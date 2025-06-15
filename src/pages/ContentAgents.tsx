
import React from 'react';
import NavBar from '@/components/NavBar';
import ContentAgentPanel from '@/components/ContentAgentPanel';
import { Bot } from 'lucide-react';

const ContentAgents = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 bg-gradient-to-b from-gray-900 to-black">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-10 w-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">AI Content Agents</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Autonomous AI agents that populate your app with fresh content across all sections
          </p>
        </div>
        
        <ContentAgentPanel />
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">How AI Agents Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-whirl-slumerican-gold">Slumerican Agent</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Searches for latest Yelawolf releases</li>
                <li>• Finds Slumerican label content</li>
                <li>• Pulls concert tour information</li>
                <li>• Discovers street culture content</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-500">Battle Agent</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Generates diverse battle content</li>
                <li>• Creates comedy, music, sports content</li>
                <li>• Populates voting competitions</li>
                <li>• Ensures active battle participation</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-amber-500">Truth Agent</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Finds controversial content</li>
                <li>• Identifies claims needing fact-checks</li>
                <li>• Feeds AI Knights for analysis</li>
                <li>• Illuminates truth through debate</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentAgents;
