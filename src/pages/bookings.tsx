import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, FileText, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Booking, TableColumn, BookingFilters } from '@/types';
import { 
  formatDate, 
  formatCurrency, 
  debounce, 
  filterBySearch, 
  getStatusColor
} from '@/utils';
import { generateInvoice } from '@/utils/invoiceGenerator';

const BookingsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<BookingFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const limit = 10;

  const {
    data: bookingsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bookings', currentPage, limit, filters],
    queryFn: () => bookingsApi.getBookings(currentPage, limit, filters),
  });

  const pagination = bookingsResponse?.pagination;

  // Filter and sort bookings - FIXED with safety checks
  const filteredAndSortedBookings = useMemo(() => {
    // Ensure bookings is an array
    const bookings = bookingsResponse?.data || [];
    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    
    let result = filterBySearch(bookingsArray, searchTerm, [
      'guestName', 
      'guestEmail', 
      'propertyName', 
      'bookingReference',
      'status',
      'paymentStatus'
    ]);
    
    if (sortKey) {
      result = result.sort((a, b) => {
        const aValue = a[sortKey as keyof Booking];
        const bValue = b[sortKey as keyof Booking];
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
        
        // Handle different types of values
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // For dates (assuming ISO strings for dates)
        if (sortKey === 'createdDate') {
          const dateA = new Date(String(aValue)).getTime();
          const dateB = new Date(String(bValue)).getTime();
          return sortDirection === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }
        
        // Fallback for other types
        const compareA = String(aValue);
        const compareB = String(bValue);
        return sortDirection === 'asc'
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      });
    }
    
    return result;
  }, [bookingsResponse?.data, searchTerm, sortKey, sortDirection]);

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

  const handleFilterChange = (filterType: keyof BookingFilters, value: string) => {
    const currentValues = (filters[filterType] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFilters({
      ...filters,
      [filterType]: newValues.length > 0 ? newValues : undefined,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleGenerateInvoice = (booking: Booking) => {
    try {
      generateInvoice(booking);
      toast.success('Invoice generated successfully!');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  const hasActiveFilters = 
    (filters.status && filters.status.length > 0) ||
    (filters.paymentStatus && filters.paymentStatus.length > 0);

  const columns: TableColumn<Booking>[] = [
    {
      key: 'bookingReference',
      label: 'Booking Ref',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-medium text-primary-orange">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'guestName',
      label: 'Guest Details',
      sortable: true,
      render: (value, booking) => (
        <div>
          <div className="font-medium text-neutral-black">{value}</div>
          <div className="text-sm text-neutral-gray">{booking.guestEmail}</div>
          <div className="text-sm text-neutral-gray">{booking.guestPhone}</div>
        </div>
      ),
    },
    {
      key: 'propertyName',
      label: 'Property',
      sortable: true,
      render: (value, booking) => (
        <div>
          <div className="font-medium text-neutral-black">{value}</div>
          <div className="text-sm text-neutral-gray">
            {booking.nights} nights • {booking.guests} guests
          </div>
        </div>
      ),
    },
    {
      key: 'checkInDate',
      label: 'Dates',
      sortable: true,
      render: (value, booking) => (
        <div>
          <div className="text-sm">
            <strong>Check-in:</strong> {formatDate(String(value))}
          </div>
          <div className="text-sm">
            <strong>Check-out:</strong> {formatDate(String(booking.checkOutDate))}
          </div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-secondary-green">
          {formatCurrency(Number(value))}
        </span>
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
      key: 'paymentStatus',
      label: 'Payment',
      sortable: true,
      render: (value) => (
        <Badge className={getStatusColor(String(value))} size="sm">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, booking) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(booking)}
            leftIcon={<Eye className="h-3 w-3" />}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleGenerateInvoice(booking)}
            leftIcon={<FileText className="h-3 w-3" />}
            className="text-primary-orange border-primary-orange hover:bg-orange-50"
          >
            Invoice
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-red">Failed to load bookings</p>
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
          <h1 className="text-2xl font-bold text-neutral-black">Bookings</h1>
          <p className="text-neutral-gray">Manage guest bookings and reservations</p>
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
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search bookings..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <h4 className="text-sm font-medium text-neutral-black mb-3">Booking Status</h4>
                <div className="space-y-2">
                  {['Confirmed', 'Pending', 'Cancelled', 'Completed'].map((status) => (
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

              {/* Payment Status Filter */}
              <div>
                <h4 className="text-sm font-medium text-neutral-black mb-3">Payment Status</h4>
                <div className="space-y-2">
                  {['Paid', 'Pending', 'Partial', 'Refunded'].map((paymentStatus) => (
                    <label key={paymentStatus} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.paymentStatus?.includes(paymentStatus) || false}
                        onChange={() => handleFilterChange('paymentStatus', paymentStatus)}
                        className="rounded border-neutral-border-gray text-primary-orange focus:ring-primary-orange"
                      />
                      <span className="text-sm text-neutral-gray">{paymentStatus}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            data={filteredAndSortedBookings}
            columns={columns}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            isLoading={isLoading}
            emptyMessage="No bookings found"
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

      {/* Booking Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-black mb-3">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Name</label>
                  <p className="text-neutral-black">{selectedBooking.guestName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Email</label>
                  <p className="text-neutral-black">{selectedBooking.guestEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Phone</label>
                  <p className="text-neutral-black">{selectedBooking.guestPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Booking Reference</label>
                  <p className="font-mono text-primary-orange">{selectedBooking.bookingReference}</p>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-black mb-3">Booking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Property</label>
                  <p className="text-neutral-black">{selectedBooking.propertyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Check-in Date</label>
                  <p className="text-neutral-black">{formatDate(String(selectedBooking.checkInDate))}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Check-out Date</label>
                  <p className="text-neutral-black">{formatDate(String(selectedBooking.checkOutDate))}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Nights</label>
                  <p className="text-neutral-black">{selectedBooking.nights}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Guests</label>
                  <p className="text-neutral-black">{selectedBooking.guests}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Source</label>
                  <p className="text-neutral-black">{selectedBooking.source}</p>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-black mb-3">Pricing</h3>
              <div className="bg-neutral-light-gray rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-gray">Base Amount:</span>
                  <span className="text-neutral-black">{formatCurrency(selectedBooking.baseAmount)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-gray">Taxes & Fees:</span>
                  <span className="text-neutral-black">{formatCurrency(selectedBooking.taxAmount)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-neutral-black">Total Amount:</span>
                  <span className="text-secondary-green">{formatCurrency(selectedBooking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-black mb-3">Status</h3>
              <div className="flex space-x-4">
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Booking Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-gray">Payment Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedBooking.paymentStatus)}>
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => handleGenerateInvoice(selectedBooking)}
                leftIcon={<FileText className="h-4 w-4" />}
              >
                Generate Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingsPage;