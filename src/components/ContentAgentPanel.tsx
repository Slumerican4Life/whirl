
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Crown, Swords, Shield, Play } from 'lucide-react';
import { triggerContentAgents, triggerSlumericanAgent, triggerBattleAgent, triggerTruthAgent } from '@/lib/content-agents';

const ContentAgentPanel = () => {
  const handleTriggerAll = async () => {
    await triggerContentAgents();
  };

  const handleTriggerSlumerican = async () => {
    await triggerSlumericanAgent();
  };

  const handleTriggerBattle = async () => {
    await triggerBattleAgent();
  };

  const handleTriggerTruth = async () => {
    await triggerTruthAgent();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="h-6 w-6 text-blue-500" />
            AI Content Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Trigger All Button */}
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">All Agents</h3>
                <Badge className="mb-3 bg-blue-500">Master Control</Badge>
                <Button 
                  onClick={handleTriggerAll}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Activate All
                </Button>
              </CardContent>
            </Card>

            {/* Slumerican Agent */}
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-gradient-to-r from-whirl-slumerican-red to-whirl-slumerican-gold p-3 rounded-full">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Slumerican Agent</h3>
                <Badge className="mb-3 bg-whirl-slumerican-red">Street Culture</Badge>
                <p className="text-gray-300 text-sm mb-3">Fetches Yelawolf content, tour dates, and street culture</p>
                <Button 
                  onClick={handleTriggerSlumerican}
                  className="w-full bg-gradient-to-r from-whirl-slumerican-red to-whirl-slumerican-gold hover:from-whirl-slumerican-gold hover:to-whirl-slumerican-red"
                >
                  Fetch Slumerican
                </Button>
              </CardContent>
            </Card>

            {/* Battle Agent */}
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-full">
                    <Swords className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Battle Agent</h3>
                <Badge className="mb-3 bg-red-500">Combat Ready</Badge>
                <p className="text-gray-300 text-sm mb-3">Generates content for video battles and voting</p>
                <Button 
                  onClick={handleTriggerBattle}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                >
                  Generate Battles
                </Button>
              </CardContent>
            </Card>

            {/* Truth Agent */}
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Truth Agent</h3>
                <Badge className="mb-3 bg-amber-500">Fact Seeker</Badge>
                <p className="text-gray-300 text-sm mb-3">Finds content for AI Knights truth analysis</p>
                <Button 
                  onClick={handleTriggerTruth}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                >
                  Seek Truth
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Agent Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Slumerican: Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Battle: Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Truth: Ready</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAgentPanel;
