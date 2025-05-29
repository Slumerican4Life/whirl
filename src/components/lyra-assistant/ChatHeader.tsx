
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, X, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Brain className="w-5 h-5 text-purple-400" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
        <div>
          <span className="font-semibold text-white">Lyra AI Assistant</span>
          <div className="text-xs text-gray-400">Powered by OpenAI</div>
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
