
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sword, Play, Users, Clock } from 'lucide-react';
import { getBattles } from '@/lib/battle-queries';
import VotingControls from '@/components/VotingControls';
import AdSenseUnit from '@/components/AdSenseUnit';

const ADS_CLIENT_ID = "ca-pub-5650237599652350";

const BattleArenaSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<1 | 2 | null>(null);
  
  const { data: battles, isLoading } = useQuery({
    queryKey: ['battles-featured'],
    queryFn: getBattles,
  });

  // Get the most active battle
  const featuredBattle = battles?.[0];

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <div className="h-96 bg-gray-700 rounded-lg"></div>
              <div className="h-96 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredBattle) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">No battles available</h2>
          <p className="text-gray-400">Check back later for exciting video battles!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-purple-900/20 to-blue-900/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sword className="h-10 w-10 text-red-500 animate-pulse" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
              BATTLE ARENA
            </h2>
            <Sword className="h-10 w-10 text-red-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Vote for your favorite! The ultimate video showdown happening now.
          </p>
        </div>

        {/* Featured Battle */}
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gray-900/80 border-2 border-red-500/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-purple-400" />
                Featured Battle
                <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Dual Video Layout */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Video 1 */}
                <div className="relative group">
                  <Card className={`bg-gray-800 border-2 transition-all duration-300 ${
                    selectedVideo === 1 ? 'border-green-500 scale-105' : 'border-gray-600 hover:border-blue-500'
                  }`}>
                    <CardContent className="p-0">
                      <div className="relative aspect-[9/16] bg-gray-700 rounded-t-lg overflow-hidden">
                        <img 
                          src={featuredBattle.video1?.thumbnail_url || '/placeholder.svg'}
                          alt={featuredBattle.video1?.title || 'Video 1'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <Badge className="absolute top-4 left-4 bg-blue-500">
                          {featuredBattle.vote_counts?.video1_votes || 0} votes
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold text-lg mb-2">
                          {featuredBattle.video1?.title || 'Video 1'}
                        </h3>
                        <Button 
                          onClick={() => setSelectedVideo(selectedVideo === 1 ? null : 1)}
                          className={`w-full ${
                            selectedVideo === 1 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          {selectedVideo === 1 ? 'Selected!' : 'Vote for This'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* VS Divider */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-red-500 text-white font-bold text-2xl px-6 py-3 rounded-full border-4 border-white shadow-2xl animate-pulse">
                    VS
                  </div>
                </div>

                {/* Video 2 */}
                <div className="relative group">
                  <Card className={`bg-gray-800 border-2 transition-all duration-300 ${
                    selectedVideo === 2 ? 'border-green-500 scale-105' : 'border-gray-600 hover:border-red-500'
                  }`}>
                    <CardContent className="p-0">
                      <div className="relative aspect-[9/16] bg-gray-700 rounded-t-lg overflow-hidden">
                        <img 
                          src={featuredBattle.video2?.thumbnail_url || '/placeholder.svg'}
                          alt={featuredBattle.video2?.title || 'Video 2'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <Badge className="absolute top-4 right-4 bg-red-500">
                          {featuredBattle.vote_counts?.video2_votes || 0} votes
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold text-lg mb-2">
                          {featuredBattle.video2?.title || 'Video 2'}
                        </h3>
                        <Button 
                          onClick={() => setSelectedVideo(selectedVideo === 2 ? null : 2)}
                          className={`w-full ${
                            selectedVideo === 2 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          {selectedVideo === 2 ? 'Selected!' : 'Vote for This'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Voting Section */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300">Battle ends in 2 days, 14 hours</span>
                </div>
                {selectedVideo && (
                  <VotingControls 
                    battleId={featuredBattle.id}
                    videoId={selectedVideo === 1 ? featuredBattle.video1_id : featuredBattle.video2_id}
                  />
                )}
              </div>

              {/* Ad Integration */}
              <div className="mt-8 text-center">
                <AdSenseUnit
                  client={ADS_CLIENT_ID}
                  slot="8238475251"
                  format="autorelaxed"
                  comment="battle-arena-section"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BattleArenaSection;
