
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
  const { user } = useAuth();
  
  const handleEndTurn = () => {
    if (!gameState) return;
    
    const newGameState = endTurn(gameState);
    setGameState(newGameState);
    
    // Only save game for logged-in users
    if (user) {
      saveGame(faction, newGameState);
    }
    
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
      
      {/* Chess/Checkers Rules Hint */}
      {gameState?.gameMode === 'chess' && (
        <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-800/50 rounded">
          <p className="font-bold mb-1">Chess Piece Movement:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Hunter (Queen): Any direction, any distance</li>
            <li>Tank (Rook): Straight lines only</li>
            <li>Mage (Bishop): Diagonal lines only</li>
            <li>Assassin (Knight): L-shaped movement</li>
            <li>Monster (Pawn/King): Limited movement</li>
          </ul>
        </div>
      )}
      
      {gameState?.gameMode === 'checkers' && (
        <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-800/50 rounded">
          <p className="font-bold mb-1">Checkers Movement:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Move diagonally forward</li>
            <li>Capture by jumping over opponent</li>
            <li>S-Rank pieces can move backward</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameController;
