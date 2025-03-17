
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getLatestSavedGame } from '@/services/gameService';
import { createInitialGameState } from '@/game/utils';
import { generatePresetCharacters } from '@/game/characterData';
import { GameState } from '@/game/types';
import { toast } from 'sonner';

export function useGameLoader() {
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

  return { gameState, setGameState, isLoading, faction };
}
