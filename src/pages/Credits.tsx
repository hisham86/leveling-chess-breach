
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Credits = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-solo-dark">
      <h1 className="text-3xl font-bold text-solo-accent mb-8">Credits</h1>
      <div className="text-gray-300 mb-8 text-center max-w-md">
        <p className="mb-4">MGS: Monarch Gambit Shadow</p>
        <p className="mb-2">A game inspired by Into the Breach</p>
        <p className="text-sm text-gray-500 mb-8">Created with Lovable AI</p>
      </div>
      <Button onClick={() => navigate('/')} variant="outline">
        Return to Main Menu
      </Button>
    </div>
  );
};

export default Credits;
