
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/data";
import { toast } from "sonner";
import { Upload, Video as VideoIcon } from "lucide-react";
import { uploadVideo } from "@/lib/videos";
import { useAuth } from "@/contexts/AuthContext";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a video file");
        return;
      }
      
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !videoFile) {
      toast.error("Please fill all fields and upload a video");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to upload videos");
      return;
    }
    
    setUploading(true);
    
    try {
      await uploadVideo(videoFile, title, category); 
      
      toast.success("Video uploaded successfully - FREE! 🎉");
      setTitle("");
      setCategory("");
      setVideoFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Free Upload Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-center">
        <h3 className="text-white font-bold text-lg mb-1">🎉 Upload Videos Completely FREE!</h3>
        <p className="text-white/90 text-sm">No tokens, no payments, just share your talent!</p>
      </div>

      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        {previewUrl ? (
          <div className="space-y-4">
            <video 
              src={previewUrl} 
              controls 
              className="mx-auto max-h-[300px] rounded-md"
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setVideoFile(null);
                setPreviewUrl(null);
                if (document.getElementById('video-upload')) {
                  (document.getElementById('video-upload') as HTMLInputElement).value = "";
                }
              }}
            >
              Remove Video
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <VideoIcon className="h-16 w-16 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a video (max 60 seconds) - FREE!
              </p>
            </div>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
            />
            <Label htmlFor="video-upload" className="cursor-pointer">
              <Button variant="outline" type="button" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Video - FREE!
                </span>
              </Button>
            </Label>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title"
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
          disabled={!title || !category || !videoFile || uploading}
        >
          {uploading ? "Uploading..." : "🚀 Upload Video - FREE!"}
        </Button>
      </form>
    </div>
  );
};

export default VideoUpload;
