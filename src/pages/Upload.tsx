
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, Category } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload } from "lucide-react";
import NavBar from "@/components/NavBar";

const UploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive"
      });
      return;
    }
    
    // Check if file is too large (15MB)
    if (file.size > 15 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video must be less than 15MB",
        variant: "destructive"
      });
      return;
    }
    
    setVideoFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !videoFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      
      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded and will be scheduled for a battle soon.",
      });
      
      // Redirect to home page
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Upload Your Battle Video</h1>
          
          <Card className="p-6 bg-card">
            <form onSubmit={handleUpload}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (required)</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your video a catchy title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Category (required)</Label>
                  <RadioGroup value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <RadioGroupItem value={cat} id={cat} />
                          <Label htmlFor={cat}>{cat}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some details about your video (optional)"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Upload Video (required, max 15 seconds)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-whirl-purple transition-colors" onClick={() => document.getElementById('video-upload')?.click()}>
                    <input
                      type="file"
                      id="video-upload"
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                    
                    {previewUrl ? (
                      <div className="space-y-4">
                        <video 
                          src={previewUrl} 
                          className="mx-auto max-h-60 rounded-lg" 
                          controls
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setVideoFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          Change Video
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, WebM or MOV (max 15 seconds, 15MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-whirl-purple hover:bg-whirl-deep-purple text-white"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload & Enter Battle"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
