
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
  const [gameMode, setGameMode] = useState<'storyline' | 'chess'>('chess'); // Default to chess

  useEffect(() => {
    const loadGame = async () => {
      setIsLoading(true);
      
      try {
        // If user is logged in, try to load saved game
        if (user) {
          const savedGame = await getLatestSavedGame();
          
          if (savedGame) {
            // Convert checkers mode to chess if found
            if (savedGame.game_data.gameMode === 'checkers') {
              savedGame.game_data.gameMode = 'chess';
            }
            
            setGameState(savedGame.game_data);
            setFaction(savedGame.faction);
            if (savedGame.game_data.gameMode) {
              setGameMode(savedGame.game_data.gameMode as 'storyline' | 'chess');
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
        
        // Create characters based on faction and game mode
        const playerCharacters = generatePresetCharacters(playerUserId, true);
        const aiCharacters = generatePresetCharacters(aiPlayerId, false);
        
        // For chess: If the board is 8x8, adjust the positions
        if (gameMode === 'chess') {
          // Make sure the board is 8x8
          initialState.boardSize = { width: 8, height: 8 };
          initialState.gameBoard = Array(8).fill(null).map((_, y) => 
            Array(8).fill(null).map((_, x) => ({
              position: { x, y },
              type: 'normal',
              occupiedBy: null,
              highlighted: false,
              highlightType: 'none'
            }))
          );
          
          // Position characters for chess
          positionCharactersForChess(playerCharacters, aiCharacters);
        }
        
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

// Helper function to position characters for chess game
function positionCharactersForChess(
  playerCharacters: any[], 
  aiCharacters: any[]
) {
  // Set player character positions (bottom row)
  playerCharacters.forEach((char, index) => {
    // Position main pieces on back row (0-7)
    if (index < 8) {
      // From left to right: Tank (Rook), Assassin (Knight), Mage (Bishop), Hunter (Queen), 
      // Monster (King), Mage, Assassin, Tank 
      char.position = { x: index, y: 7 };
      
      // Set character classes based on chess positions
      if (index === 0 || index === 7) char.class = 'Tank'; // Rooks
      else if (index === 1 || index === 6) char.class = 'Assassin'; // Knights
      else if (index === 2 || index === 5) char.class = 'Mage'; // Bishops
      else if (index === 3) char.class = 'Hunter'; // Queen
      else if (index === 4) {
        char.class = 'Monster'; // King
        char.rank = 'S';
      }
    } 
    // Position pawns on second row (8-15)
    else if (index < 16) {
      char.position = { x: index - 8, y: 6 };
      char.class = 'Monster'; // Pawns
      char.rank = 'C';
    }
    // Hide any extra characters
    else {
      char.position = { x: -1, y: -1 };
    }
  });
  
  // Set AI character positions (top row)
  aiCharacters.forEach((char, index) => {
    // Position main pieces on back row
    if (index < 8) {
      char.position = { x: index, y: 0 };
      
      // Set character classes based on chess positions
      if (index === 0 || index === 7) char.class = 'Tank'; // Rooks
      else if (index === 1 || index === 6) char.class = 'Assassin'; // Knights
      else if (index === 2 || index === 5) char.class = 'Mage'; // Bishops
      else if (index === 3) char.class = 'Hunter'; // Queen
      else if (index === 4) {
        char.class = 'Monster'; // King
        char.rank = 'S';
      }
    } 
    // Position pawns on second row
    else if (index < 16) {
      char.position = { x: index - 8, y: 1 };
      char.class = 'Monster'; // Pawns
      char.rank = 'C';
    }
    // Hide any extra characters
    else {
      char.position = { x: -1, y: -1 };
    }
  });
}
