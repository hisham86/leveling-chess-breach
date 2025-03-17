
import React from 'react';
import { useGameLoader } from '@/hooks/useGameLoader';
import GameHeader from '@/components/GameHeader';
import GameContent from '@/components/GameContent';
import { Zap, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GamePlay = () => {
  const { gameState, setGameState, isLoading, faction } = useGameLoader();
  
  return (
    <div className="min-h-screen flex flex-col bg-solo-dark text-white">
      <GameHeader faction={faction} />
      
      {/* Top Game Controls */}
      <div className="px-4 py-2 border-b border-solo-accent/30 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Power Grid */}
          <div className="flex items-center space-x-2">
            <div className="text-xs uppercase font-bold">Power Grid</div>
            <Zap size={16} className="text-solo-accent" />
            <div className="flex">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div 
                  key={i} 
                  className={`w-5 h-6 border-r border-gray-800 ${i <= 5 ? 'bg-orange-500' : 'bg-gray-700'}`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Grid Defense */}
          <div className="flex items-center space-x-2">
            <div className="text-xs uppercase font-bold">Grid Defense</div>
            <ShieldAlert size={16} className="text-solo-accent" />
            <div className="text-solo-accent font-bold">25%</div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="text-xs border-solo-accent text-solo-accent">
          Reset Turn
        </Button>
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 py-2 border-b border-solo-accent/30 flex space-x-2">
        <Button 
          variant="outline" 
          className="bg-solo-dark border-white hover:bg-solo-blue text-xl px-8"
        >
          End Turn
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-gray-400 border-gray-600"
        >
          Undo Move
        </Button>
      </div>
      
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
