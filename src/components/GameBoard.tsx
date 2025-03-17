
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
                      {character && <CharacterToken character={character} />}
                      
                      {/* Highlight and grid lines */}
                      {tile.highlighted && (
                        <div className={`absolute inset-0 ${getHighlightClass(tile.highlightType)}`}></div>
                      )}
                    </div>
                    
                    {/* Coordinate display (only during development) */}
                    {/* <div className="absolute bottom-0 right-1 text-[8px] text-white opacity-50">
                      {x},{y}
                    </div> */}
                    
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

const CharacterToken: React.FC<{ character: Character }> = ({ character }) => {
  const ownerColor = character.owner.includes('1') ? 'bg-blue-600' : 'bg-red-600';
  
  return (
    <div 
      className={`w-10 h-12 flex flex-col items-center justify-center text-white font-bold relative
        transform-gpu -translate-y-4 animate-float drop-shadow-lg`}
    >
      {/* Character model - can be replaced with actual sprite/image */}
      <div className={`w-8 h-8 ${ownerColor} rounded-md flex items-center justify-center shadow-md`}>
        <span>{character.name.substring(0, 2)}</span>
      </div>
      
      {/* Rank */}
      <div className="absolute -top-3 -right-2 w-5 h-5 rounded-full bg-slate-800 border border-yellow-400 flex items-center justify-center text-xs text-yellow-400">
        {character.rank}
      </div>
      
      {/* Health bar */}
      <div className="absolute -bottom-2 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${character.health < character.maxHealth * 0.3 ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
        ></div>
      </div>
      
      {/* Class icon indicator */}
      <div className="absolute -left-2 -top-1 w-4 h-4 flex items-center justify-center">
        {character.class === 'Tank' && <Shield size={10} className="text-slate-300" />}
        {character.class === 'Mage' && <Zap size={10} className="text-purple-300" />}
        {character.class === 'Hunter' && <Target size={10} className="text-green-300" />}
        {character.class === 'Assassin' && <Heart size={10} className="text-red-300" />}
      </div>
      
      {/* Action indicators */}
      <div className="absolute -left-3 top-2 space-y-1">
        {character.hasMoved && (
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        )}
        {character.hasAttacked && (
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
