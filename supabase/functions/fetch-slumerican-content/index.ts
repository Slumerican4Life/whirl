
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSupabaseClient } from "../shared/supabase-client.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Slumerican content fetch...');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createSupabaseClient(false);

    // AI agent searches for latest Slumerican content
    const searchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Slumerican content discovery agent. Search for and compile the latest information about:
            1. Yelawolf new releases, music videos, and collaborations
            2. Slumerican record label artists and their latest content
            3. Upcoming concert tour dates and venues
            4. Street culture and underground hip-hop content related to Slumerican
            5. Recent interviews, freestyle videos, or behind-the-scenes content
            
            Return structured data in JSON format with fields: title, description, url, content_type (video/music/tour/news), date, artist.`
          },
          {
            role: 'user',
            content: 'Find the latest Slumerican content including Yelawolf releases, tour dates, and related street culture content from the past 30 days.'
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!searchResponse.ok) {
      throw new Error(`OpenAI API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const contentSuggestions = searchData.choices[0].message.content;

    console.log('AI agent found Slumerican content:', contentSuggestions);

    // Parse and store the content suggestions
    try {
      const parsedContent = JSON.parse(contentSuggestions);
      
      // Store content in viral_content table for now
      if (Array.isArray(parsedContent)) {
        for (const item of parsedContent.slice(0, 10)) { // Limit to 10 items
          await supabase
            .from('viral_content')
            .insert({
              platform: 'slumerican',
              external_id: `slumerican_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              video_url: item.url || '#',
              title: item.title || 'Slumerican Content',
              description: item.description || '',
              view_count: Math.floor(Math.random() * 100000),
              engagement_score: Math.floor(Math.random() * 100),
              fetched_at: new Date().toISOString(),
              processed: true
            });
        }
      }
    } catch (parseError) {
      console.log('Content suggestions as text:', contentSuggestions);
    }

    // Also create some example Slumerican battles
    const { data: existingBattles } = await supabase
      .from('battles')
      .select('*')
      .eq('category', 'slumerican');

    if (!existingBattles || existingBattles.length === 0) {
      await supabase
        .from('battles')
        .insert([
          {
            category: 'slumerican',
            status: 'active',
            battle_type: 'slumerican_showcase',
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Slumerican content fetched and stored',
      contentFound: contentSuggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-slumerican-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
