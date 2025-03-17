
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FactionSelectorProps {
  faction: string;
  setFaction: (value: string) => void;
}

const FactionSelector: React.FC<FactionSelectorProps> = ({ faction, setFaction }) => {
  return (
    <div className="mb-4 border-l-4 border-solo-accent px-4 py-2">
      <p className="text-white font-mono tracking-wide mb-2">Faction:</p>
      <Select value={faction} onValueChange={setFaction}>
        <SelectTrigger className="w-full bg-solo-dark/50 border-solo-accent/50 text-white">
          <SelectValue placeholder="Select faction" />
        </SelectTrigger>
        <SelectContent className="bg-solo-dark/80 border-solo-accent/50 text-white">
          <SelectItem value="S-RANK HUNTERS" className="hover:bg-solo-purple/30">S-RANK HUNTERS</SelectItem>
          <SelectItem value="MONARCHS" className="hover:bg-solo-purple/30">MONARCHS</SelectItem>
          <SelectItem value="MAGIC BEASTS" className="hover:bg-solo-purple/30">MAGIC BEASTS</SelectItem>
          <SelectItem value="SHADOWS" className="hover:bg-solo-purple/30">SHADOWS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FactionSelector;
