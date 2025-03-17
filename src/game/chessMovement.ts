
import { Character, GameState, GridPosition } from './types';

export const getChessValidMoves = (character: Character, gameState: GameState): GridPosition[] => {
  const validMoves: GridPosition[] = [];
  const { x, y } = character.position;
  const allCharacters = gameState.players.flatMap(p => p.characters);
  
  switch(character.class) {
    case 'Tank': // Moves like a Rook (horizontally and vertically)
      // Horizontal movement (right)
      for (let i = x + 1; i < gameState.boardSize.width; i++) {
        const pos = { x: i, y };
        const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      // Horizontal movement (left)
      for (let i = x - 1; i >= 0; i--) {
        const pos = { x: i, y };
        const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      // Vertical movement (down)
      for (let j = y + 1; j < gameState.boardSize.height; j++) {
        const pos = { x, y: j };
        const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      // Vertical movement (up)
      for (let j = y - 1; j >= 0; j--) {
        const pos = { x, y: j };
        const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      break;
      
    case 'Mage': // Moves like a Bishop (diagonally)
      // Diagonal movement (up-right)
      for (let i = 1; x + i < gameState.boardSize.width && y - i >= 0; i++) {
        const pos = { x: x + i, y: y - i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      // Diagonal movement (down-right)
      for (let i = 1; x + i < gameState.boardSize.width && y + i < gameState.boardSize.height; i++) {
        const pos = { x: x + i, y: y + i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      // Diagonal movement (down-left)
      for (let i = 1; x - i >= 0 && y + i < gameState.boardSize.height; i++) {
        const pos = { x: x - i, y: y + i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      // Diagonal movement (up-left)
      for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
        const pos = { x: x - i, y: y - i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      break;
      
    case 'Hunter': // Moves like a Queen (horizontally, vertically, and diagonally)
      // First, add rook-like moves (horizontal and vertical)
      for (let i = x + 1; i < gameState.boardSize.width; i++) {
        const pos = { x: i, y };
        const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      for (let i = x - 1; i >= 0; i--) {
        const pos = { x: i, y };
        const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      for (let j = y + 1; j < gameState.boardSize.height; j++) {
        const pos = { x, y: j };
        const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      for (let j = y - 1; j >= 0; j--) {
        const pos = { x, y: j };
        const charAtPos = allCharacters.find(c => c.position.x === x && c.position.y === j);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      // Then add bishop-like moves (diagonal)
      for (let i = 1; x + i < gameState.boardSize.width && y - i >= 0; i++) {
        const pos = { x: x + i, y: y - i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      for (let i = 1; x + i < gameState.boardSize.width && y + i < gameState.boardSize.height; i++) {
        const pos = { x: x + i, y: y + i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      for (let i = 1; x - i >= 0 && y + i < gameState.boardSize.height; i++) {
        const pos = { x: x - i, y: y + i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      
      for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
        const pos = { x: x - i, y: y - i };
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (charAtPos) {
          if (charAtPos.owner !== character.owner) validMoves.push(pos);
          break;
        }
        validMoves.push(pos);
      }
      break;
      
    case 'Assassin': // Moves like a Knight (L-shape pattern)
      const knightMoves = [
        { x: x + 2, y: y + 1 }, { x: x + 2, y: y - 1 },
        { x: x - 2, y: y + 1 }, { x: x - 2, y: y - 1 },
        { x: x + 1, y: y + 2 }, { x: x + 1, y: y - 2 },
        { x: x - 1, y: y + 2 }, { x: x - 1, y: y - 2 }
      ];
      
      knightMoves.forEach(pos => {
        if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
            pos.y >= 0 && pos.y < gameState.boardSize.height) {
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (!charAtPos || charAtPos.owner !== character.owner) {
            validMoves.push(pos);
          }
        }
      });
      break;
      
    case 'Monster': // Moves like a King (one square in any direction)
      const kingMoves = [
        { x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 },
        { x: x + 1, y: y + 1 }, { x: x + 1, y: y - 1 }, 
        { x: x - 1, y: y + 1 }, { x: x - 1, y: y - 1 }
      ];
      
      kingMoves.forEach(pos => {
        if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
            pos.y >= 0 && pos.y < gameState.boardSize.height) {
          const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
          if (!charAtPos || charAtPos.owner !== character.owner) {
            validMoves.push(pos);
          }
        }
      });
      break;
      
    default: // Basic piece with limited range
      for (let i = Math.max(0, x - 2); i <= Math.min(gameState.boardSize.width - 1, x + 2); i++) {
        for (let j = Math.max(0, y - 2); j <= Math.min(gameState.boardSize.height - 1, y + 2); j++) {
          if (i !== x || j !== y) {
            const pos = { x: i, y: j };
            const charAtPos = allCharacters.find(c => c.position.x === i && c.position.y === j);
            if (!charAtPos || charAtPos.owner !== character.owner) {
              validMoves.push(pos);
            }
          }
        }
      }
  }
  
  return validMoves;
};
