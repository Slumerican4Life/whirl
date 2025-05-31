import { faker } from '@faker-js/faker';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  category: string;
  userId: string;
  likes: number;
  dislikes: number;
  comments: number;
  timestamp: string;
  content_type?: 'human' | 'ai_assisted' | 'ai_generated';
  ai_tools_used?: string[];
  ai_confidence_score?: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  wins?: number;
  badges?: Badge[];
}

export type Category =
  | "Freestyle"
  | "Music Video"
  | "Behind the Scenes"
  | "Live Performance"
  | "Dance"
  | "Beatbox"
  | "Comedy";

export type ContentType = 'human' | 'ai_assisted' | 'ai_generated';
export type BattleType = 'human_vs_human' | 'ai_vs_ai' | 'human_vs_ai';

// Export categories array for components that need it
export const categories: Category[] = [
  "Freestyle",
  "Music Video", 
  "Behind the Scenes",
  "Live Performance",
  "Dance",
  "Beatbox",
  "Comedy"
];

export const aiTools = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "DALL-E",
  "Suno AI",
  "Udio",
  "RunwayML",
  "ElevenLabs",
  "Synthesia",
  "Other"
];

export const mockUsers: User[] = [
  {
    id: "1",
    username: "SlumKing",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    wins: 15,
    badges: [
      { id: "1", name: "Champion", icon: "🏆", description: "Won multiple battles" },
      { id: "2", name: "Freestyle King", icon: "👑", description: "Master of freestyle battles" }
    ]
  },
  {
    id: "2",
    username: "BeatMaster",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    wins: 12,
    badges: [
      { id: "3", name: "Beat Maker", icon: "🎵", description: "Creates amazing beats" }
    ]
  },
  {
    id: "3",
    username: "RhymeQueen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9b6c14e?w=150",
    wins: 18,
    badges: [
      { id: "4", name: "Lyric Master", icon: "📝", description: "Master of lyrical content" },
      { id: "5", name: "Queen", icon: "👸", description: "Reigning champion" }
    ]
  },
  {
    id: "4",
    username: "FlowState",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936e79?w=150",
    wins: 9,
    badges: [
      { id: "6", name: "Flow Master", icon: "🌊", description: "Perfect flow and rhythm" }
    ]
  },
  {
    id: "5",
    username: "LyricLegend",
    avatar: "https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?w=150",
    wins: 21,
    badges: [
      { id: "7", name: "Legend", icon: "⭐", description: "Legendary status achieved" },
      { id: "8", name: "Wordsmith", icon: "✍️", description: "Master of words" }
    ]
  },
];

export const mockVideos: Video[] = [];

// Export videos array AFTER mockVideos is defined - this fixes the error!
export const videos = mockVideos;

export const getVideo = (id: string) => {
  return mockVideos.find((video) => video.id === id);
};

export const getUser = (id: string) => {
  return mockUsers.find((user) => user.id === id);
};

export const getVideosByCategory = (category: Category | "All"): Video[] => {
  return [];
};

export const getUsersByWins = () => {
  return [...mockUsers].sort((a, b) => (b.wins || 0) - (a.wins || 0));
};
