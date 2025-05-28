
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins, Zap } from "lucide-react";

const TokenCTA = () => {
  return (
    <div className="bg-gradient-to-r from-whirl-purple to-whirl-pink p-6 rounded-lg shadow-xl mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Get Tokens to Battle!</h3>
            <p className="text-white/80 text-sm">
              Vote on battles, boost your videos, and unlock special features
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right text-white">
            <div className="text-sm opacity-80">Starting at</div>
            <div className="text-lg font-bold">$0.99</div>
          </div>
          <Link to="/profile">
            <Button className="bg-white text-whirl-purple hover:bg-white/90 font-semibold">
              <Zap className="w-4 h-4 mr-2" />
              Get Tokens
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TokenCTA;
