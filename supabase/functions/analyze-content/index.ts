
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, title, description } = await req.json();

    if (!openAIApiKey) {
      // Mock analysis without OpenAI
      const mockAnalysis = {
        category: title.toLowerCase().includes('slumerican') || title.toLowerCase().includes('yelawolf') ? 'slumerican' : 
                 title.toLowerCase().includes('conspiracy') || title.toLowerCase().includes('truth') ? 'truth' : 'general',
        claims: [],
        truth_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
        verification_status: 'analyzed'
      };

      return new Response(JSON.stringify(mockAnalysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an AI content analyzer. Analyze video content and return JSON with:
            - category: "slumerican", "truth", "general"
            - claims: array of factual claims made
            - truth_score: 0-100 reliability score
            - verification_status: "analyzed"` 
          },
          { role: 'user', content: `Title: ${title}\nDescription: ${description}` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-content:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
