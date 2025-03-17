
import React, { useState, useEffect } from 'react';
import { Tile, Character, GameState } from '@/game/types';
import { getCharacterAtPosition } from '@/game/utils';

interface GameBoardProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onTileClick }) => {
  const { gameBoard, players } = gameState;
  const allCharacters = players.flatMap(player => player.characters);
  
  // Determine the cell size based on board dimensions
  const cellSize = 60;
  
  return (
    <div className="relative overflow-auto bg-solo-dark border border-solo-accent/30 rounded-lg p-4 shadow-lg">
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${gameState.boardSize.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gameState.boardSize.height}, ${cellSize}px)`
        }}
      >
        {gameBoard.map((row, y) => (
          row.map((tile, x) => {
            const character = getCharacterAtPosition({ x, y }, allCharacters);
            const tileClass = getTileClass(tile, character);

            return (
              <div 
                key={`${x},${y}`}
                className={`relative ${tileClass} flex items-center justify-center transition-all duration-200`}
                onClick={() => onTileClick(x, y)}
              >
                {character && <CharacterToken character={character} />}
                <div className="absolute bottom-0 right-0 text-xs text-gray-400 opacity-50">
                  {x},{y}
                </div>
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

const getTileClass = (tile: Tile, character: Character | null): string => {
  let baseClass = 'border border-slate-700 cursor-pointer';
  
  // Base tile type styling
  switch (tile.type) {
    case 'normal':
      baseClass += ' bg-slate-800';
      break;
    case 'blocked':
      baseClass += ' bg-solo-dark';
      break;
    case 'buff':
      baseClass += ' bg-emerald-900/30';
      break;
    case 'debuff':
      baseClass += ' bg-red-900/30';
      break;
  }
  
  // Highlight styling
  if (tile.highlighted) {
    switch (tile.highlightType) {
      case 'move':
        baseClass += ' border-blue-400 border-2 bg-blue-900/30';
        break;
      case 'attack':
        baseClass += ' border-red-400 border-2 bg-red-900/30';
        break;
      case 'ability':
        baseClass += ' border-purple-400 border-2 bg-purple-900/30';
        break;
      default:
        break;
    }
  }
  
  // Hover effects
  baseClass += ' hover:bg-opacity-70 hover:border-solo-accent';
  
  return baseClass;
};

const CharacterToken: React.FC<{ character: Character }> = ({ character }) => {
  const ownerColor = character.owner.includes('1') ? 'bg-blue-500' : 'bg-red-500';
  
  return (
    <div className={`w-10 h-10 rounded-full ${ownerColor} flex items-center justify-center text-white font-bold relative`}>
      <span>{character.name.substring(0, 2)}</span>
      <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-white`}>
        {character.rank}
      </div>
      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500"
          style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GameBoard;
