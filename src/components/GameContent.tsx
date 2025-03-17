
import React from 'react';
import GameBoard from '@/components/GameBoard';
import GameController from '@/components/GameController';
import { GameState } from '@/game/types';
import { toast } from 'sonner';

interface GameContentProps {
  gameState: GameState | null;
  setGameState: (gameState: GameState) => void;
  isLoading: boolean;
  faction: string;
}

const GameContent: React.FC<GameContentProps> = ({ 
  gameState, 
  setGameState, 
  isLoading,
  faction 
}) => {
  
  const handleTileClick = (x: number, y: number) => {
    if (!gameState || isLoading) return;
    
    // Handle tile click based on game state and selected actions
    toast.info(`Clicked tile at ${x}, ${y}`);
  };
  
  return (
    <div className="flex flex-col md:flex-row flex-grow p-4 gap-4">
      {/* Game board */}
      <div className="flex-grow md:w-3/4 order-2 md:order-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-80 bg-solo-dark/50 border border-solo-accent/20 rounded-lg animate-pulse">
            Loading game...
          </div>
        ) : gameState ? (
          <GameBoard gameState={gameState} onTileClick={handleTileClick} />
        ) : (
          <div className="flex items-center justify-center h-80 bg-solo-dark/50 border border-solo-accent/20 rounded-lg">
            Failed to load game
          </div>
        )}
      </div>
      
      {/* Side panel with game controls */}
      <div className="md:w-1/4 space-y-4 order-1 md:order-2">
        <GameController 
          gameState={gameState} 
          setGameState={setGameState} 
          isLoading={isLoading}
          faction={faction}
        />
        
        {/* Game info panel */}
        <GameInfoPanel gameState={gameState} />
      </div>
    </div>
  );
};

interface GameInfoPanelProps {
  gameState: GameState | null;
}

const GameInfoPanel: React.FC<GameInfoPanelProps> = ({ gameState }) => {
  return (
    <div className="bg-solo-dark border border-solo-accent/30 rounded-lg p-4">
      <h3 className="text-solo-accent font-bold mb-2">Game Info</h3>
      <div className="space-y-2 text-sm">
        <div>Phase: <span className="text-white">{gameState?.gamePhase || 'Loading...'}</span></div>
        <div>Current Player: <span className="text-white">{
          gameState?.players.find(p => p.id === gameState.currentPlayerId)?.name || 'Loading...'
        }</span></div>
      </div>
    </div>
  );
};

export default GameContent;
