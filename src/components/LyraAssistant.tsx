
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLyraAssistant } from './lyra-assistant/useLyraAssistant';
import ChatHeader from './lyra-assistant/ChatHeader';
import ChatInterface from './lyra-assistant/ChatInterface';

const LyraAssistant: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    inputValue,
    setInputValue,
    isLoading,
    messagesEndRef,
    handleSendMessage,
    handleKeyPress,
    handleClose
  } = useLyraAssistant();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>
      ) : (
        <div className="w-80 h-96 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl flex flex-col">
          <ChatHeader onClose={handleClose} />
          <ChatInterface
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
        </div>
      )}
    </div>
  );
};

export default LyraAssistant;
