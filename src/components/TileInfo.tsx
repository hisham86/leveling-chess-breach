
import React from 'react';
import { Tile, Character } from '@/game/types';
import { Shield, Sword, Zap, User, BarChart } from 'lucide-react';

interface TileInfoProps {
  tile: Tile;
  character: Character | null;
}

const TileInfo: React.FC<TileInfoProps> = ({ tile, character }) => {
  // Determine tile type display
  const getTileTypeDisplay = () => {
    switch (tile.type) {
      case 'normal':
        return { name: 'Ground Tile', description: 'No special effect' };
      case 'blocked':
        return { name: 'Blocked Tile', description: 'Cannot be moved through' };
      case 'buff':
        return { name: 'Power Tile', description: '+20% damage when attacking from this tile' };
      case 'debuff':
        return { name: 'Hazard Tile', description: 'Units take 10% damage at end of turn' };
      default:
        return { name: 'Unknown Tile', description: '' };
    }
  };

  const tileTypeInfo = getTileTypeDisplay();

  return (
    <div className="absolute bottom-4 right-4 w-64 bg-solo-dark/90 backdrop-blur-sm border border-solo-accent/30 rounded-lg p-3 text-white shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-solo-accent font-bold text-sm">{tileTypeInfo.name}</h3>
        <div className="text-xs text-gray-400">Position: {tile.position.x}, {tile.position.y}</div>
      </div>
      
      <div className="text-xs mb-3 text-gray-300">{tileTypeInfo.description}</div>
      
      {character ? (
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">{character.name}</div>
            <div className="px-2 py-0.5 bg-gray-700 rounded text-xs">Rank {character.rank}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <User size={12} className="mr-1 text-blue-400" />
              <span>{character.class}</span>
            </div>
            <div className="flex items-center">
              <Shield size={12} className="mr-1 text-green-400" />
              <span>DEF: {character.defense}</span>
            </div>
            <div className="flex items-center">
              <Sword size={12} className="mr-1 text-red-400" />
              <span>ATK: {character.attack}</span>
            </div>
            <div className="flex items-center">
              <Zap size={12} className="mr-1 text-yellow-400" />
              <span>Range: {character.attackRange}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <BarChart size={10} className="mr-1" /> HP: {character.health}/{character.maxHealth}
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${character.health < character.maxHealth * 0.3 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400 italic">No unit on this tile</div>
      )}
    </div>
  );
};

export default TileInfo;
