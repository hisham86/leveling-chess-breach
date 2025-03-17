
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const GamePlay = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-solo-dark">
      <h1 className="text-3xl font-bold text-solo-accent mb-8">Game In Progress</h1>
      <p className="text-gray-300 mb-8">This is where the game will be played.</p>
      <Button onClick={() => navigate('/')} variant="outline">
        Return to Main Menu
      </Button>
    </div>
  );
};

export default GamePlay;
