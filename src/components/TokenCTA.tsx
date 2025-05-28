
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins, Zap, Star } from "lucide-react";

const TokenCTA = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-whirl-purple via-whirl-pink to-whirl-orange opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      
      {/* Content */}
      <div className="relative glass-dark p-8 rounded-3xl shadow-2xl mb-8 border border-white/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left side - Icon and text */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                <Coins className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                Get Tokens to Battle!
              </h3>
              <p className="text-white/90 text-base leading-relaxed max-w-md">
                Vote on battles, boost your videos, and unlock special features to dominate the competition
              </p>
            </div>
          </div>
          
          {/* Right side - Pricing and CTA */}
          <div className="flex items-center space-x-6">
            <div className="text-center text-white">
              <div className="text-sm opacity-80 uppercase tracking-wider font-medium">Starting at</div>
              <div className="text-3xl font-black text-yellow-300 drop-shadow-lg">$0.99</div>
              <div className="text-xs opacity-70">for 10 tokens</div>
            </div>
            <Link to="/profile">
              <Button className="btn-glow bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 border-2 border-white/20">
                <Zap className="w-5 h-5 mr-3" />
                Get Tokens
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Bottom highlight */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Instant delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Battle ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCTA;
