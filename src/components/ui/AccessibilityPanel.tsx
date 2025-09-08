import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Keyboard, 
  MousePointer,
  X,
  Check,
  Eye
} from 'lucide-react';
import Button from './Button';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { useAccessibility, announceToScreenReader } from '@/utils/accessibility';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import { cn } from '@/utils';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = useAccessibility();
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean | number | string) => {
    updatePreferences({ [key]: value });
    hapticFeedback.light();
    announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`);
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small', size: 'text-sm' },
    { value: 'medium', label: 'Medium', size: 'text-base' },
    { value: 'large', label: 'Large', size: 'text-lg' },
    { value: 'extra-large', label: 'Extra Large', size: 'text-xl' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={cn(
              'fixed right-4 top-4 bottom-4 w-80',
              'glass-medium border border-white/20 rounded-2xl',
              'shadow-xl overflow-hidden z-50'
            )}
            variants={motionVariants.modal}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-labelledby="accessibility-panel-title"
            aria-describedby="accessibility-panel-description"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 
                  id="accessibility-panel-title"
                  className="text-lg font-semibold text-neutral-900"
                >
                  Accessibility Settings
                </h2>
                <p 
                  id="accessibility-panel-description"
                  className="text-sm text-neutral-600 mt-1"
                >
                  Customize your experience
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
                aria-label="Close accessibility panel"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Motion Preferences */}
              <motion.div
                variants={motionVariants.staggerChild}
                initial="initial"
                animate="animate"
              >
                <Card variant="minimal" padding="md">
                  <CardHeader padding="sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-primary-100 rounded-lg">
                        <MousePointer className="h-4 w-4 text-brand-primary-600" />
                      </div>
                      <CardTitle size="sm">Motion & Animation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-neutral-700">Reduce motion</span>
                        <motion.button
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            preferences.reducedMotion 
                              ? 'bg-brand-accent' 
                              : 'bg-neutral-300'
                          )}
                          onClick={() => handlePreferenceChange('reducedMotion', !preferences.reducedMotion)}
                          role="switch"
                          aria-checked={preferences.reducedMotion}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                            animate={{
                              x: preferences.reducedMotion ? 24 : 4,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </motion.button>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Visual Preferences */}
              <motion.div
                variants={motionVariants.staggerChild}
              >
                <Card variant="minimal" padding="md">
                  <CardHeader padding="sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-info-light rounded-lg">
                        <Eye className="h-4 w-4 text-info-default" />
                      </div>
                      <CardTitle size="sm">Visual Settings</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* High Contrast */}
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-neutral-700">High contrast</span>
                        <motion.button
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            preferences.highContrast 
                              ? 'bg-brand-accent' 
                              : 'bg-neutral-300'
                          )}
                          onClick={() => handlePreferenceChange('highContrast', !preferences.highContrast)}
                          role="switch"
                          aria-checked={preferences.highContrast}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                            animate={{
                              x: preferences.highContrast ? 24 : 4,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </motion.button>
                      </label>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm text-neutral-700 mb-2">
                          Font size
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {fontSizeOptions.map((option) => (
                            <motion.button
                              key={option.value}
                              className={cn(
                                'p-2 rounded-lg border text-left transition-all duration-200',
                                preferences.fontSize === option.value
                                  ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                                  : 'border-neutral-300 hover:border-neutral-400'
                              )}
                              onClick={() => handlePreferenceChange('fontSize', option.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between">
                                <span className={cn('font-medium', option.size)}>
                                  {option.label}
                                </span>
                                {preferences.fontSize === option.value && (
                                  <Check className="h-4 w-4" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interaction Preferences */}
              <motion.div
                variants={motionVariants.staggerChild}
              >
                <Card variant="minimal" padding="md">
                  <CardHeader padding="sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning-light rounded-lg">
                        <Keyboard className="h-4 w-4 text-warning-default" />
                      </div>
                      <CardTitle size="sm">Interaction</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-neutral-700">Keyboard navigation</span>
                        <motion.button
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            preferences.keyboardNavigation 
                              ? 'bg-brand-accent' 
                              : 'bg-neutral-300'
                          )}
                          onClick={() => handlePreferenceChange('keyboardNavigation', !preferences.keyboardNavigation)}
                          role="switch"
                          aria-checked={preferences.keyboardNavigation}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                            animate={{
                              x: preferences.keyboardNavigation ? 24 : 4,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </motion.button>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Screen Reader Info */}
              {preferences.screenReader && (
                <motion.div
                  variants={motionVariants.staggerChild}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card variant="minimal" padding="md">
                    <CardHeader padding="sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success-light rounded-lg">
                          <Volume2 className="h-4 w-4 text-success-default" />
                        </div>
                        <CardTitle size="sm">Screen Reader Detected</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600">
                        Enhanced accessibility features are active. All interactive elements include proper ARIA labels and descriptions.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  WCAG AA+ compliant
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                >
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccessibilityPanel;

