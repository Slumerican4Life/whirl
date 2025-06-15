
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Triggers AI agents to fetch content for different sections
 */
export const triggerContentAgents = async () => {
  try {
    console.log('Triggering AI content agents...');

    // Trigger all agents in parallel
    const [slumericanResult, battleResult, truthResult] = await Promise.allSettled([
      supabase.functions.invoke('fetch-slumerican-content'),
      supabase.functions.invoke('fetch-battle-content'),
      supabase.functions.invoke('fetch-truth-content')
    ]);

    const results = {
      slumerican: slumericanResult.status === 'fulfilled' ? slumericanResult.value.data : null,
      battle: battleResult.status === 'fulfilled' ? battleResult.value.data : null,
      truth: truthResult.status === 'fulfilled' ? truthResult.value.data : null
    };

    console.log('AI agents results:', results);

    toast.success('AI agents are populating content across all sections');
    return results;
  } catch (error: any) {
    console.error('Error triggering content agents:', error);
    toast.error('Failed to trigger content agents');
    return null;
  }
};

/**
 * Triggers Slumerican content agent
 */
export const triggerSlumericanAgent = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-slumerican-content');
    
    if (error) {
      console.error('Slumerican agent error:', error);
      toast.error('Failed to fetch Slumerican content');
      return null;
    }

    toast.success('Slumerican AI agent is gathering the latest content');
    return data;
  } catch (error: any) {
    console.error('Error with Slumerican agent:', error);
    toast.error('Slumerican content agent failed');
    return null;
  }
};

/**
 * Triggers battle content agent
 */
export const triggerBattleAgent = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-battle-content');
    
    if (error) {
      console.error('Battle agent error:', error);
      toast.error('Failed to generate battle content');
      return null;
    }

    toast.success('Battle AI agent is creating content for battles');
    return data;
  } catch (error: any) {
    console.error('Error with battle agent:', error);
    toast.error('Battle content agent failed');
    return null;
  }
};

/**
 * Triggers truth content agent
 */
export const triggerTruthAgent = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-truth-content');
    
    if (error) {
      console.error('Truth agent error:', error);
      toast.error('Failed to fetch truth content');
      return null;
    }

    toast.success('Truth AI agent is gathering content for analysis');
    return data;
  } catch (error: any) {
    console.error('Error with truth agent:', error);
    toast.error('Truth content agent failed');
    return null;
  }
};
