
import { GameState, Character, GridPosition } from '@/game/types';
import { getValidMovePositions } from '@/game/utils';
import { getChessValidMoves } from '@/game/chessMovement';
import { getCheckersValidMoves } from '@/game/checkersMovement';

export const highlightValidMoves = (
  character: Character,
  gameState: GameState
): GameState => {
  const newGameState = { ...gameState };
  
  // Reset all highlight
  newGameState.gameBoard = newGameState.gameBoard.map(row =>
    row.map(tile => ({
      ...tile,
      highlighted: false,
      highlightType: 'none'
    }))
  );
  
  // Set action mode
  newGameState.actionMode = 'move';
  
  // Get valid moves based on game mode
  let validMoves: GridPosition[] = [];
  
  if (gameState.gameMode === 'chess') {
    validMoves = getChessValidMoves(character, gameState);
  } else if (gameState.gameMode === 'checkers') {
    validMoves = getCheckersValidMoves(character, gameState);
  } else {
    // Standard mode
    validMoves = getValidMovePositions(
      character.position,
      character.moveRange,
      newGameState.gameBoard,
      newGameState.boardSize
    );
  }
  
  // Highlight valid moves with green highlight
  validMoves.forEach(pos => {
    if (pos.x >= 0 && pos.x < newGameState.boardSize.width && 
        pos.y >= 0 && pos.y < newGameState.boardSize.height) {
      newGameState.gameBoard[pos.y][pos.x].highlighted = true;
      newGameState.gameBoard[pos.y][pos.x].highlightType = 'move';
    }
  });
  
  return newGameState;
};

export const selectCharacter = (
  characterId: string | null,
  gameState: GameState
): GameState => {
  const newGameState = { ...gameState };
  
  if (newGameState.selectedCharacterId === characterId) {
    newGameState.selectedCharacterId = null;
    newGameState.actionMode = 'none';
  } else {
    newGameState.selectedCharacterId = characterId;
    
    // Reset all highlights when changing selected character
    newGameState.gameBoard = newGameState.gameBoard.map(row =>
      row.map(tile => ({
        ...tile,
        highlighted: false,
        highlightType: 'none'
      }))
    );
  }
  
  return newGameState;
};

export const endTurn = (gameState: GameState): GameState => {
  const newGameState = { ...gameState };
  
  const currentPlayerIndex = newGameState.players.findIndex(
    p => p.id === newGameState.currentPlayerId
  );
  const nextPlayerIndex = (currentPlayerIndex + 1) % newGameState.players.length;
  
  newGameState.players = newGameState.players.map((player, index) => ({
    ...player,
    isCurrentTurn: index === nextPlayerIndex,
    characters: player.characters.map(char => ({
      ...char,
      hasMoved: index === nextPlayerIndex ? false : char.hasMoved,
      hasAttacked: index === nextPlayerIndex ? false : char.hasAttacked,
      abilities: char.abilities.map(ability => ({
        ...ability,
        currentCooldown: ability.currentCooldown > 0 ? ability.currentCooldown - 1 : 0
      }))
    }))
  }));
  
  newGameState.currentPlayerId = newGameState.players[nextPlayerIndex].id;
  
  if (nextPlayerIndex === 0) {
    newGameState.turn += 1;
  }
  
  newGameState.selectedCharacterId = null;
  newGameState.actionMode = 'none';
  
  // Clear all highlights when turn ends
  newGameState.gameBoard = newGameState.gameBoard.map(row =>
    row.map(tile => ({
      ...tile,
      highlighted: false,
      highlightType: 'none'
    }))
  );
  
  return newGameState;
};
