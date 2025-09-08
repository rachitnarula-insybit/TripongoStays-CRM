import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Share2,
  Download,
  Bell
} from 'lucide-react';
import { profileApi } from '@/services/api';
import Button from '@/components/ui/Button';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EngagementSummary from '@/components/profile/EngagementSummary';
import ActivityTimeline from '@/components/profile/ActivityTimeline';
import ProfileTabs from '@/components/profile/ProfileTabs';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { identifier, type = 'id' } = router.query;
  const [activeView, setActiveView] = useState<'summary' | 'detailed'>('summary');

  const {
    data: profileResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', identifier, type],
    queryFn: () => profileApi.getProfile(
      String(identifier), 
      type as 'phone' | 'email' | 'id'
    ),
    enabled: !!identifier,
    retry: 2,
  });

  const profile = profileResponse?.data;

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    // TODO: Open edit modal or navigate to edit page
    console.log('Edit profile:', profile?.id);
  };

  const handleShare = () => {
    if (profile) {
      const url = `${window.location.origin}/profile/${profile.id}`;
      if (navigator.share) {
        navigator.share({
          title: `${profile.name} - Profile`,
          text: `View ${profile.name}'s profile on TripongoStays CRM`,
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        // TODO: Show toast notification
      }
    }
  };

  const handleExport = () => {
    if (profile) {
      // TODO: Implement profile data export
      console.log('Export profile:', profile.id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                Loading Profile
              </div>
              <div className="text-gray-500">
                Gathering information from all sources...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profileResponse?.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with back button */}
          <div className="mb-8">
            <Button
              variant="tertiary"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="mb-4"
            >
              Back
            </Button>
          </div>

          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                Profile Not Found
              </div>
              <div className="text-gray-500 mb-6">
                {profileResponse?.message || 'The requested profile could not be found or loaded.'}
              </div>
              <div className="flex justify-center gap-3">
                <Button onClick={handleBack} variant="tertiary">
                  Go Back
                </Button>
                <Button onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="tertiary"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveView('summary')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'summary'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Summary View
              </button>
              <button
                onClick={() => setActiveView('detailed')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'detailed'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Detailed View
              </button>
            </div>

            {/* Action Buttons */}
            <Button
              variant="tertiary"
              onClick={handleShare}
              leftIcon={<Share2 className="h-4 w-4" />}
              size="sm"
            >
              Share
            </Button>
            
            <Button
              variant="tertiary"
              onClick={handleExport}
              leftIcon={<Download className="h-4 w-4" />}
              size="sm"
            >
              Export
            </Button>

            <Button
              variant="tertiary"
              leftIcon={<Bell className="h-4 w-4" />}
              size="sm"
            >
              Follow
            </Button>

            <Button onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />} size="sm">
              Refresh
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        {profile && (
          <div className="space-y-8">
            {/* Profile Header */}
            <ProfileHeader profile={profile} onEdit={handleEdit} />

            {/* Content based on view */}
            {activeView === 'summary' ? (
              /* Summary View - Compact overview */
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Engagement & Timeline */}
                <div className="xl:col-span-2 space-y-8">
                  <EngagementSummary profile={profile} />
                  <ActivityTimeline profile={profile} />
                </div>

                {/* Right Column - Quick Info */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Engagement Level</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">High</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="text-sm font-medium">
                          {profile.engagementSummary.totalCalls > 0 
                            ? Math.round((profile.engagementSummary.callsConnected / profile.engagementSummary.totalCalls) * 100)
                            : 0}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Call Duration</span>
                        <span className="text-sm font-medium font-mono">
                          {profile.engagementSummary.callsConnected > 0
                            ? `${Math.floor(profile.engagementSummary.totalCallDuration / profile.engagementSummary.callsConnected / 60)}m`
                            : '0m'
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="text-sm font-medium">
                          {profile.engagementSummary.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags & Notes */}
                  {(profile.tags.length > 0 || profile.notes.length > 0) && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tags & Notes
                      </h3>
                      
                      {profile.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-600 mb-2">Tags</div>
                          <div className="flex flex-wrap gap-2">
                            {profile.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {profile.notes.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-2">Latest Note</div>
                          <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                            {profile.notes[0]}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Detailed View - Full information with tabs */
              <div className="space-y-8">
                <EngagementSummary profile={profile} />
                <ProfileTabs profile={profile} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
