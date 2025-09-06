import { AIAlertData } from '@/components/dashboard/AIAlert';
import { AIRecommendation } from '@/components/dashboard/AIRecommendations';

export const mockAIAlerts: AIAlertData[] = [
  {
    id: 'lead-response-anomaly',
    type: 'warning',
    title: 'Lead Response Time Anomaly',
    description: 'Response time to qualified leads increased by 47% this week. This may impact conversion rates.',
    impact: 'Potential 12-15% decrease in lead conversion if trend continues',
    confidence: 87,
    actionRequired: true,
    trend: 'up',
    metric: 'Avg Response Time',
    change: 47,
    timeframe: 'this week'
  },
  {
    id: 'booking-surge-opportunity',
    type: 'success',
    title: 'Booking Surge Opportunity',
    description: 'AI detected increased demand for premium properties in Mumbai. Consider dynamic pricing adjustments.',
    impact: 'Potential revenue increase of ₹2.3L this month',
    confidence: 92,
    actionRequired: false,
    trend: 'up',
    metric: 'Demand Index',
    change: 34,
    timeframe: 'last 3 days'
  },
  {
    id: 'customer-churn-risk',
    type: 'critical',
    title: 'High-Value Customer Churn Risk',
    description: 'AI identified 8 high-value customers showing early churn indicators based on engagement patterns.',
    impact: 'Risk of losing ₹4.2L in annual recurring revenue',
    confidence: 78,
    actionRequired: true,
    trend: 'down',
    metric: 'Engagement Score',
    change: -23,
    timeframe: 'last 2 weeks'
  },
  {
    id: 'seasonal-trend-alert',
    type: 'info',
    title: 'Seasonal Booking Pattern Shift',
    description: 'Historical data analysis shows unusual early booking patterns for winter season properties.',
    impact: 'Opportunity to optimize inventory allocation',
    confidence: 85,
    actionRequired: false,
    trend: 'up',
    metric: 'Early Bookings',
    change: 28,
    timeframe: 'vs last year'
  }
];

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: 'follow-up-hot-leads',
    type: 'lead_nurturing',
    title: 'Follow up with 5 hot leads',
    description: 'These leads showed strong interest but haven\'t been contacted in 48h',
    priority: 'high',
    impact: '$45,000 potential',
    effort: 'low',
    estimatedROI: '$45,000',
    timeToImplement: 'immediate',
    confidence: 92,
    actions: {
      primary: {
        label: 'Take Action',
        action: 'follow_up_hot_leads'
      }
    }
  },
  {
    id: 'review-linkedin-campaign',
    type: 'efficiency',
    title: 'Review LinkedIn campaign performance',
    description: 'AI detected unusual patterns in engagement metrics',
    priority: 'medium',
    impact: '15% CTR boost potential',
    effort: 'low',
    estimatedROI: '15% improvement',
    timeToImplement: '1 hour',
    confidence: 85,
    actions: {
      primary: {
        label: 'Take Action',
        action: 'review_linkedin_campaign'
      }
    }
  },
  {
    id: 'schedule-enterprise-demos',
    type: 'revenue_growth',
    title: 'Schedule demo with Enterprise prospects',
    description: '3 enterprise leads ready for product demonstration',
    priority: 'high',
    impact: '$120,000 potential',
    effort: 'low',
    estimatedROI: '$120,000',
    timeToImplement: 'this week',
    confidence: 88,
    actions: {
      primary: {
        label: 'Take Action',
        action: 'schedule_enterprise_demos'
      }
    }
  },
  {
    id: 'optimize-pricing-strategy',
    type: 'revenue_growth',
    title: 'Optimize pricing for Q4',
    description: 'Market analysis suggests 12% pricing adjustment opportunity',
    priority: 'medium',
    impact: '12% revenue increase',
    effort: 'medium',
    estimatedROI: '$85,000',
    timeToImplement: '2 weeks',
    confidence: 79,
    actions: {
      primary: {
        label: 'Take Action',
        action: 'optimize_pricing'
      }
    }
  }
];

// Helper function to get alerts by priority
export const getAlertsByType = (type: AIAlertData['type']) => {
  return mockAIAlerts.filter(alert => alert.type === type);
};

// Helper function to get recommendations by priority
export const getRecommendationsByPriority = (priority: AIRecommendation['priority']) => {
  return mockAIRecommendations.filter(rec => rec.priority === priority);
};

// Helper function to get high-priority items
export const getHighPriorityItems = () => {
  return {
    alerts: mockAIAlerts.filter(alert => alert.actionRequired),
    recommendations: mockAIRecommendations.filter(rec => rec.priority === 'high')
  };
};

// Simulate real-time updates
export const getRandomAlert = (): AIAlertData => {
  const alerts: AIAlertData[] = [
    {
      id: `alert-${Date.now()}`,
      type: 'info',
      title: 'New Market Opportunity Detected',
      description: 'AI analysis shows emerging demand in Pune market segment.',
      confidence: Math.floor(Math.random() * 20) + 75,
      actionRequired: false,
      trend: 'up',
      metric: 'Market Interest',
      change: Math.floor(Math.random() * 30) + 10
    },
    {
      id: `alert-${Date.now()}`,
      type: 'warning',
      title: 'Inventory Utilization Alert',
      description: 'Some premium properties have low booking rates this month.',
      confidence: Math.floor(Math.random() * 15) + 80,
      actionRequired: true,
      trend: 'down',
      metric: 'Utilization Rate',
      change: -(Math.floor(Math.random() * 20) + 5)
    }
  ];
  
  return alerts[Math.floor(Math.random() * alerts.length)];
};
