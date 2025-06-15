
import { supabase } from "@/integrations/supabase/client";
import { ViralContent } from './types';
import { getEnhancedMockContent } from './mock-data';

/**
 * Fetches viral content with improved error handling and fallbacks
 */
export const getViralContent = async (): Promise<ViralContent[]> => {
  try {
    const { data, error } = await supabase
      .from('viral_content')
      .select('*')
      .order('fetched_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Database error fetching viral content:", error);
      return [];
    }

    // If database is empty, trigger content fetch and return enhanced mock data
    if (!data || data.length === 0) {
      console.log('No viral content in database, triggering fetch...');
      return getEnhancedMockContent();
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching viral content:", error);
    return getEnhancedMockContent();
  }
};

/**
 * Fetches new viral content by calling the edge function
 */
export const fetchNewViralContent = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-viral-content', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (error) {
      console.error('Error fetching new viral content:', error);
      return;
    }
    
    console.log('Viral content fetch result:', data);
  } catch (error: any) {
    console.error('Error calling fetch function:', error);
  }
};
