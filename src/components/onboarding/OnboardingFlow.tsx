import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles,
  LayoutDashboard,
  Users,
  Calendar,
  TrendingUp,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import { announceToScreenReader } from '@/utils/accessibility';
import { cn } from '@/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TripongoStays CRM',
    description: 'Your premium hospitality management experience starts here',
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600 leading-relaxed">
          Experience hospitality management reimagined with Apple-inspired design, 
          buttery 120Hz animations, and accessibility-first features.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-brand-primary-50 rounded-lg">
            <div className="text-sm font-medium text-brand-primary-700">Beautiful Design</div>
            <div className="text-xs text-brand-primary-600">Minimal & premium</div>
          </div>
          <div className="p-3 bg-success-light rounded-lg">
            <div className="text-sm font-medium text-success-dark">Accessible</div>
            <div className="text-xs text-success-default">WCAG AA+ compliant</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Command Center',
    description: 'Get insights at a glance with our intelligent dashboard',
    icon: LayoutDashboard,
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600">
          Monitor your business performance with real-time analytics, 
          conversion funnels, and actionable insights.
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-brand-accent rounded-full"></div>
            Real-time booking analytics
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-success-default rounded-full"></div>
            Lead conversion tracking
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-warning-default rounded-full"></div>
            Revenue growth insights
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'contacts',
    title: 'Manage Your Guests',
    description: 'Comprehensive guest and lead management system',
    icon: Users,
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600">
          Keep track of all your guests, leads, and contacts in one beautifully 
          organized system with smart search and filtering.
        </p>
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="text-sm font-medium mb-2">Key Features:</div>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Smart guest profiles with history</li>
            <li>• Lead scoring and prioritization</li>
            <li>• Communication timeline</li>
            <li>• Automated follow-ups</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'bookings',
    title: 'Booking Management',
    description: 'Streamlined reservation and calendar system',
    icon: Calendar,
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600">
          Manage reservations, check-ins, check-outs, and availability 
          with our intuitive calendar interface.
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-info-light rounded">
            <div className="text-lg font-bold text-info-dark">12</div>
            <div className="text-xs text-info-default">Check-ins</div>
          </div>
          <div className="p-2 bg-warning-light rounded">
            <div className="text-lg font-bold text-warning-dark">8</div>
            <div className="text-xs text-warning-default">Check-outs</div>
          </div>
          <div className="p-2 bg-success-light rounded">
            <div className="text-lg font-bold text-success-dark">95%</div>
            <div className="text-xs text-success-default">Occupancy</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'ready',
    title: 'You\'re All Set!',
    description: 'Start managing your hospitality business like never before',
    icon: TrendingUp,
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600">
          Your premium CRM experience is ready. Enjoy the buttery smooth animations, 
          accessibility features, and beautiful design.
        </p>
        <div className="p-4 bg-gradient-to-r from-brand-primary-50 to-brand-accent/5 rounded-lg border border-brand-primary-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-brand-primary-600" />
            <span className="font-medium text-brand-primary-700">Pro Tip</span>
          </div>
          <p className="text-sm text-brand-primary-600">
            Press <kbd className="px-1 py-0.5 bg-white rounded text-xs border">Cmd+K</kbd> anywhere 
            to open the command palette for quick navigation.
          </p>
        </div>
      </div>
    ),
  },
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (isOpen && currentStepData) {
      announceToScreenReader(`Step ${currentStep + 1} of ${onboardingSteps.length}: ${currentStepData.title}`);
    }
  }, [currentStep, isOpen, currentStepData]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
      hapticFeedback.light();
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      hapticFeedback.light();
    }
  };

  const handleSkip = () => {
    hapticFeedback.medium();
    onClose();
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    hapticFeedback.heavy();
    onComplete();
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
      hapticFeedback.light();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.3 }}
          />

          {/* Onboarding Modal */}
          <motion.div
            className="fixed inset-4 z-50 flex items-center justify-center"
            variants={motionVariants.modal}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card 
              variant="glass" 
              className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
              padding="none"
            >
              {/* Header with progress */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-neutral-600">
                    Step {currentStep + 1} of {onboardingSteps.length}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary-500 to-brand-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                    transition={{ duration: reducedMotion ? 0.1 : 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>

                {/* Step indicators */}
                <div className="flex justify-between mt-3">
                  {onboardingSteps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = completedSteps.has(index);
                    const isAccessible = index <= currentStep || completedSteps.has(index);

                    return (
                      <motion.button
                        key={step.id}
                        className={cn(
                          'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200',
                          isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                          isActive && 'bg-brand-primary-50'
                        )}
                        onClick={() => handleStepClick(index)}
                        disabled={!isAccessible}
                        whileHover={isAccessible ? { scale: 1.05 } : {}}
                        whileTap={isAccessible ? { scale: 0.95 } : {}}
                        aria-label={`Go to step ${index + 1}: ${step.title}`}
                      >
                        <div className={cn(
                          'p-2 rounded-full transition-all duration-200',
                          isCompleted 
                            ? 'bg-success-default text-white' 
                            : isActive 
                              ? 'bg-brand-accent text-white'
                              : 'bg-neutral-200 text-neutral-500'
                        )}>
                          {isCompleted ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <step.icon className="h-3 w-3" />
                          )}
                        </div>
                        <span className={cn(
                          'text-xs font-medium',
                          isActive ? 'text-brand-accent' : 'text-neutral-500'
                        )}>
                          {step.title.split(' ')[0]}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    transition={{ duration: reducedMotion ? 0.1 : 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        className="inline-flex p-4 bg-gradient-to-br from-brand-primary-100 to-brand-accent/10 rounded-2xl mb-4"
                        whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <currentStepData.icon className="h-8 w-8 text-brand-primary-600" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-balance">
                        {currentStepData.title}
                      </h2>
                      <p className="text-neutral-600 text-pretty">
                        {currentStepData.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {currentStepData.content}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                  className={isFirstStep ? 'opacity-0 pointer-events-none' : ''}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {!isLastStep && (
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-neutral-500"
                    >
                      Skip Tour
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    rightIcon={!isLastStep ? <ChevronRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    haptic="light"
                  >
                    {isLastStep ? 'Get Started' : 'Next'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingFlow;

