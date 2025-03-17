
import React from 'react';
import GameBoard from '@/components/GameBoard';
import GameController from '@/components/GameController';
import { GameState, Character } from '@/game/types';
import { toast } from 'sonner';
import BonusObjectives from '@/components/BonusObjectives';

interface GameContentProps {
  gameState: GameState | null;
  setGameState: (gameState: GameState) => void;
  isLoading: boolean;
  faction: string;
  onCharacterSelect?: (character: Character | null) => void;
}

const GameContent: React.FC<GameContentProps> = ({ 
  gameState, 
  setGameState, 
  isLoading,
  faction,
  onCharacterSelect
}) => {
  
  const handleTileClick = (x: number, y: number) => {
    if (!gameState || isLoading) return;
    
    // Find if there's a character at the clicked position
    const allCharacters = gameState.players.flatMap(player => player.characters);
    const characterAtPosition = allCharacters.find(
      char => char.position.x === x && char.position.y === y
    );
    
    // If there's a character, select it
    if (characterAtPosition && onCharacterSelect) {
      onCharacterSelect(characterAtPosition);
      toast.info(`Selected ${characterAtPosition.name}`);
    } else {
      // Handle tile click based on game state and selected actions
      toast.info(`Clicked tile at ${x}, ${y}`);
    }
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
          <GameBoard 
            gameState={gameState} 
            onTileClick={handleTileClick}
          />
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
        
        {/* Bonus Objectives Panel */}
        <BonusObjectives />
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
        
        {/* Power Grid Status */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs">Power Grid</span>
            <span className="text-xs text-solo-accent">25%</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className="bg-solo-accent h-full" style={{ width: '25%' }}></div>
          </div>
        </div>
        
        <div>Turn: <span className="text-white">{gameState?.turn || '0'}</span></div>
        
        <div className="p-2 bg-solo-blue/20 border border-solo-accent/20 rounded-md mt-3 text-xs">
          Victory in <span className="text-solo-accent font-bold">4</span> turns
        </div>
      </div>
    </div>
  );
};

export default GameContent;
