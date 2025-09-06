'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';
import { useChatContext } from '@/contexts/ChatContext';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';

interface AIChatLauncherProps {
  isCollapsed?: boolean;
  className?: string;
}

const AIChatLauncher: React.FC<AIChatLauncherProps> = ({ 
  isCollapsed = false, 
  className 
}) => {
  const { state, toggleChat } = useChatContext();
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const handleClick = () => {
    hapticFeedback.medium();
    toggleChat();
  };

  const isActive = state.isOpen;

  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: reducedMotion ? 0.1 : 0.3,
        delay: reducedMotion ? 0 : 0.1
      }}
    >
      <motion.button
        onClick={handleClick}
        className={cn(
          // Base styles matching navigation items
          'group flex items-center rounded-xl w-full',
          'text-sm font-medium transition-all duration-200',
          'relative overflow-hidden',
          
          // Conditional spacing and layout
          isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
          
          // Active states - AI themed
          isActive ? [
            'bg-gradient-to-r from-futuristic-neon to-brand-primary-600 text-white shadow-md',
            'shadow-futuristic-neon/25'
          ] : [
            'text-neutral-700 hover:text-neutral-900',
            'hover:bg-white/10 hover:shadow-sm'
          ]
        )}
        aria-pressed={state.isOpen}
        aria-controls="ai-chat-panel"
        aria-label={isCollapsed ? "Open AI Assistant" : undefined}
        title={isCollapsed ? "Open AI Assistant" : undefined}
        whileHover={reducedMotion ? {} : { scale: 1.02, x: isCollapsed ? 0 : 4 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
            layoutId="aiActiveIndicator"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          />
        )}
        
        {/* Icon container */}
        <motion.div
          className="relative flex items-center justify-center flex-shrink-0"
          animate={{
            scale: isActive && !reducedMotion ? 1.1 : 1,
            rotate: isActive && !reducedMotion ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Main icon */}
          <MessageCircle 
            className={cn(
              'transition-all duration-200',
              isCollapsed ? 'h-5 w-5' : 'h-5 w-5'
            )} 
          />
          
          {/* AI indicator sparkle */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className={cn(
              'h-3 w-3 drop-shadow-sm',
              isActive ? 'text-white' : 'text-futuristic-neon'
            )} />
          </motion.div>

          {/* Notification dot for new messages */}
          <AnimatePresence>
            {state.messages.length > 0 && !state.isOpen && (
              <motion.div
                className="absolute -top-1 -right-1 h-2 w-2 bg-futuristic-neon rounded-full shadow-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Label and description - only show when expanded */}
        <AnimatePresence>
          {!isCollapsed && (
            <>
              <motion.div 
                className="flex-1 min-w-0"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-medium truncate">
                  AI Assistant
                </div>
                <div className={cn(
                  'text-xs truncate transition-colors duration-200',
                  isActive 
                    ? 'text-white/80' 
                    : 'text-neutral-500 group-hover:text-neutral-600'
                )}>
                  {state.isLoading ? 'Thinking...' : 'Ask me anything'}
                </div>
              </motion.div>
              
              {/* Status indicator and hover arrow */}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Status dot */}
                <motion.div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    state.isLoading ? 'bg-yellow-400' : isActive ? 'bg-white' : 'bg-futuristic-neon'
                  )}
                  animate={{
                    scale: state.isLoading ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: state.isLoading ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Hover arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Ripple effect for active items */}
        {isActive && !reducedMotion && (
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-xl"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </motion.button>
    </motion.div>
  );
};

export default AIChatLauncher;
