
import React from 'react';

interface GameBackgroundProps {
  children: React.ReactNode;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-solo-dark">
      {/* Background with Solo Leveling Arise image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(26, 27, 38, 0.5), rgba(26, 27, 38, 0.8)), url('public/lovable-uploads/044b3664-3e8f-46cf-969b-c8d224efe417.png')`,
          filter: 'brightness(0.9)',
        }}
      />
      {children}
    </div>
  );
};

export default GameBackground;
