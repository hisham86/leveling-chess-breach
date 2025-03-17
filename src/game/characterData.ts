
import { Character, Ability, GridPosition, GameState } from './types';
import { generateId, calculateDamage } from './utils';

// Character abilities
const abilities: Record<string, Ability> = {
  arise: {
    id: 'arise',
    name: 'Arise',
    description: 'Revive a fallen monster to fight for you',
    cooldown: 3,
    currentCooldown: 0,
    effect: (gameState: GameState, sourceId: string, targetPosition: GridPosition) => {
      // Implementation would be handled in the game logic
      console.log('Arise ability used');
    }
  },
  domainExpansion: {
    id: 'domainExpansion',
    name: 'Domain Expansion',
    description: 'Deal damage to all enemies in a 2-tile radius',
    cooldown: 2,
    currentCooldown: 0,
    effect: (gameState: GameState, sourceId: string, targetPosition: GridPosition) => {
      // Implementation would be handled in the game logic
      console.log('Domain Expansion ability used');
    }
  },
  healingTouch: {
    id: 'healingTouch',
    name: 'Healing Touch',
    description: 'Restore 30% HP to target ally',
    cooldown: 2,
    currentCooldown: 0,
    effect: (gameState: GameState, sourceId: string, targetPosition: GridPosition) => {
      // Implementation would be handled in the game logic
      console.log('Healing Touch ability used');
    }
  },
  charge: {
    id: 'charge',
    name: 'Charge',
    description: 'Move up to 3 spaces and attack',
    cooldown: 2,
    currentCooldown: 0,
    effect: (gameState: GameState, sourceId: string, targetPosition: GridPosition) => {
      // Implementation would be handled in the game logic
      console.log('Charge ability used');
    }
  },
  berserkerRage: {
    id: 'berserkerRage',
    name: 'Berserker Rage',
    description: 'Double attack but reduce defense by half for 2 turns',
    cooldown: 3,
    currentCooldown: 0,
    effect: (gameState: GameState, sourceId: string, targetPosition: GridPosition) => {
      // Implementation would be handled in the game logic
      console.log('Berserker Rage ability used');
    }
  }
};

// Character factory function
export const createCharacter = (
  name: string,
  characterClass: Character['class'],
  rank: Character['rank'],
  position: GridPosition,
  owner: string,
  modelType: string
): Character => {
  // Base stats depending on class
  let health = 100;
  let attack = 10;
  let defense = 5;
  let moveRange = 2;
  let attackRange = 1;
  let characterAbilities: Ability[] = [];

  // Adjust stats based on class
  switch (characterClass) {
    case 'Hunter':
      attack = 12;
      moveRange = 3;
      characterAbilities = [abilities.domainExpansion];
      break;
    case 'Tank':
      health = 150;
      defense = 10;
      moveRange = 1;
      characterAbilities = [abilities.charge];
      break;
    case 'Mage':
      health = 80;
      attack = 15;
      defense = 3;
      moveRange = 2;
      attackRange = 3;
      characterAbilities = [abilities.healingTouch];
      break;
    case 'Assassin':
      health = 90;
      attack = 14;
      defense = 4;
      moveRange = 4;
      characterAbilities = [abilities.berserkerRage];
      break;
    case 'Monster':
      health = 120;
      attack = 11;
      defense = 7;
      moveRange = 2;
      characterAbilities = [];
      break;
  }

  // Adjust stats based on rank
  const rankMultipliers = {
    'E': 0.8,
    'D': 0.9,
    'C': 1.0,
    'B': 1.1,
    'A': 1.2,
    'S': 1.5
  };

  const multiplier = rankMultipliers[rank];
  health = Math.floor(health * multiplier);
  attack = Math.floor(attack * multiplier);
  defense = Math.floor(defense * multiplier);

  // Special case for S-rank Shadow Monarch
  if (name === 'Sung Jin-Woo' && rank === 'S') {
    characterAbilities.push(abilities.arise);
  }

  return {
    id: generateId(),
    name,
    class: characterClass,
    rank,
    health,
    maxHealth: health,
    attack,
    defense,
    moveRange,
    attackRange,
    abilities: characterAbilities,
    position,
    modelType,
    owner,
    isSelected: false,
    hasMoved: false,
    hasAttacked: false
  };
};

// Create a set of preset characters
export const generatePresetCharacters = (playerId: string, isPlayer1: boolean): Character[] => {
  const startY = isPlayer1 ? 0 : 7; 
  const characters: Character[] = [];
  
  if (isPlayer1) {
    // Player 1 - Hunters
    characters.push(createCharacter('Sung Jin-Woo', 'Hunter', 'S', {x: 3, y: startY}, playerId, 'hunter-s'));
    characters.push(createCharacter('Cha Hae-In', 'Assassin', 'A', {x: 2, y: startY}, playerId, 'assassin-a'));
    characters.push(createCharacter('Go Gun-Hee', 'Mage', 'S', {x: 4, y: startY}, playerId, 'mage-s'));
    characters.push(createCharacter('Woo Jin-Cheol', 'Tank', 'B', {x: 5, y: startY}, playerId, 'tank-b'));
    characters.push(createCharacter('Min Byung-Gu', 'Hunter', 'C', {x: 1, y: startY}, playerId, 'hunter-c'));
  } else {
    // Player 2 - Monsters
    characters.push(createCharacter('Beru', 'Monster', 'S', {x: 3, y: startY}, playerId, 'monster-s'));
    characters.push(createCharacter('Igris', 'Monster', 'A', {x: 2, y: startY}, playerId, 'monster-a'));
    characters.push(createCharacter('Tusk', 'Monster', 'B', {x: 4, y: startY}, playerId, 'monster-b'));
    characters.push(createCharacter('Iron', 'Monster', 'C', {x: 5, y: startY}, playerId, 'monster-c'));
    characters.push(createCharacter('Tank', 'Monster', 'C', {x: 1, y: startY}, playerId, 'monster-c'));
  }
  
  return characters;
};
