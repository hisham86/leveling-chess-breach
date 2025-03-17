
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainMenu from '@/components/MainMenu';
import GameTitle from '@/components/GameTitle';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState("Commander");

  const handleNewGame = () => {
    toast({
      title: "Starting new game...",
      description: "Preparing tactical systems",
    });
  };

  const handleContinue = () => {
    toast({
      title: "Loading saved game...",
      description: "Retrieving tactical data",
    });
  };

  const handleOptions = () => {
    toast({
      description: "Options menu coming soon",
    });
  };

  const handleQuit = () => {
    window.close();
    // Fallback message if window.close() is blocked by browser
    toast({
      description: "Quit function only works when deployed",
      variant: "destructive",
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-solo-dark">
      {/* Background with new Solo Leveling image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(26, 27, 38, 0.5), rgba(26, 27, 38, 0.8)), url('public/lovable-uploads/ac73eded-be0d-493b-848a-6c469f0f8f45.png')`,
          filter: 'brightness(0.9)',
        }}
      />

      <div className="z-10 w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start px-8 py-10">
          <div className="w-full max-w-sm">
            <GameTitle />
            
            <div className="mt-16">
              <MainMenu 
                onContinue={handleContinue}
                onNewGame={handleNewGame} 
                onOptions={handleOptions}
                onCredits={() => {}}
                onQuit={handleQuit}
              />
            </div>

            <div className="mt-8">
              <div className="bg-solo-dark/80 backdrop-blur-sm px-4 py-2 border-l-4 border-solo-accent mb-1">
                <p className="text-white font-mono tracking-wide">Profile: {profile}</p>
              </div>
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

      <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono">
        v1.0.0 • Tactical RPG Engine
      </div>
    </div>
  );
};

export default Index;
