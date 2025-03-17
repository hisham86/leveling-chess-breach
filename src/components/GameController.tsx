
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GameState, Character } from '@/game/types';
import { saveGame } from '@/services/gameService';
import { toast } from 'sonner';
import ActionButtons from './ActionButtons';
import TurnController from './TurnController';
import GameModeDisplay from './GameModeDisplay';
import { highlightValidMoves, selectCharacter, endTurn } from '@/services/movementService';

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
  const [selectedAction, setSelectedAction] = useState<'move' | 'attack' | 'ability' | null>(null);
  
  const handleEndTurn = () => {
    if (!gameState) return;
    
    const newGameState = endTurn(gameState);
    setGameState(newGameState);
    
    saveGame(faction, newGameState);
    
    toast.info(`Turn ${newGameState.turn}: ${newGameState.players.find(
      p => p.id === newGameState.currentPlayerId
    )?.name}'s turn`);
  };
  
  const handleSelectCharacter = (characterId: string | null) => {
    if (!gameState) return;
    
    const newGameState = selectCharacter(characterId, gameState);
    setGameState(newGameState);
  };
  
  const handleShowMoves = () => {
    if (!gameState || !gameState.selectedCharacterId) return;
    
    const selectedCharacter = gameState.players
      .flatMap(p => p.characters)
      .find(c => c.id === gameState.selectedCharacterId);
    
    if (!selectedCharacter) return;
    
    const newGameState = highlightValidMoves(selectedCharacter, gameState);
    setGameState(newGameState);
    setSelectedAction('move');
  };
  
  const handleAttackClick = () => {
    setSelectedAction(selectedAction === 'attack' ? null : 'attack');
  };
  
  const handleAbilityClick = () => {
    setSelectedAction(selectedAction === 'ability' ? null : 'ability');
  };
  
  return (
    <div className="bg-solo-dark border border-solo-accent/30 rounded-lg p-4 flex flex-col space-y-3">
      <TurnController 
        gameState={gameState} 
        isLoading={isLoading} 
        onEndTurn={handleEndTurn} 
      />
      
      <ActionButtons
        selectedCharacterId={gameState?.selectedCharacterId || null}
        selectedAction={selectedAction}
        onMoveClick={handleShowMoves}
        onAttackClick={handleAttackClick}
        onAbilityClick={handleAbilityClick}
      />
      
      <div className="text-xs text-gray-400 italic">
        {selectedAction ? `${selectedAction} mode active` : "Select a character to act"}
      </div>
      
      <GameModeDisplay gameState={gameState} />
    </div>
  );
};

export default GameController;
