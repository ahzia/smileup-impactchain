'use client';

import { useEffect, useState } from 'react';
import { X, Bot, Send, Sparkles, MessageCircle, Zap, Brain } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FeedPost } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  post?: FeedPost;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIChat({ isOpen, onClose, post }: AIChatProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Get or create session ID
    let id = sessionStorage.getItem('df-messenger-sessionID');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('df-messenger-sessionID', id);
    }
    setSessionId(id);
  }, []);

  // Clear messages and reset welcome flag when chat opens
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setHasShownWelcome(false);
      setInputValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && post && sessionId && !hasShownWelcome) {
      // Send context to DialogFlow
      const projectContext = {
        agent: "smileUp",
        userName: "User",
        projectName: post.title,
        projectDescription: post.description,
        communityName: post.community.name,
        challenge: post.challenge || '',
        callToAction: post.callToAction || [],
        links: post.links || []
      };

      const contextMessage = `target project change: ${JSON.stringify(projectContext)}`;

      fetch(
        `https://dialogflow.cloud.google.com/v1/cx/integrations/messenger/webhook/projects/hey-buddy-425118/agents/565449f1-c5bd-40c2-8457-295ce6ae892d/sessions/${sessionId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            queryInput: {
              text: { text: contextMessage },
              languageCode: 'en',
            },
            queryParams: { channel: 'DF_MESSENGER' },
          }),
        }
      ).then(response => {
        console.log('Success sending context to DialogFlow');
        // Add welcome message only once
        addAIMessage("Hello! I'm your SmileUp AI assistant. I can help you learn more about this project, answer questions, and guide you on how to get involved. What would you like to know?");
        setHasShownWelcome(true);
      }).catch(error => {
        console.error('Error sending context to DialogFlow:', error);
        addAIMessage("Hello! I'm your SmileUp AI assistant. How can I help you today?");
        setHasShownWelcome(true);
      });
    }
  }, [isOpen, post, sessionId, hasShownWelcome]);

  const addAIMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addUserMessage(userMessage);
    setIsLoading(true);

    // Simulate AI response (replace with actual DialogFlow integration)
    setTimeout(() => {
      const responses = [
        "That's a great question! This project focuses on creating positive social impact through community engagement.",
        "I'd be happy to help you get involved! You can start by joining the community and participating in their activities.",
        "This is an amazing initiative! The project aims to bring people together for meaningful change.",
        "Great question! The community is always looking for passionate individuals like you to contribute.",
        "I can see you're interested in making a difference! This project offers various ways to get involved."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addAIMessage(randomResponse);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent className="sm:max-w-[500px] h-[600px] p-0 overflow-hidden ai-chat-container border-0 shadow-2xl">
        {/* Header */}
                 <DialogHeader className="p-3 pb-2 ai-chat-header-glow border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              </motion.div>
              <div>
                <DialogTitle className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  SmileUp AI Assistant
                </DialogTitle>
                <p className="text-xs text-muted-foreground">Powered by AI • Always here to help</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-background/95 to-muted/20 relative">
          {/* Floating Particles */}
          <div className="ai-particles">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="ai-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${6 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground user-message-bubble'
                      : 'bg-gradient-to-r from-card/90 to-card/80 border border-border/50 backdrop-blur-sm ai-message-bubble'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot className="w-4 h-4 text-primary mt-0.5" />
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-r from-card/90 to-card/80 border border-border/50 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

                 {/* Input Area */}
         <div className="p-2 border-t border-border/50 bg-gradient-to-r from-background/95 to-muted/20">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative ai-chat-input-glow">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about this project..."
                className="pr-12 bg-background/90 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-200"
                disabled={isLoading}
              />
              <motion.div
                animate={{ scale: inputValue.trim() ? 1 : 0.8 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
          
                     {/* Quick Actions */}
           <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>Smart Responses</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>{messages.length} messages</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 