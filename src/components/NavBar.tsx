
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Video, Award, User } from "lucide-react";

const NavBar = () => {
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
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost" size="icon">
                <Award className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/upload">
              <Button variant="ghost">Upload</Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
            <Link to="/profile">
              <Button className="bg-whirl-purple hover:bg-whirl-deep-purple text-white">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

