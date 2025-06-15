
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
    console.log('Starting truth content fetch...');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createSupabaseClient(false);

    // AI agent searches for content that needs fact-checking
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
            content: `You are a truth analysis agent for "Illuminating the Truth" section. Find controversial or claim-heavy content that needs fact-checking:
            1. Political statements or news claims
            2. Health and science misinformation
            3. Historical claims or conspiracies
            4. Social media viral statements
            5. Celebrity or influencer controversial statements
            
            Create realistic examples of content that would benefit from AI Knights fact-checking. Return JSON with: title, description, claims_made, controversy_level, platform, category.`
          },
          {
            role: 'user',
            content: 'Generate 10 pieces of controversial content suitable for truth analysis and fact-checking by AI Knights.'
          }
        ],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    });

    if (!searchResponse.ok) {
      throw new Error(`OpenAI API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const contentSuggestions = searchData.choices[0].message.content;

    console.log('AI agent found truth content:', contentSuggestions);

    // Parse and store truth content
    try {
      const parsedContent = JSON.parse(contentSuggestions);
      
      if (Array.isArray(parsedContent)) {
        for (const item of parsedContent.slice(0, 10)) {
          // Insert into viral_content first
          const { data: viralContent } = await supabase
            .from('viral_content')
            .insert({
              platform: item.platform || 'truth_network',
              external_id: `truth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              video_url: '#',
              title: item.title || 'Truth Analysis Content',
              description: item.description || '',
              view_count: Math.floor(Math.random() * 100000),
              engagement_score: Math.floor(Math.random() * 100),
              fetched_at: new Date().toISOString(),
              processed: false // Needs processing by AI Knights
            })
            .select()
            .single();

          if (viralContent) {
            // Create truth video entry
            await supabase
              .from('truth_videos')
              .insert({
                video_id: viralContent.id,
                category: item.category || 'general',
                claims: item.claims_made || [],
                truth_score: 50, // Neutral starting point
                verification_status: 'pending'
              });

            // Create a debate for this content
            await supabase
              .from('video_debates')
              .insert({
                viral_content_id: viralContent.id,
                status: 'active',
                truth_score: 50,
                debate_round: 1
              });
          }
        }
      }
    } catch (parseError) {
      console.log('Generated truth content as text:', contentSuggestions);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Truth content generated and stored for AI Knights analysis',
      contentGenerated: contentSuggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-truth-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
