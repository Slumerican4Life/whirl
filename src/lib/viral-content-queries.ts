
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ViralContent {
  id: string;
  platform: string;
  external_id: string;
  video_url: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  view_count?: number;
  engagement_score?: number;
  fetched_at: string;
  processed: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  specialization: string;
  personality: Record<string, any>;
  avatar_url?: string;
  created_at: string;
}

export interface TruthAnalysis {
  id: string;
  truth_video_id: string;
  agent_id: string;
  analysis_text: string;
  confidence_score: number;
  verdict: string;
  evidence_links: any[];
  created_at: string;
  agent?: AIAgent;
}

/**
 * Fetch viral content from database
 */
export const getViralContent = async (): Promise<ViralContent[]> => {
  try {
    const { data, error } = await supabase
      .from('viral_content')
      .select('*')
      .order('engagement_score', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching viral content:", error);
    toast.error("Failed to load viral content");
    return [];
  }
};

/**
 * Trigger viral content fetch
 */
export const fetchNewViralContent = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/fetch-viral-content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabase.supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch viral content');
    
    const result = await response.json();
    toast.success(`Fetched ${result.fetched} new viral videos`);
    return true;
  } catch (error: any) {
    console.error("Error triggering viral fetch:", error);
    toast.error("Failed to fetch new content");
    return false;
  }
};

/**
 * Get all AI agents
 */
export const getAIAgents = async (): Promise<AIAgent[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching AI agents:", error);
    toast.error("Failed to load AI agents");
    return [];
  }
};

/**
 * Analyze content with AI
 */
export const analyzeContent = async (videoId: string, title: string, description?: string) => {
  try {
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/analyze-content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabase.supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, title, description }),
    });

    if (!response.ok) throw new Error('Failed to analyze content');
    return await response.json();
  } catch (error: any) {
    console.error("Error analyzing content:", error);
    return null;
  }
};

/**
 * Get truth analyses for a video
 */
export const getTruthAnalyses = async (truthVideoId: string): Promise<TruthAnalysis[]> => {
  try {
    const { data, error } = await supabase
      .from('truth_analyses')
      .select(`
        *,
        agent:ai_agents(*)
      `)
      .eq('truth_video_id', truthVideoId)
      .order('confidence_score', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching truth analyses:", error);
    return [];
  }
};
