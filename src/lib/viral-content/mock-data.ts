
import { ViralContent } from './types';

/**
 * Enhanced mock viral content with real-looking data
 */
export const getEnhancedMockContent = (): ViralContent[] => {
  return [
    {
      id: 'enhanced-1',
      platform: 'youtube',
      external_id: 'dQw4w9WgXcQ',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      title: 'Epic Robot Dance Battle - Street Performance',
      description: 'Mind-blowing robot dance performance that went viral overnight',
      view_count: 2500000,
      engagement_score: 94,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-2',
      platform: 'tiktok',
      external_id: 'viral_dance_2024',
      video_url: 'https://vm.tiktok.com/ZM8KqQqQq/',
      thumbnail_url: 'https://via.placeholder.com/300x400/ff0000/ffffff?text=Viral+TikTok+Dance',
      title: 'Crazy Dance Challenge Goes Viral',
      description: 'This dance challenge broke TikTok - millions attempting it!',
      view_count: 15000000,
      engagement_score: 97,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-3',
      platform: 'instagram',
      external_id: 'magic_reel_viral',
      video_url: 'https://www.instagram.com/reel/CrandomID/',
      thumbnail_url: 'https://via.placeholder.com/300x400/833AB4/ffffff?text=IG+Reel+Viral',
      title: 'Behind the Scenes Magic',
      description: 'How this street artist creates mind-bending illusions',
      view_count: 3200000,
      engagement_score: 89,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-4',
      platform: 'youtube',
      external_id: 'rap_battle_park',
      video_url: 'https://www.youtube.com/shorts/shortID123',
      thumbnail_url: 'https://via.placeholder.com/300x400/FF0000/ffffff?text=YT+Shorts+Fire',
      title: 'Freestyle Rap Battle in the Park',
      description: 'Spontaneous rap battle that drew massive crowds',
      view_count: 1800000,
      engagement_score: 92,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-5',
      platform: 'facebook',
      external_id: 'parkour_gravity',
      video_url: 'https://www.facebook.com/watch/?v=123456789',
      thumbnail_url: 'https://via.placeholder.com/300x400/1877F2/ffffff?text=FB+Viral+Video',
      title: 'Parkour Artist Defies Gravity',
      description: 'Incredible parkour moves through city streets',
      view_count: 950000,
      engagement_score: 86,
      fetched_at: new Date().toISOString(),
      processed: false
    },
    {
      id: 'enhanced-6',
      platform: 'tiktok',
      external_id: 'pet_comedy_gold',
      video_url: 'https://vm.tiktok.com/ZM8KrandomID/',
      thumbnail_url: 'https://via.placeholder.com/300x400/ff0050/ffffff?text=TikTok+Comedy',
      title: 'Hilarious Pet Reaction Compilation',
      description: 'Pets reacting to magic tricks - pure comedy gold',
      view_count: 8500000,
      engagement_score: 95,
      fetched_at: new Date().toISOString(),
      processed: false
    }
  ];
};
