// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent' | 'manager';
  joinedDate: string;
  avatar?: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Lead Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'Web' | 'WhatsApp' | 'Call' | 'Social' | 'Referral';
  status: 'New' | 'Hot' | 'Follow-up' | 'Converted' | 'Lost';
  assignedTo: string | null;
  assignmentType: 'AI' | 'Human';
  createdDate: string;
  lastContactDate?: string;
  notes?: string;
  priority: 'Low' | 'Medium' | 'High';
  expectedRevenue?: number;
}

// Call History Types
export interface CallRecord {
  id: string;
  userId: string;
  userName: string;
  type: 'Incoming' | 'Outgoing';
  status: 'Connected' | 'Missed' | 'Rejected' | 'Busy';
  duration: number; // in seconds
  result: 'Booked' | 'Follow-up' | 'Not Interested' | 'No Answer';
  date: string;
  phoneNumber: string;
  notes?: string;
}

// Booking Types
export interface Booking {
  id: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  paymentStatus: 'Paid' | 'Pending' | 'Partial' | 'Refunded';
  createdDate: string;
  source: string;
}

// Property Types
export interface Property {
  id: string;
  name: string;
  type: 'Hotel' | 'Resort' | 'Villa' | 'Apartment';
  city: string;
  state: string;
  country: string;
  totalRooms: number;
  availableRooms: number;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalBookings: number;
  totalProperties: number;
  totalLeads: number;
  revenue: number;
  revenueGrowth: number;
  bookingsGrowth: number;
  leadsGrowth: number;
  propertiesGrowth: number;
}

export interface LeadConversionData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CityDemandData {
  city: string;
  bookings: number;
  revenue: number;
}

// Filter Types
export interface LeadFilters {
  source?: string[];
  status?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CallHistoryFilters {
  type?: string[];
  status?: string[];
  result?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface BookingFilters {
  status?: string[];
  paymentStatus?: string[];
  property?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: User['role'];
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  source: Lead['source'];
  notes?: string;
  priority: Lead['priority'];
}

// Toast Types
export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}