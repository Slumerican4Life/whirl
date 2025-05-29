
import NavBar from "@/components/NavBar";
import VideoUpload from "@/components/VideoUpload";
import { Separator } from "@/components/ui/separator";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingSpinner from "@/components/LoadingSpinner";

const UploadPage = () => {
  const { loading } = useRequireAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center swirl-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold">Upload Your Video</h1>
            <p className="text-muted-foreground text-center mt-2">
              Show off your skills in a 60-second video battle
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <VideoUpload />
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
