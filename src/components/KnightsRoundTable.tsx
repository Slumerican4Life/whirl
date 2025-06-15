
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Sword, Crown, Clock, Users } from 'lucide-react';
import { 
  getKnightAgents, 
  getTruthDebates, 
  getKnightArguments, 
  createKnightArgument,
  createTruthDebate,
  updateTruthMeter,
  type KnightAgent,
  type TruthDebate,
  type KnightArgument
} from '@/lib/knights-queries';
import { toast } from 'sonner';

interface KnightsRoundTableProps {
  truthVideoId?: string;
}

const KnightsRoundTable: React.FC<KnightsRoundTableProps> = ({ truthVideoId }) => {
  const [selectedDebate, setSelectedDebate] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const queryClient = useQueryClient();

  const { data: knights = [] } = useQuery({
    queryKey: ['knight-agents'],
    queryFn: getKnightAgents,
  });

  const { data: debates = [] } = useQuery({
    queryKey: ['truth-debates'],
    queryFn: getTruthDebates,
  });

  const { data: knightArgs = [] } = useQuery({
    queryKey: ['knight-arguments', selectedDebate],
    queryFn: () => selectedDebate ? getKnightArguments(selectedDebate) : Promise.resolve([]),
    enabled: !!selectedDebate,
  });

  const createDebateMutation = useMutation({
    mutationFn: (videoId: string) => createTruthDebate(videoId),
    onSuccess: (debate) => {
      setSelectedDebate(debate.id);
      queryClient.invalidateQueries({ queryKey: ['truth-debates'] });
      toast.success('Truth debate initiated!');
    },
    onError: (error) => {
      console.error('Error creating debate:', error);
      toast.error('Failed to create debate');
    },
  });

  const createArgumentMutation = useMutation({
    mutationFn: (params: {
      debateId: string;
      agentId: string;
      argumentText: string;
      position: 'true' | 'false' | 'uncertain';
      confidenceScore: number;
      evidenceSources?: any[];
      roundNumber?: number;
    }) => createKnightArgument(
      params.debateId,
      params.agentId,
      params.argumentText,
      params.position,
      params.confidenceScore,
      params.evidenceSources || [],
      params.roundNumber || 1
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knight-arguments', selectedDebate] });
      toast.success('Knight has spoken!');
    },
    onError: (error) => {
      console.error('Error creating argument:', error);
      toast.error('Failed to create argument');
    },
  });

  const handleKnightSpeak = async (knight: KnightAgent) => {
    if (!selectedDebate) return;

    const sampleArguments = [
      "The evidence presented shows clear inconsistencies with established facts.",
      "Historical precedent supports the validity of this claim.",
      "The source material requires further verification before conclusions can be drawn.",
      "Cross-referencing multiple databases reveals contradictory information.",
      "The testimony aligns with documented evidence from reliable sources."
    ];

    const positions: ('true' | 'false' | 'uncertain')[] = ['true', 'false', 'uncertain'];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    const randomArgument = sampleArguments[Math.floor(Math.random() * sampleArguments.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100% confidence

    createArgumentMutation.mutate({
      debateId: selectedDebate,
      agentId: knight.id,
      argumentText: randomArgument,
      position: randomPosition,
      confidenceScore: confidence,
      evidenceSources: [],
      roundNumber: currentRound
    });
  };

  const startNewDebate = () => {
    if (truthVideoId) {
      createDebateMutation.mutate(truthVideoId);
    } else {
      // Create a mock debate for demo
      createDebateMutation.mutate('demo-video-' + Date.now());
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'true': return 'bg-green-500';
      case 'false': return 'bg-red-500';
      case 'uncertain': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateTruthMeter = () => {
    if (knightArgs.length === 0) return 50;
    
    const trueCount = knightArgs.filter(arg => arg.position === 'true').length;
    const falseCount = knightArgs.filter(arg => arg.position === 'false').length;
    const total = knightArgs.length;
    
    return Math.round((trueCount / total) * 100);
  };

  useEffect(() => {
    if (selectedDebate && knightArgs.length > 0) {
      const newTruthScore = calculateTruthMeter();
      updateTruthMeter(selectedDebate, newTruthScore);
    }
  }, [knightArgs, selectedDebate]);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500">
            <Crown className="h-6 w-6" />
            Knights of the Round Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                <Shield className="h-4 w-4 mr-2" />
                {knights.length} Knights Ready
              </Badge>
              {selectedDebate && (
                <Badge variant="outline" className="border-blue-500 text-blue-500">
                  <Users className="h-4 w-4 mr-2" />
                  Round {currentRound}
                </Badge>
              )}
            </div>
            <Button onClick={startNewDebate} className="bg-yellow-600 hover:bg-yellow-700">
              <Sword className="h-4 w-4 mr-2" />
              Start Truth Debate
            </Button>
          </div>

          {selectedDebate && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-semibold">Truth Meter:</span>
                <span className="text-yellow-500">{calculateTruthMeter()}%</span>
              </div>
              <Progress value={calculateTruthMeter()} className="h-3" />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {knights.slice(0, 12).map((knight) => (
              <Card 
                key={knight.id} 
                className="bg-gray-700 border-gray-600 hover:border-yellow-500 transition-colors cursor-pointer"
                onClick={() => handleKnightSpeak(knight)}
              >
                <CardContent className="p-3 text-center">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-white text-sm font-semibold mb-1">{knight.name}</h4>
                  <p className="text-gray-400 text-xs">{knight.title}</p>
                  <Badge variant="outline" className="mt-2 text-xs border-yellow-500 text-yellow-500">
                    {knight.specialization}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDebate && (
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Debate Arguments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {knightArgs.map((argument) => (
                      <div key={argument.id} className="bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPositionColor(argument.position)}>
                            {argument.position.toUpperCase()}
                          </Badge>
                          <span className="text-white font-semibold">{argument.agent.name}</span>
                          <span className="text-gray-400 text-sm">
                            Confidence: {argument.confidence_score}%
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{argument.argument_text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnightsRoundTable;
