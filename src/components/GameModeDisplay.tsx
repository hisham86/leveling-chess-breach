
import React from 'react';
import { GameState } from '@/game/types';

interface GameModeDisplayProps {
  gameState: GameState | null;
}

const GameModeDisplay: React.FC<GameModeDisplayProps> = ({ gameState }) => {
  if (!gameState) return null;
  
  return (
    <>
      {gameState.gameMode === 'chess' && (
        <div className="text-xs text-solo-accent font-bold mt-2 border-t border-solo-accent/30 pt-2">
          Chess Mode: Characters move like chess pieces
        </div>
      )}
      
      {gameState.gameMode === 'checkers' && (
        <div className="text-xs text-solo-accent font-bold mt-2 border-t border-solo-accent/30 pt-2">
          Checkers Mode: Diagonal movement with jumps to capture
        </div>
      )}
    </>
  );
};

export default GameModeDisplay;
