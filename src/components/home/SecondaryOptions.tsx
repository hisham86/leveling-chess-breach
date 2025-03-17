
import React from 'react';
import { Button } from "@/components/ui/button";

interface SecondaryOptionsProps {
  onAchievements?: () => void;
  onStatistics?: () => void;
}

const SecondaryOptions: React.FC<SecondaryOptionsProps> = ({ 
  onAchievements = () => {}, 
  onStatistics = () => {} 
}) => {
  return (
    <div className="mt-8">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-gray-400 hover:text-white font-mono tracking-wide hover:bg-solo-purple/30 transition-all duration-200 mb-1"
        onClick={onAchievements}
      >
        Achievements
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-gray-400 hover:text-white font-mono tracking-wide hover:bg-solo-purple/30 transition-all duration-200"
        onClick={onStatistics}
      >
        Statistics
      </Button>
    </div>
  );
};

export default SecondaryOptions;
