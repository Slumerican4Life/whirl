
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
 * Fetches viral content with mock data
 */
export const getViralContent = async (): Promise<ViralContent[]> => {
  try {
    const { data, error } = await supabase
      .from('viral_content')
      .select('*')
      .order('fetched_at', { ascending: false });

    if (error) throw error;

    // If no data in database, use mock data for demonstration
    if (!data || data.length === 0) {
      const mockData: ViralContent[] = [
        {
          id: 'mock-1',
          platform: 'youtube',
          external_id: 'mock-yt-1',
          video_url: 'https://example.com/video1',
          thumbnail_url: 'https://via.placeholder.com/300x200',
          title: 'Breaking: New Conspiracy Theory Emerges',
          description: 'Deep dive into the latest theories circulating online',
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
          thumbnail_url: 'https://via.placeholder.com/300x200',
          title: 'Viral Yelawolf Performance Goes Wild',
          description: 'Latest Slumerican performance that broke the internet',
          view_count: 2300000,
          engagement_score: 92,
          fetched_at: new Date().toISOString(),
          processed: false
        }
      ];

      // Use fetch API to call our edge function
      const response = await fetch('/api/fetch-viral-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        console.log('Viral content fetch triggered');
      }

      return mockData;
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching viral content:", error);
    toast.error("Failed to load viral content");
    return [];
  }
};

/**
 * Gets AI agents for Truth Section
 */
export const getAIAgents = async (): Promise<AIAgent[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(agent => ({
      ...agent,
      personality: typeof agent.personality === 'string' 
        ? JSON.parse(agent.personality) 
        : agent.personality || {}
    }));
  } catch (error: any) {
    console.error("Error fetching AI agents:", error);
    toast.error("Failed to load AI agents");
    return [];
  }
};

/**
 * Gets truth analyses from AI agents
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

    if (error) throw error;

    // Use fetch API to call our edge function for content analysis
    const response = await fetch('/api/analyze-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId: 'mock-video',
        title: 'Sample Truth Analysis',
        description: 'Testing our truth analysis system'
      })
    });

    if (response.ok) {
      console.log('Content analysis triggered');
    }

    return (data || []).map(analysis => ({
      ...analysis,
      evidence_links: Array.isArray(analysis.evidence_links) 
        ? analysis.evidence_links 
        : []
    }));
  } catch (error: any) {
    console.error("Error fetching truth analyses:", error);
    toast.error("Failed to load truth analyses");
    return [];
  }
};
