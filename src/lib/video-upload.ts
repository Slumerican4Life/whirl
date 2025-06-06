
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateThumbnail, dataUrlToBlob } from "./thumbnails";

interface UploadOptions {
  contentType?: 'human' | 'ai_assisted' | 'ai_generated';
  aiToolsUsed?: string[];
  userDeclaredAI?: boolean;
}

/**
 * Uploads a video to the storage bucket, generates a thumbnail,
 * and inserts a record into the videos table
 * @param file Video file to upload
 * @param title Title of the video
 * @param category Category of the video
 * @param options Additional options for AI content detection
 * @returns Promise with URLs of the uploaded video and thumbnail, and video ID
 */
export const uploadVideo = async (
  file: File, 
  title: string, 
  category: string,
  options: UploadOptions = {}
): Promise<{ video_url: string, thumbnailUrl: string, videoId: string }> => {
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
    const { data: { publicUrl: videoPublicUrl } } = supabase.storage
      .from('battle-videos')
      .getPublicUrl(filePath);
    
    // Generate and upload thumbnail
    let thumbnailUrl = "";
    try {
      const thumbnailDataUrl = await generateThumbnail(file);
      const thumbnailBlob = dataUrlToBlob(thumbnailDataUrl);
      const thumbnailFile = new File([thumbnailBlob], `thumbnail_${fileName.replace(`.${fileExt}`, '.jpg')}`, { type: 'image/jpeg' });
      
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
    } catch (thumbnailGenError) {
      console.error("Error generating or uploading thumbnail:", thumbnailGenError);
      // Continue without thumbnail if it fails
    }
    
    // Insert record into videos table with AI detection fields
    const { data: newVideo, error: insertError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        video_url: videoPublicUrl,
        thumbnail_url: thumbnailUrl || null,
        title: title,
        category: category || null,
        content_type: options.contentType || 'human',
        ai_tools_used: options.aiToolsUsed || null,
        user_declared_ai: options.userDeclaredAI || false,
        ai_confidence_score: options.contentType === 'human' ? 0 : 0.5 // Basic scoring
      })
      .select('id')
      .single();
    
    if (insertError) {
      throw new Error(`Error inserting video record: ${insertError.message}`);
    }
    if (!newVideo || !newVideo.id) {
      throw new Error('Failed to retrieve video ID after insert.');
    }
    
    return {
      video_url: videoPublicUrl,
      thumbnailUrl: thumbnailUrl,
      videoId: newVideo.id,
    };
  } catch (error: any) {
    console.error("Video upload failed:", error);
    toast.error(error.message || "Failed to upload video");
    throw error;
  }
};
