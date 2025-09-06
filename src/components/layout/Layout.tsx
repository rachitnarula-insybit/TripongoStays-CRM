'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';
import Sidebar from './Sidebar';
import Header from './Header';
import AIChat from '@/components/ai-chat/AIChat';
import { cn } from '@/utils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  hideNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, hideNavigation = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsedState !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Loading state with Apple-inspired design
  if (isLoading) {
    return (
      <motion.div 
        className="flex h-screen items-center justify-center bg-neutral-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-center"
          variants={motionVariants.staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="mx-auto h-8 w-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin mb-4"
            variants={motionVariants.staggerChild}
          />
          <motion.p 
            className="text-sm font-medium text-neutral-600"
            variants={motionVariants.staggerChild}
          >
            Loading your workspace...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ 
          duration: reducedMotion ? 0.1 : 0.4,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {children}
      </motion.div>
    );
  }

  // Full-screen layout without sidebar (for Analytics page)
  if (hideNavigation) {
    return (
      <ChatProvider>
        <div className="min-h-screen bg-neutral-50">
          {/* AI Chat */}
          <AIChat />
          {children}
        </div>
      </ChatProvider>
    );
  }

  return (
    <ChatProvider>
      <div className="flex h-screen bg-neutral-50 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          <Sidebar 
            isOpen={sidebarOpen} 
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onCollapse={toggleSidebarCollapse}
          />
        </AnimatePresence>
        
        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onSidebarToggle={toggleSidebarCollapse}
            sidebarCollapsed={sidebarCollapsed}
            title={title}
          />
          
          {/* Main content with generous spacing */}
          <motion.main 
            className={cn(
              'flex-1 overflow-auto',
              'px-6 py-8 lg:px-8 lg:py-10', // Generous padding
              'bg-gradient-to-br from-neutral-50 to-neutral-100/50', // Subtle gradient
              'transition-all duration-300'
            )}
            variants={motionVariants.page}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Content container with max width and centering */}
            <motion.div 
              className="mx-auto max-w-7xl"
              variants={motionVariants.staggerContainer}
              initial="initial"
              animate="animate"
            >
              {children}
            </motion.div>
          </motion.main>
        </div>
        
        {/* Sidebar overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* AI Chat */}
        <AIChat />
      </div>
    </ChatProvider>
  );
};

export default Layout;