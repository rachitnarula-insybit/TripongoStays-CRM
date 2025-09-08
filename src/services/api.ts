import { 
  User, 
  CreateUserData,
  Lead, 
  CallRecord, 
  Booking, 
  Property, 
  DashboardStats, 
  LeadConversionData, 
  CityDemandData,
  ApiResponse,
  LeadFilters,
  CallHistoryFilters,
  BookingFilters,
  UserProfile,
  ProfileActivity,
  ProfileFilters,
  BackendLeadData,
  BackendBookingData,
  CallAnalysisResponse
} from '@/types';
// Mock data is defined inline where needed

// -----------------------------
// Data transformation helpers
// -----------------------------

// Transform backend data to match frontend format
function transformBackendData(data: unknown, endpoint: string): unknown {
  if (data === undefined || data === null) return data;

  const baseEndpoint = endpoint.split('?')[0];

  // Special-case /user/login which often returns { user, token }
  if (baseEndpoint.includes('/user/login')) {
    if (typeof data === 'object' && data !== null && 'user' in (data as Record<string, unknown>)) {
      const d = data as Record<string, unknown>;
      return {
        ...d,
        user: transformUserData(d.user as Record<string, unknown>),
      };
    }
    // fallback - try to transform as a user object
    return transformUserData(data as Record<string, unknown>);
  }

  // Transform user(s)
  if (baseEndpoint.includes('/user/')) {
    if (Array.isArray(data)) {
      return data.map(item => transformUserData(item as Record<string, unknown>));
    } else if (typeof data === 'object' && data !== null) {
      if ('user' in (data as Record<string, unknown>)) {
        const d = data as Record<string, unknown>;
        return {
          ...d,
          user: transformUserData(d.user as Record<string, unknown>),
        };
      }
      return transformUserData(data as Record<string, unknown>);
    }
  }

  // Transform booking(s)
  if (baseEndpoint.includes('/booking/')) {
    if (Array.isArray(data)) {
      return data.map(item => transformBookingData(item as Record<string, unknown>));
    } else if (typeof data === 'object' && data !== null) {
      if ('booking' in (data as Record<string, unknown>)) {
        const d = data as Record<string, unknown>;
        return {
          ...d,
          booking: transformBookingData(d.booking as Record<string, unknown>),
        };
      }
      return transformBookingData(data as Record<string, unknown>);
    }
  }

  // Transform enquiry/leads data - FIXED to handle nested structure
  if (baseEndpoint.includes('/enquiry/leads') || baseEndpoint.includes('/enquiry/getenquiries')) {
    if (typeof data === 'object' && data !== null) {
      const d = data as Record<string, unknown> & { leads?: BackendLeadData[] };
      
      // If data has a 'leads' property, extract and transform the leads array
      if ('leads' in d && Array.isArray(d.leads)) {
        const transformedLeads = d.leads.map((lead: BackendLeadData) => transformLeadData(lead));
        
        return {
          ...d,
          leads: transformedLeads,
        };
      }
      
      // If it's a direct array of leads
      if (Array.isArray(data)) {
        return data.map(item => transformLeadData(item as Record<string, unknown>));
      }
      
      // If it's a single lead object
      return transformLeadData(data as Record<string, unknown>);
    }
  }

  // default: return as-is
  return data;
}

// Add a new transform function for lead data
function transformLeadData(backendLead: BackendLeadData): Lead {
  // Handle the nested leadName structure
  const leadName = backendLead.leadName || {};
  
  return {
    id: String(backendLead.id || ''),
    name: String(leadName.name || backendLead.name || ''),
    email: String(leadName.email || backendLead.email || ''),
    phone: String(leadName.phone || backendLead.phone || ''),
    source: (backendLead.source as Lead['source']) || 'Web',
    status: (backendLead.status as Lead['status']) || 'New',
    assignedTo: backendLead.assignedTo || null,
    assignmentType: (backendLead.assignmentType as Lead['assignmentType']) || 'AI',
    createdDate: String(backendLead.createdDate || new Date().toISOString()),
    lastContactDate: backendLead.lastContactDate ? String(backendLead.lastContactDate) : undefined,
    notes: backendLead.message ? String(backendLead.message) : undefined,
    priority: (backendLead.priority as Lead['priority']) || 'Medium',
    expectedRevenue: Number(backendLead.expectedRevenue || 0),
  };
}

// Transform individual booking object
function transformBookingData(backendBooking: BackendBookingData): Booking {
  const user = backendBooking.user || {};
  const property = backendBooking.property || {};

  // Helper to coerce dates safely
  const safeDateString = (val: unknown): string => {
    if (!val) return '';
    try {
      const d = new Date(String(val));
      return isNaN(d.getTime()) ? String(val) : d.toISOString();
    } catch {
      return String(val);
    }
  };

  // Ensure numeric coercions are safe
  const safeNumber = (val: unknown, fallback = 0): number => {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };

  // Normalize status strings to title case expected by UI (but keep as is if unknown)
  const rawStatus = String(backendBooking.status || 'Pending');
  const status = (['pending','confirmed','completed','cancelled'].includes(rawStatus.toLowerCase()))
    ? (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()) 
    : rawStatus;

  const paymentRaw = String(backendBooking.paymentStatus || backendBooking.payment || 'Pending');
  const paymentStatus = (['pending','paid','failed'].includes(paymentRaw.toLowerCase()))
    ? (paymentRaw.charAt(0).toUpperCase() + paymentRaw.slice(1).toLowerCase())
    : paymentRaw;

  return {
    id: String(backendBooking._id || backendBooking.id || ''),
    bookingReference: String(backendBooking.bookingReference || `TGS${String(backendBooking._id || '').slice(-6)}`),
    guestName: String(backendBooking.guestName || user.fullname || user.fullName || ''),
    guestEmail: String(backendBooking.guestEmail || user.email || ''),
    guestPhone: String(backendBooking.guestPhone || backendBooking.phone || ''),
    propertyName: String(property.name || backendBooking.propertyName || ''),
    propertyId: String(property._id || backendBooking.propertyId || backendBooking.property || ''),
    checkInDate: safeDateString(backendBooking.checkInDate || backendBooking.startDate || ''),
    checkOutDate: safeDateString(backendBooking.checkOutDate || backendBooking.endDate || ''),
    nights: safeNumber(backendBooking.nights || 1, 1),
    guests: safeNumber(backendBooking.guests || 1, 1),
    baseAmount: safeNumber(backendBooking.baseAmount ?? backendBooking.amount ?? 0, 0),
    taxAmount: safeNumber(backendBooking.taxAmount ?? 0, 0),
    totalAmount: safeNumber(backendBooking.totalAmount ?? backendBooking.amount ?? 0, 0),
    status: status as Booking['status'],
    paymentStatus: paymentStatus as Booking['paymentStatus'],
    createdDate: safeDateString(backendBooking.createdAt || backendBooking.createdDate || new Date().toISOString()),
    source: String(backendBooking.source || 'Website'),
  };
}

// Transform individual user object  
function transformUserData(backendUser: Record<string, unknown>): User {
  const roleRaw = String(backendUser.Role ?? backendUser.role ?? '').toLowerCase();
  const role = roleRaw === 'admin' ? 'admin' : roleRaw === 'manager' ? 'manager' : 'agent';

  const safeDateString = (val: unknown): string => {
    if (!val) return '';
    try {
      const d = new Date(String(val));
      return isNaN(d.getTime()) ? String(val) : d.toISOString();
    } catch {
      return String(val);
    }
  };

  return {
    id: String(backendUser._id || backendUser.id || ''),
    name: String(backendUser.fullName || backendUser.fullname || backendUser.name || ''),
    email: String(backendUser.email || ''),
    phone: String(backendUser.phoneNumber || backendUser.mobile || ''),
    role: role as User['role'],
    joinedDate: safeDateString(backendUser.createdAt || backendUser.joinedDate || new Date().toISOString()),
    avatar: String(backendUser.avatar || ''),
    isActive: typeof backendUser.isActive === 'boolean' ? backendUser.isActive : true,
  };
}

// -----------------------------
// API call helper (no mock fallback)
// -----------------------------

// Helper to perform fetch calls and transform response
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // SSR-safe token retrieval
  let token: string | null = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      token = window.localStorage.getItem('authToken');
    }
  } catch {
    token = null;
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string> | undefined),
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Try to parse error body for a friendlier message
      let errBody: string | undefined;
      try {
        const parsed = await response.json();
        errBody = JSON.stringify(parsed);
      } catch {
        try {
          errBody = await response.text();
        } catch {
          errBody = undefined;
        }
      }
      throw new Error(`HTTP error! status: ${response.status}${errBody ? ` - ${errBody}` : ''}`);
    }

    const backendResponse = await response.json();

    // Support two shapes:
    // 1) { data: ... , success, message } (common)
    // 2) direct payload (array / object)
    const rawData = backendResponse && backendResponse.data !== undefined
      ? backendResponse.data
      : backendResponse;

    // Transform backend response to match frontend expected format
    const transformedData = transformBackendData(rawData, endpoint);

    // Preserve top level success/message/pagination if present
    const success = backendResponse && 'success' in backendResponse ? backendResponse.success : true;
    const message = backendResponse && 'message' in backendResponse ? backendResponse.message : undefined;
    const pagination = backendResponse && 'pagination' in backendResponse ? backendResponse.pagination : undefined;

    return {
      data: transformedData as T,
      success,
      message,
      pagination,
    };
  } catch (error: unknown) {
    return {
      data: undefined as T, // Use undefined instead of null
      success: false,
      message: (error as Error)?.message || `Failed to fetch ${endpoint}`,
    };
  }
}

// -----------------------------
// Small util
// -----------------------------
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// -----------------------------
// Authentication API
// -----------------------------
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    // Always use local authentication - no backend calls
    console.log('🔧 Using local authentication (no backend calls)');
    
    // Accept demo credentials
    if (email === 'admin@tripongostays.com' && password === 'admin123') {
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@tripongostays.com',
        phone: '+1234567890',
        role: 'admin',
        joinedDate: new Date().toISOString(),
        avatar: '',
        isActive: true,
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Store in localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('authToken', mockToken);
          window.localStorage.setItem('user', JSON.stringify(mockUser));
        }
      } catch {
        // ignore localStorage errors
      }
      
      return {
        data: { user: mockUser, token: mockToken },
        success: true,
        message: 'Local authentication successful',
      };
    } else {
      return {
        data: null as any,
        success: false,
        message: 'Invalid credentials',
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('user');
      }
    } catch {
      // ignore
    }
    return {
      data: null,
      success: true,
      message: 'Logged out successfully',
    };
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const userStr = window.localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          return {
            data: user,
            success: true,
            message: 'Profile retrieved successfully',
          };
        }
      }
    } catch {
      // ignore
    }
    
    return {
      data: null as any,
      success: false,
      message: 'Profile not found',
    };
  },
};

// -----------------------------
// Dashboard API - FIXED with correct endpoints
// -----------------------------
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      // Fetch real data from bookings and properties
      const [bookingsResponse, propertiesResponse, leadsResponse] = await Promise.all([
        apiCall<Booking[]>('/booking/getallbooking?limit=1000'), // Get all bookings
        apiCall<Property[]>('/property/getproperties'), // This might not exist
        apiCall<Lead[]>('/enquiry/leads?limit=1000'), // FIXED: Use correct endpoint
      ]);

      // Use data even if some calls failed, but log the issues
      const bookings = bookingsResponse.data || [];
      const properties = propertiesResponse.data || [];

      // Normalize leads which may come as { leads: [...] }
      const leadsRaw = leadsResponse.data || [];
      const leads = Array.isArray(leadsRaw)
        ? leadsRaw
        : (Array.isArray((leadsRaw as Record<string, unknown>).leads) ? (leadsRaw as Record<string, unknown>).leads : []);

      // Calculate real stats
      const totalBookings = bookings.length;
      const totalProperties = properties.length;
      const totalLeads = Array.isArray(leads) ? leads.length : 0;

      // Calculate total revenue from confirmed bookings
      const confirmedBookings = bookings.filter((booking: Booking) =>
        String(booking.status).toLowerCase() === 'confirmed' || String(booking.status).toLowerCase() === 'completed'
      );
      const revenue = confirmedBookings.reduce((sum: number, booking: Booking) => {
        const amount = Number(booking.totalAmount || 0);
        return sum + amount;
      }, 0);

      // Placeholder growth percentages — ideally calculated from historical data
      const revenueGrowth = 12.5;
      const bookingsGrowth = 8.3;
      const leadsGrowth = 15.7;
      const propertiesGrowth = 4.2;

      const stats: DashboardStats = {
        totalBookings,
        totalProperties,
        totalLeads,
        revenue,
        revenueGrowth,
        bookingsGrowth,
        leadsGrowth,
        propertiesGrowth,
      };

      return {
        data: stats,
        success: true,
        message: 'Dashboard stats calculated successfully',
      };
    } catch (error: unknown) {
      return {
        data: {
          totalBookings: 0,
          totalProperties: 0,
          totalLeads: 0,
          revenue: 0,
          revenueGrowth: 0,
          bookingsGrowth: 0,
          leadsGrowth: 0,
          propertiesGrowth: 0,
        } as DashboardStats,
        success: false,
        message: `Failed to calculate dashboard stats: ${(error as Error)?.message || 'unknown error'}`,
      };
    }
  },

  getLeadConversion: async (): Promise<ApiResponse<LeadConversionData[]>> => {
    try {
      // For now, return mock data since this endpoint might not exist
      const mockData: LeadConversionData[] = [
        { stage: 'New Leads', count: 25, percentage: 100, color: '#1e3a8a' },
        { stage: 'Contacted', count: 18, percentage: 72, color: '#1e40af' },
        { stage: 'Qualified', count: 12, percentage: 48, color: '#1d4ed8' },
        { stage: 'Proposal', count: 8, percentage: 32, color: '#2563eb' },
        { stage: 'Converted', count: 5, percentage: 20, color: '#3b82f6' },
      ];
      
      return {
        data: mockData,
        success: true,
        message: 'Lead conversion data loaded',
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch lead conversion data',
      };
    }
  },

  getCityDemand: async (): Promise<ApiResponse<CityDemandData[]>> => {
    try {
      // For now, return mock data since this endpoint might not exist
      const mockData: CityDemandData[] = [
        { city: 'Mumbai', bookings: 45, revenue: 125000 },
        { city: 'Delhi', bookings: 38, revenue: 98000 },
        { city: 'Bangalore', bookings: 32, revenue: 85000 },
        { city: 'Chennai', bookings: 28, revenue: 72000 },
        { city: 'Kolkata', bookings: 22, revenue: 58000 },
      ];
      
      return {
        data: mockData,
        success: true,
        message: 'City demand data loaded',
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch city demand data',
      };
    }
  },
};

// -----------------------------
// Users API
// -----------------------------
export const usersApi = {
  getUsers: async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    return apiCall<User[]>(`/user/getuser?page=${page}&limit=${limit}`);
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/user/getuserbyid/${id}`);
  },

  createUser: async (userData: CreateUserData): Promise<ApiResponse<User>> => {
    return apiCall<User>('/user/registeruser', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/user/updateuser/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    return apiCall<null>(`/user/deleteuser/${id}`, {
      method: 'DELETE',
    });
  },
};

// -----------------------------
// Leads API - READ ONLY (no update methods)
// -----------------------------
export const leadsApi = {
  getLeads: async (
    page = 1, 
    limit = 10, 
    filters?: LeadFilters
  ): Promise<ApiResponse<Lead[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.source?.length) {
        params.append('source', filters.source.join(','));
      }
      if (filters.status?.length) {
        params.append('status', filters.status.join(','));
      }
      if (filters.assignedTo?.length) {
        params.append('assignedTo', filters.assignedTo.join(','));
      }
    }

    // Fetch and normalize the backend shape { leads: [], pagination, ... } → array
    const resp = await apiCall<BackendLeadData[] | { leads: BackendLeadData[]; pagination?: unknown }>(`/enquiry/leads?${params.toString()}`);

    const leadsArray = Array.isArray(resp.data)
      ? resp.data
      : (Array.isArray(resp.data?.leads) ? resp.data.leads : []);

    const pagination = (resp.data && !Array.isArray(resp.data) ? resp.data.pagination : undefined) || resp.pagination;

    return {
      data: leadsArray as Lead[],
      success: resp.success,
      message: resp.message,
      pagination: pagination as ApiResponse<Lead[]>['pagination'],
    };
  },
};

// -----------------------------
// Call History API - UPDATED to use correct backend URL
// -----------------------------
export const callHistoryApi = {
  getCallHistory: async (
    page: number = 1,
    limit: number = 10,
    filters?: CallHistoryFilters
  ): Promise<ApiResponse<CallRecord[]>> => {
    try {
      // Use the call analysis backend URL from environment variable
      const CALL_ANALYSIS_BASE_URL = process.env.NEXT_PUBLIC_CALL_ANALYSIS_BASE_URL || 'https://core-python-prod-183848857592.asia-south1.run.app';
      const url = `${CALL_ANALYSIS_BASE_URL}/call-analyses`;

      // Make direct fetch call to the call analysis backend
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendResponse = await response.json();

      // Transform the response to match our expected format
      const callRecords = transformCallAnalysisToCallRecords(backendResponse);
      
      // Apply filters
      let filteredCalls = callRecords;
      
      if (filters?.type?.length) {
        filteredCalls = filteredCalls.filter(call => 
          filters.type!.includes(call.type)
        );
      }

      if (filters?.status?.length) {
        filteredCalls = filteredCalls.filter(call => 
          filters.status!.includes(call.status)
        );
      }

      if (filters?.result?.length) {
        filteredCalls = filteredCalls.filter(call => 
          filters.result!.includes(call.result)
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCalls = filteredCalls.slice(startIndex, endIndex);

      return {
        data: paginatedCalls,
        success: true,
        pagination: {
          page,
          limit,
          total: filteredCalls.length,
          totalPages: Math.ceil(filteredCalls.length / limit),
        },
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: (error as Error)?.message || 'Failed to fetch call history',
      };
    }
  },

  exportCallHistory: async (filters?: CallHistoryFilters): Promise<ApiResponse<string>> => {
    try {
      // Use the call analysis backend URL from environment variable
      const CALL_ANALYSIS_BASE_URL = process.env.NEXT_PUBLIC_CALL_ANALYSIS_BASE_URL ;
      const url = `${CALL_ANALYSIS_BASE_URL}/call-analyses`;

      // Make direct fetch call to the call analysis backend
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendResponse = await response.json();
      
      // Parse the API response and transform to CallRecord format
      const callRecords = transformCallAnalysisToCallRecords(backendResponse);
      
      // Apply filters (same logic as getCallHistory)
      let filteredCalls = callRecords;
      
      if (filters?.type?.length) {
        filteredCalls = filteredCalls.filter(call => 
          filters.type!.includes(call.type)
        );
      }

      if (filters?.status?.length) {
        filteredCalls = filteredCalls.filter(call => 
          filters.status!.includes(call.status)
        );
      }

      if (filters?.result?.length) {
        filteredCalls = filteredCalls.filter(call => 
          filters.result!.includes(call.result)
        );
      }

      // Generate CSV content
      const headers = ['Date', 'User', 'Type', 'Status', 'Duration', 'Result', 'Phone', 'Notes'];
      const csvContent = [
        headers.join(','),
        ...filteredCalls.map(call => [
          call.date,
          call.userName,
          call.type,
          call.status,
          call.duration,
          call.result,
          call.phoneNumber,
          `"${call.notes || ''}"`,
        ].join(','))
      ].join('\n');

      return {
        data: csvContent,
        success: true,
        message: 'Call history exported successfully',
      };
    } catch (error: unknown) {
      return {
        data: '',
        success: false,
        message: (error as Error)?.message || 'Failed to export call history',
      };
    }
  },
};

// Helper function to transform call analysis response to CallRecord format
function transformCallAnalysisToCallRecords(apiResponse: CallAnalysisResponse): CallRecord[] {
  
  // Only use primary_collection_analyses array
  const primaryAnalyses = apiResponse.primary_collection_analyses || [];
  
  const transformedRecords = primaryAnalyses.map((call, index: number) => {
    
    // Extract data from the API response structure
    const statisticalDetails = call.Statistical_Details || {};
    const otherDetails = statisticalDetails.other_details || {};
    const metadata = otherDetails.metadata || {};
    const phoneCall = metadata.metadata?.phone_call || {};
    // const supportQuality = call.Other_Details_LLM?.support_quality || {};
    const resultAction = call.Other_Details_LLM?.result_action || {};
    const dynamicVariables = metadata.conversation_initiation_client_data?.dynamic_variables || {};
    
    // Parse date from system__time_utc (ISO format)
    const systemTimeUtc = dynamicVariables.system__time_utc || '';
    let parsedDate = new Date().toISOString(); // fallback
    
    if (systemTimeUtc) {
      try {
        // Parse the ISO date string "2025-08-14T10:46:16.387212+00:00"
        parsedDate = new Date(String(systemTimeUtc)).toISOString();
      } catch (error) {
        console.warn('Failed to parse date:', systemTimeUtc, error);
      }
    }
    
    // Determine call type from direction
    const direction = phoneCall.direction || 'outbound';
    const callType = direction === 'inbound' ? 'Incoming' : 'Outgoing';
    
    // Determine status from call_status
    const callStatus = otherDetails.call_status || 'success';
    let status: CallRecord['status'];
    switch (callStatus) {
      case 'success':
        status = 'Connected';
        break;
      case 'failed':
        status = 'Missed';
        break;
      case 'busy':
        status = 'Busy';
        break;
      default:
        status = 'Connected';
    }
    
    // Get result from action_required - handle both string and array cases
    const actionRequired = resultAction.action_required || 'No Action';
    const result = Array.isArray(actionRequired) ? actionRequired.join(', ') : String(actionRequired);
    
    // Get duration in seconds from dynamic_variables
    const durationSecs = dynamicVariables.system__call_duration_secs || phoneCall.call_duration_secs || 0;
    
    // Get user name and phone from dynamic_variables
    const userName = String(dynamicVariables.name || 'Unknown');
    const phoneNumber = String(dynamicVariables.number || phoneCall.external_number || '');
    
    // Get notes from summary
    const notes = call.Other_Details_LLM?.summary || '';
    
    const transformedRecord = {
      id: String(index + 1), // Generate ID since API doesn't provide one
      userId: '1', // Default user ID since API doesn't provide one
      userName: userName,
      type: callType as CallRecord['type'],
      status: status,
      duration: Number(durationSecs),
      result: String(result),
      date: parsedDate,
      phoneNumber: phoneNumber,
      notes: String(notes),
    };
    
    return transformedRecord;
  });
  
  // Sort by date in descending order (newest first)
  return transformedRecords.sort((a: CallRecord, b: CallRecord) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Descending order (newest first)
  });
}

// -----------------------------
// Bookings API
// -----------------------------
export const bookingsApi = {
  getBookings: async (
    page = 1, 
    limit = 10, 
    filters?: BookingFilters
  ): Promise<ApiResponse<Booking[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.status?.length) {
        params.append('status', filters.status.join(','));
      }
      if (filters.paymentStatus?.length) {
        params.append('paymentStatus', filters.paymentStatus.join(','));
      }
      if (filters.property?.length) {
        params.append('property', filters.property.join(','));
      }
    }

    return apiCall<Booking[]>(`/booking/getallbooking?${params.toString()}`);
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>(`/booking/getbooking/${id}`);
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'createdDate'>): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>('/booking/createbooking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  updateBooking: async (id: string, bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>(`/booking/updatebooking/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  deleteBooking: async (id: string): Promise<ApiResponse<null>> => {
    return apiCall<null>(`/booking/deletebooking/${id}`, {
      method: 'DELETE',
    });
  },

  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>(`/booking/cancel/${id}`, {
      method: 'PUT',
    });
  },

  createManualBooking: async (bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>('/booking/admin/manual-booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
};

// -----------------------------
// Properties API - ADDED fallback for missing endpoint
// -----------------------------
export const propertiesApi = {
  getProperties: async (): Promise<ApiResponse<Property[]>> => {
    try {
      // Try the real endpoint first
      const response = await apiCall<Property[]>('/property/getallproperties');
      
      // If it fails, return mock data for now
      if (!response.success) {
        console.log('🔥 Property endpoint not available, using mock data');
        const mockProperties: Property[] = [
          {
            id: '1',
            name: 'Luxury Villa Goa',
            type: 'Villa',
            city: 'Goa',
            state: 'Goa',
            country: 'India',
            totalRooms: 4,
            availableRooms: 2,
            rating: 4.8,
            pricePerNight: 15000,
            amenities: ['Pool', 'WiFi', 'AC', 'Kitchen'],
            images: ['/images/villa1.jpg'],
            isActive: true,
          },
          {
            id: '2',
            name: 'Beach Resort Mumbai',
            type: 'Resort',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            totalRooms: 50,
            availableRooms: 15,
            rating: 4.5,
            pricePerNight: 8000,
            amenities: ['Beach Access', 'Spa', 'Restaurant', 'WiFi'],
            images: ['/images/resort1.jpg'],
            isActive: true,
          },
        ];
        
        return {
          data: mockProperties,
          success: true,
          message: 'Mock properties loaded',
        };
      }
      
      return response;
    } catch (error: unknown) {
      console.error('Error fetching properties:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch properties',
      };
    }
  },

  getPropertyById: async (id: string): Promise<ApiResponse<Property>> => {
    return apiCall<Property>(`/property/getproperty/${id}`);
  },

  createProperty: async (propertyData: Omit<Property, 'id'>): Promise<ApiResponse<Property>> => {
    return apiCall<Property>('/property/add', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  updateProperty: async (id: string, propertyData: Partial<Property>): Promise<ApiResponse<Property>> => {
    return apiCall<Property>(`/property/updateproperty/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  deleteProperty: async (id: string): Promise<ApiResponse<null>> => {
    return apiCall<null>(`/property/deleteproperty/${id}`, {
      method: 'DELETE',
    });
  },
};

// -----------------------------
// Profile API - Centralized User Profile System
// -----------------------------
export const profileApi = {
  // Get unified profile by identifier (phone/email/id)
  getProfile: async (identifier: string, type: 'phone' | 'email' | 'id' = 'id'): Promise<ApiResponse<UserProfile>> => {
    try {
      // Fetch data from all sources in parallel
      const [leadsResponse, callHistoryResponse, bookingsResponse] = await Promise.all([
        leadsApi.getLeads(1, 1000), // Get all leads
        callHistoryApi.getCallHistory(1, 1000), // Get all call history
        bookingsApi.getBookings(1, 1000), // Get all bookings
      ]);

      const leads = leadsResponse.data || [];
      const callHistory = callHistoryResponse.data || [];
      const bookings = bookingsResponse.data || [];

      // Find the user across all data sources
      let profileData: Partial<UserProfile> = {};
      let userCalls: CallRecord[] = [];
      let userBookings: Booking[] = [];
      let leadData: Lead | undefined;
      let source: UserProfile['source'] = 'Contact';

      // Search in leads first
      if (type === 'phone') {
        leadData = leads.find(lead => lead.phone === identifier);
      } else if (type === 'email') {
        leadData = leads.find(lead => lead.email === identifier);
      } else {
        leadData = leads.find(lead => lead.id === identifier);
      }

      if (leadData) {
        source = 'Lead';
        profileData = {
          id: leadData.id,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          createdDate: leadData.createdDate,
          lastInteraction: leadData.lastContactDate,
        };

        // Find related calls by phone
        userCalls = callHistory.filter(call => call.phoneNumber === leadData!.phone);
        // Find related bookings by email or phone
        userBookings = bookings.filter(booking => 
          booking.guestEmail === leadData!.email || booking.guestPhone === leadData!.phone
        );
      } else {
        // Search in call history
        const callRecord = callHistory.find(call => {
          if (type === 'phone') return call.phoneNumber === identifier;
          if (type === 'email') return false; // Call records don't have email
          return call.id === identifier;
        });

        if (callRecord) {
          source = 'Call History';
          profileData = {
            id: callRecord.id,
            name: callRecord.userName,
            email: '', // Not available in call records
            phone: callRecord.phoneNumber,
            createdDate: callRecord.date,
            lastInteraction: callRecord.date,
          };
          userCalls = [callRecord];
          userBookings = bookings.filter(booking => booking.guestPhone === callRecord.phoneNumber);
        } else {
          // Search in bookings
          const booking = bookings.find(booking => {
            if (type === 'phone') return booking.guestPhone === identifier;
            if (type === 'email') return booking.guestEmail === identifier;
            return booking.id === identifier;
          });

          if (booking) {
            source = 'Booking';
            profileData = {
              id: booking.id,
              name: booking.guestName,
              email: booking.guestEmail,
              phone: booking.guestPhone,
              createdDate: booking.createdDate,
              lastInteraction: booking.createdDate,
            };
            userBookings = [booking];
            userCalls = callHistory.filter(call => 
              call.phoneNumber === booking.guestPhone
            );
          }
        }
      }

      if (!profileData.id) {
        return {
          data: {} as UserProfile,
          success: false,
          message: 'Profile not found',
        };
      }

      // Calculate engagement summary
      const connectedCalls = userCalls.filter(call => call.status === 'Connected');
      const totalCallDuration = connectedCalls.reduce((sum, call) => sum + call.duration, 0);
      const totalRevenue = userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      const lastCallDate = userCalls.length > 0 ? 
        userCalls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date : 
        undefined;

      // Generate activity timeline
      const activities: ProfileActivity[] = [];
      
      // Add call activities
      userCalls.forEach(call => {
        activities.push({
          id: `call-${call.id}`,
          type: 'call',
          title: `${call.type} Call - ${call.status}`,
          description: call.notes || `${call.result} (${Math.floor(call.duration / 60)}m ${call.duration % 60}s)`,
          date: call.date,
          metadata: { callRecord: call },
          color: call.status === 'Connected' ? '#10B981' : '#EF4444',
        });
      });

      // Add booking activities
      userBookings.forEach(booking => {
        activities.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          title: `Booking ${booking.status}`,
          description: `${booking.propertyName} - ${booking.nights} nights`,
          date: booking.createdDate,
          metadata: { booking },
          color: booking.status === 'Confirmed' ? '#10B981' : '#F59E0B',
        });
      });

      // Sort activities by date (newest first)
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Determine status
      let status: UserProfile['status'] = 'Active';
      if (leadData) {
        if (leadData.status === 'Converted') status = 'Converted';
        else if (leadData.status === 'Lost') status = 'Lost';
      }

      const profile: UserProfile = {
        id: profileData.id!,
        name: profileData.name!,
        email: profileData.email!,
        phone: profileData.phone!,
        source,
        status,
        tags: leadData?.priority ? [leadData.priority] : [],
        notes: leadData?.notes ? [leadData.notes] : [],
        createdDate: profileData.createdDate!,
        lastInteraction: profileData.lastInteraction,
        engagementSummary: {
          totalCalls: userCalls.length,
          totalCallDuration,
          lastCallDate,
          callsConnected: connectedCalls.length,
          callsMissed: userCalls.filter(call => call.status === 'Missed').length,
          totalBookings: userBookings.length,
          totalRevenue,
          averageBookingValue: userBookings.length > 0 ? totalRevenue / userBookings.length : 0,
          conversionRate: leadData && userBookings.length > 0 ? 100 : 0,
        },
        activities,
        leadData,
        callHistory: userCalls,
        bookings: userBookings,
        customAttributes: {},
      };

      return {
        data: profile,
        success: true,
        message: 'Profile retrieved successfully',
      };
    } catch (error: unknown) {
      return {
        data: {} as UserProfile,
        success: false,
        message: (error as Error)?.message || 'Failed to fetch profile',
      };
    }
  },

  // Search profiles across all data sources
  searchProfiles: async (
    query: string,
    page = 1,
    limit = 10,
    filters?: ProfileFilters
  ): Promise<ApiResponse<UserProfile[]>> => {
    try {
      // Fetch all data
      const [leadsResponse, callHistoryResponse, bookingsResponse] = await Promise.all([
        leadsApi.getLeads(1, 1000),
        callHistoryApi.getCallHistory(1, 1000),
        bookingsApi.getBookings(1, 1000),
      ]);

      const leads = leadsResponse.data || [];
      const callHistory = callHistoryResponse.data || [];
      const bookings = bookingsResponse.data || [];

      // Create unified profiles list
      const profilesMap = new Map<string, UserProfile>();

      // Process leads
      leads.forEach(lead => {
        const profile = profileApi.createProfileFromLead(lead, callHistory, bookings);
        profilesMap.set(profile.phone || profile.email, profile);
      });

      // Process call records not already in profiles
      callHistory.forEach(call => {
        const key = call.phoneNumber;
        if (!profilesMap.has(key)) {
          const profile = profileApi.createProfileFromCall(call, callHistory, bookings);
          profilesMap.set(key, profile);
        }
      });

      // Process bookings not already in profiles  
      bookings.forEach(booking => {
        const key = booking.guestPhone || booking.guestEmail;
        if (!profilesMap.has(key)) {
          const profile = profileApi.createProfileFromBooking(booking, callHistory, bookings);
          profilesMap.set(key, profile);
        }
      });

      let profiles = Array.from(profilesMap.values());

      // Apply search filter
      if (query) {
        const searchLower = query.toLowerCase();
        profiles = profiles.filter(profile =>
          profile.name.toLowerCase().includes(searchLower) ||
          profile.email.toLowerCase().includes(searchLower) ||
          profile.phone.includes(query)
        );
      }

      // Apply filters
      if (filters?.source?.length) {
        profiles = profiles.filter(profile => filters.source!.includes(profile.source));
      }

      if (filters?.status?.length) {
        profiles = profiles.filter(profile => filters.status!.includes(profile.status));
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProfiles = profiles.slice(startIndex, endIndex);

      return {
        data: paginatedProfiles,
        success: true,
        pagination: {
          page,
          limit,
          total: profiles.length,
          totalPages: Math.ceil(profiles.length / limit),
        },
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: (error as Error)?.message || 'Failed to search profiles',
      };
    }
  },

  // Helper methods for creating profiles from different sources
  createProfileFromLead: (
    lead: Lead,
    allCalls: CallRecord[],
    allBookings: Booking[]
  ): UserProfile => {
    const userCalls = allCalls.filter(call => call.phoneNumber === lead.phone);
    const userBookings = allBookings.filter(booking => 
      booking.guestEmail === lead.email || booking.guestPhone === lead.phone
    );

    const connectedCalls = userCalls.filter(call => call.status === 'Connected');
    const totalCallDuration = connectedCalls.reduce((sum, call) => sum + call.duration, 0);
    const totalRevenue = userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    const activities: ProfileActivity[] = [];
    
    // Add activities from calls and bookings
    userCalls.forEach(call => {
      activities.push({
        id: `call-${call.id}`,
        type: 'call',
        title: `${call.type} Call - ${call.status}`,
        description: call.notes || call.result,
        date: call.date,
        color: call.status === 'Connected' ? '#10B981' : '#EF4444',
      });
    });

    userBookings.forEach(booking => {
      activities.push({
        id: `booking-${booking.id}`,
        type: 'booking',
        title: `Booking ${booking.status}`,
        description: `${booking.propertyName} - ${booking.nights} nights`,
        date: booking.createdDate,
        color: booking.status === 'Confirmed' ? '#10B981' : '#F59E0B',
      });
    });

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: 'Lead',
      status: lead.status === 'Converted' ? 'Converted' : 
              lead.status === 'Lost' ? 'Lost' : 'Active',
      tags: [lead.priority],
      notes: lead.notes ? [lead.notes] : [],
      createdDate: lead.createdDate,
      lastInteraction: lead.lastContactDate,
      engagementSummary: {
        totalCalls: userCalls.length,
        totalCallDuration,
        lastCallDate: userCalls.length > 0 ? userCalls[0].date : undefined,
        callsConnected: connectedCalls.length,
        callsMissed: userCalls.filter(call => call.status === 'Missed').length,
        totalBookings: userBookings.length,
        totalRevenue,
        averageBookingValue: userBookings.length > 0 ? totalRevenue / userBookings.length : 0,
        conversionRate: userBookings.length > 0 ? 100 : 0,
      },
      activities,
      leadData: lead,
      callHistory: userCalls,
      bookings: userBookings,
      customAttributes: {},
    };
  },

  createProfileFromCall: (
    call: CallRecord,
    allCalls: CallRecord[],
    allBookings: Booking[]
  ): UserProfile => {
    const userCalls = allCalls.filter(c => c.phoneNumber === call.phoneNumber);
    const userBookings = allBookings.filter(booking => booking.guestPhone === call.phoneNumber);

    const connectedCalls = userCalls.filter(c => c.status === 'Connected');
    const totalCallDuration = connectedCalls.reduce((sum, c) => sum + c.duration, 0);
    const totalRevenue = userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    const activities: ProfileActivity[] = userCalls.map(c => ({
      id: `call-${c.id}`,
      type: 'call' as const,
      title: `${c.type} Call - ${c.status}`,
      description: c.notes || c.result,
      date: c.date,
      color: c.status === 'Connected' ? '#10B981' : '#EF4444',
    }));

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      id: call.id,
      name: call.userName,
      email: '',
      phone: call.phoneNumber,
      source: 'Call History',
      status: 'Active',
      tags: [],
      notes: call.notes ? [call.notes] : [],
      createdDate: call.date,
      lastInteraction: call.date,
      engagementSummary: {
        totalCalls: userCalls.length,
        totalCallDuration,
        lastCallDate: call.date,
        callsConnected: connectedCalls.length,
        callsMissed: userCalls.filter(c => c.status === 'Missed').length,
        totalBookings: userBookings.length,
        totalRevenue,
        averageBookingValue: userBookings.length > 0 ? totalRevenue / userBookings.length : 0,
        conversionRate: userBookings.length > 0 ? 100 : 0,
      },
      activities,
      callHistory: userCalls,
      bookings: userBookings,
      customAttributes: {},
    };
  },

  createProfileFromBooking: (
    booking: Booking,
    allCalls: CallRecord[],
    allBookings: Booking[]
  ): UserProfile => {
    const userCalls = allCalls.filter(call => call.phoneNumber === booking.guestPhone);
    const userBookings = allBookings.filter(b => 
      b.guestEmail === booking.guestEmail || b.guestPhone === booking.guestPhone
    );

    const connectedCalls = userCalls.filter(call => call.status === 'Connected');
    const totalCallDuration = connectedCalls.reduce((sum, call) => sum + call.duration, 0);
    const totalRevenue = userBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const activities: ProfileActivity[] = [];
    
    userBookings.forEach(b => {
      activities.push({
        id: `booking-${b.id}`,
        type: 'booking',
        title: `Booking ${b.status}`,
        description: `${b.propertyName} - ${b.nights} nights`,
        date: b.createdDate,
        color: b.status === 'Confirmed' ? '#10B981' : '#F59E0B',
      });
    });

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      id: booking.id,
      name: booking.guestName,
      email: booking.guestEmail,
      phone: booking.guestPhone,
      source: 'Booking',
      status: 'Converted',
      tags: [],
      notes: [],
      createdDate: booking.createdDate,
      lastInteraction: booking.createdDate,
      engagementSummary: {
        totalCalls: userCalls.length,
        totalCallDuration,
        lastCallDate: userCalls.length > 0 ? userCalls[0].date : undefined,
        callsConnected: connectedCalls.length,
        callsMissed: userCalls.filter(call => call.status === 'Missed').length,
        totalBookings: userBookings.length,
        totalRevenue,
        averageBookingValue: totalRevenue / userBookings.length,
        conversionRate: 100,
      },
      activities,
      callHistory: userCalls,
      bookings: userBookings,
      customAttributes: {},
    };
  },
};
