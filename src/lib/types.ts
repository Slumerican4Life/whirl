
// Common types used throughout the video module
export interface Video {
  id: string;
  user_id: string;
  video_url: string; // Changed from 'url' to 'video_url'
  thumbnail_url: string | null;
  created_at: string;
  title: string; // Added title
  category: string | null; // Added category (nullable to match DB)
  caption: string | null; // Added caption
  duration_seconds: number | null; // Added duration
  boosted: boolean | null; // Added boosted status
  boost_expiry: string | null; // Added boost_expiry
}
