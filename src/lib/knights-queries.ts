
import { supabase } from "@/integrations/supabase/client";

export interface VideoDebate {
  id: string;
  video_id?: string;
  viral_content_id?: string;
  debate_round: number;
  status: string;
  truth_score: number;
  final_verdict?: string;
  created_at: string;
  updated_at: string;
}

export interface KnightArgument {
  id: string;
  debate_id: string;
  agent_id: string;
  argument_text: string;
  position: 'true' | 'false' | 'uncertain';
  confidence_score: number;
  evidence_sources: any[];
  round_number: number;
  created_at: string;
  agent: {
    id: string;
    name: string;
    title: string;
    description: string;
    specialization: string;
    personality: Record<string, any>;
  };
}

/**
 * Creates a new video debate for knights to analyze
 */
export const createVideoDebate = async (videoId: string, isViralContent: boolean = true): Promise<VideoDebate> => {
  const insertData = isViralContent 
    ? { viral_content_id: videoId }
    : { video_id: videoId };

  const { data, error } = await supabase
    .from('video_debates')
    .insert({
      ...insertData,
      status: 'active',
      truth_score: 50,
      debate_round: 1
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Gets all debates for a specific video
 */
export const getVideoDebates = async (videoId: string, isViralContent: boolean = true): Promise<VideoDebate[]> => {
  const column = isViralContent ? 'viral_content_id' : 'video_id';
  
  const { data, error } = await supabase
    .from('video_debates')
    .select('*')
    .eq(column, videoId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Gets knight arguments for a debate
 */
export const getKnightArguments = async (debateId: string): Promise<KnightArgument[]> => {
  const { data, error } = await supabase
    .from('knight_arguments')
    .select(`
      *,
      agent:ai_agents(*)
    `)
    .eq('debate_id', debateId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Updates the truth score for a debate
 */
export const updateTruthScore = async (debateId: string, truthScore: number): Promise<void> => {
  const { error } = await supabase
    .from('video_debates')
    .update({ 
      truth_score: truthScore,
      updated_at: new Date().toISOString()
    })
    .eq('id', debateId);

  if (error) throw error;
};

/**
 * Finalizes a debate with a verdict
 */
export const finalizeDebate = async (debateId: string, verdict: string): Promise<void> => {
  const { error } = await supabase
    .from('video_debates')
    .update({ 
      status: 'completed',
      final_verdict: verdict,
      updated_at: new Date().toISOString()
    })
    .eq('id', debateId);

  if (error) throw error;
};

/**
 * Adds a knight argument to a debate
 */
export const addKnightArgument = async (
  debateId: string,
  agentId: string,
  argumentText: string,
  position: 'true' | 'false' | 'uncertain',
  confidenceScore: number,
  evidenceSources: any[] = [],
  roundNumber: number = 1
): Promise<KnightArgument> => {
  const { data, error } = await supabase
    .from('knight_arguments')
    .insert({
      debate_id: debateId,
      agent_id: agentId,
      argument_text: argumentText,
      position,
      confidence_score: confidenceScore,
      evidence_sources: evidenceSources,
      round_number: roundNumber
    })
    .select(`
      *,
      agent:ai_agents(*)
    `)
    .single();

  if (error) throw error;
  return data;
};
