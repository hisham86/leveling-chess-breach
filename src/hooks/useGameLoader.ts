
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
  const [gameMode, setGameMode] = useState<'storyline' | 'chess' | 'checkers'>('chess'); // Default to chess

  useEffect(() => {
    const loadGame = async () => {
      setIsLoading(true);
      
      try {
        // If user is logged in, try to load saved game
        if (user) {
          const savedGame = await getLatestSavedGame();
          
          if (savedGame) {
            setGameState(savedGame.game_data);
            setFaction(savedGame.faction);
            if (savedGame.game_data.gameMode) {
              setGameMode(savedGame.game_data.gameMode);
            }
            toast.success("Game loaded successfully");
            setIsLoading(false);
            return;
          }
        }
        
        // Create a new game (for both logged in and guest users)
        const playerUserId = user ? user.id : 'guest-player';
        const aiPlayerId = 'ai-player';
        const initialState = createInitialGameState(playerUserId, aiPlayerId);
        
        // Add game mode (use the current gameMode state, which defaults to chess)
        initialState.gameMode = gameMode;
        
        // Create characters based on faction
        const playerCharacters = generatePresetCharacters(playerUserId, true);
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
        toast.info(`New ${gameMode} game started${user ? '' : ' (guest mode)'}`);
      } catch (error) {
        console.error("Error loading game:", error);
        toast.error("Failed to load game");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGame();
  }, [user, navigate, gameMode]);

  return { gameState, setGameState, isLoading, faction, gameMode, setGameMode };
}
