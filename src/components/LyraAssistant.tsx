
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  category: string;
  page_context: string[];
}

const LyraAssistant: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Lyra, your personal assistant. I'm here to help you navigate the platform, understand how battles work, learn about tokens, and troubleshoot any issues. What can I help you with today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadHelpArticles();
  }, []);

  const loadHelpArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*');

      if (error) throw error;
      setHelpArticles(data || []);
    } catch (error) {
      console.error('Error loading help articles:', error);
    }
  };

  const findRelevantArticles = (query: string, currentPath: string): HelpArticle[] => {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);

    return helpArticles
      .filter(article => {
        // Check if article is relevant to current page
        const isPageRelevant = article.page_context.includes('*') || 
                              article.page_context.includes(currentPath) ||
                              article.page_context.includes('/');

        // Check if query matches keywords or content
        const matchesKeywords = article.keywords.some(keyword => 
          queryWords.some(word => keyword.toLowerCase().includes(word))
        );
        
        const matchesContent = queryWords.some(word => 
          article.title.toLowerCase().includes(word) ||
          article.content.toLowerCase().includes(word)
        );

        return isPageRelevant && (matchesKeywords || matchesContent);
      })
      .sort((a, b) => {
        // Prioritize exact keyword matches
        const aExactMatch = a.keywords.some(keyword => 
          queryWords.some(word => keyword.toLowerCase() === word)
        );
        const bExactMatch = b.keywords.some(keyword => 
          queryWords.some(word => keyword.toLowerCase() === word)
        );
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      });
  };

  const generateResponse = (query: string): string => {
    const currentPath = window.location.pathname;
    const relevantArticles = findRelevantArticles(query, currentPath);

    if (relevantArticles.length === 0) {
      return "I couldn't find specific information about that. Here are some things I can help you with:\n\n• How to upload videos\n• Understanding tokens and voting\n• Battle mechanics\n• Leaderboard system\n• Account management\n• Technical troubleshooting\n\nTry asking about any of these topics!";
    }

    if (relevantArticles.length === 1) {
      return relevantArticles[0].content;
    }

    // Multiple relevant articles
    let response = "Here's what I found:\n\n";
    relevantArticles.slice(0, 3).forEach((article, index) => {
      response += `**${article.title}**\n${article.content}\n\n`;
    });

    if (relevantArticles.length > 3) {
      response += "I found more related information. Feel free to ask more specific questions!";
    }

    return response;
  };

  const saveSession = async () => {
    if (!messages.length || messages.length <= 1) return;

    try {
      const sessionData = {
        user_id: user?.id || null,
        messages: messages,
        page_url: window.location.href
      };

      const { error } = await supabase
        .from('help_sessions')
        .insert(sessionData);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    saveSession();
    setIsOpen(false);
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.startsWith('**') && line.endsWith('**') ? (
          <strong className="text-purple-300">{line.slice(2, -2)}</strong>
        ) : line.startsWith('• ') ? (
          <span className="text-cyan-300">{line}</span>
        ) : (
          line
        )}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

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
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white">Lyra Assistant</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  {formatMessageContent(message.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LyraAssistant;
