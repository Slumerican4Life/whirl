
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
    const { message, pageContext, userContext } = await req.json();
    console.log('Lyra AI request:', { message, pageContext, userContext });

    // Get help articles for context
    const supabase = createSupabaseClient(false);
    const { data: helpArticles } = await supabase
      .from('help_articles')
      .select('*');

    // Build context for the AI
    const platformContext = `
You are Lyra, the intelligent assistant for Whirl Win - a video battle platform where users upload videos and compete in battles.

PLATFORM FEATURES:
- Video battles where users vote on the best videos
- Token system (currently free - all features are free)
- Leaderboards showing top performers
- Categories: General, Comedy, Music, Sports, Gaming, Art, Slumerican
- User profiles with stats and badges
- Video uploads with automatic thumbnail generation

CURRENT PAGE: ${pageContext?.currentPage || 'Homepage'}
USER STATUS: ${userContext?.isLoggedIn ? 'Logged in' : 'Not logged in'}

HELP ARTICLES AVAILABLE:
${helpArticles?.map(article => `- ${article.title}: ${article.content.substring(0, 200)}...`).join('\n') || 'No help articles loaded'}

CONTACT INFO: For complex issues, direct users to whirlwin.supp@gmail.com

Be helpful, friendly, and knowledgeable about the platform. Give specific guidance based on what page the user is on and their current status.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: platformContext },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in lyra-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
