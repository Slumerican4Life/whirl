
import { supabase } from "@/integrations/supabase/client";
import { TruthAnalysis } from './types';

/**
 * Gets truth analyses with improved error handling
 */
export const getTruthAnalyses = async (): Promise<TruthAnalysis[]> => {
  try {
    const { data, error } = await supabase
      .from('truth_analyses')
      .select(`
        *,
        agent:ai_agents(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Database error fetching truth analyses:", error);
      return [];
    }

    return (data || []).map(analysis => ({
      ...analysis,
      evidence_links: Array.isArray(analysis.evidence_links) 
        ? analysis.evidence_links 
        : [],
      agent: {
        ...analysis.agent,
        personality: typeof analysis.agent.personality === 'string'
          ? JSON.parse(analysis.agent.personality)
          : (analysis.agent.personality as Record<string, any>) || {}
      }
    }));
  } catch (error: any) {
    console.error("Error fetching truth analyses:", error);
    return [];
  }
};
