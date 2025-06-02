import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sword, RefreshCw, Plus } from 'lucide-react';
import { getBattles } from '@/lib/battle-queries';
import { getViralContent } from '@/lib/viral-content-queries';
import BattleCard from '@/components/BattleCard';

const TodaysBattlesSection = () => {
  const [showAll, setShowAll] = useState(false);
  
  const { data: battles, isLoading: battlesLoading, refetch: refetchBattles } = useQuery({
    queryKey: ['battles'],
    queryFn: getBattles,
  });

  const { data: viralContent, isLoading: viralLoading } = useQuery({
    queryKey: ['viral-content-for-battles'],
    queryFn: getViralContent,
  });

  const displayBattles = showAll ? battles : battles?.slice(0, 6);
  const hasNoBattles = !battles || battles.length === 0;

  const handleRefreshClick = () => {
    refetchBattles();
  };

  const generateMockBattle = () => {
    if (!viralContent || viralContent.length < 2) return null;
    
    const shuffled = [...viralContent].sort(() => 0.5 - Math.random());
    return {
      id: 'mock-battle',
      video1: shuffled[0],
      video2: shuffled[1],
      category: 'viral',
      status: 'active',
      created_at: new Date().toISOString()
    };
  };

  if (battlesLoading || viralLoading) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-red-500" />
          </div>
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

        {hasNoBattles ? (
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
                  No battles are currently active. Check back soon or create your own!
                </p>
                {viralContent && viralContent.length >= 2 && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">
                      Mock Battle Preview (from viral content):
                    </p>
                    <div className="text-xs text-gray-400">
                      {viralContent[0]?.title} vs {viralContent[1]?.title}
                    </div>
                  </div>
                )}
                <Button className="bg-red-500 hover:bg-red-600 mt-4">
                  Upload Video to Start Battle
                </Button>
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

        {viralContent && viralContent.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-500">Beta Feature</Badge>
              <span className="text-gray-400 text-sm">Viral content integration active</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaysBattlesSection;
