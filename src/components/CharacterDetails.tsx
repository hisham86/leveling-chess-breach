
import React from 'react';
import { Character } from '@/game/types';
import { Zap, Shield, Target, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CharacterDetailsProps {
  character: Character | null;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ character }) => {
  if (!character) {
    return (
      <div className="bg-solo-dark border border-solo-accent/30 rounded-lg p-4 text-center">
        <p className="text-gray-400">Select a character to view details</p>
      </div>
    );
  }

  // Get the appropriate icon based on character class
  const getClassIcon = () => {
    switch (character.class) {
      case 'Tank':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'Mage':
        return <Zap className="w-4 h-4 text-purple-400" />;
      case 'Hunter':
        return <Target className="w-4 h-4 text-green-400" />;
      case 'Assassin':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'Monster':
        return <Shield className="w-4 h-4 text-orange-400" />;
      default:
        return null;
    }
  };

  // Get the appropriate color based on character rank
  const getRankColor = () => {
    switch (character.rank) {
      case 'S':
        return 'bg-yellow-500 text-black';
      case 'A':
        return 'bg-purple-500 text-white';
      case 'B':
        return 'bg-blue-500 text-white';
      case 'C':
        return 'bg-green-500 text-white';
      case 'D':
        return 'bg-gray-500 text-white';
      case 'E':
        return 'bg-gray-400 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-solo-dark border border-solo-accent/30 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{character.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-400 flex items-center">
              {getClassIcon()}
              <span className="ml-1">{character.class}</span>
            </span>
            <Badge className={`${getRankColor()} text-xs`}>Rank {character.rank}</Badge>
          </div>
        </div>
        
        <div className={`w-10 h-10 ${character.owner.includes('1') ? 'bg-blue-600' : 'bg-red-600'} rounded-md flex items-center justify-center shadow-md`}>
          <span>{character.name.substring(0, 2)}</span>
        </div>
      </div>

      {/* Character Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="flex flex-col">
          <span className="text-gray-400">Health</span>
          <div className="flex items-center">
            <div className="w-full h-2 bg-gray-700 rounded-full mr-2">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
              ></div>
            </div>
            <span>{character.health}/{character.maxHealth}</span>
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Attack</span>
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-red-400 mr-1" />
            <span>{character.attack}</span>
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Defense</span>
          <div className="flex items-center">
            <Shield className="w-4 h-4 text-blue-400 mr-1" />
            <span>{character.defense}</span>
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Movement</span>
          <div className="flex items-center space-x-1">
            {Array(character.moveRange).fill(0).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-solo-accent rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Character Abilities */}
      {character.abilities.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-solo-accent mb-2">Abilities</h4>
          <div className="space-y-2">
            {character.abilities.map(ability => (
              <div key={ability.id} className="bg-solo-dark/50 border border-solo-accent/20 p-2 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{ability.name}</span>
                  <span className="text-xs bg-solo-blue/30 px-2 py-0.5 rounded-full">
                    CD: {ability.currentCooldown}/{ability.cooldown}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{ability.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Status:</span>
          <span>
            {character.hasMoved ? 'Moved' : 'Ready'} | 
            {character.hasAttacked ? ' Attacked' : ' Can Attack'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
