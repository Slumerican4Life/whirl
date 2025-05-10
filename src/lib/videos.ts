
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Video {
  id: string;
  user_id: string;
  url: string;
  thumbnail_url: string | null;
  created_at: string;
}

/**
 * Generates a thumbnail from a video file
 * @param videoFile The video file to generate thumbnail from
 * @returns Promise resolving to thumbnail data URL
 */
export const generateThumbnail = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      
      const fileUrl = URL.createObjectURL(videoFile);
      video.src = fileUrl;
      
      // Take thumbnail at 25% of the video duration
      video.onloadedmetadata = () => {
        video.currentTime = video.duration * 0.25;
      };
      
      video.oncanplay = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Cleanup
        URL.revokeObjectURL(fileUrl);
        
        // Get the data URL and resolve
        const dataUrl = canvas.toDataURL("image/jpeg");
        resolve(dataUrl);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(fileUrl);
        reject(new Error("Failed to load video for thumbnail generation"));
      };
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Converts a data URL to a Blob
 * @param dataUrl Data URL to convert
 * @returns Blob object
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Uploads a video to the storage bucket, generates a thumbnail,
 * and inserts a record into the videos table
 * @param file Video file to upload
 * @returns Promise with URLs of the uploaded video and thumbnail
 */
export const uploadVideo = async (file: File): Promise<{ url: string, thumbnailUrl: string }> => {
  try {
    // Check authentication first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    // Upload video to storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('battle-videos')
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
    
    if (uploadError) {
      throw new Error(`Error uploading video: ${uploadError.message}`);
    }
    
    // Get public URL for the uploaded video
    const { data: { publicUrl } } = supabase.storage
      .from('battle-videos')
      .getPublicUrl(filePath);
    
    // Generate and upload thumbnail
    let thumbnailUrl = "";
    try {
      // Generate thumbnail from video
      const thumbnailDataUrl = await generateThumbnail(file);
      const thumbnailBlob = dataUrlToBlob(thumbnailDataUrl);
      const thumbnailFile = new File([thumbnailBlob], `thumbnail_${fileName.replace(`.${fileExt}`, '.jpg')}`, { type: 'image/jpeg' });
      
      // Upload thumbnail to storage
      const thumbnailPath = `${user.id}/thumbnails/${thumbnailFile.name}`;
      const { error: thumbnailError, data: thumbnailData } = await supabase.storage
        .from('battle-videos')
        .upload(thumbnailPath, thumbnailFile, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });
      
      if (!thumbnailError) {
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage
          .from('battle-videos')
          .getPublicUrl(thumbnailPath);
        
        thumbnailUrl = thumbPublicUrl;
      }
    } catch (thumbnailError) {
      console.error("Error generating thumbnail:", thumbnailError);
      // Continue without thumbnail if it fails
    }
    
    // Insert record into videos table
    const { error: insertError, data: video } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        url: publicUrl,
        thumbnail_url: thumbnailUrl || null,
      })
      .select()
      .single();
    
    if (insertError) {
      throw new Error(`Error inserting video record: ${insertError.message}`);
    }
    
    return {
      url: publicUrl,
      thumbnailUrl: thumbnailUrl,
    };
  } catch (error: any) {
    console.error("Video upload failed:", error);
    toast.error(error.message || "Failed to upload video");
    throw error;
  }
};

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
