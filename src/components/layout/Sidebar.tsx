'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Phone,
  Calendar,
  Package,
  LogOut,
  X,
  UserCircle,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import AIChatLauncher from '@/components/ai-chat/AIChatLauncher';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onToggle: () => void;
  onCollapse?: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & analytics',
  },
  {
    name: 'User Profiles',
    href: '/profiles',
    icon: UserCircle,
    description: 'Customer profiles',
  },
  {
    name: 'Users / Contacts',
    href: '/users',
    icon: Users,
    description: 'Manage contacts',
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: UserCheck,
    description: 'Lead management',
  },
  {
    name: 'Call History',
    href: '/call-history',
    icon: Phone,
    description: 'Communication logs',
  },
  {
    name: 'Bookings',
    href: '/bookings',
    icon: Calendar,
    description: 'Reservations & stays',
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
    description: 'Property management',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'AI insights & reports',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed = false, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const handleLogout = () => {
    hapticFeedback.medium();
    logout();
    router.push('/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      hapticFeedback.light();
      onToggle();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* Sidebar container */}
      <motion.aside
        className={cn(
          // Layout & positioning
          'fixed left-0 top-0 z-40 h-full',
          'lg:relative lg:z-30',
          
          // Dynamic width based on collapsed state
          isCollapsed ? 'w-16 lg:w-16' : 'w-72',
          
          // Apple-inspired glass morphism
          'glass-medium border-r border-white/20',
          'backdrop-blur-xl backdrop-saturate-150',
          
          // Shadow for depth
          'shadow-xl lg:shadow-lg',
          
          // Responsive behavior
          'transition-all duration-300 ease-apple',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        initial={{ x: isCollapsed ? -64 : -288, opacity: 0 }}
        animate={{ 
          x: isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : (isCollapsed ? -64 : -288), 
          opacity: 1,
          width: isCollapsed ? 64 : 288
        }}
        exit={{ x: isCollapsed ? -64 : -288, opacity: 0 }}
        transition={{ 
          duration: reducedMotion ? 0.1 : 0.3,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {/* Header with brand */}
        <motion.div 
          className={cn(
            "flex items-center border-b border-white/10 transition-all duration-300",
            isCollapsed ? "justify-center p-3" : "justify-between p-6"
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.4,
            delay: reducedMotion ? 0 : 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <motion.div 
            className={cn(
              "flex items-center transition-all duration-300",
              isCollapsed ? "justify-center" : "gap-3"
            )}
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className={cn(
                'flex h-10 w-10 items-center justify-center',
                'rounded-xl bg-gradient-to-br from-futuristic-neon to-brand-primary-600',
                'text-white font-bold text-lg',
                'shadow-md'
              )}
              whileHover={reducedMotion ? {} : { rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              T
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
                    TripongoStays
                  </h1>
                  <p className="text-xs text-neutral-600 font-medium">
                    CRM System
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Close button for mobile */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="lg:hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="p-2 hover:bg-white/10"
                  haptic="light"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5 text-neutral-600" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* User profile section */}
        <motion.div 
          className={cn(
            "border-b border-white/10 transition-all duration-300",
            isCollapsed ? "p-3" : "p-6"
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.4,
            delay: reducedMotion ? 0 : 0.2
          }}
        >
          <motion.div 
            className={cn(
              "flex items-center rounded-xl hover:bg-white/5 transition-colors duration-200 cursor-pointer",
              isCollapsed ? "p-2 justify-center" : "gap-3 p-3"
            )}
            whileHover={reducedMotion ? {} : { scale: 1.02, x: isCollapsed ? 0 : 4 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
            title={isCollapsed ? (user?.name || 'Admin User') : undefined}
          >
            <motion.div 
              className={cn(
                'flex items-center justify-center',
                'rounded-full bg-gradient-to-br from-brand-accent to-blue-600',
                'text-white font-semibold',
                'shadow-md',
                isCollapsed ? 'h-8 w-8 text-sm' : 'h-12 w-12 text-lg'
              )}
              whileHover={reducedMotion ? {} : { scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {user?.name?.charAt(0) || 'A'}
            </motion.div>
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
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-neutral-600 capitalize">
                      {user?.role || 'Administrator'}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Navigation menu */}
        <nav className={cn(
          "flex-1 space-y-1 transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <motion.div
            variants={motionVariants.staggerContainer}
            initial="initial"
            animate="animate"
          >
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.div
                  key={item.name}
                  variants={motionVariants.staggerChild}
                  custom={index}
                >
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      // Base styles
                      'group flex items-center rounded-xl',
                      'text-sm font-medium transition-all duration-200',
                      'relative overflow-hidden',
                      
                      // Conditional spacing and layout
                      isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                      
                      // Active states
                      isActive ? [
                        'bg-brand-accent text-white shadow-md',
                        'shadow-brand-accent/25'
                      ] : [
                        'text-neutral-700 hover:text-neutral-900',
                        'hover:bg-white/10 hover:shadow-sm'
                      ]
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    )}
                    
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isActive && !reducedMotion ? 1.1 : 1,
                        rotate: isActive && !reducedMotion ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <Icon className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-5 w-5"
                      )} />
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
                              {item.name}
                            </div>
                            <div className={cn(
                              'text-xs truncate transition-colors duration-200',
                              isActive 
                                ? 'text-white/80' 
                                : 'text-neutral-500 group-hover:text-neutral-600'
                            )}>
                              {item.description}
                            </div>
                          </motion.div>
                          
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
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </nav>

        {/* AI Chat Launcher */}
        <motion.div 
          className={cn(
            "border-t border-white/10 transition-all duration-300",
            isCollapsed ? "p-2" : "p-4"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.4,
            delay: reducedMotion ? 0 : 0.5
          }}
        >
          <AIChatLauncher isCollapsed={isCollapsed} />
        </motion.div>

        {/* Logout section */}
        <motion.div 
          className={cn(
            "border-t border-white/10 transition-all duration-300",
            isCollapsed ? "p-2" : "p-4"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: reducedMotion ? 0.1 : 0.4,
            delay: reducedMotion ? 0 : 0.6
          }}
        >
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full rounded-xl transition-all duration-200 group',
              'text-error-default hover:text-error-dark',
              'hover:bg-error-light/10',
              isCollapsed ? 'justify-center p-3' : 'justify-start gap-3 px-4 py-3'
            )}
            haptic="medium"
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <motion.div
              whileHover={reducedMotion ? {} : { rotate: [0, -10, 0] }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <LogOut className="h-5 w-5" />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <>
                  <motion.span 
                    className="font-medium"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sign Out
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;