
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sword, RefreshCw, Plus, Upload } from 'lucide-react';
import { getBattles } from '@/lib/battle-queries';
import BattleCard from '@/components/BattleCard';
import LoadingFallback from '@/components/LoadingFallback';
import { Link } from 'react-router-dom';

const TodaysBattlesSection = () => {
  const [showAll, setShowAll] = useState(false);
  
  const { data: battles, isLoading, refetch, error } = useQuery({
    queryKey: ['battles'],
    queryFn: getBattles,
    retry: 2,
    retryDelay: 1000,
  });

  const displayBattles = showAll ? battles : battles?.slice(0, 6);

  const handleRefreshClick = () => {
    refetch();
  };

  // Show loading fallback instead of spinner
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Sword className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Today's Battles</h2>
            </div>
          </div>
          <LoadingFallback 
            title="Loading Active Battles"
            description="Finding the hottest video competitions..."
            showRetry={false}
          />
        </div>
      </section>
    );
  }

  // Show error fallback
  if (error) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Sword className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Today's Battles</h2>
            </div>
          </div>
          <LoadingFallback 
            title="Unable to Load Battles"
            description="Battle arena will be back online shortly"
            onRetry={handleRefreshClick}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Sword className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Today's Battles</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefreshClick}
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {!battles || battles.length === 0 ? (
          <div className="text-center py-12">
            <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <Plus className="h-6 w-6 text-red-500" />
                  No Active Battles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Be the first to start a battle! Upload your video and challenge others.
                </p>
                <Link to="/upload">
                  <Button className="bg-red-500 hover:bg-red-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video to Start Battle
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {displayBattles?.map((battle) => (
                <BattleCard key={battle.id} battle={battle} />
              ))}
            </div>

            {battles && battles.length > 6 && (
              <div className="text-center">
                <Button 
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  {showAll ? 'Show Less' : `Show All ${battles.length} Battles`}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TodaysBattlesSection;
