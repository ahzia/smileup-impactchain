'use client';

import { LoginModal } from './LoginModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string; // e.g., "donate", "comment", etc.
}

export function AuthModal({ isOpen, onClose, action = "continue" }: AuthModalProps) {
  return (
    <LoginModal
      isOpen={isOpen}
      onClose={onClose}
      showCreateAccountLink={true}
    />
  );
} 