
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface GameHeaderProps {
  faction: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ faction }) => {
  const navigate = useNavigate();
  
  return (
    <header className="p-4 border-b border-solo-accent/30 flex justify-between items-center">
      <Button 
        onClick={() => navigate('/')} 
        variant="ghost"
        className="flex items-center text-solo-accent hover:text-white"
      >
        <ArrowLeft size={16} className="mr-2" />
        Main Menu
      </Button>
      <h1 className="text-xl font-bold text-solo-accent">MGS: Monarch Gambit Shadow</h1>
      <div className="text-sm">
        Faction: <span className="text-solo-accent">{faction}</span>
      </div>
    </header>
  );
};

export default GameHeader;
