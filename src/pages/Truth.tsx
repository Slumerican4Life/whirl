
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Eye, Scroll, Shield, ArrowLeft } from 'lucide-react';
import { getAIAgents } from '@/lib/viral-content-queries';
import { useNavigate } from 'react-router-dom';

const getAgentIcon = (name: string) => {
  switch (name) {
    case 'Sir Calcifer': return <Brain className="h-8 w-8" />;
    case 'Dame Sophia': return <Eye className="h-8 w-8" />;
    case 'High Scribe Enoch': return <Scroll className="h-8 w-8" />;
    case 'Blackwatch Solomon': return <Shield className="h-8 w-8" />;
    default: return <Brain className="h-8 w-8" />;
  }
};

const getAgentGradient = (name: string) => {
  switch (name) {
    case 'Sir Calcifer': return 'from-blue-500 via-purple-600 to-indigo-700';
    case 'Dame Sophia': return 'from-green-500 via-emerald-600 to-teal-700';
    case 'High Scribe Enoch': return 'from-amber-500 via-orange-600 to-red-700';
    case 'Blackwatch Solomon': return 'from-gray-600 via-gray-800 to-black';
    default: return 'from-red-500 to-red-600';
  }
};

const Truth = () => {
  const navigate = useNavigate();
  const { data: agents, isLoading } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: getAIAgents,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading The Awakening...</div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-white mb-2">The Awakening</h1>
            <p className="text-gray-300">Four AI Knights of Truth analyzing reality</p>
          </div>
        </div>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {agents?.map((agent) => {
            const personality = agent.personality as any;
            return (
              <Card key={agent.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${getAgentGradient(agent.name)} text-white p-6`}>
                  <div className="flex items-center gap-4">
                    {getAgentIcon(agent.name)}
                    <div>
                      <CardTitle className="text-2xl">{agent.name}</CardTitle>
                      <p className="text-lg opacity-90">{agent.title}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                    {agent.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Specialization:</h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialization.split(',').map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {spec.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {personality?.catchphrase && (
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-lg italic text-gray-400 text-center">
                          "{personality.catchphrase}"
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-xl text-gray-300 mb-6">
            Full AI Knights Council with 12 specialized agents
          </p>
          <p className="text-gray-400 mb-8">
            Video fact-checking, truth scoring, agent debates, and community discussions
          </p>
          <Badge className="bg-red-500 text-white px-6 py-3 text-lg">
            Phase 4 Feature
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Truth;
