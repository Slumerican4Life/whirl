
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message, HelpArticle } from './types';
import { generateResponse } from './responseUtils';

export const useLyraAssistant = () => {
  const { user } = useAuth();
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

  const saveSession = async () => {
    if (!messages.length || messages.length <= 1) return;

    try {
      const sessionData = {
        user_id: user?.id || null,
        messages: JSON.stringify(messages),
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
      const response = generateResponse(userMessage.content, helpArticles);
      
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

  return {
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
  };
};
