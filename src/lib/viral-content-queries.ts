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
      .limit(20);

    if (error) {
      console.error("Database error fetching viral content:", error);
      return [];
    }

    // If database is empty, trigger content fetch and return enhanced mock data
    if (!data || data.length === 0) {
      console.log('No viral content in database, triggering fetch...');
      fetchNewViralContent(); // Don't await - let it run in background
      return getEnhancedMockContent();
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching viral content:", error);
    return getEnhancedMockContent();
  }
};

/**
 * Enhanced mock viral content with real-looking data
 */
const getEnhancedMockContent = (): ViralContent[] => {
  return [
    {
      id: 'enhanced-1',
      platform: 'youtube',
      external_id: 'dQw4w9WgXcQ',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      title: 'Epic Robot Dance Battle - Street Performance',
      description: 'Mind-blowing robot dance performance that went viral overnight',
      view_count: 2500000,
      engagement_score: 94,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-2',
      platform: 'tiktok',
      external_id: 'viral_dance_2024',
      video_url: 'https://vm.tiktok.com/ZM8KqQqQq/',
      thumbnail_url: 'https://via.placeholder.com/300x400/ff0000/ffffff?text=Viral+TikTok+Dance',
      title: 'Crazy Dance Challenge Goes Viral',
      description: 'This dance challenge broke TikTok - millions attempting it!',
      view_count: 15000000,
      engagement_score: 97,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-3',
      platform: 'instagram',
      external_id: 'magic_reel_viral',
      video_url: 'https://www.instagram.com/reel/CrandomID/',
      thumbnail_url: 'https://via.placeholder.com/300x400/833AB4/ffffff?text=IG+Reel+Viral',
      title: 'Behind the Scenes Magic',
      description: 'How this street artist creates mind-bending illusions',
      view_count: 3200000,
      engagement_score: 89,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-4',
      platform: 'youtube',
      external_id: 'rap_battle_park',
      video_url: 'https://www.youtube.com/shorts/shortID123',
      thumbnail_url: 'https://via.placeholder.com/300x400/FF0000/ffffff?text=YT+Shorts+Fire',
      title: 'Freestyle Rap Battle in the Park',
      description: 'Spontaneous rap battle that drew massive crowds',
      view_count: 1800000,
      engagement_score: 92,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-5',
      platform: 'facebook',
      external_id: 'parkour_gravity',
      video_url: 'https://www.facebook.com/watch/?v=123456789',
      thumbnail_url: 'https://via.placeholder.com/300x400/1877F2/ffffff?text=FB+Viral+Video',
      title: 'Parkour Artist Defies Gravity',
      description: 'Incredible parkour moves through city streets',
      view_count: 950000,
      engagement_score: 86,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-6',
      platform: 'tiktok',
      external_id: 'pet_comedy_gold',
      video_url: 'https://vm.tiktok.com/ZM8KrandomID/',
      thumbnail_url: 'https://via.placeholder.com/300x400/ff0050/ffffff?text=TikTok+Comedy',
      title: 'Hilarious Pet Reaction Compilation',
      description: 'Pets reacting to magic tricks - pure comedy gold',
      view_count: 8500000,
      engagement_score: 95,
      fetched_at: new Date().toISOString(),
      processed: false
    }
  ];
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
    if (data?.fetched > 0) {
      toast.success(`Fetched ${data.fetched} viral videos from ${Object.keys(data.platforms || {}).length} platforms`);
    }
  } catch (error: any) {
    console.error('Error calling fetch function:', error);
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
