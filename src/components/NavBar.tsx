
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Video, Award, User, LogOut, UploadCloud } from "lucide-react"; // Added UploadCloud for consistency if used
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NavBar = () => {
  const { user, signOut } = useAuth();

  const displayUsername = user?.user_metadata?.username || user?.email?.split('@')[0] || "User";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-card border-t border-border z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="hidden md:flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-whirl-purple to-whirl-pink text-transparent bg-clip-text">
                Whirl-Win
              </span>
            </Link>
          </div>
          
          <div className="flex md:hidden w-full justify-around py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/">
                  <Button variant="ghost" size="icon">
                    <Home className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
            {user ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/upload">
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" /> {/* Assuming Video icon for upload on mobile */}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload Video</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/leaderboard">
                      <Button variant="ghost" size="icon">
                        <Award className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Leaderboard</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/profile">
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/login">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Login / Sign Up</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/">
                  <Button variant="ghost">Home</Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Homepage</p>
              </TooltipContent>
            </Tooltip>
            
            {user ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/upload">
                      <Button variant="ghost">Upload</Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload a new video</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/leaderboard">
                      <Button variant="ghost">Leaderboard</Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Top Players</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/profile">
                        <Button variant="ghost" className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback>{displayUsername.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="hidden lg:inline">Profile</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Your Profile</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sign Out</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-whirl-purple hover:bg-whirl-deep-purple text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

