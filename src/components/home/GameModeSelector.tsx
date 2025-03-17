
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GameModeSelectorProps {
  gameMode: "storyline" | "chess" | "checkers";
  setGameMode: (value: "storyline" | "chess" | "checkers") => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ gameMode, setGameMode }) => {
  return (
    <div className="mt-8 mb-4 border-l-4 border-solo-accent px-4 py-3">
      <p className="text-white font-mono tracking-wide mb-2">Game Mode:</p>
      <ToggleGroup 
        type="single" 
        value={gameMode} 
        onValueChange={(value) => value && setGameMode(value as "storyline" | "chess" | "checkers")}
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
        <ToggleGroupItem 
          value="chess" 
          className="text-white border border-solo-accent/50 data-[state=on]:bg-solo-purple"
        >
          Chess
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="checkers" 
          className="text-white border border-solo-accent/50 data-[state=on]:bg-solo-purple"
        >
          Checkers
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default GameModeSelector;
