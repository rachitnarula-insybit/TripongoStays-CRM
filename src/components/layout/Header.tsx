'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, User, PanelLeftClose, PanelLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MotionToggle from '@/components/ui/MotionToggle';
import { AnalyticsLauncher } from '@/components/analytics';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import { cn } from '@/utils';

interface HeaderProps {
  onMenuClick: () => void;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSidebarToggle, sidebarCollapsed = false, title }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const handleMenuClick = () => {
    hapticFeedback.light();
    onMenuClick();
  };

  return (
    <motion.header 
      className={cn(
        // Layout & Structure
        'relative z-30',
        'flex items-center justify-between',
        'h-16 px-6 lg:px-8', // Generous horizontal padding
        
        // Apple-inspired glass morphism
        'glass-light border-b border-white/20',
        'backdrop-blur-xl backdrop-saturate-150',
        
        // Subtle shadow for depth
        'shadow-sm'
      )}
      initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: reducedMotion ? 0.1 : 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {/* Left section */}
      <motion.div 
        className="flex items-center gap-4"
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Mobile menu button */}
        <motion.div
          variants={motionVariants.staggerChild}
          className="lg:hidden"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMenuClick}
            className="p-2 hover:bg-white/10 focus:bg-white/10"
            haptic="light"
            aria-label="Open navigation menu"
          >
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={reducedMotion ? {} : { rotate: 180 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Menu className="h-5 w-5 text-neutral-700" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Desktop sidebar toggle */}
        {onSidebarToggle && (
          <motion.div
            variants={motionVariants.staggerChild}
            className="hidden lg:block"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                hapticFeedback.light();
                onSidebarToggle();
              }}
              className="p-2 hover:bg-white/10 focus:bg-white/10"
              haptic="light"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <motion.div
                animate={{ rotate: 0 }}
                whileHover={reducedMotion ? {} : { scale: 1.1 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="h-5 w-5 text-neutral-700" />
                ) : (
                  <PanelLeftClose className="h-5 w-5 text-neutral-700" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        )}
        
        {/* Page title with elegant typography */}
        <AnimatePresence mode="wait">
          {title && (
            <motion.div
              variants={motionVariants.staggerChild}
              key={title}
              initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              transition={{ 
                duration: reducedMotion ? 0.1 : 0.3,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <h1 className={cn(
                'text-xl font-semibold text-neutral-900',
                'tracking-tight leading-none',
                'text-balance' // Better text wrapping
              )}>
                {title}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Center section - Search (hidden on mobile) */}
      <motion.div 
        className="hidden md:flex flex-1 justify-center max-w-md mx-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: reducedMotion ? 0.1 : 0.4,
          delay: reducedMotion ? 0 : 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        <motion.div
          className="w-full relative"
          animate={{
            scale: isSearchFocused && !reducedMotion ? 1.02 : 1,
          }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Input
            placeholder="Search everything..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={cn(
              'w-full transition-all duration-300',
              'bg-white/50 border-white/30',
              'focus:bg-white/80 focus:border-brand-accent/50',
              'placeholder:text-neutral-500',
              'backdrop-blur-sm'
            )}
            leftIcon={
              <motion.div
                animate={{ 
                  scale: isSearchFocused && !reducedMotion ? 1.1 : 1,
                  color: isSearchFocused ? '#007AFF' : '#8E8E93'
                }}
                transition={{ duration: 0.2 }}
              >
                <Search className="h-4 w-4" />
              </motion.div>
            }
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            variant="minimal"
            size="md"
          />
          
          {/* Search suggestions dropdown (placeholder) */}
          <AnimatePresence>
            {isSearchFocused && searchValue && (
              <motion.div
                className={cn(
                  'absolute top-full left-0 right-0 mt-2',
                  'glass-medium rounded-lg border border-white/20',
                  'shadow-lg p-2',
                  'z-50'
                )}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="text-sm text-neutral-600 p-2">
                  Search suggestions would appear here...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Right section */}
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: reducedMotion ? 0.1 : 0.4,
          delay: reducedMotion ? 0 : 0.2,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {/* Analytics Launcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.3,
            delay: reducedMotion ? 0 : 0.25
          }}
        >
          <AnalyticsLauncher variant="minimal" showLabel={false} />
        </motion.div>

        {/* Motion toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.3,
            delay: reducedMotion ? 0 : 0.3
          }}
        >
          <MotionToggle 
            variant="minimal" 
            size="sm" 
            showLabel={false}
            showSystemStatus={false}
          />
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.3,
            delay: reducedMotion ? 0 : 0.35
          }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              'relative p-2',
              'hover:bg-white/10 focus:bg-white/10',
              'transition-colors duration-200'
            )}
            haptic="light"
            aria-label="View notifications"
          >
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={reducedMotion ? {} : { 
                rotate: [0, -10, 10, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <Bell className="h-5 w-5 text-neutral-700" />
            </motion.div>
            
            {/* Notification badge */}
            <motion.span 
              className={cn(
                'absolute -top-1 -right-1',
                'h-4 w-4 rounded-full',
                'bg-error-default text-white',
                'text-xs font-medium',
                'flex items-center justify-center',
                'shadow-sm'
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: reducedMotion ? 0.1 : 0.4,
                delay: reducedMotion ? 0 : 0.6,
                type: reducedMotion ? "tween" : "spring",
                stiffness: 400,
                damping: 25
              }}
              whileHover={reducedMotion ? {} : { scale: 1.1 }}
              whileTap={reducedMotion ? {} : { scale: 0.9 }}
            >
              3
            </motion.span>
          </Button>
        </motion.div>

        {/* User menu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.3,
            delay: reducedMotion ? 0 : 0.4
          }}
        >
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              'p-2',
              'hover:bg-white/10 focus:bg-white/10',
              'transition-colors duration-200'
            )}
            haptic="light"
            aria-label="User menu"
          >
            <motion.div
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={cn(
                'h-8 w-8 rounded-full',
                'bg-gradient-to-br from-futuristic-neon to-brand-primary-600',
                'flex items-center justify-center',
                'shadow-sm'
              )}>
                <User className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>

      {/* Subtle bottom border animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ 
          duration: reducedMotion ? 0.1 : 0.8,
          delay: reducedMotion ? 0 : 0.5,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      />
    </motion.header>
  );
};

export default Header;