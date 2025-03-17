
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Swords, Clock } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GameModeSelectorProps {
  gameMode: "storyline" | "chess";
  setGameMode: (value: "storyline" | "chess") => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ gameMode, setGameMode }) => {
  return (
    <div className="mt-8 mb-4 bg-black/60 backdrop-blur-sm px-4 py-3 border-l-4 border-solo-accent">
      <p className="text-white font-mono tracking-wide mb-2">Game Mode:</p>
      <ToggleGroup 
        type="single" 
        value={gameMode} 
        onValueChange={(value) => value && setGameMode(value as "storyline" | "chess")}
        className="justify-between w-full"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <ToggleGroupItem 
                  disabled 
                  value="storyline" 
                  className="text-white border border-solo-accent/50 data-[state=on]:bg-solo-purple opacity-60 cursor-not-allowed"
                >
                  <Clock size={16} className="mr-2" />
                  Storyline
                  <Badge variant="outline" className="ml-2 bg-amber-500/20 text-amber-300 border-amber-500/50">
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
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <ToggleGroupItem 
                  value="chess" 
                  className="text-white border border-solo-accent/50 data-[state=on]:bg-solo-purple"
                >
                  <Swords size={16} className="mr-2" />
                  Chess
                </ToggleGroupItem>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Characters move like chess pieces based on their class</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ToggleGroup>
      
      {/* Mode description */}
      <div className="mt-3 text-xs text-gray-300 italic">
        {gameMode === 'chess' && (
          <p>Characters move according to chess rules. Hunters move like queens, Tanks like rooks, Mages like bishops, and Assassins like knights.</p>
        )}
        {gameMode === 'storyline' && (
          <p>Follow the story and complete missions to level up your hunters and defeat powerful enemies.</p>
        )}
      </div>
    </div>
  );
};

export default GameModeSelector;
