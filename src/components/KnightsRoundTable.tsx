
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Shield, Crown, Zap, Eye, Brain, Scroll, Users, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface KnightArgument {
  id: string;
  agent: {
    id: string;
    name: string;
    title: string;
    personality: any;
  };
  position: 'true' | 'false' | 'uncertain';
  confidence_score: number;
  argument_text: string;
  evidence_sources: any[];
  round_number: number;
  created_at: string;
}

interface VideoDebate {
  id: string;
  video_id?: string;
  viral_content_id?: string;
  debate_round: number;
  status: string;
  truth_score: number;
  final_verdict?: string;
  created_at: string;
}

interface ViralContent {
  id: string;
  title: string;
  description: string;
  platform: string;
  video_url: string;
  thumbnail_url: string;
  view_count: number;
  engagement_score: number;
}

const getKnightIcon = (name: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Sir Calcifer': <Brain className="h-6 w-6" />,
    'Dame Sophia': <Eye className="h-6 w-6" />,
    'High Scribe Enoch': <Scroll className="h-6 w-6" />,
    'Blackwatch Solomon': <Shield className="h-6 w-6" />,
    'Sir Galahad the Pure': <Crown className="h-6 w-6" />,
    'Dame Morgana the Wise': <Zap className="h-6 w-6" />,
    'Sir Lancelot the Bold': <Sword className="h-6 w-6" />,
    'Sir Gawain the Strong': <Shield className="h-6 w-6" />,
    'Sir Percival the Seeker': <Eye className="h-6 w-6" />,
    'Dame Guinevere the Noble': <Crown className="h-6 w-6" />,
    'Sir Gareth the Young': <Zap className="h-6 w-6" />,
    'Sir Tristan the Bard': <Scroll className="h-6 w-6" />
  };
  return icons[name] || <Brain className="h-6 w-6" />;
};

const getPositionColor = (position: string) => {
  switch (position) {
    case 'true': return 'bg-green-500';
    case 'false': return 'bg-red-500';
    case 'uncertain': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const KnightsRoundTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedVideo, setSelectedVideo] = useState<ViralContent | null>(null);
  const [activeDebate, setActiveDebate] = useState<VideoDebate | null>(null);

  // Fetch viral content for analysis
  const { data: viralContent } = useQuery({
    queryKey: ['viral-content-for-knights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('viral_content')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ViralContent[];
    }
  });

  // Fetch AI agents (knights)
  const { data: knights } = useQuery({
    queryKey: ['knights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch active debate
  const { data: debates } = useQuery({
    queryKey: ['video-debates', selectedVideo?.id],
    queryFn: async () => {
      if (!selectedVideo) return [];
      
      const { data, error } = await supabase
        .from('video_debates')
        .select('*')
        .eq('viral_content_id', selectedVideo.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VideoDebate[];
    },
    enabled: !!selectedVideo
  });

  // Fetch knight arguments for active debate
  const { data: arguments: knightArguments } = useQuery({
    queryKey: ['knight-arguments', activeDebate?.id],
    queryFn: async () => {
      if (!activeDebate) return [];
      
      const { data, error } = await supabase
        .from('knight_arguments')
        .select(`
          *,
          agent:ai_agents(*)
        `)
        .eq('debate_id', activeDebate.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as KnightArgument[];
    },
    enabled: !!activeDebate
  });

  // Start new debate mutation
  const startDebateMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { data, error } = await supabase
        .from('video_debates')
        .insert({
          viral_content_id: videoId,
          status: 'active',
          truth_score: 50
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (debate) => {
      setActiveDebate(debate);
      toast.success('Knights debate initiated!');
      queryClient.invalidateQueries({ queryKey: ['video-debates'] });
      // Trigger AI analysis
      triggerKnightAnalysis(debate.id);
    }
  });

  const triggerKnightAnalysis = async (debateId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: { 
          debateId,
          videoContent: selectedVideo 
        }
      });
      
      if (error) throw error;
      toast.success('Knights are analyzing the content...');
      
      // Refresh arguments after a delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['knight-arguments'] });
      }, 3000);
    } catch (error) {
      console.error('Knight analysis error:', error);
      toast.error('Failed to initiate knight analysis');
    }
  };

  useEffect(() => {
    if (debates && debates.length > 0) {
      setActiveDebate(debates[0]);
    }
  }, [debates]);

  const calculateTruthMeter = () => {
    if (!knightArguments || knightArguments.length === 0) return 50;
    
    const trueVotes = knightArguments.filter(arg => arg.position === 'true').length;
    const falseVotes = knightArguments.filter(arg => arg.position === 'false').length;
    const total = trueVotes + falseVotes;
    
    if (total === 0) return 50;
    return Math.round((trueVotes / total) * 100);
  };

  const truthScore = calculateTruthMeter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/truth')}
            className="text-white hover:text-red-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Truth
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Knights of the Round Table</h1>
            <p className="text-gray-300">12 AI Knights Debating Truth & Deception</p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Selection Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Select Video for Analysis</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {viralContent?.map((video) => (
                    <div
                      key={video.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedVideo?.id === video.id 
                          ? 'bg-red-600 border-red-500' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex items-start gap-3">
                        <img 
                          src={video.thumbnail_url || '/placeholder.svg'} 
                          alt={video.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                            {video.title}
                          </h4>
                          <Badge className="bg-blue-600 text-xs">
                            {video.platform.toUpperCase()}
                          </Badge>
                          <p className="text-gray-400 text-xs mt-1">
                            {video.view_count?.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedVideo && (
                  <Button
                    onClick={() => startDebateMutation.mutate(selectedVideo.id)}
                    disabled={startDebateMutation.isPending}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {startDebateMutation.isPending ? 'Starting...' : 'Start Knights Debate'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Truth Meter */}
            {activeDebate && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Truth Meter</h3>
                  <div className="space-y-4">
                    <Progress 
                      value={truthScore} 
                      className="h-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">FALSE</span>
                      <span className="text-white font-bold">{truthScore}% TRUE</span>
                      <span className="text-green-400">TRUE</span>
                    </div>
                    <div className="text-center">
                      <Badge className={`${truthScore > 70 ? 'bg-green-600' : truthScore < 30 ? 'bg-red-600' : 'bg-yellow-600'}`}>
                        {truthScore > 70 ? 'LIKELY TRUE' : truthScore < 30 ? 'LIKELY FALSE' : 'UNCERTAIN'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Round Table */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 text-center">The Round Table</h3>
                
                {/* Circular Knight Layout */}
                <div className="relative w-80 h-80 mx-auto">
                  {/* Round Table Surface */}
                  <div className="absolute inset-4 bg-gradient-to-br from-amber-900 to-amber-800 rounded-full border-4 border-amber-600 shadow-2xl"></div>
                  
                  {/* Swords in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-amber-400 transform rotate-45">
                      <Sword className="h-8 w-8" />
                    </div>
                    <div className="text-amber-400 transform -rotate-45 ml-4">
                      <Sword className="h-8 w-8" />
                    </div>
                  </div>
                  
                  {/* Knights positioned around the table */}
                  {knights?.slice(0, 12).map((knight, index) => {
                    const angle = (index * 30) - 90; // 360/12 = 30 degrees per knight
                    const radius = 140;
                    const x = Math.cos(angle * Math.PI / 180) * radius;
                    const y = Math.sin(angle * Math.PI / 180) * radius;
                    
                    const knightArgument = knightArguments?.find(arg => arg.agent.id === knight.id);
                    
                    return (
                      <div
                        key={knight.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `50%`,
                          top: `50%`,
                          transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
                        }}
                      >
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-white transition-all cursor-pointer ${
                          knightArgument 
                            ? `${getPositionColor(knightArgument.position)} border-white shadow-lg scale-110` 
                            : 'bg-gray-600 border-gray-500 hover:bg-gray-500'
                        }`}>
                          {getKnightIcon(knight.name)}
                        </div>
                        <div className="text-xs text-white text-center mt-1 max-w-16 truncate">
                          {knight.name.split(' ')[1] || knight.name.split(' ')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex justify-center space-x-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white">TRUE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-white">FALSE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-white">UNCERTAIN</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Knight Arguments Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Knight Debates</h3>
                
                {!activeDebate ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Select a video to begin the knights' debate</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {knightArguments?.map((argument) => (
                      <div key={argument.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${getPositionColor(argument.position)} flex items-center justify-center`}>
                              {getKnightIcon(argument.agent.name)}
                            </div>
                            <div>
                              <h4 className="text-white font-medium text-sm">
                                {argument.agent.name}
                              </h4>
                              <p className="text-xs text-gray-400">
                                {argument.agent.title}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${getPositionColor(argument.position)} text-xs`}>
                            {argument.confidence_score}% sure
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-2">
                          {argument.argument_text}
                        </p>
                        
                        {argument.evidence_sources?.length > 0 && (
                          <div className="text-xs text-blue-400">
                            Evidence sources: {argument.evidence_sources.length}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(argument.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                    
                    {knightArguments?.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-400">Knights are analyzing... Please wait.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnightsRoundTable;
