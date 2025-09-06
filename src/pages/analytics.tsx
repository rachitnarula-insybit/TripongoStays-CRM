import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { BarChart3, TrendingUp, Brain, Target, Activity, MessageCircle, Sparkles, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { 
  PredictiveInsightsCard, 
  PerformanceMetricsGrid, 
  AIRecommendationsPanel, 
  TrendAnalysisChart 
} from '@/components/analytics';
import CRMAnalyticsDashboard from '@/components/analytics/CRMAnalyticsDashboard';
import CRMChartsPanel from '@/components/analytics/CRMChartsPanel';
import Button from '@/components/ui/Button';
import FuturisticCard from '@/components/ui/FuturisticCard';
import AIChat from '@/components/ai-chat/AIChat';
import { useChatContext } from '@/contexts/ChatContext';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import { mockAIRecommendations } from '@/data/aiMockData';
import { cn } from '@/utils';

const AnalyticsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('crm-overview');
  const { toggleChat, state: chatState } = useChatContext();
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const analyticsCategories = [
    {
      id: 'crm-overview',
      name: 'CRM Overview',
      icon: Activity,
      description: 'Comprehensive CRM metrics',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'charts',
      name: 'Data Visualizations',
      icon: BarChart3,
      description: 'Interactive charts & graphs',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'predictions',
      name: 'AI Predictions',
      icon: Brain,
      description: 'Future trends & forecasts',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'recommendations',
      name: 'Smart Actions',
      icon: Target,
      description: 'AI-powered suggestions',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'trends',
      name: 'Legacy Analytics',
      icon: TrendingUp,
      description: 'Traditional performance trends',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const handleCategoryChange = (categoryId: string) => {
    hapticFeedback.light();
    setActiveCategory(categoryId);
  };

  const handleOpenAIChat = () => {
    hapticFeedback.medium();
    toggleChat();
  };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'crm-overview':
        return <CRMAnalyticsDashboard />;
      case 'charts':
        return <CRMChartsPanel />;
      case 'predictions':
        return <PredictiveInsightsCard />;
      case 'recommendations':
        return <AIRecommendationsPanel recommendations={mockAIRecommendations} />;
      case 'trends':
        return <TrendAnalysisChart />;
      default:
        return <CRMAnalyticsDashboard />;
    }
  };

  return (
    <>
      <Head>
        <title>Analytics Hub - TripongoStays CRM</title>
        <meta name="description" content="AI-powered analytics and insights for your business performance" />
      </Head>

      <Layout hideNavigation>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
          {/* Top Navigation */}
          <motion.div
            className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <BarChart3 className="w-5 h-5" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900">Analytics Hub</h1>
                  <p className="text-sm text-neutral-600">AI-powered insights and predictive analytics</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium text-neutral-700">Live Analysis</span>
                </motion.div>

                <motion.div 
                  className="flex flex-col items-center gap-1"
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleOpenAIChat}
                    className={cn(
                      'px-6 py-3 rounded-xl transition-all duration-200',
                      'bg-gradient-to-r from-purple-500 to-pink-500',
                      'hover:from-purple-600 hover:to-pink-600',
                      'text-white shadow-lg relative overflow-hidden group',
                      chatState.isOpen && 'ring-4 ring-purple-500/30'
                    )}
                    haptic="medium"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10 flex items-center gap-2">
                      <motion.div
                        animate={chatState.isOpen ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </motion.div>
                      <span className="font-semibold">AI Assistant</span>
                    </div>
                    
                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute top-1 right-1 w-2 h-2"
                      animate={{ 
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: 1,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-2 h-2 text-white" />
                    </motion.div>
                  </Button>
                  
                  <motion.p 
                    className="text-xs text-neutral-500 font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Ask about your business
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="container mx-auto px-6 py-8">
            {/* Main Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                AI-Powered Business Intelligence
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Get intelligent insights, predictive analytics, and actionable recommendations 
                to optimize your business performance and make data-driven decisions.
              </p>
            </motion.div>

            {/* Category Navigation */}
            <motion.div
              className="flex items-center gap-4 mb-8 overflow-x-auto scrollbar-hide"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {analyticsCategories.map((category, index) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn(
                      'flex items-center gap-3 px-6 py-4 rounded-xl',
                      'text-sm font-medium transition-all duration-200',
                      'whitespace-nowrap relative overflow-hidden min-w-fit',
                      isActive ? [
                        'bg-gradient-to-r',
                        category.color,
                        'text-white shadow-lg'
                      ] : [
                        'text-neutral-700 hover:text-neutral-900',
                        'hover:bg-white/60 bg-white/40 border border-white/40'
                      ]
                    )}
                    whileHover={reducedMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-white/10 rounded-xl"
                        layoutId="categoryIndicator"
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    )}
                    
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    
                    <div className="relative z-10">
                      <div className="font-semibold">{category.name}</div>
                      <div className={cn(
                        'text-xs',
                        isActive ? 'text-white/80' : 'text-neutral-500'
                      )}>
                        {category.description}
                      </div>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCategoryContent()}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* AI Insights Footer */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FuturisticCard className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        AI Analysis Continuously Active
                      </p>
                      <p className="text-sm text-neutral-600">
                        Processing real-time data to provide you with the latest insights and recommendations
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                  >
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Monitoring</span>
                  </motion.div>
                </div>
              </FuturisticCard>
            </motion.div>
          </div>
        </div>

        {/* AI Chat Overlay */}
        <AIChat />
      </Layout>
    </>
  );
};

export default AnalyticsPage;
