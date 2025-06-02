
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Brain, Scroll, Shield } from 'lucide-react';
import { getAIAgents } from '@/lib/viral-content-queries';
import { useNavigate } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';

const getAgentIcon = (name: string) => {
  switch (name) {
    case 'Sir Calcifer': return <Brain className="h-6 w-6" />;
    case 'Dame Sophia': return <Eye className="h-6 w-6" />;
    case 'High Scribe Enoch': return <Scroll className="h-6 w-6" />;
    case 'Blackwatch Solomon': return <Shield className="h-6 w-6" />;
    default: return <Brain className="h-6 w-6" />;
  }
};

const getAgentColor = (name: string) => {
  switch (name) {
    case 'Sir Calcifer': return 'from-blue-500 to-purple-600';
    case 'Dame Sophia': return 'from-green-500 to-emerald-600';
    case 'High Scribe Enoch': return 'from-amber-500 to-orange-600';
    case 'Blackwatch Solomon': return 'from-gray-700 to-black';
    default: return 'from-red-500 to-red-600';
  }
};

// Fallback agents in case the API fails
const fallbackAgents = [
  {
    id: 'fallback-1',
    name: 'Sir Calcifer',
    title: 'Logic Knight',
    description: 'Master of deductive reasoning and logical analysis',
    specialization: 'Logic, Mathematics, Science',
    personality: { catchphrase: 'Logic prevails over all illusions' }
  },
  {
    id: 'fallback-2',
    name: 'Dame Sophia',
    title: 'Vision Keeper',
    description: 'Expert in pattern recognition and hidden connections',
    specialization: 'Pattern Analysis, Investigation',
    personality: { catchphrase: 'Truth hides in plain sight' }
  },
  {
    id: 'fallback-3',
    name: 'High Scribe Enoch',
    title: 'Archive Guardian',
    description: 'Keeper of ancient knowledge and historical truths',
    specialization: 'History, Documentation, Research',
    personality: { catchphrase: 'The past illuminates the present' }
  },
  {
    id: 'fallback-4',
    name: 'Blackwatch Solomon',
    title: 'Shadow Analyst',
    description: 'Specialist in covert operations and hidden agendas',
    specialization: 'Intelligence, Security, Counter-Intelligence',
    personality: { catchphrase: 'In darkness, truth emerges' }
  }
];

const TruthSectionPreview = () => {
  const navigate = useNavigate();
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: getAIAgents,
    retry: 1,
    retryDelay: 1000,
  });

  // Use fallback agents if loading or error occurs
  const displayAgents = agents && agents.length > 0 ? agents : fallbackAgents;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            The Awakening
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Four AI Knights of Truth stand ready to analyze reality
          </p>
          <Badge className="bg-red-500 text-white px-4 py-2">
            Coming Soon: Full AI Knights Council
          </Badge>
        </div>

        {isLoading ? (
          <LoadingFallback 
            title="Awakening the AI Knights"
            description="Preparing the truth analysis council..."
            showRetry={false}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {displayAgents.map((agent) => {
                const personality = agent.personality as any;
                return (
                  <Card key={agent.id} className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-red-500 transition-all duration-300">
                    <CardHeader className={`bg-gradient-to-r ${getAgentColor(agent.name)} text-white p-4`}>
                      <div className="flex items-center gap-3">
                        {getAgentIcon(agent.name)}
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <p className="text-sm opacity-90">{agent.title}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {agent.description}
                      </p>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {agent.specialization.split(',')[0]}
                        </Badge>
                        {personality?.catchphrase && (
                          <p className="text-xs italic text-gray-400">
                            "{personality.catchphrase}"
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate('/truth')}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
              >
                Enter The Awakening
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TruthSectionPreview;
