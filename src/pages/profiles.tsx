import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Users, 
  Eye, 
  Phone, 
  MessageCircle,
  Download,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { profileApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { UserProfile, TableColumn, ProfileFilters } from '@/types';
import { 
  formatDate, 
  formatCurrency, 
  debounce, 
  getStatusColor,
  initiateCall,
  openWhatsApp
} from '@/utils';

const ProfilesPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('lastInteraction');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<ProfileFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const limit = 12;

  const {
    data: profilesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profiles', currentPage, limit, searchTerm, filters],
    queryFn: () => profileApi.searchProfiles(searchTerm, currentPage, limit, filters),
    placeholderData: (previousData) => previousData,
  });

  const profiles = useMemo(() => profilesResponse?.data || [], [profilesResponse?.data]);
  const pagination = profilesResponse?.pagination;

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFilterChange = (filterType: keyof ProfileFilters, value: string) => {
    const currentValues = filters[filterType] || [];
    let newValues;

    if (Array.isArray(currentValues)) {
      newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
    } else {
      newValues = currentValues;
    }
    
    setFilters({
      ...filters,
      [filterType]: Array.isArray(newValues) && newValues.length > 0 ? newValues : undefined,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleViewProfile = (profile: UserProfile) => {
    router.push(`/profile/${profile.id}`);
  };

  const handleCall = (profile: UserProfile) => {
    if (profile.phone) {
      initiateCall(profile.phone);
    }
  };

  const handleWhatsApp = (profile: UserProfile) => {
    if (profile.phone) {
      const message = `Hi ${profile.name}, I'm reaching out from TripongoStays. How can I assist you today?`;
      openWhatsApp(profile.phone, message);
    }
  };

  const getEngagementLevel = (profile: UserProfile) => {
    const score = (
      (profile.engagementSummary.callsConnected * 10) +
      (profile.engagementSummary.totalBookings * 25) +
      (profile.engagementSummary.totalRevenue / 1000)
    );

    if (score >= 100) return { level: 'High', color: 'bg-green-100 text-green-800' };
    if (score >= 50) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-red-100 text-red-800' };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasActiveFilters = 
    (filters.source && filters.source.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    (filters.tags && filters.tags.length > 0);

  // Sort profiles client-side
  const sortedProfiles = useMemo(() => {
    if (!sortKey) return profiles;
    
    return [...profiles].sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortKey) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'lastInteraction':
          aValue = a.lastInteraction ? new Date(a.lastInteraction).getTime() : 0;
          bValue = b.lastInteraction ? new Date(b.lastInteraction).getTime() : 0;
          break;
        case 'totalCalls':
          aValue = a.engagementSummary.totalCalls;
          bValue = b.engagementSummary.totalCalls;
          break;
        case 'totalRevenue':
          aValue = a.engagementSummary.totalRevenue;
          bValue = b.engagementSummary.totalRevenue;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' 
        ? (Number(aValue) || 0) - (Number(bValue) || 0)
        : (Number(bValue) || 0) - (Number(aValue) || 0);
    });
  }, [profiles, sortKey, sortDirection]);

  const tableColumns: TableColumn<UserProfile>[] = [
    {
      key: 'name',
      label: 'Profile',
      sortable: true,
      render: (value, profile) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            {profile?.avatar ? (
              <Image src={profile.avatar} alt={profile.name} width={40} height={40} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(profile?.name || '')
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{profile?.name}</div>
            <div className="text-sm text-gray-500">{profile?.email || profile?.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      render: (value) => {
        const colors = {
          'Lead': 'bg-orange-100 text-orange-800',
          'Call History': 'bg-purple-100 text-purple-800',
          'Booking': 'bg-emerald-100 text-emerald-800',
          'Contact': 'bg-blue-100 text-blue-800',
        };
        return (
          <Badge className={colors[value as keyof typeof colors]} size="sm">
            {String(value)}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge className={getStatusColor(String(value))} size="sm">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'engagement',
      label: 'Engagement',
      render: (_, profile) => {
        if (!profile) return null;
        const engagement = getEngagementLevel(profile);
        return (
          <Badge className={engagement.color} size="sm">
            {engagement.level}
          </Badge>
        );
      },
    },
    {
      key: 'totalCalls',
      label: 'Calls',
      sortable: true,
      render: (_, profile) => (
        <div className="text-center">
          <div className="font-medium">{profile?.engagementSummary?.totalCalls}</div>
          <div className="text-xs text-gray-500">
            {profile?.engagementSummary?.callsConnected} connected
          </div>
        </div>
      ),
    },
    {
      key: 'totalRevenue',
      label: 'Revenue',
      sortable: true,
      render: (_, profile) => (
        <div className="text-right">
          <div className="font-medium text-green-600">
            {formatCurrency(profile?.engagementSummary?.totalRevenue || 0)}
          </div>
          <div className="text-xs text-gray-500">
            {profile?.engagementSummary?.totalBookings} bookings
          </div>
        </div>
      ),
    },
    {
      key: 'lastInteraction',
      label: 'Last Interaction',
      sortable: true,
      render: (value) => value ? formatDate(String(value)) : 'Never',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, profile) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => profile && handleViewProfile(profile)}
            leftIcon={<Eye className="h-3 w-3" />}
          >
            View
          </Button>
          {profile?.phone && (
            <>
              <Button
                size="sm"
                variant="tertiary"
                onClick={() => profile && handleCall(profile)}
                leftIcon={<Phone className="h-3 w-3" />}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Call
              </Button>
              <Button
                size="sm"
                variant="tertiary"
                onClick={() => profile && handleWhatsApp(profile)}
                leftIcon={<MessageCircle className="h-3 w-3" />}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                Chat
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profiles</p>
          <Button variant="tertiary" onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profiles</h1>
          <p className="text-gray-600">
            Centralized view of all users across leads, calls, and bookings
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="h-4 w-4" />}
            className={hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
          >
            Filters
            {hasActiveFilters && (
              <Badge variant="error" size="sm" className="ml-2">
                Active
              </Badge>
            )}
          </Button>
          
          <Button
            variant="tertiary"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search profiles by name, email, or phone..."
            leftIcon={<Search className="h-4 w-4" />}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sort Controls */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <Button
              size="sm"
              variant={sortDirection === 'asc' ? 'primary' : 'secondary'}
              onClick={() => handleSort(sortKey, 'asc')}
              leftIcon={<SortAsc className="h-3 w-3" />}
              className="text-xs"
            >
              Asc
            </Button>
            <Button
              size="sm"
              variant={sortDirection === 'desc' ? 'primary' : 'secondary'}
              onClick={() => handleSort(sortKey, 'desc')}
              leftIcon={<SortDesc className="h-3 w-3" />}
              className="text-xs"
            >
              Desc
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('grid')}
              leftIcon={<Grid3X3 className="h-3 w-3" />}
              className="text-xs"
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              leftIcon={<List className="h-3 w-3" />}
              className="text-xs"
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Source Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Source</h4>
                <div className="space-y-2">
                  {['Lead', 'Call History', 'Booking', 'Contact'].map((source) => (
                    <label key={source} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.source?.includes(source) || false}
                        onChange={() => handleFilterChange('source', source)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{source}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
                <div className="space-y-2">
                  {['Active', 'Converted', 'Lost', 'Inactive'].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status) || false}
                        onChange={() => handleFilterChange('status', status)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Engagement Level Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Engagement Level</h4>
                <div className="space-y-2">
                  {['High', 'Medium', 'Low'].map((level) => (
                    <label key={level} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.engagementLevel?.includes(level.toLowerCase() as 'low' | 'medium' | 'high') || false}
                        onChange={() => handleFilterChange('engagementLevel', level.toLowerCase())}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProfiles.map((profile) => {
            const engagement = getEngagementLevel(profile);
            
            return (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => profile && handleViewProfile(profile)}>
                <CardContent className="p-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                      {profile?.avatar ? (
                        <Image src={profile.avatar} alt={profile.name} width={48} height={48} className='w-full h-full rounded-full object-cover' />
                      ) : (
                        getInitials(profile?.name || '')
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{profile?.name}</div>
                      <div className="text-sm text-gray-500 truncate">{profile?.email || profile?.phone}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="info" size="sm">{profile?.source}</Badge>
                    <Badge className={getStatusColor(profile?.status || 'Active')} size="sm">{profile?.status}</Badge>
                    <Badge className={engagement.color} size="sm">{engagement.level}</Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{profile?.engagementSummary?.totalCalls}</div>
                      <div className="text-xs text-gray-500">Calls</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {(profile?.engagementSummary?.totalRevenue || 0) > 0 
                          ? `₹${Math.round((profile?.engagementSummary?.totalRevenue || 0) / 1000)}K`
                          : '₹0'
                        }
                      </div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="tertiary"
                      onClick={(e) => {
                        e.stopPropagation();
                        profile && handleCall(profile);
                      }}
                      leftIcon={<Phone className="h-3 w-3" />}
                      className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                      disabled={!profile?.phone}
                    >
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="tertiary"
                      onClick={(e) => {
                        e.stopPropagation();
                        profile && handleWhatsApp(profile);
                      }}
                      leftIcon={<MessageCircle className="h-3 w-3" />}
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      disabled={!profile?.phone}
                    >
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <Table
              data={sortedProfiles}
              columns={tableColumns}
              onSort={handleSort}
              sortKey={sortKey}
              sortDirection={sortDirection}
              isLoading={isLoading}
              emptyMessage="No profiles found"
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && sortedProfiles.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <div className="text-lg font-medium text-gray-900 mb-2">No profiles found</div>
          <div className="text-gray-500 mb-6">
            {searchTerm || hasActiveFilters
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Profiles will appear here as leads, calls, and bookings are created.'
            }
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;

