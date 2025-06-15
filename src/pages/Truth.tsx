import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import KnightsRoundTable from "@/components/KnightsRoundTable";
import { useQuery } from '@tanstack/react-query';
import { getTruthDebates } from "@/lib/knights-queries";
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Truth = () => {
  const navigate = useNavigate();
  const { data: debates = [] } = useQuery({
    queryKey: ['truth-debates'],
    queryFn: getTruthDebates,
  });

  // Grab the newest debate
  const activeDebate = debates.find((deb) => deb.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:text-red-500 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">The Illuminating Truth Council</h1>
            <p className="text-gray-300">Twelve AI Knights debating reality over the latest viral claims</p>
          </div>
        </div>
        {/* Knights Debate Table */}
        <div className="mb-10">
          <KnightsRoundTable truthVideoId={activeDebate?.truth_video_id} />
        </div>
        {/* If no debate exists yet, prompt to start */}
        {!activeDebate && (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Not enough truth? Start a new Council Debate</h2>
            <p className="text-gray-400 mb-4">AI will pull a claim-heavy video or content for analysis.</p>
            <Badge className="bg-red-500 text-white px-6 py-3 text-lg">Tap "Start Truth Debate" below</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default Truth;
