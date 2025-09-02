import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  MessageCircle,
  Edit3,
  MoreHorizontal,
  User,
  Building2
} from 'lucide-react';
import { UserProfile } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, formatDuration, formatCurrency, initiateCall, openWhatsApp } from '@/utils';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onEdit }) => {
  const getStatusColor = (status: UserProfile['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Converted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceColor = (source: UserProfile['source']) => {
    switch (source) {
      case 'Lead': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Call History': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Booking': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Contact': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCall = () => {
    if (profile.phone) {
      initiateCall(profile.phone);
    }
  };

  const handleWhatsApp = () => {
    if (profile.phone) {
      const message = `Hi ${profile.name}, I'm reaching out from TripongoStays. How can I assist you today?`;
      openWhatsApp(profile.phone, message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Background */}
      <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-100 relative">
        <div className="absolute inset-0 bg-white/20"></div>
      </div>

      {/* Profile Content */}
      <div className="px-8 pb-8 -mt-16 relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Section - Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-4 border-white">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {getInitials(profile.name)}
                  </span>
                )}
              </div>
              
              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(profile.status)}`}>
                  {profile.status}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                
                {/* Source & Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className={`border ${getSourceColor(profile.source)}`} size="md">
                    {profile.source}
                  </Badge>
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {profile.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-sm">{profile.phone}</span>
                  </div>
                )}
                
                {profile.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                )}
                
                {profile.organization && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profile.organization}</span>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Customer since {formatDate(profile.createdDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions & Quick Stats */}
          <div className="flex flex-col gap-4 lg:items-end">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {profile.phone && (
                <Button
                  onClick={handleCall}
                  leftIcon={<Phone className="h-4 w-4" />}
                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                  size="sm"
                >
                  Call
                </Button>
              )}
              
              {profile.phone && (
                <Button
                  onClick={handleWhatsApp}
                  leftIcon={<MessageCircle className="h-4 w-4" />}
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                  size="sm"
                >
                  WhatsApp
                </Button>
              )}
              
              {onEdit && (
                <Button
                  onClick={onEdit}
                  leftIcon={<Edit3 className="h-4 w-4" />}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
              )}
              
              <Button
                leftIcon={<MoreHorizontal className="h-4 w-4" />}
                variant="outline"
                size="sm"
              >
                More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:min-w-[200px]">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profile.engagementSummary.totalCalls}
                </div>
                <div className="text-sm text-gray-500">Total Calls</div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(profile.engagementSummary.totalRevenue)}
                </div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Interaction */}
        {profile.lastInteraction && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">
                Last interaction: {formatDate(profile.lastInteraction)}
              </span>
            </div>
          </div>
        )}

        {/* Notes Preview */}
        {profile.notes.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="text-sm text-yellow-800">
              <span className="font-medium">Latest Note: </span>
              {profile.notes[0].length > 100 
                ? `${profile.notes[0].substring(0, 100)}...` 
                : profile.notes[0]
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

