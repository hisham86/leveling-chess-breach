
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { getLatestSavedGame } from '@/services/gameService';
import { createInitialGameState } from '@/game/utils';
import { generatePresetCharacters } from '@/game/characterData';
import { GameState } from '@/game/types';
import GameBoard from '@/components/GameBoard';
import GameController from '@/components/GameController';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const GamePlay = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [faction, setFaction] = useState('S-RANK HUNTERS');
  
  useEffect(() => {
    const loadGame = async () => {
      if (!user) {
        toast.error("You need to be logged in to play");
        navigate('/');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Try to load saved game
        const savedGame = await getLatestSavedGame();
        
        if (savedGame) {
          setGameState(savedGame.game_data);
          setFaction(savedGame.faction);
          toast.success("Game loaded successfully");
        } else {
          // Create a new game if none exists
          const aiPlayerId = 'ai-player';
          const initialState = createInitialGameState(user.id, aiPlayerId);
          
          // Create characters based on faction
          const playerCharacters = generatePresetCharacters(user.id, true);
          const aiCharacters = generatePresetCharacters(aiPlayerId, false);
          
          initialState.players[0].characters = playerCharacters;
          initialState.players[1].characters = aiCharacters;
          
          // Update the board with character positions
          const allCharacters = [...playerCharacters, ...aiCharacters];
          initialState.gameBoard = initialState.gameBoard.map(row => 
            row.map(tile => {
              const charAtPos = allCharacters.find(
                c => c.position.x === tile.position.x && c.position.y === tile.position.y
              );
              return {
                ...tile,
                occupiedBy: charAtPos ? charAtPos.id : null
              };
            })
          );
          
          setGameState(initialState);
          toast.info("New game created");
        }
      } catch (error) {
        console.error("Error loading game:", error);
        toast.error("Failed to load game");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGame();
  }, [user, navigate]);
  
  const handleTileClick = (x: number, y: number) => {
    if (!gameState || isLoading) return;
    
    // Handle tile click based on game state and selected actions
    toast.info(`Clicked tile at ${x}, ${y}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-solo-dark text-white">
      {/* Header */}
      <header className="p-4 border-b border-solo-accent/30 flex justify-between items-center">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost"
          className="flex items-center text-solo-accent hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Main Menu
        </Button>
        <h1 className="text-xl font-bold text-solo-accent">Tactical Breach</h1>
        <div className="text-sm">
          Faction: <span className="text-solo-accent">{faction}</span>
        </div>
      </header>
      
      {/* Main content */}
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
          <div className="bg-solo-dark border border-solo-accent/30 rounded-lg p-4">
            <h3 className="text-solo-accent font-bold mb-2">Game Info</h3>
            <div className="space-y-2 text-sm">
              <div>Phase: <span className="text-white">{gameState?.gamePhase || 'Loading...'}</span></div>
              <div>Current Player: <span className="text-white">{
                gameState?.players.find(p => p.id === gameState.currentPlayerId)?.name || 'Loading...'
              }</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
