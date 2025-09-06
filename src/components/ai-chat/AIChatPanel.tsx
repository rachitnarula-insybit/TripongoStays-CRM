'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Settings, 
  Trash2, 
  MessageCircle, 
  Bot,
  User,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/utils';
import { useChatContext, ChatMessage } from '@/contexts/ChatContext';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import Button from '@/components/ui/Button';

interface AIChatPanelProps {
  className?: string;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ className }) => {
  const { state, closeChat, sendMessage, clearMessages, setModel } = useChatContext();
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (state.isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [state.isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || state.isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(message);
    hapticFeedback.light();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    hapticFeedback.light();
    closeChat();
  };

  const handleClearMessages = () => {
    hapticFeedback.medium();
    clearMessages();
    setShowSettings(false);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  if (!state.isOpen) return null;

  return (
    <motion.div
      id="ai-chat-panel"
      className={cn(
        'fixed right-0 top-0 h-full w-96 z-50',
        'glass-medium border-l border-white/20',
        'backdrop-blur-xl backdrop-saturate-150',
        'shadow-2xl',
        'flex flex-col',
        className
      )}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ 
        duration: reducedMotion ? 0.1 : 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      role="dialog"
      aria-label="AI Assistant Chat"
      aria-modal="true"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: reducedMotion ? 0.1 : 0.3,
          delay: reducedMotion ? 0 : 0.1
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-futuristic-neon to-brand-primary-600 rounded-lg">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              AI Assistant
            </h2>
            <p className="text-xs text-neutral-600">
              Model: {state.model}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 p-0 hover:bg-white/10"
            aria-label="Chat settings"
            title="Chat settings"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-white/10"
            aria-label="Close chat"
            title="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="border-b border-white/10 p-4 bg-white/5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              {/* Model Selector */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  AI Model
                </label>
                <div className="relative">
                  <select
                    value={state.model}
                    onChange={(e) => setModel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-neutral-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                  >
                    <option value="gpt-4">GPT-4 (Most Capable)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
                    <option value="claude-3">Claude 3 (Analytical)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-600 pointer-events-none" />
                </div>
              </div>

              {/* Clear Messages */}
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearMessages}
                leftIcon={<Trash2 className="h-4 w-4" />}
                className="w-full"
                disabled={state.messages.length === 0}
              >
                Clear Chat History
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {state.messages.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-futuristic-neon/20 to-brand-primary-200 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-brand-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Welcome to AI Assistant
            </h3>
            <p className="text-sm text-neutral-600 max-w-64">
              I'm here to help you with your CRM tasks, analyze data, and answer questions about your business.
            </p>
          </motion.div>
        ) : (
          <>
            {state.messages.map((message, index) => (
              <ChatMessageBubble 
                key={message.id} 
                message={message} 
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <motion.div 
        className="p-4 border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: reducedMotion ? 0.1 : 0.3,
          delay: reducedMotion ? 0 : 0.2
        }}
      >
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your CRM..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg resize-none text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-200"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={state.isLoading}
              aria-label="Type your message"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{inputValue.length}/2000</span>
            </div>
          </div>
          
          <Button
            variant="primary"
            size="md"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || state.isLoading}
            className="h-11 w-11 p-0 rounded-lg"
            aria-label="Send message"
            title="Send message"
          >
            {state.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Chat Message Bubble Component
interface ChatMessageBubbleProps {
  message: ChatMessage;
  index: number;
  reducedMotion: boolean;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ 
  message, 
  index, 
  reducedMotion 
}) => {
  const isUser = message.role === 'user';
  const isLoading = message.isLoading;

  return (
    <motion.div
      className={cn(
        'flex gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: reducedMotion ? 0.1 : 0.3,
        delay: reducedMotion ? 0 : index * 0.05
      }}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-futuristic-neon to-brand-primary-600 rounded-lg flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3',
          isUser
            ? 'bg-brand-accent text-white rounded-br-sm'
            : 'bg-white/10 text-neutral-900 rounded-bl-sm'
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}
        
        <div className={cn(
          'text-xs mt-2 opacity-70',
          isUser ? 'text-white/70' : 'text-neutral-600'
        )}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-brand-accent to-blue-600 rounded-lg flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

export default AIChatPanel;


