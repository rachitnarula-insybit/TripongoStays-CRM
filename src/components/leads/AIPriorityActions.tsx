import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  AlertCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface PriorityAction {
  id: string;
  type: 'call' | 'followup' | 'urgent' | 'opportunity';
  title: string;
  description: string;
  leadName: string;
  leadId: string;
  priority: 'High' | 'Medium' | 'Low';
  expectedRevenue?: number;
  timeframe: string;
  confidence: number; // AI confidence score 0-100
}

const mockPriorityActions: PriorityAction[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Hot Lead Requires Immediate Attention',
    description: 'Lead has shown high engagement and is ready to book',
    leadName: 'Sunita Verma',
    leadId: '2',
    priority: 'High',
    expectedRevenue: 35000,
    timeframe: 'Next 2 hours',
    confidence: 92
  },
  {
    id: '2',
    type: 'followup',
    title: 'Follow-up Scheduled Lead',
    description: 'Perfect timing for follow-up based on previous interaction',
    leadName: 'Rajesh Khanna',
    leadId: '3',
    priority: 'Medium',
    expectedRevenue: 18000,
    timeframe: 'Today',
    confidence: 78
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'High-Value Opportunity',
    description: 'New lead with premium property interest',
    leadName: 'Amit Gupta',
    leadId: '1',
    priority: 'High',
    expectedRevenue: 25000,
    timeframe: 'Next 4 hours',
    confidence: 85
  },
  {
    id: '4',
    type: 'call',
    title: 'Callback Window Open',
    description: 'Lead is most likely to answer calls now',
    leadName: 'Meera Joshi',
    leadId: '4',
    priority: 'Medium',
    expectedRevenue: 42000,
    timeframe: 'Next 30 minutes',
    confidence: 73
  }
];

const AIPriorityActions: React.FC = () => {
  const getActionIcon = (type: PriorityAction['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'followup':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'opportunity':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'call':
        return <Phone className="h-4 w-4 text-purple-500" />;
      default:
        return <Zap className="h-4 w-4 text-orange-500" />;
    }
  };

  const getActionColor = (type: PriorityAction['type']) => {
    switch (type) {
      case 'urgent':
        return 'from-red-500 to-red-600';
      case 'followup':
        return 'from-blue-500 to-blue-600';
      case 'opportunity':
        return 'from-green-500 to-green-600';
      case 'call':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };

  const getPriorityColor = (priority: PriorityAction['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // const _handleActionClick = (action: PriorityAction) => {
  //   // Handle different action types
  //   console.log('Action clicked:', action);
  // };

  const handleCallLead = (leadId: string) => {
    console.log('Calling lead:', leadId);
  };

  const handleWhatsAppLead = (leadId: string) => {
    console.log('WhatsApp lead:', leadId);
  };

  const handleScheduleCallback = (leadId: string) => {
    console.log('Schedule callback:', leadId);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <CardContent className="p-0">
        {/* Header */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">AI Priority Actions</h2>
                <p className="text-blue-100 text-xs">Smart recommendations for maximum conversion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-0.5 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-white text-xs font-medium">Live Updates</span>
              </div>
              <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 divide-x divide-gray-200 bg-white/60 backdrop-blur-sm">
          <div className="px-3 py-2 text-center">
            <div className="text-lg font-bold text-blue-600">4</div>
            <div className="text-xs text-gray-600">Priority Actions</div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="text-lg font-bold text-green-600">₹1.2L</div>
            <div className="text-xs text-gray-600">Potential Revenue</div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="text-lg font-bold text-orange-600">82%</div>
            <div className="text-xs text-gray-600">Avg Confidence</div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="text-lg font-bold text-purple-600">2hrs</div>
            <div className="text-xs text-gray-600">Response Time</div>
          </div>
        </div>

        {/* Actions List */}
        <div className="p-4 space-y-3">
          {mockPriorityActions.map((action) => (
            <div
              key={action.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Priority Indicator */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getActionColor(action.type)}`}></div>
              
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1.5">
                      {getActionIcon(action.type)}
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <Badge className={getPriorityColor(action.priority)} size="sm">
                          {action.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-2">{action.description}</p>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{action.leadName}</span>
                      {action.expectedRevenue && (
                        <span className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          ₹{(action.expectedRevenue / 1000).toFixed(0)}K
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {action.timeframe}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1.5 ml-3">
                    {/* AI Confidence */}
                    <div className="flex items-center space-x-1 text-xs">
                      <Brain className="h-2.5 w-2.5 text-purple-500" />
                      <span className="text-purple-600 font-medium">{action.confidence}%</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleCallLead(action.leadId)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Phone className="h-2.5 w-2.5" />
                      </Button>
                      <Button
                        size="xs"
                        variant="success"
                        onClick={() => handleWhatsAppLead(action.leadId)}
                        className="p-1.5"
                      >
                        <MessageCircle className="h-2.5 w-2.5" />
                      </Button>
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleScheduleCallback(action.leadId)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Calendar className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar for Confidence */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-0.5">
                    <span>AI Confidence</span>
                    <span>{action.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full bg-gradient-to-r ${getActionColor(action.type)} transition-all duration-500`}
                      style={{ width: `${action.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Powered by AI • Updated every 5 minutes</span>
            </div>
            <Button
              variant="secondary"
              size="xs"
              rightIcon={<ArrowRight className="h-2.5 w-2.5" />}
              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
            >
              View All Insights
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPriorityActions;
