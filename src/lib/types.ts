
// Common types used throughout the video module
export interface Video {
  id: string;
  user_id: string;
  url: string;
  thumbnail_url: string | null;
  created_at: string;
}
