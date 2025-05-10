
/**
 * Utilities for generating and processing thumbnails
 */

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
