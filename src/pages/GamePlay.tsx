
import React from 'react';
import { useGameLoader } from '@/hooks/useGameLoader';
import GameHeader from '@/components/GameHeader';
import GameContent from '@/components/GameContent';

const GamePlay = () => {
  const { gameState, setGameState, isLoading, faction } = useGameLoader();
  
  return (
    <div className="min-h-screen flex flex-col bg-solo-dark text-white">
      <GameHeader faction={faction} />
      <GameContent 
        gameState={gameState} 
        setGameState={setGameState} 
        isLoading={isLoading} 
        faction={faction}
      />
    </div>
  );
};

export default GamePlay;
