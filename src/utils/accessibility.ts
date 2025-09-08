import { useEffect, useState } from 'react';

// Accessibility preferences manager
class AccessibilityPreferences {
  private static instance: AccessibilityPreferences;
  private storageKey = 'tripongo-a11y-preferences';

  static getInstance(): AccessibilityPreferences {
    if (!AccessibilityPreferences.instance) {
      AccessibilityPreferences.instance = new AccessibilityPreferences();
    }
    return AccessibilityPreferences.instance;
  }

  getPreferences(): A11yPreferences {
    if (typeof window === 'undefined') {
      return {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        screenReader: false,
        keyboardNavigation: true,
      };
    }
    
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Detect system preferences
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      fontSize: 'medium',
      screenReader: this.detectScreenReader(),
      keyboardNavigation: true,
    };
  }

  setPreferences(preferences: Partial<A11yPreferences>): void {
    if (typeof window === 'undefined') return;
    
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    
    // Apply preferences to document
    this.applyPreferences(updated);
  }

  private detectScreenReader(): boolean {
    // Check for common screen reader indicators
    if (typeof window === 'undefined') return false;
    
    return !!(
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      window.speechSynthesis ||
      (window as Window & { chrome?: { tts?: unknown } })?.chrome?.tts
    );
  }

  private applyPreferences(preferences: A11yPreferences): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Apply high contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${preferences.fontSize}`);
    
    // Apply reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }
}

export interface A11yPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export const a11yPrefs = AccessibilityPreferences.getInstance();

// Hook for accessibility preferences
export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<A11yPreferences>(
    a11yPrefs.getPreferences()
  );

  const updatePreferences = (newPrefs: Partial<A11yPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    a11yPrefs.setPreferences(updated);
  };

  return {
    preferences,
    updatePreferences,
  };
};

// Focus management utilities
export class FocusManager {
  private static focusHistory: HTMLElement[] = [];
  private static trapStack: HTMLElement[] = [];

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }
  }

  static restoreFocus(): void {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  }

  static trapFocus(container: HTMLElement): void {
    this.trapStack.push(container);
    this.setupFocusTrap(container);
  }

  static releaseFocus(): void {
    const container = this.trapStack.pop();
    if (container) {
      this.removeFocusTrap(container);
    }
  }

  private static setupFocusTrap(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    (container as HTMLElement & { _focusTrapHandler?: (e: KeyboardEvent) => void })._focusTrapHandler = handleTabKey;

    // Focus first element
    firstElement?.focus();
  }

  private static removeFocusTrap(container: HTMLElement): void {
    const handler = (container as HTMLElement & { _focusTrapHandler?: (e: KeyboardEvent) => void })._focusTrapHandler;
    if (handler) {
      container.removeEventListener('keydown', handler);
      delete (container as HTMLElement & { _focusTrapHandler?: (e: KeyboardEvent) => void })._focusTrapHandler;
    }
  }

  private static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
    ].join(', ');

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  }
}

// Hook for focus management
export const useFocusManagement = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key handling
      if (event.key === 'Escape') {
        const escapeEvent = new CustomEvent('escape-pressed', { bubbles: true });
        container.dispatchEvent(escapeEvent);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef]);

  const trapFocus = () => {
    if (containerRef.current) {
      FocusManager.saveFocus();
      FocusManager.trapFocus(containerRef.current);
    }
  };

  const releaseFocus = () => {
    FocusManager.releaseFocus();
    FocusManager.restoreFocus();
  };

  return { trapFocus, releaseFocus };
};

// Screen reader utilities
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Keyboard navigation helpers
export const useKeyboardNavigation = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
};

// ARIA live region hook
export const useAriaLiveRegion = () => {
  const [liveRegion, setLiveRegion] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    setLiveRegion(region);

    return () => {
      if (document.body.contains(region)) {
        document.body.removeChild(region);
      }
    };
  }, []);

  const announce = (message: string) => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  };

  return announce;
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

export const meetsWCAGAA = (foreground: string, background: string, isLargeText = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

export const meetsWCAGAAA = (foreground: string, background: string, isLargeText = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
};

// Skip link component hook
export const useSkipLink = (targetId: string) => {
  const skipToContent = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return skipToContent;
};

