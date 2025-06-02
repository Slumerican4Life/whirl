
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ViralVideo {
  platform: string;
  external_id: string;
  video_url: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  view_count?: number;
  engagement_score?: number;
}

// Mock data for demonstration - in production would connect to APIs
const getMockViralContent = (): ViralVideo[] => [
  {
    platform: 'tiktok',
    external_id: 'mock_1',
    video_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://via.placeholder.com/300x400/ff0000/ffffff?text=TikTok+Viral',
    title: 'Crazy Street Performance Goes Viral',
    description: 'Amazing street performer captivates thousands',
    view_count: 2500000,
    engagement_score: 89
  },
  {
    platform: 'instagram',
    external_id: 'mock_2', 
    video_url: 'https://example.com/video2.mp4',
    thumbnail_url: 'https://via.placeholder.com/300x400/1f77b4/ffffff?text=IG+Reel',
    title: 'Epic Skateboard Trick Compilation',
    description: 'Mind-blowing skateboard tricks that broke the internet',
    view_count: 1800000,
    engagement_score: 92
  },
  {
    platform: 'youtube',
    external_id: 'mock_3',
    video_url: 'https://example.com/video3.mp4', 
    thumbnail_url: 'https://via.placeholder.com/300x400/ff7f0e/ffffff?text=YouTube+Short',
    title: 'Slumerican Music Video Reaction',
    description: 'Reacting to the latest Yelawolf drop',
    view_count: 950000,
    engagement_score: 85
  },
  {
    platform: 'facebook',
    external_id: 'mock_4',
    video_url: 'https://example.com/video4.mp4',
    thumbnail_url: 'https://via.placeholder.com/300x400/2ca02c/ffffff?text=FB+Viral',
    title: 'Conspiracy Theory Debunked',
    description: 'Breaking down the facts behind viral conspiracy claims',
    view_count: 1200000,
    engagement_score: 78
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const viralVideos = getMockViralContent();
    
    // Insert or update viral content
    for (const video of viralVideos) {
      const { error } = await supabase
        .from('viral_content')
        .upsert(video, { 
          onConflict: 'platform,external_id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('Error inserting viral content:', error);
      }
    }

    console.log(`Fetched ${viralVideos.length} viral videos`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      fetched: viralVideos.length,
      message: 'Viral content updated successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-viral-content:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
