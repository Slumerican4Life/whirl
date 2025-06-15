
import { supabase } from "@/integrations/supabase/client";
import { AIAgent } from './types';

/**
 * Gets AI agents with improved error handling
 */
export const getAIAgents = async (): Promise<AIAgent[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Database error fetching AI agents:", error);
      return [];
    }

    return (data || []).map(agent => ({
      ...agent,
      personality: typeof agent.personality === 'string' 
        ? JSON.parse(agent.personality) 
        : (agent.personality as Record<string, any>) || {}
    }));
  } catch (error: any) {
    console.error("Error fetching AI agents:", error);
    return [];
  }
};
