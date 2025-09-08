'use client';

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatContext } from '@/contexts/ChatContext';
import AIChatPanel from './AIChatPanel';

interface AIChatProps {
  className?: string;
}

const AIChat: React.FC<AIChatProps> = ({ className }) => {
  const { state, closeChat } = useChatContext();


  // Focus management
  useEffect(() => {
    if (state.isOpen) {
      // Prevent body scroll when chat is open
      document.body.style.overflow = 'hidden';
      
      // Set focus trap
      const chatPanel = document.getElementById('ai-chat-panel');
      if (chatPanel) {
        const focusableElements = chatPanel.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isOpen]);

  // Handle escape key globally when chat is open
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isOpen) {
        event.preventDefault();
        event.stopPropagation();
        closeChat();
      }
    };

    if (state.isOpen) {
      document.addEventListener('keydown', handleEscape, true);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [state.isOpen, closeChat]);

  return (
    <AnimatePresence mode="wait">
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeChat}
            aria-hidden="true"
          />
          
          {/* Chat Panel */}
          <AIChatPanel className={className} />
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChat;
