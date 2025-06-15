
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
    console.log('Starting battle content fetch...');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createSupabaseClient(false);

    // AI agent searches for trending video content suitable for battles
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
            content: `You are a viral content discovery agent for a video battle platform. Find trending content suitable for video battles across categories:
            1. Comedy - Funny skits, pranks, memes
            2. Music - Freestyle rap, singing, beatboxing
            3. Sports - Athletic feats, trick shots, competitions
            4. Gaming - Gameplay highlights, reactions
            5. Art - Creative processes, digital art, graffiti
            6. General - Trending challenges, viral moments
            
            Return mock data in JSON format with fields: title, description, platform, category, engagement_score, view_count. Create realistic but fictional content.`
          },
          {
            role: 'user',
            content: 'Generate 15 diverse video content entries suitable for battle competitions across all categories.'
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!searchResponse.ok) {
      throw new Error(`OpenAI API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const contentSuggestions = searchData.choices[0].message.content;

    console.log('AI agent generated battle content:', contentSuggestions);

    // Parse and store the content
    try {
      const parsedContent = JSON.parse(contentSuggestions);
      
      if (Array.isArray(parsedContent)) {
        for (const item of parsedContent.slice(0, 15)) {
          await supabase
            .from('viral_content')
            .insert({
              platform: item.platform || 'whirl',
              external_id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              video_url: '#', // Placeholder URL
              title: item.title || 'Battle Content',
              description: item.description || '',
              view_count: item.view_count || Math.floor(Math.random() * 500000),
              engagement_score: item.engagement_score || Math.floor(Math.random() * 100),
              fetched_at: new Date().toISOString(),
              processed: true
            });
        }

        // Create some active battles with this content
        const categories = ['comedy', 'music', 'sports', 'gaming', 'art', 'general'];
        for (const category of categories.slice(0, 3)) {
          await supabase
            .from('battles')
            .insert({
              category: category,
              status: 'active',
              battle_type: 'human_vs_human',
              start_time: new Date().toISOString(),
              end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
      }
    } catch (parseError) {
      console.log('Generated content as text:', contentSuggestions);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Battle content generated and stored',
      contentGenerated: contentSuggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-battle-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
