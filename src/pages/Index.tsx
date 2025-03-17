
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainMenu from '@/components/MainMenu';
import GameTitle from '@/components/GameTitle';
import { useToast } from "@/hooks/use-toast";
import { Coffee, Twitter, Linkedin, User, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import UserProfile from "@/components/UserProfile";
import { saveGame, getLatestSavedGame } from "@/services/gameService";
import type { GameState } from "@/game/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
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
            const savedMode = latestSave.game_data.gameMode === 'standard' ? 'chess' : latestSave.game_data.gameMode;
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
      gameMode: gameMode // Add the selected game mode
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-solo-dark">
      {/* Background with new Solo Leveling Arise image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(26, 27, 38, 0.5), rgba(26, 27, 38, 0.8)), url('public/lovable-uploads/044b3664-3e8f-46cf-969b-c8d224efe417.png')`,
          filter: 'brightness(0.9)',
        }}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* User Profile / Login Button */}
      <div className="absolute top-4 right-4 z-20">
        {!isLoading && (
          user ? (
            <UserProfile />
          ) : (
            <Button 
              onClick={handleLogin} 
              variant="ghost" 
              className="text-white hover:bg-solo-purple/30 border border-solo-accent/50"
            >
              <User size={18} className="mr-2" />
              Sign In
            </Button>
          )
        )}
      </div>

      <div className="z-10 w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start px-8 py-10">
          <div className="w-full max-w-sm">
            <GameTitle />
            
            {/* Game Mode Selection - Renamed Standard to Storyline and added Coming Soon */}
            <div className="mt-8 mb-4 bg-solo-dark/80 backdrop-blur-sm px-4 py-3 border-l-4 border-solo-accent">
              <p className="text-white font-mono tracking-wide mb-2">Game Mode:</p>
              <ToggleGroup type="single" value={gameMode} onValueChange={(value) => value && setGameMode(value as "storyline" | "chess" | "checkers")}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <ToggleGroupItem disabled value="storyline" className="text-white border border-solo-accent/50 data-[state=on]:bg-solo-purple opacity-60 cursor-not-allowed">
                          Storyline
                          <Badge variant="outline" className="ml-2 bg-amber-500/20 text-amber-300 border-amber-500/50">
                            <Clock size={12} className="mr-1" />
                            Soon
                          </Badge>
                        </ToggleGroupItem>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Storyline mode coming soon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ToggleGroupItem value="chess" className="text-white border border-solo-accent/50 data-[state=on]:bg-solo-purple">
                  Chess
                </ToggleGroupItem>
                <ToggleGroupItem value="checkers" className="text-white border border-solo-accent/50 data-[state=on]:bg-solo-purple">
                  Checkers
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {/* Faction Selection - Moved above MainMenu */}
            <div className="mb-4 bg-solo-dark/80 backdrop-blur-sm px-4 py-2 border-l-4 border-solo-accent">
              <p className="text-white font-mono tracking-wide mb-2">Faction:</p>
              
              <Select 
                value={faction} 
                onValueChange={setFaction}
              >
                <SelectTrigger className="w-full bg-solo-dark border-solo-accent/50 text-white">
                  <SelectValue placeholder="Select faction" />
                </SelectTrigger>
                <SelectContent className="bg-solo-dark border-solo-accent/50 text-white">
                  <SelectItem value="S-RANK HUNTERS" className="hover:bg-solo-purple/30">S-RANK HUNTERS</SelectItem>
                  <SelectItem value="MONARCHS" className="hover:bg-solo-purple/30">MONARCHS</SelectItem>
                  <SelectItem value="MAGIC BEASTS" className="hover:bg-solo-purple/30">MAGIC BEASTS</SelectItem>
                  <SelectItem value="SHADOWS" className="hover:bg-solo-purple/30">SHADOWS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4">
              <MainMenu 
                onContinue={handleContinue}
                onNewGame={handleNewGame} 
                onOptions={handleOptions}
                onCredits={handleCredits}
                onQuit={handleQuit}
              />
            </div>

            <div className="mt-8">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-400 hover:text-white font-mono tracking-wide hover:bg-solo-purple/30 transition-all duration-200 mb-1"
              >
                Achievements
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-400 hover:text-white font-mono tracking-wide hover:bg-solo-purple/30 transition-all duration-200"
              >
                Statistics
              </Button>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex md:w-1/2 relative">
          {/* This space is for game art/visual elements that will appear on the right side */}
        </div>
      </div>

      <div className="absolute bottom-2 w-full flex flex-col items-center">
        <div className="text-gray-400 text-xs mb-2 font-mono">Created by Hisham</div>
        <div className="flex justify-center items-center space-x-4">
          <a 
            href="https://buymeacoffee.com/hishamcato" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-solo-accent transition-colors"
          >
            <Coffee size={20} />
          </a>
          <a 
            href="https://x.com/Solo_Level_27" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-solo-accent transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a 
            href="https://www.linkedin.com/in/hisham86/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-solo-accent transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono">
        v1.0.0 • Tactical RPG Engine
      </div>
    </div>
  );
};

export default Index;
