import { GridPosition, Character, Tile, GameState } from './types';

// Calculate Manhattan distance between two grid positions
export const calculateDistance = (pos1: GridPosition, pos2: GridPosition): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

// Check if a position is within the game board
export const isPositionValid = (pos: GridPosition, boardSize: { width: number; height: number }): boolean => {
  return pos.x >= 0 && pos.x < boardSize.width && pos.y >= 0 && pos.y < boardSize.height;
};

// Get character at a specific grid position
export const getCharacterAtPosition = (
  pos: GridPosition,
  characters: Character[]
): Character | null => {
  return characters.find(char => char.position.x === pos.x && char.position.y === pos.y) || null;
};

// Check if a position is within a character's move range
export const isPositionInMoveRange = (
  character: Character,
  targetPos: GridPosition,
  gameState: GameState
): boolean => {
  if (!character) return false;

  // Check if position is occupied
  const targetTile = gameState.gameBoard[targetPos.y]?.[targetPos.x];
  if (!targetTile || targetTile.occupiedBy !== null) return false;

  // Check if within movement range
  return calculateDistance(character.position, targetPos) <= character.moveRange;
};

// Check if a position is within a character's attack range
export const isPositionInAttackRange = (
  character: Character,
  targetPos: GridPosition
): boolean => {
  if (!character) return false;
  return calculateDistance(character.position, targetPos) <= character.attackRange;
};

// Get all valid move positions for a character
export const getValidMovePositions = (
  startPos: GridPosition,
  moveRange: number,
  gameBoard: Tile[][],
  boardSize: { width: number; height: number }
): GridPosition[] => {
  const validPositions: GridPosition[] = [];

  // Check all positions within move range
  for (let y = 0; y < boardSize.height; y++) {
    for (let x = 0; x < boardSize.width; x++) {
      const pos = { x, y };
      if (calculateDistance(startPos, pos) <= moveRange) {
        // Check if position is empty
        if (gameBoard[y]?.[x] && gameBoard[y][x].occupiedBy === null) {
          validPositions.push(pos);
        }
      }
    }
  }

  return validPositions;
};

// Get all valid attack positions for a character
export const getValidAttackPositions = (
  character: Character,
  gameState: GameState
): GridPosition[] => {
  const validPositions: GridPosition[] = [];
  const { boardSize } = gameState;
  const allCharacters = gameState.players.flatMap(p => p.characters);

  // Check all positions within attack range
  for (let y = 0; y < boardSize.height; y++) {
    for (let x = 0; x < boardSize.width; x++) {
      const pos = { x, y };
      if (isPositionInAttackRange(character, pos)) {
        // Check if there's an enemy character at this position
        const targetChar = getCharacterAtPosition(pos, allCharacters);
        if (targetChar && targetChar.owner !== character.owner) {
          validPositions.push(pos);
        }
      }
    }
  }

  return validPositions;
};

// Create a new game board
export const createGameBoard = (width: number, height: number): Tile[][] => {
  const board: Tile[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        position: { x, y },
        type: 'normal',
        occupiedBy: null,
        highlighted: false,
        highlightType: 'none'
      });
    }
    board.push(row);
  }
  
  return board;
};

// Create initial game state
export const createInitialGameState = (playerId: string, aiPlayerId: string): GameState => {
  const gameBoard = createGameBoard(8, 8);
  
  // Create players
  const players = [
    {
      id: playerId,
      name: 'Player 1',
      characters: [],
      isCurrentTurn: true
    },
    {
      id: aiPlayerId,
      name: 'AI Player',
      characters: [],
      isCurrentTurn: false
    }
  ];
  
  const initialState: GameState = {
    players,
    gameBoard,
    currentPlayerId: playerId,
    selectedCharacterId: null,
    gamePhase: 'setup',
    turn: 1,
    boardSize: { width: 8, height: 8 },
    winner: null,
    actionMode: 'none',
    selectedAbilityId: null,
    gameMode: 'storyline'
  };
  
  return initialState;
};

// Calculate damage between attacker and defender
export const calculateDamage = (attacker: Character, defender: Character): number => {
  const baseDamage = attacker.attack;
  const defense = defender.defense;
  
  // Simple damage formula with some randomness
  const damageMultiplier = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
  let damage = Math.max(1, Math.floor((baseDamage - defense / 2) * damageMultiplier));
  
  // S-Rank attackers deal extra damage
  if (attacker.rank === 'S') {
    damage = Math.floor(damage * 1.2);
  }
  
  return damage;
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
