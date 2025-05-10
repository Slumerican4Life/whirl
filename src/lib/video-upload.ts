
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateThumbnail, dataUrlToBlob } from "./thumbnails";

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
    const { error: uploadError } = await supabase.storage
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
      const { error: thumbnailError } = await supabase.storage
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
    const { error: insertError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        url: publicUrl,
        thumbnail_url: thumbnailUrl || null,
      });
    
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
