import React, { useState } from 'react';
import { Tile, Character, GameState } from '@/game/types';
import { getCharacterAtPosition } from '@/game/utils';
import { Shield, Sword, Target, Heart, Crown } from 'lucide-react';
import TileInfo from '@/components/TileInfo';

interface GameBoardProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onTileClick }) => {
  const { gameBoard, players } = gameState;
  const allCharacters = players.flatMap(player => player.characters);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  
  const isChessMode = gameState.gameMode === 'chess';
  const isCheckersMode = gameState.gameMode === 'checkers';
  
  const handleTileSelect = (tile: Tile) => {
    setSelectedTile(tile === selectedTile ? null : tile);
  };
  
  return (
    <div className="relative bg-solo-dark border border-solo-accent/30 rounded-lg p-4 shadow-lg">
      <div className="relative mx-auto">
        <div className="grid grid-cols-8 gap-0 max-w-[600px] mx-auto">
          {gameBoard.map((row, y) => (
            <React.Fragment key={`row-${y}`}>
              {row.map((tile, x) => {
                const character = getCharacterAtPosition({ x, y }, allCharacters);
                const tileClass = getTileClass(tile, character, x, y);
                
                return (
                  <div 
                    key={`${x},${y}`}
                    className={`${tileClass} relative`}
                    style={{ 
                      width: '60px', 
                      height: '60px',
                    }}
                    onClick={() => {
                      onTileClick(x, y);
                      handleTileSelect(tile);
                    }}
                  >
                    {y === 0 && (
                      <div className="absolute -top-5 w-full text-center text-xs text-gray-400">
                        {String.fromCharCode(97 + x)}
                      </div>
                    )}
                    {x === 0 && (
                      <div className="absolute -left-5 h-full flex items-center text-xs text-gray-400">
                        {8 - y}
                      </div>
                    )}
                    
                    {character && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ChessPiece character={character} isChessMode={isChessMode} isCheckersMode={isCheckersMode} />
                      </div>
                    )}
                    
                    {tile.highlighted && (
                      <div className={`absolute inset-0 ${getHighlightClass(tile.highlightType)}`}></div>
                    )}
                    
                    {renderTileFeature(tile)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {selectedTile && (
        <TileInfo tile={selectedTile} character={getCharacterAtPosition(selectedTile.position, allCharacters)} />
      )}
    </div>
  );
};

const getTileClass = (tile: Tile, character: Character | null, x: number, y: number): string => {
  const isLightSquare = (x + y) % 2 === 0;
  let baseClass = 'cursor-pointer transition-all duration-200';
  
  if (isLightSquare) {
    baseClass += ' bg-amber-50';
  } else {
    baseClass += ' bg-amber-800';
  }
  
  switch (tile.type) {
    case 'blocked':
      baseClass += ' bg-gray-900 opacity-70';
      break;
    case 'buff':
      baseClass += ' ring-2 ring-emerald-500 ring-inset';
      break;
    case 'debuff':
      baseClass += ' ring-2 ring-red-500 ring-inset';
      break;
  }
  
  baseClass += ' hover:ring-2 hover:ring-solo-accent hover:ring-opacity-70';
  
  return baseClass;
};

const getHighlightClass = (type: 'move' | 'attack' | 'ability' | 'none'): string => {
  switch (type) {
    case 'move':
      return 'bg-blue-500 bg-opacity-30 animate-pulse';
    case 'attack':
      return 'bg-red-500 bg-opacity-30 animate-pulse';
    case 'ability':
      return 'bg-purple-500 bg-opacity-30 animate-pulse';
    default:
      return '';
  }
};

const renderTileFeature = (tile: Tile) => {
  switch (tile.type) {
    case 'buff':
      return (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      );
    case 'debuff':
      return (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      );
    default:
      return null;
  }
};

const ChessPiece: React.FC<{ character: Character, isChessMode: boolean, isCheckersMode: boolean }> = ({ 
  character, isChessMode, isCheckersMode 
}) => {
  const isPlayer1 = character.owner === 'guest-player' || character.owner.includes('1');
  const pieceColor = isPlayer1 ? 'text-blue-600' : 'text-red-600';
  
  const getChessPieceSymbol = () => {
    if (isChessMode) {
      switch(character.class) {
        case 'Tank': return '♜';
        case 'Mage': return '♝';
        case 'Hunter': return '♛';
        case 'Assassin': return '♞';
        case 'Monster': 
          return character.rank === 'S' ? '♚' : '♟︎';
        default: return '♟︎';
      }
    } else if (isCheckersMode) {
      return character.rank === 'S' ? '⬤' : '●';
    } else {
      return '◆';
    }
  };
  
  const getClassIcon = () => {
    switch(character.class) {
      case 'Tank': return <Shield className="h-6 w-6" />;
      case 'Mage': return <Target className="h-6 w-6" />;
      case 'Hunter': return <Sword className="h-6 w-6" />;
      case 'Assassin': return <Sword className="h-6 w-6" />;
      case 'Monster': 
        return character.rank === 'S' ? <Crown className="h-6 w-6" /> : <Heart className="h-6 w-6" />;
      default: return <Heart className="h-6 w-6" />;
    }
  };
  
  return (
    <div className={`${pieceColor} relative w-full h-full flex items-center justify-center`}>
      <span className="text-3xl select-none">{getChessPieceSymbol()}</span>
      
      {character.isSelected && (
        <div className="absolute inset-0 ring-2 ring-yellow-400 ring-opacity-80"></div>
      )}
      
      <div className="absolute bottom-0 right-0 flex space-x-1">
        {character.hasMoved && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
        )}
        {character.hasAttacked && (
          <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
