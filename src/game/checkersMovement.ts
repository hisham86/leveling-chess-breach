
import { Character, GameState, GridPosition } from './types';

export const getCheckersValidMoves = (character: Character, gameState: GameState): GridPosition[] => {
  const validMoves: GridPosition[] = [];
  const { x, y } = character.position;
  const allCharacters = gameState.players.flatMap(p => p.characters);
  const isPlayer1 = character.owner === gameState.players[0].id;
  
  // Forward direction depends on which player the character belongs to
  const forwardY = isPlayer1 ? 1 : -1;
  
  // Regular moves (diagonal forward)
  const regularMoves = [
    { x: x - 1, y: y + forwardY },
    { x: x + 1, y: y + forwardY }
  ];
  
  regularMoves.forEach(pos => {
    if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
        pos.y >= 0 && pos.y < gameState.boardSize.height) {
      const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
      if (!charAtPos) {
        validMoves.push(pos);
      }
    }
  });
  
  // Capture moves (jump over opponent)
  const captureMoves = [
    { jumpX: x - 1, jumpY: y + forwardY, landX: x - 2, landY: y + (forwardY * 2) },
    { jumpX: x + 1, jumpY: y + forwardY, landX: x + 2, landY: y + (forwardY * 2) }
  ];
  
  captureMoves.forEach(move => {
    if (move.landX >= 0 && move.landX < gameState.boardSize.width && 
        move.landY >= 0 && move.landY < gameState.boardSize.height) {
      const jumpCharacter = allCharacters.find(
        c => c.position.x === move.jumpX && c.position.y === move.jumpY && c.owner !== character.owner
      );
      
      const landingCharacter = allCharacters.find(
        c => c.position.x === move.landX && c.position.y === move.landY
      );
      
      if (jumpCharacter && !landingCharacter) {
        validMoves.push({ x: move.landX, y: move.landY });
      }
    }
  });
  
  // S-Rank characters can move backward (king in checkers)
  if (character.rank === 'S') {
    const backwardY = isPlayer1 ? -1 : 1;
    
    // Regular backward moves
    const kingMoves = [
      { x: x - 1, y: y + backwardY },
      { x: x + 1, y: y + backwardY }
    ];
    
    kingMoves.forEach(pos => {
      if (pos.x >= 0 && pos.x < gameState.boardSize.width && 
          pos.y >= 0 && pos.y < gameState.boardSize.height) {
        const charAtPos = allCharacters.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (!charAtPos) {
          validMoves.push(pos);
        }
      }
    });
    
    // Backward capture moves
    const kingCaptures = [
      { jumpX: x - 1, jumpY: y + backwardY, landX: x - 2, landY: y + (backwardY * 2) },
      { jumpX: x + 1, jumpY: y + backwardY, landX: x + 2, landY: y + (backwardY * 2) }
    ];
    
    kingCaptures.forEach(move => {
      if (move.landX >= 0 && move.landX < gameState.boardSize.width && 
          move.landY >= 0 && move.landY < gameState.boardSize.height) {
        const jumpCharacter = allCharacters.find(
          c => c.position.x === move.jumpX && c.position.y === move.jumpY && c.owner !== character.owner
        );
        
        const landingCharacter = allCharacters.find(
          c => c.position.x === move.landX && c.position.y === move.landY
        );
        
        if (jumpCharacter && !landingCharacter) {
          validMoves.push({ x: move.landX, y: move.landY });
        }
      }
    });
  }
  
  return validMoves;
};
