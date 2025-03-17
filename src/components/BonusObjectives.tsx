
import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const BonusObjectives = () => {
  // This would be populated from the game state in a real implementation
  const objectives = [
    { id: 1, description: 'Destroy the Spider Boss', completed: false },
    { id: 2, description: 'Protect the Corporate Tower', completed: true },
    { id: 3, description: 'Kill at least 7 Enemies', completed: false, current: 3 }
  ];

  return (
    <div className="bg-solo-dark border border-solo-accent/30 rounded-lg p-4">
      <h3 className="text-solo-accent font-bold mb-2">Bonus Objectives</h3>
      
      <div className="space-y-3">
        {objectives.map(objective => (
          <div 
            key={objective.id} 
            className={`flex items-start ${objective.completed ? 'text-green-400 line-through opacity-70' : 'text-white'}`}
          >
            <div className="mt-0.5 mr-2">
              {objective.completed ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <Star size={16} className="text-solo-accent" />
              )}
            </div>
            
            <div className="text-sm">
              {objective.description}
              {objective.hasOwnProperty('current') && (
                <span className="text-xs ml-1 text-gray-400">
                  (Current: {objective.current})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusObjectives;
