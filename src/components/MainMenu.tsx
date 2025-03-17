
import React from 'react';
import { Button } from "@/components/ui/button";

interface MainMenuProps {
  onContinue: () => void;
  onNewGame: () => void;
  onOptions: () => void;
  onCredits: () => void;
  onQuit: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  onContinue, 
  onNewGame, 
  onOptions, 
  onCredits,
  onQuit 
}) => {
  return (
    <div className="flex flex-col w-full">
      <MenuButton onClick={onContinue} label="Continue" />
      <MenuButton onClick={onNewGame} label="New Game" />
      <MenuButton onClick={onOptions} label="Options" />
      <MenuButton onClick={onCredits} label="Credits" />
      <MenuButton onClick={onQuit} label="Quit" />
    </div>
  );
};

const MenuButton = ({ onClick, label }: { onClick: () => void; label: string }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="w-full py-3 mb-1 justify-start text-white font-mono text-lg tracking-wide 
                hover:bg-solo-purple/40 hover:text-solo-accent transition-all duration-200 
                border-l-4 border-transparent hover:border-solo-accent 
                bg-black/50 backdrop-blur-sm" // Changed to black with transparency for better contrast
    >
      {label}
    </Button>
  );
};

export default MainMenu;
