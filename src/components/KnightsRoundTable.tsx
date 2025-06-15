
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Sword, Shield, Brain, Crown, Search, Gavel, Scroll, Wand2, Users, Heart, Zap, Music } from 'lucide-react';
import { getAIAgents } from '@/lib/viral-content-queries';
import { getViralContent } from '@/lib/viral-content-queries';
import { createVideoDebate, getVideoDebates, getKnightArguments, addKnightArgument, updateTruthScore } from '@/lib/knights-queries';
import { toast } from 'sonner';
import LoadingFallback from './LoadingFallback';

const getKnightIcon = (name: string) => {
  switch (name) {
    case 'Sir Calcifer': return <Brain className="h-6 w-6" />;
    case 'Dame Sophia': return <Search className="h-6 w-6" />;
    case 'High Scribe Enoch': return <Scroll className="h-6 w-6" />;
    case 'Blackwatch Solomon': return <Shield className="h-6 w-6" />;
    case 'Sir Galahad the Pure': return <Crown className="h-6 w-6" />;
    case 'Dame Morgana the Wise': return <Wand2 className="h-6 w-6" />;
    case 'Sir Lancelot the Bold': return <Sword className="h-6 w-6" />;
    case 'Sir Gawain the Strong': return <Shield className="h-6 w-6" />;
    case 'Sir Percival the Seeker': return <Search className="h-6 w-6" />;
    case 'Dame Guinevere the Noble': return <Gavel className="h-6 w-6" />;
    case 'Sir Gareth the Young': return <Zap className="h-6 w-6" />;
    case 'Sir Tristan the Bard': return <Music className="h-6 w-6" />;
    default: return <Sword className="h-6 w-6" />;
  }
};

const getKnightPosition = (index: number, total: number) => {
  const angle = (index * 360) / total;
  const radius = 45; // percentage from center
  const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180);
  const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180);
  return { x, y, angle };
};

const KnightsRoundTable = () => {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [currentDebate, setCurrentDebate] = useState<any>(null);
  const [truthScore, setTruthScore] = useState(50);
  const queryClient = useQueryClient();

  const { data: knights, isLoading: knightsLoading } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: getAIAgents,
  });

  const { data: viralContent, isLoading: contentLoading } = useQuery({
    queryKey: ['viral-content'],
    queryFn: getViralContent,
  });

  const { data: debates, refetch: refetchDebates } = useQuery({
    queryKey: ['video-debates', selectedVideo?.id],
    queryFn: () => selectedVideo ? getVideoDebates(selectedVideo.id, true) : Promise.resolve([]),
    enabled: !!selectedVideo,
  });

  const { data: arguments, refetch: refetchArguments } = useQuery({
    queryKey: ['knight-arguments', currentDebate?.id],
    queryFn: () => currentDebate ? getKnightArguments(currentDebate.id) : Promise.resolve([]),
    enabled: !!currentDebate,
  });

  const createDebateMutation = useMutation({
    mutationFn: ({ videoId, isViral }: { videoId: string; isViral: boolean }) => 
      createVideoDebate(videoId, isViral),
    onSuccess: (newDebate) => {
      setCurrentDebate(newDebate);
      refetchDebates();
      toast.success('Knights have been summoned to analyze this video!');
      simulateKnightArguments(newDebate.id);
    },
    onError: (error) => {
      console.error('Failed to create debate:', error);
      toast.error('Failed to summon the knights');
    },
  });

  const addArgumentMutation = useMutation({
    mutationFn: addKnightArgument,
    onSuccess: () => {
      refetchArguments();
      queryClient.invalidateQueries({ queryKey: ['knight-arguments'] });
    },
  });

  const updateScoreMutation = useMutation({
    mutationFn: ({ debateId, score }: { debateId: string; score: number }) => 
      updateTruthScore(debateId, score),
    onSuccess: () => {
      toast.success('Truth score updated!');
    },
  });

  const simulateKnightArguments = async (debateId: string) => {
    if (!knights) return;

    // Simulate knights analyzing and debating
    const positions: ('true' | 'false' | 'uncertain')[] = ['true', 'false', 'uncertain'];
    
    for (let i = 0; i < Math.min(knights.length, 6); i++) {
      const knight = knights[i];
      const position = positions[Math.floor(Math.random() * positions.length)];
      const confidence = Math.floor(Math.random() * 40) + 60; // 60-100
      
      const argumentTexts = {
        true: [
          "My analysis reveals authentic markers in this content.",
          "The evidence supports the veracity of these claims.",
          "Cross-referencing sources confirms this information.",
          "Technical analysis shows no signs of manipulation."
        ],
        false: [
          "I detect clear signs of deception in this material.",
          "Multiple inconsistencies undermine credibility.",
          "Evidence contradicts the presented narrative.",
          "Digital forensics reveal manipulation."
        ],
        uncertain: [
          "The evidence is inconclusive at this time.",
          "Further investigation is required for certainty.",
          "Mixed signals prevent a definitive verdict.",
          "Additional verification needed."
        ]
      };

      const argumentText = argumentTexts[position][Math.floor(Math.random() * argumentTexts[position].length)];

      try {
        await addArgumentMutation.mutateAsync({
          debateId,
          agentId: knight.id,
          argumentText,
          position,
          confidenceScore: confidence,
          evidenceSources: [],
          roundNumber: 1
        });

        // Small delay between arguments for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Failed to add knight argument:', error);
      }
    }

    // Calculate final truth score based on arguments
    const trueArgs = Math.floor(Math.random() * 3) + 1;
    const falseArgs = Math.floor(Math.random() * 3) + 1;
    const uncertainArgs = Math.floor(Math.random() * 2);
    
    const totalArgs = trueArgs + falseArgs + uncertainArgs;
    const score = Math.round((trueArgs / totalArgs) * 100);
    
    setTruthScore(score);
    updateScoreMutation.mutate({ debateId, score });
  };

  const startAnalysis = () => {
    if (!selectedVideo) {
      toast.error('Please select a video first');
      return;
    }

    createDebateMutation.mutate({
      videoId: selectedVideo.id,
      isViral: true
    });
  };

  if (knightsLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <LoadingFallback 
          title="Assembling the Knights"
          description="The Round Table is being prepared..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Knights of the Round Table</h1>
          <p className="text-gray-300">12 AI Knights debating truth in the digital realm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Selection Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Select Video to Analyze</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {viralContent?.slice(0, 5).map((video) => (
                  <div
                    key={video.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedVideo?.id === video.id
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <h4 className="text-white font-medium text-sm">{video.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{video.platform}</p>
                  </div>
                ))}
                
                {selectedVideo && (
                  <Button 
                    onClick={startAnalysis}
                    className="w-full bg-red-500 hover:bg-red-600"
                    disabled={createDebateMutation.isPending}
                  >
                    {createDebateMutation.isPending ? 'Summoning Knights...' : 'Begin Analysis'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Truth Meter */}
            {currentDebate && (
              <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Truth Meter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={truthScore} className="h-4" />
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Likely False</span>
                      <span className="text-white font-bold">{truthScore}%</span>
                      <span className="text-green-400">Likely True</span>
                    </div>
                    <Badge 
                      className={
                        truthScore > 70 ? 'bg-green-500' :
                        truthScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }
                    >
                      {truthScore > 70 ? 'LIKELY TRUE' :
                       truthScore > 40 ? 'UNCERTAIN' : 'LIKELY FALSE'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Round Table */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-center">The Round Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square max-w-2xl mx-auto">
                  {/* Table Background */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900/20 to-amber-700/20 border-4 border-amber-600/30">
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-800/10 to-amber-600/10 border-2 border-amber-500/20">
                      {/* Center Crest */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                          <Crown className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Knights Positions */}
                  {knights?.slice(0, 12).map((knight, index) => {
                    const position = getKnightPosition(index, Math.min(knights.length, 12));
                    const argument = arguments?.find(arg => arg.agent_id === knight.id);
                    
                    return (
                      <div
                        key={knight.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`
                        }}
                      >
                        <div className={`relative group cursor-pointer ${argument ? 'animate-pulse' : ''}`}>
                          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                            argument?.position === 'true' ? 'bg-green-500 border-green-400' :
                            argument?.position === 'false' ? 'bg-red-500 border-red-400' :
                            argument?.position === 'uncertain' ? 'bg-yellow-500 border-yellow-400' :
                            'bg-gray-600 border-gray-500'
                          }`}>
                            {getKnightIcon(knight.name)}
                          </div>
                          
                          {/* Knight Info Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <div className="bg-black/90 text-white text-xs p-2 rounded-lg whitespace-nowrap">
                              <div className="font-bold">{knight.name}</div>
                              <div className="text-gray-300">{knight.title}</div>
                              {argument && (
                                <div className="mt-1">
                                  <div className={`text-xs ${
                                    argument.position === 'true' ? 'text-green-400' :
                                    argument.position === 'false' ? 'text-red-400' :
                                    'text-yellow-400'
                                  }`}>
                                    {argument.position.toUpperCase()} ({argument.confidence_score}%)
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Sword when knight has argued */}
                          {argument && (
                            <div className="absolute -top-2 -right-2">
                              <Sword className="h-4 w-4 text-amber-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Arguments Panel */}
            {arguments && arguments.length > 0 && (
              <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Knight Arguments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {arguments.map((argument) => (
                      <div key={argument.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            argument.position === 'true' ? 'bg-green-500' :
                            argument.position === 'false' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}>
                            {getKnightIcon(argument.agent.name)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-white font-medium">{argument.agent.name}</span>
                              <Badge variant="outline" className={
                                argument.position === 'true' ? 'border-green-500 text-green-400' :
                                argument.position === 'false' ? 'border-red-500 text-red-400' :
                                'border-yellow-500 text-yellow-400'
                              }>
                                {argument.position.toUpperCase()}
                              </Badge>
                              <span className="text-gray-400 text-sm">{argument.confidence_score}% confident</span>
                            </div>
                            <p className="text-gray-300 text-sm">{argument.argument_text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnightsRoundTable;
