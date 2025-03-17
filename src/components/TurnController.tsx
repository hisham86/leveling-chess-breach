
import React from 'react';
import { GameState } from '@/game/types';
import { useAuth } from '@/context/AuthContext';

interface TurnControllerProps {
  gameState: GameState | null;
  isLoading: boolean;
  onEndTurn: () => void;
}

const TurnController: React.FC<TurnControllerProps> = ({ gameState, isLoading, onEndTurn }) => {
  const { user } = useAuth();
  
  const isPlayerTurn = () => {
    if (!gameState || !user) return false;
    
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
    return currentPlayer?.id === user.id;
  };
  
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-solo-accent font-bold">
        {isLoading ? "Loading..." : `Turn ${gameState?.turn || 1}`}
      </h3>
      <div>
        <button
          onClick={onEndTurn}
          className="bg-solo-purple hover:bg-solo-accent px-4 py-1 rounded text-white transition"
          disabled={!isPlayerTurn()}
        >
          End Turn
        </button>
      </div>
    </div>
  );
};

export default TurnController;
