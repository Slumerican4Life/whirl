
import { supabase } from "@/integrations/supabase/client";

export interface KnightAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  specialization: string;
  personality: Record<string, any>;
  avatar_url: string | null;
  created_at: string;
}

export interface TruthDebate {
  id: string;
  truth_video_id: string;
  current_round: number;
  status: 'active' | 'completed' | 'paused';
  truth_meter: number;
  participant_count: number;
  created_at: string;
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
  agent: KnightAgent;
}

export const getKnightAgents = async (): Promise<KnightAgent[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Database error fetching knight agents:", error);
      return [];
    }

    return (data || []).map(agent => ({
      ...agent,
      personality: typeof agent.personality === 'string' 
        ? JSON.parse(agent.personality) 
        : (agent.personality as Record<string, any>) || {}
    }));
  } catch (error: any) {
    console.error("Error fetching knight agents:", error);
    return [];
  }
};

export const getTruthDebates = async (): Promise<TruthDebate[]> => {
  try {
    const { data, error } = await supabase
      .from('video_debates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Database error fetching truth debates:", error);
      return [];
    }

    return (data || []).map(debate => ({
      id: debate.id,
      truth_video_id: debate.video_id || debate.viral_content_id || '',
      current_round: debate.debate_round,
      status: debate.status as 'active' | 'completed' | 'paused',
      truth_meter: debate.truth_score || 50,
      participant_count: 0, // This would need to be calculated separately
      created_at: debate.created_at
    }));
  } catch (error: any) {
    console.error("Error fetching truth debates:", error);
    return [];
  }
};

export const getKnightArguments = async (debateId: string): Promise<KnightArgument[]> => {
  try {
    const { data, error } = await supabase
      .from('knight_arguments')
      .select(`
        *,
        agent:ai_agents(*)
      `)
      .eq('debate_id', debateId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Database error fetching knight arguments:", error);
      return [];
    }

    return (data || []).map(arg => ({
      ...arg,
      position: arg.position as 'true' | 'false' | 'uncertain',
      evidence_sources: Array.isArray(arg.evidence_sources) 
        ? arg.evidence_sources 
        : [],
      agent: {
        ...arg.agent,
        personality: typeof arg.agent.personality === 'string'
          ? JSON.parse(arg.agent.personality)
          : (arg.agent.personality as Record<string, any>) || {}
      }
    }));
  } catch (error: any) {
    console.error("Error fetching knight arguments:", error);
    return [];
  }
};

export const createKnightArgument = async (
  debateId: string,
  agentId: string,
  argumentText: string,
  position: 'true' | 'false' | 'uncertain',
  confidenceScore: number,
  evidenceSources: any[] = [],
  roundNumber: number = 1
): Promise<KnightArgument> => {
  try {
    const { data, error } = await supabase
      .from('knight_arguments')
      .insert([{
        debate_id: debateId,
        agent_id: agentId,
        argument_text: argumentText,
        position,
        confidence_score: confidenceScore,
        evidence_sources: evidenceSources,
        round_number: roundNumber
      }])
      .select(`
        *,
        agent:ai_agents(*)
      `)
      .single();

    if (error) {
      console.error("Database error creating knight argument:", error);
      throw error;
    }

    return {
      ...data,
      position: data.position as 'true' | 'false' | 'uncertain',
      evidence_sources: Array.isArray(data.evidence_sources) 
        ? data.evidence_sources 
        : [],
      agent: {
        ...data.agent,
        personality: typeof data.agent.personality === 'string'
          ? JSON.parse(data.agent.personality)
          : (data.agent.personality as Record<string, any>) || {}
      }
    };
  } catch (error: any) {
    console.error("Error creating knight argument:", error);
    throw error;
  }
};

export const createTruthDebate = async (truthVideoId: string): Promise<TruthDebate> => {
  try {
    const { data, error } = await supabase
      .from('video_debates')
      .insert([{
        video_id: truthVideoId,
        debate_round: 1,
        status: 'active',
        truth_score: 50
      }])
      .select('*')
      .single();

    if (error) {
      console.error("Database error creating truth debate:", error);
      throw error;
    }

    return {
      id: data.id,
      truth_video_id: data.video_id || data.viral_content_id || '',
      current_round: data.debate_round,
      status: data.status as 'active' | 'completed' | 'paused',
      truth_meter: data.truth_score || 50,
      participant_count: 0,
      created_at: data.created_at
    };
  } catch (error: any) {
    console.error("Error creating truth debate:", error);
    throw error;
  }
};

export const updateTruthMeter = async (debateId: string, newScore: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('video_debates')
      .update({ truth_score: newScore })
      .eq('id', debateId);

    if (error) {
      console.error("Database error updating truth meter:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Error updating truth meter:", error);
    throw error;
  }
};
