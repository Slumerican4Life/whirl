
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center swirl-bg">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-whirl-purple via-whirl-pink to-whirl-orange text-transparent bg-clip-text">
          404
        </h1>
        <p className="text-xl text-foreground mb-8">Oops! That page doesn't exist</p>
        <Link to="/">
          <Button className="bg-whirl-purple hover:bg-whirl-deep-purple">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
