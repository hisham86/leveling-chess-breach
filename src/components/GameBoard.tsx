
import React, { useState, useEffect } from 'react';
import { Tile, Character, GameState } from '@/game/types';
import { getCharacterAtPosition } from '@/game/utils';
import { Shield, Zap, Target, Heart } from 'lucide-react';
import TileInfo from '@/components/TileInfo';

interface GameBoardProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onTileClick }) => {
  const { gameBoard, players } = gameState;
  const allCharacters = players.flatMap(player => player.characters);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  
  // Determine the cell size based on board dimensions
  const cellSize = 72; // Increased size for better visibility
  const cellHeight = cellSize * 0.7; // For isometric effect
  
  // Handle tile selection for info display
  const handleTileSelect = (tile: Tile) => {
    setSelectedTile(tile === selectedTile ? null : tile);
  };
  
  return (
    <div className="relative overflow-auto bg-solo-dark border border-solo-accent/30 rounded-lg p-8 shadow-lg">
      {/* Isometric Board Container */}
      <div className="relative transform rotate-[15deg] skew-y-[-15deg] scale-90 mb-20 mt-8">
        <div className="relative">
          {gameBoard.map((row, y) => (
            <div 
              key={`row-${y}`}
              className="flex"
              style={{ 
                marginBottom: `-${cellHeight * 0.5}px`,
                marginLeft: `${y * cellSize * 0.5}px` 
              }}
            >
              {row.map((tile, x) => {
                const character = getCharacterAtPosition({ x, y }, allCharacters);
                const tileClass = getTileClass(tile, character);
                
                // Calculate the Z-index to make tiles "stack" properly
                const zIndex = x + y;

                return (
                  <div 
                    key={`${x},${y}`}
                    className={`relative ${tileClass}`}
                    style={{ 
                      width: `${cellSize}px`, 
                      height: `${cellSize}px`,
                      zIndex,
                      transform: `translateY(${y * cellHeight * 0.5}px)`,
                      marginRight: `-${cellSize * 0.3}px`, // Overlap tiles horizontally
                    }}
                    onClick={() => {
                      onTileClick(x, y);
                      handleTileSelect(tile);
                    }}
                  >
                    {/* Tile content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {character && <IsometricCharacter character={character} />}
                      
                      {/* Highlight and grid lines */}
                      {tile.highlighted && (
                        <div className={`absolute inset-0 ${getHighlightClass(tile.highlightType)}`}></div>
                      )}
                    </div>
                    
                    {/* Terrain features - can be customized based on tile type */}
                    {tile.type === 'blocked' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[60%] h-[60%] bg-gray-700 rounded-md transform -rotate-[15deg]"></div>
                      </div>
                    )}
                    
                    {tile.type === 'buff' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                    
                    {tile.type === 'debuff' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tile Info Panel */}
      {selectedTile && (
        <TileInfo tile={selectedTile} character={getCharacterAtPosition(selectedTile.position, allCharacters)} />
      )}
    </div>
  );
};

const getTileClass = (tile: Tile, character: Character | null): string => {
  // The base class includes an isometric transformation
  let baseClass = 'cursor-pointer transition-all duration-200 transform-gpu';
  
  // Base tile type styling - now with more thematic colors and patterns
  switch (tile.type) {
    case 'normal':
      baseClass += ' bg-slate-700 border border-slate-600';
      break;
    case 'blocked':
      baseClass += ' bg-solo-dark border border-gray-700';
      break;
    case 'buff':
      baseClass += ' bg-emerald-900/30 border border-emerald-700/50';
      break;
    case 'debuff':
      baseClass += ' bg-red-900/30 border border-red-700/50';
      break;
  }
  
  // Hover effects enhanced for isometric view
  baseClass += ' hover:bg-opacity-70 hover:border-solo-accent hover:-translate-y-1 hover:shadow-glow';
  
  return baseClass;
};

const getHighlightClass = (type: 'move' | 'attack' | 'ability' | 'none'): string => {
  switch (type) {
    case 'move':
      return 'border-2 border-blue-400 bg-blue-900/30 animate-pulse';
    case 'attack':
      return 'border-2 border-red-400 bg-red-900/30 animate-pulse';
    case 'ability':
      return 'border-2 border-purple-400 bg-purple-900/30 animate-pulse';
    default:
      return '';
  }
};

// New isometric character component with cell-shaded style
const IsometricCharacter: React.FC<{ character: Character }> = ({ character }) => {
  // Determine base color scheme based on owner
  const isPlayer1 = character.owner.includes('1');
  
  // Color schemes for hunters and monsters
  const baseColors = {
    body: isPlayer1 ? 'bg-blue-700' : 'bg-red-700',
    highlight: isPlayer1 ? 'bg-blue-500' : 'bg-red-500',
    shadow: isPlayer1 ? 'bg-blue-900' : 'bg-red-900',
    outline: isPlayer1 ? 'border-blue-400' : 'border-red-400',
  };
  
  // Adjust color scheme based on character class
  const getClassColorAccent = () => {
    switch(character.class) {
      case 'Tank': return 'border-blue-300';
      case 'Mage': return 'border-purple-300';
      case 'Hunter': return 'border-green-300';
      case 'Assassin': return 'border-red-300';
      default: return 'border-orange-300';
    }
  };
  
  // Get rank-specific styling
  const getRankStyle = () => {
    switch(character.rank) {
      case 'S': return 'ring-2 ring-yellow-400 shadow-yellow-glow';
      case 'A': return 'ring-2 ring-purple-400';
      case 'B': return 'ring-1 ring-blue-400';
      default: return '';
    }
  };
  
  // Class-specific character shape
  const getCharacterShape = () => {
    switch(character.class) {
      case 'Tank':
        return (
          <div className="relative w-10 h-10">
            {/* Main body - blocky shape for tanks */}
            <div className={`absolute inset-0 ${baseColors.body} rounded-md transform translate-y-[-4px]`}></div>
            {/* Highlight */}
            <div className={`absolute top-0 left-0 right-3 h-2 ${baseColors.highlight} rounded-t-md`}></div>
            {/* Shadow */}
            <div className={`absolute bottom-0 right-0 left-3 h-2 ${baseColors.shadow} rounded-b-md`}></div>
            {/* Shield detail */}
            <div className="absolute top-1 left-1 w-4 h-6 bg-gray-400 rounded-t-md transform rotate-[-5deg]"></div>
          </div>
        );
      
      case 'Mage':
        return (
          <div className="relative w-9 h-11">
            {/* Main body - tall and narrow for mages */}
            <div className={`absolute inset-0 ${baseColors.body} rounded-md transform translate-y-[-6px]`}></div>
            {/* Highlight */}
            <div className={`absolute top-0 left-0 right-4 h-2 ${baseColors.highlight} rounded-t-md`}></div>
            {/* Shadow */}
            <div className={`absolute bottom-0 right-0 left-4 h-2 ${baseColors.shadow} rounded-b-md`}></div>
            {/* Staff detail */}
            <div className="absolute -right-1 -top-1 w-1 h-7 bg-purple-300 transform rotate-[15deg]"></div>
          </div>
        );
      
      case 'Hunter':
        return (
          <div className="relative w-9 h-9">
            {/* Main body - balanced shape for hunters */}
            <div className={`absolute inset-0 ${baseColors.body} rounded-md transform translate-y-[-4px]`}></div>
            {/* Highlight */}
            <div className={`absolute top-0 left-0 right-3 h-2 ${baseColors.highlight} rounded-t-md`}></div>
            {/* Shadow */}
            <div className={`absolute bottom-0 right-0 left-3 h-2 ${baseColors.shadow} rounded-b-md`}></div>
            {/* Bow detail */}
            <div className="absolute -left-2 top-1 w-1 h-5 bg-green-300 transform rotate-[30deg] rounded-full"></div>
          </div>
        );
      
      case 'Assassin':
        return (
          <div className="relative w-8 h-9">
            {/* Main body - sleek shape for assassins */}
            <div className={`absolute inset-0 ${baseColors.body} rounded-md transform skew-x-[-5deg] translate-y-[-4px]`}></div>
            {/* Highlight */}
            <div className={`absolute top-0 left-0 right-4 h-2 ${baseColors.highlight} rounded-t-md skew-x-[-5deg]`}></div>
            {/* Shadow */}
            <div className={`absolute bottom-0 right-0 left-3 h-2 ${baseColors.shadow} rounded-b-md skew-x-[-5deg]`}></div>
            {/* Dagger detail */}
            <div className="absolute -right-1 top-3 w-3 h-1 bg-gray-300 transform rotate-[30deg]"></div>
          </div>
        );
      
      case 'Monster':
        return (
          <div className="relative w-10 h-10">
            {/* Main body - irregular shape for monsters */}
            <div className={`absolute inset-0 ${baseColors.body} rounded-md transform translate-y-[-3px] rotate-[5deg]`}></div>
            {/* Highlight */}
            <div className={`absolute top-0 left-0 right-4 h-2 ${baseColors.highlight} rounded-t-md transform rotate-[5deg]`}></div>
            {/* Shadow */}
            <div className={`absolute bottom-0 right-0 left-2 h-3 ${baseColors.shadow} rounded-b-md transform rotate-[5deg]`}></div>
            {/* Monster detail - horns or spikes */}
            <div className="absolute -left-1 -top-1 w-2 h-2 bg-orange-300 transform rotate-[-20deg] rounded-t-md"></div>
            <div className="absolute -right-1 -top-1 w-2 h-2 bg-orange-300 transform rotate-[20deg] rounded-t-md"></div>
          </div>
        );
      
      default:
        return (
          <div className={`w-9 h-9 ${baseColors.body} rounded-md`}></div>
        );
    }
  };
  
  return (
    <div className={`relative transform-gpu -translate-y-4 ${getRankStyle()}`}>
      {/* Character model with cell-shaded style */}
      <div className={`${getClassColorAccent()} border-2 animate-float drop-shadow-lg`}>
        {getCharacterShape()}
        
        {/* Character label - initial or icon */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/80 px-1 py-0 rounded text-xs font-bold">
          {character.name.substring(0, 2)}
        </div>
        
        {/* Health bar */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${character.health < character.maxHealth * 0.3 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
          ></div>
        </div>
        
        {/* Rank indicator */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gray-800 border flex items-center justify-center text-[10px]">
          <span className={character.rank === 'S' ? 'text-yellow-400' : character.rank === 'A' ? 'text-purple-400' : 'text-blue-400'}>
            {character.rank}
          </span>
        </div>
        
        {/* Status indicators */}
        <div className="absolute -left-2 top-0 space-y-1">
          {character.hasMoved && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
          )}
          {character.hasAttacked && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
