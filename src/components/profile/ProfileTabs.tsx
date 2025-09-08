import React, { useState } from 'react';
import {
  User,
  Phone,
  Calendar,
  FileText,
  Activity
} from 'lucide-react';
import { UserProfile } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { formatDate, formatDateTime, formatDuration, formatCurrency } from '@/utils';

interface ProfileTabsProps {
  profile: UserProfile;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: User,
      count: null,
    },
    {
      id: 'calls',
      label: 'Call History',
      icon: Phone,
      count: profile.callHistory.length,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      count: profile.bookings.length,
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      count: profile.notes.length,
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: Activity,
      count: profile.activities.length,
    },
  ];

  const callColumns = [
    {
      key: 'date',
      label: 'Date & Time',
      sortable: true,
      render: (value: string | number | undefined) => (
        <div>
          <div className="font-medium text-gray-900">{formatDate(String(value))}</div>
          <div className="text-sm text-gray-500">{formatDateTime(String(value)).split(' ')[1]}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string | number | undefined) => (
        <Badge variant={value === 'Incoming' ? 'info' : 'success'} size="sm">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string | number | undefined) => {
        const color = value === 'Connected' ? 'success' : 'error';
        return (
          <Badge variant={color} size="sm">
            {String(value)}
          </Badge>
        );
      },
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value: string | number | undefined) => (
        <span className="font-mono text-sm">{formatDuration(Number(value))}</span>
      ),
    },
    {
      key: 'result',
      label: 'Result',
      render: (value: string | number | undefined) => (
        <span className="text-sm text-gray-600">{String(value)}</span>
      ),
    },
  ];

  const bookingColumns = [
    {
      key: 'bookingReference',
      label: 'Reference',
      render: (value: string | number | undefined) => (
        <span className="font-mono text-sm font-medium">{String(value)}</span>
      ),
    },
    {
      key: 'propertyName',
      label: 'Property',
      render: (value: string | number | undefined) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: 'checkInDate',
      label: 'Check-in',
      render: (value: string | number | undefined) => formatDate(String(value)),
    },
    {
      key: 'nights',
      label: 'Nights',
      render: (value: string | number | undefined) => `${value} nights`,
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value: string | number | undefined) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(Number(value))}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string | number | undefined) => {
        const color = value === 'Confirmed' ? 'success' :
                    value === 'Pending' ? 'warning' : 'error';
        return (
          <Badge variant={color} size="sm">
            {String(value)}
          </Badge>
        );
      },
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-mono text-sm">{profile.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-sm">{profile.email || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <Badge variant="info" size="sm">{profile.source}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge 
                        variant={profile.status === 'Active' ? 'success' : 
                                profile.status === 'Converted' ? 'info' : 'error'} 
                        size="sm"
                      >
                        {profile.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Calls:</span>
                      <span className="font-semibold">{profile.engagementSummary.totalCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connected Calls:</span>
                      <span className="font-semibold text-green-600">
                        {profile.engagementSummary.callsConnected}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookings:</span>
                      <span className="font-semibold">{profile.engagementSummary.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(profile.engagementSummary.totalRevenue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            {profile.tags.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map((tag, index) => (
                      <Badge key={index} variant="default" size="md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity Summary */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                {profile.activities.length > 0 ? (
                  <div className="space-y-3">
                    {profile.activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: activity.color || '#6B7280' }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </div>
                          {activity.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {activity.description}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDateTime(activity.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent activity
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'calls':
        return (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {profile.callHistory.length > 0 ? (
                <Table
                  data={profile.callHistory}
                  columns={callColumns}
                  emptyMessage="No call history found"
                />
              ) : (
                <div className="text-center py-12">
                  <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">No calls yet</div>
                  <div className="text-gray-500">Call history will appear here once calls are made.</div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'bookings':
        return (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {profile.bookings.length > 0 ? (
                <Table
                  data={profile.bookings}
                  columns={bookingColumns}
                  emptyMessage="No bookings found"
                />
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">No bookings yet</div>
                  <div className="text-gray-500">Booking history will appear here once bookings are made.</div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'notes':
        return (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              {profile.notes.length > 0 ? (
                <div className="space-y-4">
                  {profile.notes.map((note, index) => (
                    <div key={index} className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <div className="text-sm text-gray-900">{note}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">No notes yet</div>
                  <div className="text-gray-500">Notes and comments will appear here.</div>
                  <Button className="mt-4" size="sm">
                    Add Note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'activity':
        return (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              {profile.activities.length > 0 ? (
                <div className="space-y-4">
                  {profile.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: activity.color || '#6B7280' }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {activity.title}
                        </div>
                        {activity.description && (
                          <div className="text-sm text-gray-600 mb-2">
                            {activity.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {formatDateTime(activity.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">No activity yet</div>
                  <div className="text-gray-500">User activity will appear here.</div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <Badge variant="default" size="sm" className="ml-1">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfileTabs;

