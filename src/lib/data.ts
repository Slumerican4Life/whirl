
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
}

export interface Battle {
  id: string;
  category: string;
  video1Id: string;
  video2Id: string;
  startTime: Date;
  endTime: Date;
  status: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  wins?: number;
  badges?: string[];
}

export type Category =
  | "Freestyle"
  | "Music Video"
  | "Behind the Scenes"
  | "Live Performance";

// Export categories array for components that need it
export const categories: Category[] = [
  "Freestyle",
  "Music Video", 
  "Behind the Scenes",
  "Live Performance"
];

// Export videos array for components that need it
export const videos = mockVideos;

export const mockBattles: Battle[] = [
  {
    id: "1",
    category: "Freestyle",
    video1Id: "1",
    video2Id: "4",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    status: "Active",
  },
  {
    id: "2",
    category: "Music Video",
    video1Id: "2",
    video2Id: "5",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    status: "Upcoming",
  },
  {
    id: "3",
    category: "Behind the Scenes",
    video1Id: "3",
    video2Id: "6",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    status: "Completed",
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    username: "SlumKing",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    wins: 15,
    badges: ["Champion", "Freestyle King"]
  },
  {
    id: "2",
    username: "BeatMaster",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    wins: 12,
    badges: ["Beat Maker"]
  },
  {
    id: "3",
    username: "RhymeQueen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9b6c14e?w=150",
    wins: 18,
    badges: ["Lyric Master", "Queen"]
  },
  {
    id: "4",
    username: "FlowState",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936e79?w=150",
    wins: 9,
    badges: ["Flow Master"]
  },
  {
    id: "5",
    username: "LyricLegend",
    avatar: "https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?w=150",
    wins: 21,
    badges: ["Legend", "Wordsmith"]
  },
];

export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Fire Freestyle Session",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    url: "/placeholder-video.mp4",
    category: "Freestyle",
    userId: "1",
    likes: 125,
    dislikes: 8,
    comments: 23,
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    title: "Slumerican Anthem",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    url: "/placeholder-video.mp4",
    category: "Music Video",
    userId: "2",
    likes: 89,
    dislikes: 5,
    comments: 17,
    timestamp: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    title: "Battle Preparation",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800", 
    url: "/placeholder-video.mp4",
    category: "Behind the Scenes",
    userId: "3",
    likes: 67,
    dislikes: 3,
    comments: 12,
    timestamp: "2024-01-13T08:20:00Z"
  },
  {
    id: "4",
    title: "Cypher in the Park",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    url: "/placeholder-video.mp4", 
    category: "Freestyle",
    userId: "4",
    likes: 156,
    dislikes: 12,
    comments: 34,
    timestamp: "2024-01-12T19:10:00Z"
  },
  {
    id: "5",
    title: "Studio Vibes",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
    url: "/placeholder-video.mp4",
    category: "Music Video", 
    userId: "5",
    likes: 203,
    dislikes: 15,
    comments: 45,
    timestamp: "2024-01-11T14:25:00Z"
  },
  {
    id: "6",
    title: "Crowd Goes Wild",
    thumbnail: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800",
    url: "/placeholder-video.mp4",
    category: "Live Performance",
    userId: "1",
    likes: 298,
    dislikes: 22,
    comments: 67,
    timestamp: "2024-01-10T21:15:00Z"
  }
];

export const getBattle = (id: string) => {
  return mockBattles.find((battle) => battle.id === id);
};

export const getVideo = (id: string) => {
  return mockVideos.find((video) => video.id === id);
};

export const getUser = (id: string) => {
  return mockUsers.find((user) => user.id === id);
};

export const getActiveBattles = (): Battle[] => {
  const now = new Date();
  return mockBattles.filter(
    (battle) => now >= battle.startTime && now <= battle.endTime
  );
};

export const getVideosByCategory = (category: Category | "All"): Video[] => {
  if (category === "All") {
    return mockVideos;
  }
  return mockVideos.filter((video) => video.category === category);
};

// Add missing functions that other files are trying to import
export const getBattlesByCategory = (category: string) => {
  if (category === "All") {
    return mockBattles;
  }
  return mockBattles.filter((battle) => battle.category === category);
};

export const getUsersByWins = () => {
  return [...mockUsers].sort((a, b) => (b.wins || 0) - (a.wins || 0));
};
