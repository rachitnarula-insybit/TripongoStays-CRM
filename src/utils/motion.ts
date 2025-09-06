import { useEffect, useState } from 'react';
import { Variants, Transition } from 'framer-motion';
import designTokens from '../design-system/tokens.json';

// Motion preferences utility
export const motionPrefs = {
  getPreference(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('reduce-motion');
    return stored === 'true';
  },

  setPreference(value: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('reduce-motion', value.toString());
  },

  togglePreference(): boolean {
    const current = this.getPreference();
    const newValue = !current;
    this.setPreference(newValue);
    return newValue;
  }
};

// Hook to detect system and user motion preferences
export const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const systemReducedMotion = mediaQuery.matches;
    
    // Check user preference
    const userReducedMotion = motionPrefs.getPreference();
    
    // Use either system or user preference
    setReducedMotion(systemReducedMotion || userReducedMotion);

    // Listen for system preference changes
    const handleChange = () => {
      const newSystemPref = mediaQuery.matches;
      const currentUserPref = motionPrefs.getPreference();
      setReducedMotion(newSystemPref || currentUserPref);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
};

// 120Hz optimized spring configurations
export const springs = {
  gentle: {
    type: "spring" as const,
    damping: designTokens.motion.spring.gentle.damping,
    stiffness: designTokens.motion.spring.gentle.stiffness,
    mass: designTokens.motion.spring.gentle.mass
  },
  bouncy: {
    type: "spring" as const,
    damping: designTokens.motion.spring.bouncy.damping,
    stiffness: designTokens.motion.spring.bouncy.stiffness,
    mass: designTokens.motion.spring.bouncy.mass
  },
  snappy: {
    type: "spring" as const,
    damping: designTokens.motion.spring.snappy.damping,
    stiffness: designTokens.motion.spring.snappy.stiffness,
    mass: designTokens.motion.spring.snappy.mass
  }
};

// Apple-inspired easing functions
export const easingFunctions = {
  apple: [0.25, 0.1, 0.25, 1] as const,
  swift: [0.4, 0.0, 0.2, 1] as const,
  entrance: [0.0, 0.0, 0.2, 1] as const,
  exit: [0.4, 0.0, 1, 1] as const,
  spring: [0.175, 0.885, 0.32, 1.275] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const
};

// Shared element transition utilities
export const sharedElementTransitions = {
  layoutId: (id: string) => `shared-${id}`,
  transition: {
    type: "spring",
    damping: 25,
    stiffness: 120,
    mass: 1
  } as Transition
};

// Micro-interaction helpers
export const microInteractions = {
  tap: (reducedMotion: boolean) => ({
    scale: reducedMotion ? 1 : 0.96,
    transition: springs.snappy
  }),
  hover: (reducedMotion: boolean) => ({
    scale: reducedMotion ? 1 : 1.02,
    y: reducedMotion ? 0 : -2,
    transition: springs.gentle
  }),
  focus: (reducedMotion: boolean) => ({
    scale: reducedMotion ? 1 : 1.05,
    transition: springs.bouncy
  })
};

// Glassmorphism backdrop blur variants
export const glassVariants = {
  light: {
    backgroundColor: designTokens.colors.glassmorphism.light,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)"
  },
  medium: {
    backgroundColor: designTokens.colors.glassmorphism.medium,
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)"
  },
  dark: {
    backgroundColor: designTokens.colors.glassmorphism.dark,
    backdropFilter: "blur(60px) saturate(180%)",
    WebkitBackdropFilter: "blur(60px) saturate(180%)"
  }
};

// Create motion variants based on reduced motion preference
export const createMotionVariants = (reducedMotion: boolean): Record<string, Variants> => {
  const fastDuration = designTokens.motion.durations.fast / 1000;
  const normalDuration = designTokens.motion.durations.normal / 1000;
  const slowDuration = designTokens.motion.durations.slow / 1000;

  return {
    // Enhanced button variants with 120Hz optimization
    button: {
      initial: { scale: 1, filter: "brightness(1)" },
      hover: { 
        scale: reducedMotion ? 1 : 1.02,
        filter: reducedMotion ? "brightness(1)" : "brightness(1.05)",
        transition: springs.gentle
      },
      tap: { 
        scale: reducedMotion ? 1 : 0.96,
        filter: reducedMotion ? "brightness(1)" : "brightness(0.95)",
        transition: springs.snappy
      },
      focus: {
        scale: reducedMotion ? 1 : 1.01,
        transition: springs.bouncy
      }
    },

    // Glassmorphic card variants
    card: {
      initial: { 
        opacity: 0, 
        y: reducedMotion ? 0 : 24,
        scale: reducedMotion ? 1 : 0.95,
        filter: "blur(0px)"
      },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: "blur(0px)",
        transition: {
          ...springs.gentle,
          staggerChildren: 0.1,
          delayChildren: 0.05
        }
      },
      hover: {
        y: reducedMotion ? 0 : -4,
        scale: reducedMotion ? 1 : 1.01,
        transition: springs.gentle
      },
      exit: {
        opacity: 0,
        y: reducedMotion ? 0 : -24,
        scale: reducedMotion ? 1 : 0.95,
        transition: {
          duration: fastDuration,
          ease: easingFunctions.exit
        }
      }
    },

    // Refined list item variants
    listItem: {
      initial: { 
        opacity: 0, 
        x: reducedMotion ? 0 : -20,
        filter: "blur(4px)"
      },
      animate: { 
        opacity: 1, 
        x: 0,
        filter: "blur(0px)",
        transition: springs.gentle
      },
      hover: {
        x: reducedMotion ? 0 : 4,
        transition: springs.snappy
      }
    },

    // Enhanced modal with glassmorphism
    modal: {
      initial: { 
        opacity: 0, 
        scale: reducedMotion ? 1 : 0.9,
        y: reducedMotion ? 0 : 40,
        filter: "blur(8px)"
      },
      animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        filter: "blur(0px)",
        transition: {
          ...springs.bouncy,
          staggerChildren: 0.05,
          delayChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        scale: reducedMotion ? 1 : 0.9,
        y: reducedMotion ? 0 : 40,
        filter: "blur(8px)",
        transition: {
          duration: normalDuration,
          ease: easingFunctions.exit
        }
      }
    },

    // Page transitions with shared elements
    page: {
      initial: { 
        opacity: 0, 
        y: reducedMotion ? 0 : 20,
        filter: "blur(4px)"
      },
      animate: { 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)",
        transition: { 
          ...springs.gentle,
          staggerChildren: 0.08,
          delayChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        y: reducedMotion ? 0 : -20,
        filter: "blur(4px)",
        transition: {
          duration: fastDuration,
          ease: easingFunctions.exit
        }
      }
    },

    // Floating action button
    fab: {
      initial: { scale: 0, rotate: -180 },
      animate: { 
        scale: 1, 
        rotate: 0,
        transition: springs.bouncy
      },
      hover: {
        scale: reducedMotion ? 1 : 1.1,
        rotate: reducedMotion ? 0 : 5,
        transition: springs.gentle
      },
      tap: {
        scale: reducedMotion ? 1 : 0.9,
        transition: springs.snappy
      }
    },

    // Notification toast
    toast: {
      initial: { 
        opacity: 0, 
        y: reducedMotion ? 0 : -100,
        scale: reducedMotion ? 1 : 0.3
      },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: springs.bouncy
      },
      exit: { 
        opacity: 0, 
        y: reducedMotion ? 0 : -100,
        scale: reducedMotion ? 1 : 0.3,
        transition: springs.snappy
      }
    },

    // Stagger container
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.05
        }
      }
    },

    // Stagger children
    staggerChild: {
      initial: { 
        opacity: 0, 
        y: reducedMotion ? 0 : 20,
        scale: reducedMotion ? 1 : 0.95
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: springs.gentle
      }
    }
  };
};

// Haptic feedback utilities (for supported devices)
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  }
};


// Performance utilities
export const willChange = {
  auto: { willChange: 'auto' },
  transform: { willChange: 'transform' },
  opacity: { willChange: 'opacity' },
  transformOpacity: { willChange: 'transform, opacity' },
};

// Telemetry hooks for performance monitoring
export const useMotionTelemetry = () => {
  const reportLongFrame = (duration: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'motion_long_frame', {
        event_category: 'performance',
        value: Math.round(duration),
      });
    }
  };

  const reportMotionEvent = (eventName: string, component: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'motion',
        event_label: component,
      });
    }
  };

  return { reportLongFrame, reportMotionEvent };
};

// Export design tokens for use in components
export { designTokens };