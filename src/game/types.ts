
// Game Types
export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type CharacterClass = 'Hunter' | 'Tank' | 'Mage' | 'Assassin' | 'Monster';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface GridPosition {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  rank: PlayerRank;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  moveRange: number;
  attackRange: number;
  abilities: Ability[];
  position: GridPosition;
  modelType: string;
  owner: string;
  isSelected: boolean;
  hasMoved: boolean;
  hasAttacked: boolean;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  effect: (gameState: GameState, sourceId: string, targetPosition: GridPosition) => void;
}

export interface Tile {
  position: GridPosition;
  type: 'normal' | 'blocked' | 'buff' | 'debuff';
  occupiedBy: string | null;
  highlighted: boolean;
  highlightType: 'move' | 'attack' | 'ability' | 'none';
}

export interface Player {
  id: string;
  name: string;
  characters: Character[];
  isCurrentTurn: boolean;
}

export interface GameState {
  players: Player[];
  gameBoard: Tile[][];
  currentPlayerId: string;
  selectedCharacterId: string | null;
  gamePhase: 'setup' | 'playing' | 'gameOver';
  turn: number;
  boardSize: { width: number, height: number };
  winner: string | null;
  actionMode: 'move' | 'attack' | 'ability' | 'none';
  selectedAbilityId: string | null;
}
