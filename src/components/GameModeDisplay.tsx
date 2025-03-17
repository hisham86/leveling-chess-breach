
import React from 'react';
import { GameState } from '@/game/types';
import { Badge } from "@/components/ui/badge";
import { Swords, Clock } from "lucide-react";

interface GameModeDisplayProps {
  gameState: GameState | null;
}

const GameModeDisplay: React.FC<GameModeDisplayProps> = ({ gameState }) => {
  if (!gameState) return null;
  
  return (
    <div className="w-full">
      {gameState.gameMode === 'storyline' && (
        <div className="text-xs text-solo-accent font-bold mt-2 border-t border-solo-accent/30 pt-2 flex items-center gap-2">
          <Clock size={14} className="text-solo-accent" />
          Storyline Mode: Complete missions to progress through the story
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/50">Coming Soon</Badge>
        </div>
      )}
      
      {gameState.gameMode === 'chess' && (
        <div className="text-xs text-solo-accent font-bold mt-2 border-t border-solo-accent/30 pt-2 flex items-center gap-2">
          <Swords size={14} className="text-solo-accent" />
          Chess Mode: Characters move like chess pieces based on their class
          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">Active</Badge>
        </div>
      )}
    </div>
  );
};

export default GameModeDisplay;
