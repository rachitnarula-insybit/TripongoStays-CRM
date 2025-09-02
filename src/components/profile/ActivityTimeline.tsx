import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Calendar,
  MessageCircle,
  Mail,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react';
import { UserProfile, ProfileActivity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, formatDateTime, formatDuration } from '@/utils';

interface ActivityTimelineProps {
  profile: UserProfile;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ profile }) => {
  const [filter, setFilter] = useState<'all' | 'call' | 'booking' | 'note'>('all');
  const [showAll, setShowAll] = useState(false);

  const getActivityIcon = (type: ProfileActivity['type']) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'booking':
        return Calendar;
      case 'note':
        return Edit3;
      case 'email':
        return Mail;
      case 'whatsapp':
        return MessageCircle;
      case 'status_change':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (activity: ProfileActivity) => {
    if (activity.color) return activity.color;
    
    switch (activity.type) {
      case 'call':
        return '#3B82F6';
      case 'booking':
        return '#10B981';
      case 'note':
        return '#F59E0B';
      case 'email':
        return '#8B5CF6';
      case 'whatsapp':
        return '#25D366';
      case 'status_change':
        return '#6366F1';
      default:
        return '#6B7280';
    }
  };

  const filteredActivities = profile.activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 10);

  const filterOptions = [
    { value: 'all', label: 'All Activities', count: profile.activities.length },
    { value: 'call', label: 'Calls', count: profile.activities.filter(a => a.type === 'call').length },
    { value: 'booking', label: 'Bookings', count: profile.activities.filter(a => a.type === 'booking').length },
    { value: 'note', label: 'Notes', count: profile.activities.filter(a => a.type === 'note').length },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-700" />
            Activity Timeline
          </CardTitle>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(option.value as any)}
                className={`text-xs ${
                  filter === option.value 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
                {option.count > 0 && (
                  <Badge variant="default" size="sm" className="ml-1 bg-white/20 text-current">
                    {option.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {displayedActivities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">No activities found</div>
            <div className="text-gray-500">
              {filter === 'all' 
                ? "This profile doesn't have any recorded activities yet."
                : `No ${filter} activities found for this profile.`
              }
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Activities */}
              <div className="space-y-6">
                {displayedActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const color = getActivityColor(activity);
                  const isLast = index === displayedActivities.length - 1;
                  
                  return (
                    <div key={activity.id} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <div 
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                {activity.title}
                              </h4>
                              {activity.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {activity.description}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0 ml-4">
                              <div className="text-xs text-gray-500">
                                {formatDateTime(activity.date)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              {activity.type === 'call' && activity.metadata.callRecord && (
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Duration: {formatDuration(activity.metadata.callRecord.duration)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {activity.metadata.callRecord.phoneNumber}
                                  </span>
                                </div>
                              )}
                              
                              {activity.type === 'booking' && activity.metadata.booking && (
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {activity.metadata.booking.nights} nights
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Badge variant="success" size="sm">
                                      ₹{activity.metadata.booking.totalAmount?.toLocaleString()}
                                    </Badge>
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Load More */}
            {filteredActivities.length > 10 && !showAll && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(true)}
                  leftIcon={<ChevronDown className="h-4 w-4" />}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Show {filteredActivities.length - 10} more activities
                </Button>
              </div>
            )}

            {/* Show Less */}
            {showAll && filteredActivities.length > 10 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Show less
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;

