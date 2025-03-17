
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GameState, Character, GridPosition } from '@/game/types';
import { createInitialGameState, generateId } from '@/game/utils';
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
    
    // Copy game state
    const newGameState = { ...gameState };
    
    // Find current and next player
    const currentPlayerIndex = newGameState.players.findIndex(
      p => p.id === newGameState.currentPlayerId
    );
    const nextPlayerIndex = (currentPlayerIndex + 1) % newGameState.players.length;
    
    // Update player turns
    newGameState.players = newGameState.players.map((player, index) => ({
      ...player,
      isCurrentTurn: index === nextPlayerIndex,
      // Reset characters' moved/attacked status for next turn
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
    
    // Update current player
    newGameState.currentPlayerId = newGameState.players[nextPlayerIndex].id;
    
    // Increment turn counter if all players have taken their turn
    if (nextPlayerIndex === 0) {
      newGameState.turn += 1;
    }
    
    // Clear selections
    newGameState.selectedCharacterId = null;
    newGameState.actionMode = 'none';
    
    // Update game state
    setGameState(newGameState);
    
    // Save game
    saveGame(faction, newGameState);
    
    toast.info(`Turn ${newGameState.turn}: ${newGameState.players[nextPlayerIndex].name}'s turn`);
  };
  
  const handleSelectCharacter = (characterId: string | null) => {
    if (!gameState) return;
    
    const newGameState = { ...gameState };
    
    if (newGameState.selectedCharacterId === characterId) {
      // Deselect if already selected
      newGameState.selectedCharacterId = null;
      newGameState.actionMode = 'none';
    } else {
      // Select new character
      newGameState.selectedCharacterId = characterId;
      
      // Reset board highlights
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
  
  // Check if it's the player's turn
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
            onClick={() => setSelectedAction(selectedAction === 'move' ? null : 'move')}
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
    </div>
  );
};

export default GameController;
