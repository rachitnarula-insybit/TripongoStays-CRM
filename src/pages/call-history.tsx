import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Search, Download, Filter, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { callHistoryApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CallRecord, TableColumn, CallHistoryFilters } from '@/types';
import { 
  formatDate, 
  formatDateTime, 
  formatDuration, 
  debounce, 
  filterBySearch, 
  getStatusColor,
  downloadFile
} from '@/utils';

const CallHistoryPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<CallHistoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const limit = 10;

  const {
    data: callHistoryResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['call-history', currentPage, limit, filters],
    queryFn: () => callHistoryApi.getCallHistory(currentPage, limit, filters),
  });

  const exportMutation = useMutation({
    mutationFn: () => callHistoryApi.exportCallHistory(filters),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const filename = `call-history-${new Date().toISOString().split('T')[0]}.csv`;
        downloadFile(response.data, filename, 'text/csv');
        toast.success('Call history exported successfully');
      } else {
        toast.error('Failed to export call history');
      }
    },
    onError: () => {
      toast.error('An error occurred while exporting call history');
    },
  });

  const pagination = callHistoryResponse?.pagination;

  // Filter and sort call records - FIXED with safety checks
  const filteredAndSortedRecords = useMemo(() => {
    const callRecords = callHistoryResponse?.data || [];
    // Ensure callRecords is an array
    const safeCallRecords = Array.isArray(callRecords) ? callRecords : [];
    
    let result = filterBySearch(safeCallRecords, searchTerm, ['userName', 'phoneNumber', 'type', 'status', 'result']);
    
    if (sortKey) {
      const dir = sortDirection === 'asc' ? 1 : -1;

      result = result.sort((a, b) => {
        const aValue = a[sortKey as keyof CallRecord];
        const bValue = b[sortKey as keyof CallRecord];

        // Handle undefined/null first (put undefined at the end for asc)
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1 * dir;   // undefined comes last in asc
        if (bValue == null) return -1 * dir;

        // Strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * dir;
        }

        // Numbers
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * dir;
        }

        // Fallback
        return String(aValue).localeCompare(String(bValue)) * dir;
      });
    }
    
    return result;
  }, [callHistoryResponse?.data, searchTerm, sortKey, sortDirection]);

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

  const handleFilterChange = (filterType: keyof CallHistoryFilters, value: string) => {
    const currentValues = filters[filterType] || [];
    let newValues;

    if (Array.isArray(currentValues)) {
      newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
    } else {
      // If it's an object (e.g., date range), handle accordingly or leave unchanged
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

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleViewProfile = (callRecord: CallRecord) => {
    router.push(`/profile/${encodeURIComponent(callRecord.phoneNumber)}?type=phone`);
  };

  const hasActiveFilters = 
    (filters.type && filters.type.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    (filters.result && filters.result.length > 0);

  const columns: TableColumn<CallRecord>[] = [
    {
      key: 'date',
      label: 'Date & Time',
      sortable: true,
      render: (value) => (
        <div>
          <div className="font-medium text-neutral-black">
            {formatDate(String(value || ''))}
          </div>
          <div className="text-sm text-neutral-gray">
            {formatDateTime(String(value || '')).split(' ')[1]}
          </div>
        </div>
      ),
    },
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium text-neutral-black">{value}</div>
            <div className="text-sm text-neutral-gray">{record.phoneNumber}</div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewProfile(record)}
            leftIcon={<Eye className="h-3 w-3" />}
            className="text-gray-600 border-gray-300 hover:bg-gray-50 ml-2"
          >
            Profile
          </Button>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <Badge 
          variant={String(value) === 'Incoming' ? 'info' : 'success'}
          size="sm"
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge className={getStatusColor(String(value))} size="sm">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">
          {formatDuration(Number(value))}
        </span>
      ),
    },
    {
      key: 'result',
      label: 'Result',
      sortable: true,
      render: (value) => {
        const getResultColor = (result: string) => {
          switch (result) {
            case 'Booked': return 'bg-green-100 text-green-800';
            case 'Follow-up': return 'bg-yellow-100 text-yellow-800';
            case 'Not Interested': return 'bg-red-100 text-red-800';
            case 'No Answer': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };

        const stringValue = String(value);
        return (
          <Badge className={getResultColor(stringValue)} size="sm">
            {stringValue}
          </Badge>
        );
      },
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (value) => (
        <span className="text-sm text-neutral-gray max-w-xs truncate">
          {String(value) || '-'}
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-red">Failed to load call history</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
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
          <h1 className="text-2xl font-bold text-neutral-black">Call History</h1>
          <p className="text-neutral-gray">Track and manage all call records</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="h-4 w-4" />}
            className={hasActiveFilters ? 'border-primary-orange text-primary-orange' : ''}
          >
            Filters
            {hasActiveFilters && (
              <Badge variant="error" size="sm" className="ml-2">
                Active
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            isLoading={exportMutation.isPending}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search call history..."
            leftIcon={<Search className="h-4 w-4" />}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-neutral-black mb-3">Call Type</h4>
                <div className="space-y-2">
                  {['Incoming', 'Outgoing'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(type) || false}
                        onChange={() => handleFilterChange('type', type)}
                        className="rounded border-neutral-border-gray text-primary-orange focus:ring-primary-orange"
                      />
                      <span className="text-sm text-neutral-gray">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h4 className="text-sm font-medium text-neutral-black mb-3">Status</h4>
                <div className="space-y-2">
                  {['Connected', 'Missed', 'Rejected', 'Busy'].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status) || false}
                        onChange={() => handleFilterChange('status', status)}
                        className="rounded border-neutral-border-gray text-primary-orange focus:ring-primary-orange"
                      />
                      <span className="text-sm text-neutral-gray">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Result Filter */}
              <div>
                <h4 className="text-sm font-medium text-neutral-black mb-3">Result</h4>
                <div className="space-y-2">
                  {['Booked', 'Follow-up', 'Not Interested', 'No Answer'].map((result) => (
                    <label key={result} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.result?.includes(result) || false}
                        onChange={() => handleFilterChange('result', result)}
                        className="rounded border-neutral-border-gray text-primary-orange focus:ring-primary-orange"
                      />
                      <span className="text-sm text-neutral-gray">{result}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call History Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            data={filteredAndSortedRecords}
            columns={columns}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            isLoading={isLoading}
            emptyMessage="No call records found"
          />
        </CardContent>
      </Card>

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

export default CallHistoryPage;