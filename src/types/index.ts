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

export type CreateUserData = Omit<User, 'id' | 'joinedDate'>;

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
  result: string;
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
  render?: (value: T[keyof T], row: T) => React.ReactNode;
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

// Profile Types - Centralized User Profile System
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  source: 'Lead' | 'Contact' | 'Call History' | 'Booking';
  status: 'Active' | 'Inactive' | 'Converted' | 'Lost';
  tags: string[];
  notes: string[];
  
  // Core Details
  organization?: string;
  location?: string;
  createdDate: string;
  lastInteraction?: string;
  
  // Engagement Summary
  engagementSummary: {
    totalCalls: number;
    totalCallDuration: number; // in seconds
    lastCallDate?: string;
    callsConnected: number;
    callsMissed: number;
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    conversionRate: number;
  };
  
  // Activity Timeline
  activities: ProfileActivity[];
  
  // Related Data
  leadData?: Lead;
  callHistory: CallRecord[];
  bookings: Booking[];
  
  // Custom Attributes
  customAttributes: Record<string, any>;
}

export interface ProfileActivity {
  id: string;
  type: 'call' | 'booking' | 'note' | 'status_change' | 'email' | 'whatsapp';
  title: string;
  description?: string;
  date: string;
  metadata?: Record<string, any>;
  icon?: string;
  color?: string;
}

export interface ProfileNote {
  id: string;
  content: string;
  createdBy: string;
  createdDate: string;
  type: 'general' | 'call' | 'follow_up' | 'important';
}

export interface ProfileEngagementMetrics {
  totalInteractions: number;
  engagementScore: number; // 0-100
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  bestTimeToContact?: string;
  responseRate: number;
  averageResponseTime: number; // in hours
}

// Profile Filters
export interface ProfileFilters {
  source?: string[];
  status?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  engagementLevel?: 'high' | 'medium' | 'low'[];
}