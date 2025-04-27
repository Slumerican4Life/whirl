
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/data";
import { toast } from "sonner";
import { Upload, Video } from "lucide-react";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a video file");
        return;
      }
      
      // Create preview URL
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
    
    setUploading(true);
    
    // In a real app, you would upload the file to a server here
    // For now, we'll simulate a successful upload
    setTimeout(() => {
      toast.success("Video uploaded successfully! It will be matched for a battle soon.");
      setTitle("");
      setCategory("");
      setVideoFile(null);
      setPreviewUrl(null);
      setUploading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
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
              }}
            >
              Remove Video
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <Video className="h-16 w-16 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a video (max 30 seconds)
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
              <Button variant="outline" type="button" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Select Video
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
            maxLength={50}
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
          className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
          disabled={!title || !category || !videoFile || uploading}
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </Button>
      </form>
    </div>
  );
};

export default VideoUpload;
