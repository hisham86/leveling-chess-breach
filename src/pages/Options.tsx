
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Options = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-solo-dark">
      <h1 className="text-3xl font-bold text-solo-accent mb-8">Game Options</h1>
      <p className="text-gray-300 mb-8">Configure your game settings here.</p>
      <Button onClick={() => navigate('/')} variant="outline">
        Return to Main Menu
      </Button>
    </div>
  );
};

export default Options;
