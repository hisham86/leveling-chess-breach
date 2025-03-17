
import React from 'react';
import { Button } from "@/components/ui/button";

interface MainMenuProps {
  onContinue: () => void;
  onNewGame: () => void;
  onOptions: () => void;
  onCredits: () => void;
  onQuit: () => void;
  hasSavedGame?: boolean; // New prop to check if user has a saved game
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  onContinue, 
  onNewGame, 
  onOptions, 
  onCredits,
  onQuit,
  hasSavedGame = false // Default to false if prop not provided
}) => {
  return (
    <div className="flex flex-col w-full">
      <MenuButton 
        onClick={onContinue} 
        label="Continue" 
        disabled={!hasSavedGame} // Disable button if no saved game
      />
      <MenuButton onClick={onNewGame} label="New Game" />
      <MenuButton onClick={onOptions} label="Options" />
      <MenuButton onClick={onCredits} label="Credits" />
      <MenuButton onClick={onQuit} label="Quit" />
    </div>
  );
};

interface MenuButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const MenuButton = ({ onClick, label, disabled = false }: MenuButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      disabled={disabled}
      className={`w-full py-3 mb-1 justify-start text-white font-mono text-lg tracking-wide 
                hover:bg-solo-purple/40 hover:text-solo-accent transition-all duration-200 
                border-l-4 border-transparent hover:border-solo-accent 
                bg-black/50 backdrop-blur-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </Button>
  );
};

export default MainMenu;
