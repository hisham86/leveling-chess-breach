
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { saveGame, getLatestSavedGame } from "@/services/gameService";
import type { GameState } from "@/game/types";

// Core components
import GameTitle from '@/components/GameTitle';
import MainMenu from '@/components/MainMenu';

// Refactored components
import GameModeSelector from '@/components/home/GameModeSelector';
import FactionSelector from '@/components/home/FactionSelector';
import SecondaryOptions from '@/components/home/SecondaryOptions';
import Footer from '@/components/home/Footer';
import VersionInfo from '@/components/home/VersionInfo';
import GameBackground from '@/components/home/GameBackground';
import UserAuthButton from '@/components/home/UserAuthButton';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [faction, setFaction] = useState("S-RANK HUNTERS");
  const [gameMode, setGameMode] = useState<"storyline" | "chess" | "checkers">("chess");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  
  useEffect(() => {
    // Check if user has saved games
    const checkSavedGames = async () => {
      if (user) {
        const latestSave = await getLatestSavedGame();
        setHasSavedGame(!!latestSave);
        if (latestSave) {
          setFaction(latestSave.faction);
          if (latestSave.game_data && latestSave.game_data.gameMode) {
            // Convert 'standard' to 'storyline' if needed
            const savedMode = latestSave.game_data.gameMode;
            setGameMode(savedMode);
          }
        }
      } else {
        setHasSavedGame(false);
      }
    };
    
    checkSavedGames();
  }, [user]);

  const handleNewGame = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    toast({
      title: "Starting new game...",
      description: "Preparing tactical systems",
    });
    
    // This is just a placeholder for actual game data structure
    const mockGameState = {
      players: [],
      gameBoard: [],
      currentPlayerId: '',
      selectedCharacterId: null,
      gamePhase: 'setup' as const,
      turn: 1,
      boardSize: { width: 10, height: 10 },
      winner: null,
      actionMode: 'none' as const,
      selectedAbilityId: null,
      gameMode: gameMode
    };
    
    // Save initial game state
    await saveGame(faction, mockGameState as GameState);
    
    // Navigate to game
    navigate('/game');
  };

  const handleContinue = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!hasSavedGame) {
      toast({
        title: "No saved game found",
        description: "Start a new game to begin",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Loading saved game...",
      description: "Retrieving tactical data",
    });
    
    // Navigate to game
    navigate('/game');
  };

  const handleOptions = () => {
    toast({
      description: "Options menu coming soon",
    });
    navigate('/options');
  };

  const handleCredits = () => {
    navigate('/credits');
  };

  const handleQuit = () => {
    window.close();
    // Fallback message if window.close() is blocked by browser
    toast({
      description: "Quit function only works when deployed",
      variant: "destructive",
    });
  };

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <GameBackground>
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* User Authentication Button */}
      <UserAuthButton onLogin={handleLogin} />

      <div className="z-10 w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start px-8 py-10">
          <div className="w-full max-w-sm">
            <GameTitle />
            
            {/* Game Mode and Faction Selection */}
            <GameModeSelector gameMode={gameMode} setGameMode={setGameMode} />
            <FactionSelector faction={faction} setFaction={setFaction} />
            
            {/* Main Menu */}
            <div className="mt-4">
              <MainMenu 
                onContinue={handleContinue}
                onNewGame={handleNewGame} 
                onOptions={handleOptions}
                onCredits={handleCredits}
                onQuit={handleQuit}
              />
            </div>

            {/* Secondary Options */}
            <SecondaryOptions />
          </div>
        </div>
        
        <div className="hidden md:flex md:w-1/2 relative">
          {/* This space is for game art/visual elements that will appear on the right side */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Version Info */}
      <VersionInfo />
    </GameBackground>
  );
};

export default Index;
