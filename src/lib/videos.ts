
// Main entry point for video-related functionality
// This file re-exports all video-related functions for easier imports

import { uploadVideo } from './video-upload';
import { getVideos, getUserVideos, deleteVideo } from './video-queries';
import { generateThumbnail, dataUrlToBlob } from './thumbnails';
import type { Video } from './types';

export {
  // Types
  Video,
  
  // Thumbnail utilities
  generateThumbnail,
  dataUrlToBlob,
  
  // Upload functionality
  uploadVideo,
  
  // Queries
  getVideos,
  getUserVideos,
  deleteVideo,
};
