'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send } from 'lucide-react';
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
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

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
      setInputMessage('');
      setIsInitializing(true);
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
        communityName: post.community?.name || 'SmileUp',
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
        setIsInitializing(false);
      }).catch(error => {
        console.error('Error sending context to DialogFlow:', error);
        addAIMessage("Hello! I'm your SmileUp AI assistant. How can I help you today?");
        setHasShownWelcome(true);
        setIsInitializing(false);
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
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
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
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] max-h-[90vh] min-h-[400px] h-auto p-0 overflow-hidden ai-chat-container border-0 shadow-2xl mb-20 sm:mb-0 lg:shadow-3xl">
        {/* Desktop-only decorative elements */}
        <div className="hidden lg:block absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="hidden lg:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full"></div>
        <div className="hidden lg:block absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 via-transparent to-transparent rounded-tr-full"></div>
        
        {/* Header */}
        <DialogHeader className="p-3 pb-2 ai-chat-header-glow border-b border-border/50 flex-shrink-0 lg:p-6 lg:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative lg:group-hover:scale-110 transition-transform duration-300"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg lg:shadow-xl lg:group-hover:shadow-2xl transition-all duration-300">
                  <Bot className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-primary-foreground" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full lg:group-hover:bg-green-400 transition-colors duration-300"
                />
              </motion.div>
              <div className="lg:group-hover:scale-105 transition-transform duration-300">
                <DialogTitle className="text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent lg:group-hover:from-primary/90 lg:group-hover:to-primary transition-all duration-300">
                  SmileUp AI Assistant
                </DialogTitle>
                <p className="text-xs lg:text-sm text-muted-foreground lg:group-hover:text-muted-foreground/80 transition-colors duration-300">Powered by AI • Always here to help</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-4 bg-gradient-to-b from-background/95 to-muted/20 relative min-h-0 max-h-[60vh]">
          {/* Desktop-only floating particles */}
          <div className="hidden lg:block ai-particles">
            {[...Array(8)].map((_, i) => (
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

          {/* Initial Loading State */}
          <AnimatePresence>
            {isInitializing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-r from-card/90 to-card/80 border border-border/50 rounded-2xl px-4 py-3 lg:px-6 lg:py-4 shadow-lg backdrop-blur-sm lg:group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-primary-foreground" />
                      </div>
                    </motion.div>
                    <div className="flex flex-col space-y-2 lg:space-y-3">
                      <div className="flex space-x-1 lg:space-x-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full"
                        />
                      </div>
                      <span className="text-xs lg:text-sm text-muted-foreground">Initializing AI assistant...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} lg:group-hover:scale-[1.02] transition-transform duration-300`}
              >
                <div
                  className={`max-w-[80%] lg:max-w-[85%] rounded-2xl px-4 py-3 lg:px-6 lg:py-4 shadow-lg lg:shadow-xl lg:group-hover:shadow-2xl transition-all duration-300 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground user-message-bubble lg:group-hover:from-primary/95 lg:group-hover:to-primary/85'
                      : 'bg-gradient-to-r from-card/90 to-card/80 border border-border/50 backdrop-blur-sm ai-message-bubble lg:group-hover:from-card/95 lg:group-hover:to-card/85 lg:group-hover:border-border/70'
                  }`}
                >
                  <div className="flex items-start space-x-2 lg:space-x-3">
                    {message.type === 'ai' && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="lg:group-hover:scale-110 transition-transform duration-300"
                      >
                        <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-primary mt-0.5" />
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm lg:text-base leading-relaxed">{message.content}</p>
                      <p className={`text-xs lg:text-sm mt-2 lg:mt-3 ${
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
                <div className="bg-gradient-to-r from-card/90 to-card/80 border border-border/50 rounded-2xl px-4 py-3 lg:px-6 lg:py-4 shadow-lg backdrop-blur-sm lg:group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-primary lg:group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex space-x-1 lg:space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-3 lg:p-6 border-t border-border/50 flex-shrink-0 bg-gradient-to-t from-background/95 to-background/80 backdrop-blur-sm">
          <div className="flex items-end space-x-3 lg:space-x-4">
            <div className="flex-1 relative">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="min-h-[60px] lg:min-h-[80px] max-h-[120px] lg:max-h-[160px] resize-none border-border/50 bg-background/50 backdrop-blur-sm lg:group-hover:bg-background/70 lg:group-hover:border-border/70 transition-all duration-300"
                disabled={isLoading}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 lg:p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl lg:group-hover:shadow-2xl lg:group-hover:from-primary/95 lg:group-hover:to-primary/85 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 lg:w-6 lg:h-6" />
            </motion.button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span>AI Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Smart Responses</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span>{messages.length} messages</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 