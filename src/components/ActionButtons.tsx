
import React from 'react';
import { GameState } from '@/game/types';

interface ActionButtonsProps {
  selectedCharacterId: string | null;
  selectedAction: string | null;
  onMoveClick: () => void;
  onAttackClick: () => void;
  onAbilityClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  selectedCharacterId, 
  selectedAction,
  onMoveClick,
  onAttackClick,
  onAbilityClick
}) => {
  const getActionButtonClass = (action: string, isDisabled: boolean = false) => {
    const baseClass = "px-3 py-1 text-sm font-mono rounded text-white transition";
    
    if (isDisabled) {
      return `${baseClass} bg-gray-700 opacity-50 cursor-not-allowed`;
    }
    
    if (selectedAction === action) {
      return `${baseClass} bg-solo-accent border-2 border-white`;
    }
    
    return `${baseClass} bg-solo-purple/40 hover:bg-solo-purple/60 border border-solo-accent/50`;
  };

  if (!selectedCharacterId) return null;
  
  return (
    <div className="grid grid-cols-3 gap-2">
      <button 
        className={getActionButtonClass('move')}
        onClick={onMoveClick}
      >
        Move
      </button>
      <button 
        className={getActionButtonClass('attack')}
        onClick={onAttackClick}
      >
        Attack
      </button>
      <button 
        className={getActionButtonClass('ability')}
        onClick={onAbilityClick}
      >
        Ability
      </button>
    </div>
  );
};

export default ActionButtons;
