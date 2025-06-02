
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ViralContent {
  id: string;
  platform: string;
  external_id: string;
  video_url: string;
  thumbnail_url: string | null;
  title: string;
  description: string | null;
  view_count: number;
  engagement_score: number;
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
  avatar_url: string | null;
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
  agent: AIAgent;
}

/**
 * Fetches viral content with improved error handling and fallbacks
 */
export const getViralContent = async (): Promise<ViralContent[]> => {
  try {
    const { data, error } = await supabase
      .from('viral_content')
      .select('*')
      .order('fetched_at', { ascending: false })
      .limit(20); // Limit to prevent large payloads

    if (error) {
      console.error("Database error fetching viral content:", error);
      // Return mock data instead of throwing
      return getMockViralContent();
    }

    // If no data in database, use mock data for demonstration
    if (!data || data.length === 0) {
      return getMockViralContent();
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching viral content:", error);
    // Don't show error toast for background failures
    return getMockViralContent();
  }
};

/**
 * Mock viral content for fallback when database is unavailable
 */
const getMockViralContent = (): ViralContent[] => {
  return [
    {
      id: 'mock-1',
      platform: 'youtube',
      external_id: 'mock-yt-1',
      video_url: 'https://example.com/video1',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Trending+Video+1',
      title: 'Breaking: Latest Conspiracy Theory Analysis',
      description: 'Deep dive into the theories making waves online',
      view_count: 1500000,
      engagement_score: 85,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'mock-2',
      platform: 'tiktok',
      external_id: 'mock-tk-1',
      video_url: 'https://example.com/video2',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Viral+Slumerican',
      title: 'Yelawolf Performance Goes Viral',
      description: 'Latest Slumerican performance breaking the internet',
      view_count: 2300000,
      engagement_score: 92,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'mock-3',
      platform: 'instagram',
      external_id: 'mock-ig-1',
      video_url: 'https://example.com/video3',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Trending+Content',
      title: 'Behind the Scenes Truth',
      description: 'Exclusive content you need to see',
      view_count: 850000,
      engagement_score: 78,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'mock-4',
      platform: 'youtube',
      external_id: 'mock-yt-2',
      video_url: 'https://example.com/video4',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Hot+Topic',
      title: 'Culture Clash: Street vs Mainstream',
      description: 'The debate everyone is talking about',
      view_count: 1200000,
      engagement_score: 88,
      fetched_at: new Date().toISOString(),
      processed: false
    }
  ];
};

/**
 * Fetches new viral content by calling the edge function with timeout
 */
export const fetchNewViralContent = async (): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('fetch-viral-content', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (error) {
      console.error('Error fetching new viral content:', error);
      toast.error('Unable to fetch new content right now');
      return;
    }
    
    toast.success('New viral content fetched successfully');
  } catch (error: any) {
    console.error('Error calling fetch function:', error);
    toast.error('Content refresh temporarily unavailable');
  }
};

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
