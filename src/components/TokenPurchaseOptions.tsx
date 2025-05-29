
import { Button } from "@/components/ui/button";
import { Gift, Upload, Heart, MessageCircle, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const TokenPurchaseOptions = () => {
  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl"></div>
      
      {/* Content */}
      <div className="relative glass-dark p-8 rounded-3xl shadow-2xl border border-white/10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-3 rounded-2xl">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Everything FREE</h2>
          </div>
          <p className="text-gray-300 text-lg">No tokens, no payments, just pure creativity!</p>
        </div>

        {/* Free Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="modern-card p-6 rounded-2xl text-center transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Videos</h3>
            <div className="text-3xl font-black text-green-400 mb-2">FREE</div>
            <div className="text-sm text-gray-400 mb-4">Always</div>
            <div className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full mb-4 inline-block">
              No limits
            </div>
            <Link to="/upload">
              <Button className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 shadow-lg">
                <Upload className="w-4 h-4 mr-2" />
                Start Uploading
              </Button>
            </Link>
          </div>

          <div className="modern-card p-6 rounded-2xl text-center transition-all duration-300 ring-2 ring-blue-500">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                <Heart className="w-3 h-3" />
                POPULAR
              </div>
            </div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Vote & Like</h3>
            <div className="text-3xl font-black text-blue-400 mb-2">FREE</div>
            <div className="text-sm text-gray-400 mb-4">Forever</div>
            <div className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full mb-4 inline-block">
              Unlimited voting
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 shadow-lg">
              <Heart className="w-4 h-4 mr-2" />
              Start Voting
            </Button>
          </div>

          <div className="modern-card p-6 rounded-2xl text-center transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Comment & Chat</h3>
            <div className="text-3xl font-black text-purple-400 mb-2">FREE</div>
            <div className="text-sm text-gray-400 mb-4">Always</div>
            <div className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full mb-4 inline-block">
              Express yourself
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 shadow-lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Join Conversations
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">100% Free Forever</span>
          </div>
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            SlumBucket believes in free expression. Upload videos, vote on battles, comment, and showcase your talent - 
            all completely free with no hidden costs or token requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseOptions;
