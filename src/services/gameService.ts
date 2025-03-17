
import { supabase } from '@/integrations/supabase/client';
import { GameState } from '@/game/types';
import { Json } from '@/integrations/supabase/types';

export interface SavedGame {
  id: string;
  user_id: string;
  game_data: GameState;
  faction: string;
  created_at: string;
  updated_at: string;
}

export const saveGame = async (faction: string, gameData: GameState): Promise<SavedGame | null> => {
  try {
    // First, get the user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }
    
    // Now insert the data with the user ID
    const { data, error } = await supabase
      .from('saved_games')
      .insert({
        faction,
        game_data: gameData as unknown as Json,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving game:', error);
      return null;
    }

    return {
      ...data,
      game_data: data.game_data as unknown as GameState
    } as SavedGame;
  } catch (error) {
    console.error('Unexpected error saving game:', error);
    return null;
  }
};

export const getSavedGames = async (): Promise<SavedGame[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_games')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved games:', error);
      return [];
    }

    return data?.map(game => ({
      ...game,
      game_data: game.game_data as unknown as GameState
    })) as SavedGame[] || [];
  } catch (error) {
    console.error('Unexpected error fetching saved games:', error);
    return [];
  }
};

export const getLatestSavedGame = async (): Promise<SavedGame | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_games')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching latest saved game:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      game_data: data.game_data as unknown as GameState
    } as SavedGame;
  } catch (error) {
    console.error('Unexpected error fetching latest saved game:', error);
    return null;
  }
};

export const deleteSavedGame = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_games')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting saved game:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting saved game:', error);
    return false;
  }
};
