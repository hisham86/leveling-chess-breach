
import React from 'react';
import { GameState } from '@/game/types';
import { Badge } from "@/components/ui/badge";

interface GameModeDisplayProps {
  gameState: GameState | null;
}

const GameModeDisplay: React.FC<GameModeDisplayProps> = ({ gameState }) => {
  if (!gameState) return null;
  
  return (
    <>
      {gameState.gameMode === 'storyline' && (
        <div className="text-xs text-solo-accent font-bold mt-2 border-t border-solo-accent/30 pt-2 flex items-center gap-2">
          Storyline Mode: Complete missions to progress through the story
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/50">Coming Soon</Badge>
        </div>
      )}
      
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
