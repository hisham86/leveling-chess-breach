import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GameState, Character, GridPosition } from '@/game/types';
import { createInitialGameState, generateId, getValidMovePositions } from '@/game/utils';
import { generatePresetCharacters } from '@/game/characterData';
import { saveGame, getLatestSavedGame } from '@/services/gameService';
import { toast } from 'sonner';

interface GameControllerProps {
  gameState: GameState | null;
  setGameState: (gameState: GameState) => void;
  isLoading: boolean;
  faction: string;
}

const GameController: React.FC<GameControllerProps> = ({ 
  gameState, 
  setGameState, 
  isLoading,
  faction
}) => {
  const { user } = useAuth();
  const [selectedAction, setSelectedAction] = useState<'move' | 'attack' | 'ability' | null>(null);
  
  const handleEndTurn = () => {
    if (!gameState) return;
    
    const newGameState = { ...gameState };
    
    const currentPlayerIndex = newGameState.players.findIndex(
      p => p.id === newGameState.currentPlayerId
    );
    const nextPlayerIndex = (currentPlayerIndex + 1) % newGameState.players.length;
    
    newGameState.players = newGameState.players.map((player, index) => ({
      ...player,
      isCurrentTurn: index === nextPlayerIndex,
      characters: player.characters.map(char => ({
        ...char,
        hasMoved: index === nextPlayerIndex ? false : char.hasMoved,
        hasAttacked: index === nextPlayerIndex ? false : char.hasAttacked,
        abilities: char.abilities.map(ability => ({
          ...ability,
          currentCooldown: ability.currentCooldown > 0 ? ability.currentCooldown - 1 : 0
        }))
      }))
    }));
    
    newGameState.currentPlayerId = newGameState.players[nextPlayerIndex].id;
    
    if (nextPlayerIndex === 0) {
      newGameState.turn += 1;
    }
    
    newGameState.selectedCharacterId = null;
    newGameState.actionMode = 'none';
    
    setGameState(newGameState);
    
    saveGame(faction, newGameState);
    
    toast.info(`Turn ${newGameState.turn}: ${newGameState.players[nextPlayerIndex].name}'s turn`);
  };
  
  const handleSelectCharacter = (characterId: string | null) => {
    if (!gameState) return;
    
    const newGameState = { ...gameState };
    
    if (newGameState.selectedCharacterId === characterId) {
      newGameState.selectedCharacterId = null;
      newGameState.actionMode = 'none';
    } else {
      newGameState.selectedCharacterId = characterId;
      
      newGameState.gameBoard = newGameState.gameBoard.map(row =>
        row.map(tile => ({
          ...tile,
          highlighted: false,
          highlightType: 'none'
        }))
      );
    }
    
    setGameState(newGameState);
  };
  
  const handleShowCheckersMove = () => {
    if (!gameState || !gameState.selectedCharacterId) return;
    
    const newGameState = { ...gameState };
    newGameState.actionMode = 'move';
    
    const selectedCharacter = gameState.players
      .flatMap(p => p.characters)
      .find(c => c.id === gameState.selectedCharacterId);
    
    if (!selectedCharacter) return;
    
    newGameState.gameBoard = newGameState.gameBoard.map(row =>
      row.map(tile => ({
        ...tile,
        highlighted: false,
        highlightType: 'none'
      }))
    );
    
    const validMoves = getCheckersValidMoves(selectedCharacter, newGameState);
    
    validMoves.forEach(pos => {
      if (pos.x >= 0 && pos.x < newGameState.boardSize.width && 
          pos.y >= 0 && pos.y < newGameState.boardSize.height) {
        newGameState.gameBoard[pos.y][pos.x].highlighted = true;
        newGameState.gameBoard[pos.y][pos.x].highlightType = 'move';
      }
    });
    
    setGameState(newGameState);
    setSelectedAction('move');
  };
  
  const getCheckersValidMoves = (character: Character, gameState: GameState): GridPosition[] => {
    const validMoves: GridPosition[] = [];
    const { x, y } = character.position;
    const allCharacters = gameState.players.flatMap(p => p.characters);
    const isPlayer1 = character.owner === gameState.players[0].id;
    
    const forwardY = isPlayer1 ? 1 : -1;
    
    const regularMoves = [
      { x: x - 1, y: y + forwardY },
      { x: x + 1, y: y + forwardY }
    ];
    
    regularMoves.forEach(pos => {
      if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
          pos.y >= 0 && pos.y < gameState.boardSize.height) {
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (!charAtPos) {
          validMoves.push(pos);
        }
      }
    });
    
    const captureMoves = [
      { jumpX: x - 1, jumpY: y + forwardY, landX: x - 2, landY: y + (forwardY * 2) },
      { jumpX: x + 1, jumpY: y + forwardY, landX: x + 2, landY: y + (forwardY * 2) }
    ];
    
    captureMoves.forEach(move => {
      if (move.landX >= 0 && move.landX < gameState.boardSize.width && 
          move.landY >= 0 && move.landY < gameState.boardSize.height) {
        const jumpCharacter = allCharacters.find(
          c => c.position.x === move.jumpX && c.position.y === move.jumpY && c.owner !== character.owner
        );
        
        const landingCharacter = allCharacters.find(
          c => c.position.x === move.landX && c.position.y === move.landY
        );
        
        if (jumpCharacter && !landingCharacter) {
          validMoves.push({ x: move.landX, y: move.landY });
        }
      }
    });
    
    if (character.rank === 'S') {
      const backwardY = isPlayer1 ? -1 : 1;
      
      const kingMoves = [
        { x: x - 1, y: y + backwardY },
        { x: x + 1, y: y + backwardY }
      ];
      
      kingMoves.forEach(pos => {
        if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
            pos.y >= 0 && pos.y < gameState.boardSize.height) {
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (!charAtPos) {
            validMoves.push(pos);
          }
        }
      });
      
      const kingCaptures = [
        { jumpX: x - 1, jumpY: y + backwardY, landX: x - 2, landY: y + (backwardY * 2) },
        { jumpX: x + 1, jumpY: y + backwardY, landX: x + 2, landY: y + (backwardY * 2) }
      ];
      
      kingCaptures.forEach(move => {
        if (move.landX >= 0 && move.landX < gameState.boardSize.width && 
            move.landY >= 0 && move.landY < gameState.boardSize.height) {
          const jumpCharacter = allCharacters.find(
            c => c.position.x === move.jumpX && c.position.y === move.jumpY && c.owner !== character.owner
          );
          
          const landingCharacter = allCharacters.find(
            c => c.position.x === move.landX && c.position.y === move.landY
          );
          
          if (jumpCharacter && !landingCharacter) {
            validMoves.push({ x: move.landX, y: move.landY });
          }
        }
      });
    }
    
    return validMoves;
  };
  
  const handleShowMoves = () => {
    if (!gameState) return;
    
    if (gameState.gameMode === 'checkers') {
      handleShowCheckersMove();
    } else if (gameState.gameMode === 'chess') {
      handleShowChessMove();
    } else {
      handleShowStandardMove();
    }
  };
  
  const handleShowChessMove = () => {
    if (!gameState || !gameState.selectedCharacterId) return;
    
    const newGameState = { ...gameState };
    newGameState.actionMode = 'move';
    
    const selectedCharacter = gameState.players
      .flatMap(p => p.characters)
      .find(c => c.id === gameState.selectedCharacterId);
    
    if (!selectedCharacter) return;
    
    newGameState.gameBoard = newGameState.gameBoard.map(row =>
      row.map(tile => ({
        ...tile,
        highlighted: false,
        highlightType: 'none'
      }))
    );
    
    const validMoves = getChessValidMoves(selectedCharacter, newGameState);
    
    validMoves.forEach(pos => {
      if (pos.x >= 0 && pos.x < newGameState.boardSize.width && 
          pos.y >= 0 && pos.y < newGameState.boardSize.height) {
        newGameState.gameBoard[pos.y][pos.x].highlighted = true;
        newGameState.gameBoard[pos.y][pos.x].highlightType = 'move';
      }
    });
    
    setGameState(newGameState);
    setSelectedAction('move');
  };
  
  const handleShowStandardMove = () => {
    if (!gameState || !gameState.selectedCharacterId) return;
    
    const newGameState = { ...gameState };
    newGameState.actionMode = 'move';
    
    const selectedCharacter = gameState.players
      .flatMap(p => p.characters)
      .find(c => c.id === gameState.selectedCharacterId);
    
    if (!selectedCharacter) return;
    
    newGameState.gameBoard = newGameState.gameBoard.map(row =>
      row.map(tile => ({
        ...tile,
        highlighted: false,
        highlightType: 'none'
      }))
    );
    
    const validMoves = getValidMovePositions(
      selectedCharacter.position,
      selectedCharacter.moveRange,
      newGameState.gameBoard,
      newGameState.boardSize
    );
    
    validMoves.forEach(pos => {
      if (pos.x >= 0 && pos.x < newGameState.boardSize.width && 
          pos.y >= 0 && pos.y < newGameState.boardSize.height) {
        newGameState.gameBoard[pos.y][pos.x].highlighted = true;
        newGameState.gameBoard[pos.y][pos.x].highlightType = 'move';
      }
    });
    
    setGameState(newGameState);
    setSelectedAction('move');
  };
  
  const getChessValidMoves = (character: Character, gameState: GameState): GridPosition[] => {
    const validMoves: GridPosition[] = [];
    const { x, y } = character.position;
    const allCharacters = gameState.players.flatMap(p => p.characters);
    
    switch(character.class) {
      case 'Tank':
        for (let i = x + 1; i < gameState.boardSize.width; i++) {
          const pos = { x: i, y };
          const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = x - 1; i >= 0; i--) {
          const pos = { x: i, y };
          const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let j = y + 1; j < gameState.boardSize.height; j++) {
          const pos = { x, y: j };
          const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let j = y - 1; j >= 0; j--) {
          const pos = { x, y: j };
          const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        break;
        
      case 'Mage':
        for (let i = 1; x + i < gameState.boardSize.width && y - i >= 0; i++) {
          const pos = { x: x + i, y: y - i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = 1; x + i < gameState.boardSize.width && y + i < gameState.boardSize.height; i++) {
          const pos = { x: x + i, y: y + i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = 1; x - i >= 0 && y + i < gameState.boardSize.height; i++) {
          const pos = { x: x - i, y: y + i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
          const pos = { x: x - i, y: y - i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        break;
        
      case 'Hunter':
        for (let i = x + 1; i < gameState.boardSize.width; i++) {
          const pos = { x: i, y };
          const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = x - 1; i >= 0; i--) {
          const pos = { x: i, y };
          const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let j = y + 1; j < gameState.boardSize.height; j++) {
          const pos = { x, y: j };
          const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let j = y - 1; j >= 0; j--) {
          const pos = { x, y: j };
          const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = 1; x + i < gameState.boardSize.width && y - i >= 0; i++) {
          const pos = { x: x + i, y: y - i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = 1; x + i < gameState.boardSize.width && y + i < gameState.boardSize.height; i++) {
          const pos = { x: x + i, y: y + i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = 1; x - i >= 0 && y + i < gameState.boardSize.height; i++) {
          const pos = { x: x - i, y: y + i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        
        for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
          const pos = { x: x - i, y: y - i };
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (charAtPos) {
            if (charAtPos.owner !== character.owner) validMoves.push(pos);
            break;
          }
          validMoves.push(pos);
        }
        break;
        
      case 'Assassin':
        const knightMoves = [
          { x: x + 2, y: y + 1 }, { x: x + 2, y: y - 1 },
          { x: x - 2, y: y + 1 }, { x: x - 2, y: y - 1 },
          { x: x + 1, y: y + 2 }, { x: x + 1, y: y - 2 },
          { x: x - 1, y: y + 2 }, { x: x - 1, y: y - 2 }
        ];
        
        knightMoves.forEach(pos => {
          if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
              pos.y >= 0 && pos.y < gameState.boardSize.height) {
            const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
            if (!charAtPos || charAtPos.owner !== character.owner) {
              validMoves.push(pos);
            }
          }
        });
        break;
        
      case 'Monster':
        const kingMoves = [
          { x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 },
          { x: x + 1, y: y + 1 }, { x: x + 1, y: y - 1 }, 
          { x: x - 1, y: y + 1 }, { x: x - 1, y: y - 1 }
        ];
        
        kingMoves.forEach(pos => {
          if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
              pos.y >= 0 && pos.y < gameState.boardSize.height) {
            const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
            if (!charAtPos || charAtPos.owner !== character.owner) {
              validMoves.push(pos);
            }
          }
        });
        break;
        
      default:
        for (let i = Math.max(0, x - 2); i <= Math.min(gameState.boardSize.width - 1, x + 2); i++) {
          for (let j = Math.max(0, y - 2); j <= Math.min(gameState.boardSize.height - 1, y + 2); j++) {
            if (i !== x || j !== y) {
              const pos = { x: i, y: j };
              const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === j);
              if (!charAtPos || charAtPos.owner !== character.owner) {
                validMoves.push(pos);
              }
            }
          }
        }
    }
    
    return validMoves;
  };
  
  const getActionButtonClass = (action: string, isDisabled: boolean = false) => {
    const baseClass = "px-3 py-1 text-sm font-mono rounded text-white transition";
    
    if (isDisabled) {
      return `${baseClass} bg-gray-700 opacity-50 cursor-not-allowed`;
    }
    
    if (selectedAction === action) {
      return `${baseClass} bg-solo-accent border-2 border-white`;
    }
    
    return `${baseClass} bg-solo-purple/40 hover:bg-solo-purple/60 border border-solo-accent/50`;
  };
  
  const isPlayerTurn = () => {
    if (!gameState || !user) return false;
    
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
    return currentPlayer?.id === user.id;
  };
  
  return (
    <div className="bg-solo-dark border border-solo-accent/30 rounded-lg p-4 flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-solo-accent font-bold">
          {isLoading ? "Loading..." : `Turn ${gameState?.turn || 1}`}
        </h3>
        <div>
          <button
            onClick={handleEndTurn}
            className="bg-solo-purple hover:bg-solo-accent px-4 py-1 rounded text-white transition"
            disabled={!isPlayerTurn()}
          >
            End Turn
          </button>
        </div>
      </div>
      
      {gameState?.selectedCharacterId && (
        <div className="grid grid-cols-3 gap-2">
          <button 
            className={getActionButtonClass('move')}
            onClick={handleShowMoves}
          >
            Move
          </button>
          <button 
            className={getActionButtonClass('attack')}
            onClick={() => setSelectedAction(selectedAction === 'attack' ? null : 'attack')}
          >
            Attack
          </button>
          <button 
            className={getActionButtonClass('ability')}
            onClick={() => setSelectedAction(selectedAction === 'ability' ? null : 'ability')}
          >
            Ability
          </button>
        </div>
      )}
      
      <div className="text-xs text-gray-400 italic">
        {selectedAction ? `${selectedAction} mode active` : "Select a character to act"}
      </div>
      
      {gameState?.gameMode === 'chess' && (
        <div className="text-xs text-solo-accent font-bold mt-2 border-t border-solo-accent/30 pt-2">
          Chess Mode: Characters move like chess pieces
        </div>
      )}
      
      {gameState?.gameMode === 'checkers' && (
        <div className="text-xs text-solo-accent font-bold mt-2 border-t border-solo-accent/30 pt-2">
          Checkers Mode: Diagonal movement with jumps to capture
        </div>
      )}
    </div>
  );
};

export default GameController;
