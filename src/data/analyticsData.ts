// Analytics Demo Data
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit?: string;
  format?: 'currency' | 'percentage' | 'number';
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  confidence: number;
  impact: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalyticsTrend {
  period: string;
  revenue: number;
  leads: number;
  conversions: number;
  satisfaction: number;
  bookings: number;
  occupancy: number;
}

// Mock Analytics Data
export const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: 'total-revenue',
    name: 'Total Revenue',
    value: 2840000,
    previousValue: 2650000,
    change: 7.2,
    trend: 'up',
    format: 'currency',
  },
  {
    id: 'lead-conversion',
    name: 'Lead Conversion Rate',
    value: 23.8,
    previousValue: 21.2,
    change: 12.3,
    trend: 'up',
    unit: '%',
    format: 'percentage',
  },
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    value: 4.7,
    previousValue: 4.5,
    change: 4.4,
    trend: 'up',
    unit: '/5',
    format: 'number',
  },
  {
    id: 'response-time',
    name: 'Avg Response Time',
    value: 4.2,
    previousValue: 6.1,
    change: -31.1,
    trend: 'up', // Negative change is good for response time
    unit: 'hrs',
    format: 'number',
  },
];

export const analyticsInsights: AnalyticsInsight[] = [
  {
    id: 'revenue-forecast',
    title: 'Q4 Revenue Growth Opportunity',
    description: 'AI analysis shows potential for 23% revenue increase based on current booking patterns and market trends.',
    type: 'opportunity',
    confidence: 87,
    impact: '₹18.5L potential increase',
    actionable: true,
    priority: 'high',
  },
  {
    id: 'lead-optimization',
    title: 'Lead Response Time Alert',
    description: 'Response time to qualified leads has increased by 47%. This may impact conversion rates.',
    type: 'warning',
    confidence: 92,
    impact: 'Potential 12-15% decrease in conversions',
    actionable: true,
    priority: 'high',
  },
  {
    id: 'market-demand',
    title: 'Mumbai Market Surge Detected',
    description: 'Unusual increase in premium property demand in Mumbai. Consider dynamic pricing adjustments.',
    type: 'success',
    confidence: 78,
    impact: 'Potential revenue boost of ₹2.3L',
    actionable: false,
    priority: 'medium',
  },
  {
    id: 'seasonal-pattern',
    title: 'Early Winter Booking Pattern',
    description: 'Historical analysis shows 28% increase in early winter bookings compared to last year.',
    type: 'info',
    confidence: 85,
    impact: 'Inventory optimization opportunity',
    actionable: false,
    priority: 'low',
  },
];

export const analyticsTrends: AnalyticsTrend[] = [
  { 
    period: 'Jan', 
    revenue: 2200000, 
    leads: 120, 
    conversions: 23, 
    satisfaction: 4.2, 
    bookings: 145, 
    occupancy: 78 
  },
  { 
    period: 'Feb', 
    revenue: 2350000, 
    leads: 135, 
    conversions: 25, 
    satisfaction: 4.3, 
    bookings: 162, 
    occupancy: 81 
  },
  { 
    period: 'Mar', 
    revenue: 2180000, 
    leads: 118, 
    conversions: 22, 
    satisfaction: 4.1, 
    bookings: 138, 
    occupancy: 76 
  },
  { 
    period: 'Apr', 
    revenue: 2420000, 
    leads: 142, 
    conversions: 28, 
    satisfaction: 4.4, 
    bookings: 178, 
    occupancy: 83 
  },
  { 
    period: 'May', 
    revenue: 2680000, 
    leads: 156, 
    conversions: 31, 
    satisfaction: 4.5, 
    bookings: 195, 
    occupancy: 86 
  },
  { 
    period: 'Jun', 
    revenue: 2840000, 
    leads: 147, 
    conversions: 35, 
    satisfaction: 4.7, 
    bookings: 203, 
    occupancy: 87 
  },
];

// Helper functions
export const getMetricsByTrend = (trend: 'up' | 'down' | 'stable') => {
  return analyticsMetrics.filter(metric => metric.trend === trend);
};

export const getInsightsByPriority = (priority: 'high' | 'medium' | 'low') => {
  return analyticsInsights.filter(insight => insight.priority === priority);
};

export const getInsightsByType = (type: 'opportunity' | 'warning' | 'success' | 'info') => {
  return analyticsInsights.filter(insight => insight.type === type);
};

export const calculateOverallPerformance = () => {
  const totalMetrics = analyticsMetrics.length;
  const improvingMetrics = getMetricsByTrend('up').length;
  const decliningMetrics = getMetricsByTrend('down').length;
  const stableMetrics = getMetricsByTrend('stable').length;
  
  const averageChange = analyticsMetrics.reduce((acc, metric) => acc + Math.abs(metric.change), 0) / totalMetrics;
  
  return {
    improving: improvingMetrics,
    declining: decliningMetrics,
    stable: stableMetrics,
    averageChange: Math.round(averageChange * 10) / 10,
    overallTrend: improvingMetrics > decliningMetrics ? 'positive' : improvingMetrics === decliningMetrics ? 'neutral' : 'negative'
  };
};

// Simulate real-time data updates
export const generateRandomMetricUpdate = (): Partial<AnalyticsMetric> => {
  const changePercent = (Math.random() - 0.5) * 10; // -5% to +5% change
  return {
    change: Math.round(changePercent * 10) / 10,
    trend: changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'stable'
  };
};

export const getLatestTrendData = () => {
  return analyticsTrends[analyticsTrends.length - 1];
};

export const getPreviousTrendData = () => {
  return analyticsTrends[analyticsTrends.length - 2];
};

export const calculateTrendGrowth = (current: AnalyticsTrend, previous: AnalyticsTrend) => {
  return {
    revenue: ((current.revenue - previous.revenue) / previous.revenue) * 100,
    leads: ((current.leads - previous.leads) / previous.leads) * 100,
    conversions: ((current.conversions - previous.conversions) / previous.conversions) * 100,
    satisfaction: ((current.satisfaction - previous.satisfaction) / previous.satisfaction) * 100,
    bookings: ((current.bookings - previous.bookings) / previous.bookings) * 100,
    occupancy: ((current.occupancy - previous.occupancy) / previous.occupancy) * 100,
  };
};


