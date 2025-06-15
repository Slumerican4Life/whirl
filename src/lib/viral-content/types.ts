
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
