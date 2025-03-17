import React from 'react';

interface GameBackgroundProps {
  children: React.ReactNode;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A1F2C]">
      {/* Main background with Solo Leveling purple gradient */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#1A1F2C] to-[#221F26]"
      />
      
      {/* Subtle purple glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6E59A5]/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-[100px]" />
      
      {/* Animated pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM5Yjg3ZjUiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTE4IDI2djI4TTQgMjZsMTQtMTQgMTQgMTRNMzIgMjZ2MjhNNDYgMjZsMTQtMTQtMTQtMTRNMzIgMmwtMTQgMTQtMTQtMTRNNDYgNThsMTQtMTQiLz48L2c+PC9zdmc+')]"
      />

      {/* Content overlay - keeps children visible */}
      <div className="absolute inset-0 z-0 bg-[#1A1F2C]/50" />
      
      {/* Actual content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GameBackground;
