
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Video } from "./types";

/**
 * Fetches all videos ordered by creation date (newest first)
 * @returns Promise resolving to an array of videos
 */
export const getVideos = async (): Promise<Video[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching videos: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    toast.error(error.message || "Failed to load videos");
    throw error;
  }
};

/**
 * Fetches videos for a specific user
 * @param userId User ID to fetch videos for
 * @returns Promise resolving to an array of videos
 */
export const getUserVideos = async (userId: string): Promise<Video[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching user videos: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching user videos:", error);
    toast.error(error.message || "Failed to load user videos");
    throw error;
  }
};

/**
 * Deletes a video by ID (only if the user owns it)
 * @param videoId ID of the video to delete
 * @returns Promise resolving to boolean indicating success
 */
export const deleteVideo = async (videoId: string): Promise<boolean> => {
  try {
    // Fetch the video first to get the storage path
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
    
    if (fetchError || !video) {
      throw new Error(`Error fetching video: ${fetchError?.message || "Video not found"}`);
    }
    
    // Delete the video record
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (deleteError) {
      throw new Error(`Error deleting video: ${deleteError.message}`);
    }
    
    // Note: Storage files will be cleaned up separately if needed
    // RLS policies will prevent unauthorized deletions
    
    return true;
  } catch (error: any) {
    console.error("Error deleting video:", error);
    toast.error(error.message || "Failed to delete video");
    throw error;
  }
};
