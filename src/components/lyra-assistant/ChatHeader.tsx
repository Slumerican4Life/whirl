
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-purple-400" />
        <span className="font-semibold text-white">Lyra Assistant</span>
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
