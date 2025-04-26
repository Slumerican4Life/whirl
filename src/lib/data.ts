
export type Category = 'Funny' | 'Emotional' | 'Savage' | 'Creative' | 'Sports' | 'Dance';

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
  badges: Badge[];
  wins: number;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  userId: string;
  category: Category;
  likes: number;
  createdAt: string;
}

export interface Battle {
  id: string;
  category: Category;
  video1Id: string;
  video2Id: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed';
}

// Mock data
export const users: User[] = [
  {
    id: '1',
    username: 'UrbanDancer',
    avatar: '/placeholder.svg',
    badges: [
      { id: '1', name: 'Dance Master', icon: '🕺', description: 'Won 5 dance battles' },
      { id: '2', name: 'Crowd Favorite', icon: '🌟', description: 'Received 100+ likes' }
    ],
    wins: 12
  },
  {
    id: '2',
    username: 'FunnyGuy42',
    avatar: '/placeholder.svg',
    badges: [
      { id: '3', name: 'Comedy King', icon: '😂', description: 'Won 3 funny battles' }
    ],
    wins: 8
  },
  {
    id: '3',
    username: 'StreetArtist',
    avatar: '/placeholder.svg',
    badges: [
      { id: '4', name: 'Creative Genius', icon: '🎨', description: 'Won 10 creative battles' },
      { id: '5', name: 'Trendsetter', icon: '📈', description: 'Started a viral trend' }
    ],
    wins: 15
  },
  {
    id: '4',
    username: 'B_Ball_Pro',
    avatar: '/placeholder.svg',
    badges: [
      { id: '6', name: 'Sports Star', icon: '🏀', description: 'Won 6 sports battles' }
    ],
    wins: 9
  },
  {
    id: '5',
    username: 'EmotionalSoul',
    avatar: '/placeholder.svg',
    badges: [
      { id: '7', name: 'Heart Toucher', icon: '❤️', description: 'Won 4 emotional battles' }
    ],
    wins: 6
  }
];

export const videos: Video[] = [
  {
    id: '1',
    title: 'Incredible street dance moves',
    url: 'https://example.com/video1.mp4',
    thumbnail: '/placeholder.svg',
    userId: '1',
    category: 'Dance',
    likes: 245,
    createdAt: '2025-04-25T14:30:00Z'
  },
  {
    id: '2',
    title: 'Comedy sketch at the mall',
    url: 'https://example.com/video2.mp4',
    thumbnail: '/placeholder.svg',
    userId: '2',
    category: 'Funny',
    likes: 189,
    createdAt: '2025-04-25T15:45:00Z'
  },
  {
    id: '3',
    title: 'Amazing street art creation',
    url: 'https://example.com/video3.mp4',
    thumbnail: '/placeholder.svg',
    userId: '3',
    category: 'Creative',
    likes: 302,
    createdAt: '2025-04-25T12:15:00Z'
  },
  {
    id: '4',
    title: 'Basketball trick shots',
    url: 'https://example.com/video4.mp4',
    thumbnail: '/placeholder.svg',
    userId: '4',
    category: 'Sports',
    likes: 217,
    createdAt: '2025-04-25T09:20:00Z'
  },
  {
    id: '5',
    title: 'Story that made everyone cry',
    url: 'https://example.com/video5.mp4',
    thumbnail: '/placeholder.svg',
    userId: '5',
    category: 'Emotional',
    likes: 178,
    createdAt: '2025-04-24T18:10:00Z'
  },
  {
    id: '6',
    title: 'Savage comeback on the street',
    url: 'https://example.com/video6.mp4',
    thumbnail: '/placeholder.svg',
    userId: '3',
    category: 'Savage',
    likes: 267,
    createdAt: '2025-04-24T20:45:00Z'
  },
  {
    id: '7',
    title: 'Hilarious pet reaction',
    url: 'https://example.com/video7.mp4',
    thumbnail: '/placeholder.svg',
    userId: '2',
    category: 'Funny',
    likes: 225,
    createdAt: '2025-04-24T14:30:00Z'
  },
  {
    id: '8',
    title: 'Emotional street performance',
    url: 'https://example.com/video8.mp4',
    thumbnail: '/placeholder.svg',
    userId: '5',
    category: 'Emotional',
    likes: 193,
    createdAt: '2025-04-23T16:20:00Z'
  }
];

export const battles: Battle[] = [
  {
    id: '1',
    category: 'Dance',
    video1Id: '1',
    video2Id: '7',
    startTime: '2025-04-26T09:00:00Z',
    endTime: '2025-04-26T21:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    category: 'Funny',
    video1Id: '2',
    video2Id: '7',
    startTime: '2025-04-26T09:00:00Z',
    endTime: '2025-04-26T21:00:00Z',
    status: 'active'
  },
  {
    id: '3',
    category: 'Creative',
    video1Id: '3',
    video2Id: '6',
    startTime: '2025-04-26T09:00:00Z',
    endTime: '2025-04-26T21:00:00Z',
    status: 'active'
  },
  {
    id: '4',
    category: 'Sports',
    video1Id: '4',
    video2Id: '8',
    startTime: '2025-04-26T15:00:00Z',
    endTime: '2025-04-27T03:00:00Z',
    status: 'upcoming'
  },
  {
    id: '5',
    category: 'Emotional',
    video1Id: '5',
    video2Id: '8',
    startTime: '2025-04-27T09:00:00Z',
    endTime: '2025-04-27T21:00:00Z',
    status: 'upcoming'
  },
  {
    id: '6',
    category: 'Savage',
    video1Id: '6',
    video2Id: '1',
    startTime: '2025-04-27T09:00:00Z',
    endTime: '2025-04-27T21:00:00Z',
    status: 'upcoming'
  }
];

// Helper functions
export function getUser(userId: string): User | undefined {
  return users.find(user => user.id === userId);
}

export function getVideo(videoId: string): Video | undefined {
  return videos.find(video => video.id === videoId);
}

export function getBattle(battleId: string): Battle | undefined {
  return battles.find(battle => battle.id === battleId);
}

export function getVideosByCategory(category: Category): Video[] {
  return videos.filter(video => video.category === category);
}

export function getBattlesByCategory(category: Category): Battle[] {
  return battles.filter(battle => battle.category === category);
}

export function getActiveBattles(): Battle[] {
  return battles.filter(battle => battle.status === 'active');
}

export function getUpcomingBattles(): Battle[] {
  return battles.filter(battle => battle.status === 'upcoming');
}

export function getCompletedBattles(): Battle[] {
  return battles.filter(battle => battle.status === 'completed');
}

export function getUsersByWins(limit: number = 10): User[] {
  return [...users].sort((a, b) => b.wins - a.wins).slice(0, limit);
}

export const categories: Category[] = ['Funny', 'Emotional', 'Savage', 'Creative', 'Sports', 'Dance'];
