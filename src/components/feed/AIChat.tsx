'use client';

import { useEffect, useState } from 'react';
import { X, Bot } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FeedPost } from '@/lib/types';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  post?: FeedPost;
}

export function AIChat({ isOpen, onClose, post }: AIChatProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get or create session ID
    let id = sessionStorage.getItem('df-messenger-sessionID');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('df-messenger-sessionID', id);
    }
    setSessionId(id);
  }, []);

    useEffect(() => {
    if (isOpen && post && sessionId) {
      // Send context to DialogFlow like in existing projects
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
      }).catch(error => {
        console.error('Error sending context to DialogFlow:', error);
      });
    }
  }, [isOpen, post, sessionId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="text-2xl text-primary" />
            <span>SmileUp AI Assistant</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative">
          <df-messenger
            project-id="hey-buddy-425118"
            agent-id="565449f1-c5bd-40c2-8457-295ce6ae892d"
            language-code="en"
            max-query-length="-1"
            allow-feedback="all"
          >
            <df-messenger-chat chat-title="SmileUp AI"></df-messenger-chat>
          </df-messenger>
        </div>
      </DialogContent>
    </Dialog>
  );
} 