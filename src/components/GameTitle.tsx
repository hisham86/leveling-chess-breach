
import React from 'react';

const GameTitle = () => {
  return (
    <div className="flex flex-col items-center md:items-start">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-none">
        <span className="inline-block glow-text text-solo-accent">
          MONARCH
        </span>
      </h1>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide leading-none">
        <span className="inline-block relative">
          <span className="relative z-10 text-white drop-shadow-[0_0_8px_rgba(97,218,251,0.3)]">
            GAMBIT
          </span>
          <span className="absolute -bottom-1.5 -right-1.5 z-0 text-solo-purple opacity-90">
            GAMBIT
          </span>
        </span>
      </h1>
      <p className="text-sm md:text-base text-gray-400 mt-2 font-mono tracking-wider">
        SHADOW • TURN-BASED STRATEGY
      </p>
    </div>
  );
};

export default GameTitle;
