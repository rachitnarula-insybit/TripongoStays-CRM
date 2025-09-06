import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Users, Calendar, DollarSign, Sparkles, Brain } from 'lucide-react';
import { dashboardApi, leadsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import StatsCards from '@/components/dashboard/StatsCards';
import LeadConversionFunnel from '@/components/dashboard/LeadConversionFunnel';
import CityDemandChart from '@/components/dashboard/CityDemandChart';
import NotContactedLeads from '@/components/dashboard/NotContactedLeads';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import AIFloatingIndicator from '@/components/dashboard/AIFloatingIndicator';
import AIBackgroundAnimation from '@/components/dashboard/AIBackgroundAnimation';
import { AnalyticsLauncher } from '@/components/analytics';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';
import { cn } from '@/utils';
import { mockAIAlerts, mockAIRecommendations, getHighPriorityItems } from '@/data/aiMockData';

const DashboardPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);
  
  // Get high priority AI items
  const highPriorityItems = getHighPriorityItems();
  const visibleAlerts = mockAIAlerts;
  const visibleRecommendations = mockAIRecommendations.filter(rec => !dismissedRecommendations.includes(rec.id));

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  const {
    data: conversionData,
    isLoading: conversionLoading,
    refetch: refetchConversion,
  } = useQuery({
    queryKey: ['lead-conversion'],
    queryFn: dashboardApi.getLeadConversion,
  });

  const {
    data: cityDemandData,
    isLoading: cityDemandLoading,
    refetch: refetchCityDemand,
  } = useQuery({
    queryKey: ['city-demand'],
    queryFn: dashboardApi.getCityDemand,
  });

  const {
    data: leadsData,
    isLoading: leadsLoading,
    refetch: refetchLeads,
  } = useQuery({
    queryKey: ['leads', 1, 20],
    queryFn: () => leadsApi.getLeads(1, 20),
  });

  const handleRefresh = async () => {
    await Promise.all([
      refetchStats(),
      refetchConversion(),
      refetchCityDemand(),
      refetchLeads(),
    ]);
  };

  const isRefreshing = statsLoading || conversionLoading || cityDemandLoading || leadsLoading;


  const handleRecommendationAction = (recommendationId: string, actionType: 'primary' | 'secondary') => {
    console.log('Recommendation action:', recommendationId, actionType);
    // TODO: Implement recommendation action handlers
  };

  const handleRecommendationDismiss = (recommendationId: string) => {
    setDismissedRecommendations(prev => [...prev, recommendationId]);
  };

  return (
    <motion.div 
      className="relative space-y-8"
      variants={motionVariants.page}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* AI Background Animation */}
      <AIBackgroundAnimation />
      {/* Header Section */}
      <motion.div 
        className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="space-y-2"
          variants={motionVariants.staggerChild}
        >
          <div className="flex items-center gap-3">
            <h1 className={cn(
              'text-3xl font-bold text-neutral-900',
              'tracking-tight leading-none',
              'text-balance'
            )}>
              AI-Powered Dashboard
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-futuristic-neon/10 to-brand-primary-100 rounded-full border border-futuristic-neon/20">
              <Brain className="h-4 w-4 text-futuristic-neon" />
              <span className="text-sm font-medium text-brand-primary-700">AI Active</span>
              <div className="w-2 h-2 bg-futuristic-neon rounded-full animate-pulse" />
            </div>
          </div>
          <motion.p 
            className="text-lg text-neutral-600 text-pretty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: reducedMotion ? 0.1 : 0.3,
              delay: reducedMotion ? 0 : 0.1
            }}
          >
            Your intelligent business companion is analyzing data and providing insights.
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={motionVariants.staggerChild}
        >
          <Button
            variant="secondary"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="h-4 w-4" />}
            className="shadow-sm hover:shadow-md"
            haptic="light"
          >
            Refresh Data
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards Section */}
      <motion.div
        variants={motionVariants.staggerChild}
      >
        <StatsCards 
          stats={statsData?.data || {
            totalBookings: 0,
            totalProperties: 0,
            totalLeads: 0,
            revenue: 0,
            revenueGrowth: 0,
            bookingsGrowth: 0,
            leadsGrowth: 0,
            propertiesGrowth: 0,
          }} 
          isLoading={statsLoading} 
        />
      </motion.div>

      {/* AI Insights & Alerts Section - Header Only */}
      <motion.div
        variants={motionVariants.staggerChild}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-futuristic-electric" />
          <h2 className="text-lg font-semibold text-neutral-900">AI Insights & Alerts</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-futuristic-electric/30 via-futuristic-neon/20 to-transparent" />
        </div>
       
      </motion.div>

      {/* Main Content Section */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Left Column - Lead Funnel */}
        <motion.div
          variants={motionVariants.staggerChild}
        >
          <LeadConversionFunnel 
            data={conversionData?.data || []} 
            isLoading={conversionLoading} 
          />
        </motion.div>
        
        {/* Right Column - AI Recommendations */}
        <motion.div
          variants={motionVariants.staggerChild}
        >
          {visibleRecommendations.length > 0 && (
            <AIRecommendations
              recommendations={visibleRecommendations.slice(0, 4)}
              onActionClick={handleRecommendationAction}
              onDismiss={handleRecommendationDismiss}
            />
          )}
        </motion.div>
      </motion.div>

      {/* City Demand Chart - Full Width Below */}
      <motion.div
        variants={motionVariants.staggerChild}
      >
        <CityDemandChart 
          data={cityDemandData?.data || []} 
          isLoading={cityDemandLoading} 
        />
      </motion.div>

      {/* Quick Insights Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={motionVariants.staggerChild}>
          <Card 
            variant="glass" 
            hover 
            className="h-full"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-light rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success-default" />
                </div>
                <div>
                  <CardTitle size="sm">Growth Trend</CardTitle>
                  <CardDescription>This month vs last month</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Revenue</span>
                  <span className="text-sm font-semibold text-success-default">
                    +{statsData?.data?.revenueGrowth || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Bookings</span>
                  <span className="text-sm font-semibold text-success-default">
                    +{statsData?.data?.bookingsGrowth || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Leads</span>
                  <span className="text-sm font-semibold text-success-default">
                    +{statsData?.data?.leadsGrowth || 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={motionVariants.staggerChild}>
          <Card 
            variant="glass" 
            hover 
            className="h-full"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-gradient-to-br from-futuristic-neon/20 to-brand-primary-200 rounded-lg shadow-sm">
                   <Users className="h-5 w-5 text-brand-primary-700" />
                 </div>
                <div>
                  <CardTitle size="sm">Active Users</CardTitle>
                  <CardDescription>Currently online</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900 mb-2">
                24
              </div>
              <div className="text-sm text-neutral-600">
                8 team members, 16 customers
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={motionVariants.staggerChild}>
          <Card 
            variant="glass" 
            hover 
            className="h-full"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning-light rounded-lg">
                  <Calendar className="h-5 w-5 text-warning-default" />
                </div>
                <div>
                  <CardTitle size="sm">Upcoming</CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-lg font-semibold text-neutral-900">
                  12 Check-ins
                </div>
                <div className="text-lg font-semibold text-neutral-900">
                  8 Check-outs
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Not Contacted Leads Section */}
      <motion.div
        variants={motionVariants.staggerChild}
      >
        <NotContactedLeads 
          leads={leadsData?.data || []} 
          isLoading={leadsLoading} 
        />
      </motion.div>

      {/* AI Floating Indicator */}
      <AIFloatingIndicator />

      {/* Floating Analytics Launcher */}
      <AnalyticsLauncher variant="fab" />
    </motion.div>
  );
};

export default DashboardPage;