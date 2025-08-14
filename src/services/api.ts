import { 
  User, 
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
  BookingFilters
} from '@/types';
import {
  mockUsers,
  mockLeads,
  mockCallRecords,
  mockBookings,
  mockProperties,
  mockDashboardStats,
  mockLeadConversionData,
  mockCityDemandData,
} from '@/data/mockData';

// Transform backend data to match frontend format
function transformBackendData(data: any, endpoint: string): any {
  if (!data) return data;

  const baseEndpoint = endpoint.split('?')[0];
  
  // Transform user data
  if (baseEndpoint.includes('/user/')) {
    if (Array.isArray(data)) {
      return data.map(transformUserData);
    } else {
      return transformUserData(data);
    }
  }
  
  // Transform booking data
  if (baseEndpoint.includes('/booking/')) {
    if (Array.isArray(data)) {
      return data.map(transformBookingData);
    } else {
      return transformBookingData(data);
    }
  }
  
  // Add more transformations for other data types as needed
  return data;
}

// Transform individual booking object
function transformBookingData(backendBooking: any): Booking {
  return {
    id: backendBooking._id,
    bookingReference: backendBooking.bookingReference || `TGS${backendBooking._id.slice(-6)}`,
    guestName: backendBooking.guestName || backendBooking.user?.fullname || '',
    guestEmail: backendBooking.guestEmail || backendBooking.user?.email || '',
    guestPhone: backendBooking.guestPhone || '',
    propertyName: backendBooking.property?.name || backendBooking.propertyName || '',
    propertyId: backendBooking.property?._id || backendBooking.propertyId || '',
    checkInDate: backendBooking.checkInDate || '',
    checkOutDate: backendBooking.checkOutDate || '',
    nights: backendBooking.nights || 1,
    guests: backendBooking.guests || 1,
    baseAmount: backendBooking.baseAmount || backendBooking.amount || 0,
    taxAmount: backendBooking.taxAmount || 0,
    totalAmount: backendBooking.totalAmount || backendBooking.amount || 0,
    status: backendBooking.status || 'Pending',
    paymentStatus: backendBooking.paymentStatus || backendBooking.payment || 'Pending',
    createdDate: backendBooking.createdAt || backendBooking.createdDate || new Date().toISOString(),
    source: backendBooking.source || 'Website',
  };
}

// Transform individual user object
function transformUserData(backendUser: any): User {
  return {
    id: backendUser._id,
    name: backendUser.fullName || backendUser.fullname || '',
    email: backendUser.email || '',
    phone: backendUser.phoneNumber || backendUser.mobile || '',
    role: backendUser.Role === 'admin' ? 'admin' : backendUser.Role === 'user' ? 'agent' : 'agent',
    joinedDate: backendUser.createdAt,
    avatar: backendUser.avatar,
    isActive: true, // Default to true since backend doesn't have this field
  };
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log('🔥 API Call Debug:', { url, endpoint, API_BASE_URL: process.env.VITE_SERVER_URL });
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendResponse = await response.json();
    console.log('🔥 Backend Response:', backendResponse);
    
    // Transform backend response to match frontend expected format
    const transformedData = transformBackendData(backendResponse.data, endpoint);
    console.log('🔥 Transformed Data:', transformedData);
    
    return {
      data: transformedData,
      success: backendResponse.success,
      message: backendResponse.message,
      pagination: backendResponse.pagination,
    };
  } catch (error) {
    console.error('🔥 API call failed:', error);
    console.log('🔥 Falling back to mock data');
    // Fallback to mock data
    return await mockApiCall<T>(endpoint, options);
  }
}

// Fallback to mock data
async function mockApiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(500);
  
  // Map endpoints to mock data
  const mockDataMap: Record<string, any> = {
    '/user/login': { user: mockUsers[0], token: 'mock-token' },
    '/user/getuserbyid': mockUsers[0],
    '/user/getuser': mockUsers,
    '/user/getusers': mockUsers,
    '/property/getproperties': mockProperties,
    '/property/getproperty': mockProperties[0],
    
    // Fixed booking endpoints
    '/booking/getallbooking': mockBookings,
    '/booking/getbooking': mockBookings[0],
    '/booking/createbooking': mockBookings[0],
    '/booking/updatebooking': mockBookings[0],
    '/booking/deletebooking': null,
    '/booking/cancel': mockBookings[0],
    
    '/enquiry/getenquiries': mockLeads,
    '/enquiry/getenquiry': mockLeads[0],
    '/dashboard/stats': mockDashboardStats,
    '/dashboard/lead-conversion': mockLeadConversionData,
    '/dashboard/city-demand': mockCityDemandData,
  };

// Check if this endpoint expects pagination
const paginatedEndpoints = ['/user/getuser', '/user/getusers', '/booking/getallbooking', '/enquiry/getenquiries'];
  const baseEndpoint = endpoint.split('?')[0];
  const data = mockDataMap[baseEndpoint];
  
  if (data) {
    // Check if this endpoint expects pagination
    const paginatedEndpoints = ['/user/getuser', '/user/getusers', '/booking/getbookings', '/enquiry/getenquiries'];
    
    if (paginatedEndpoints.includes(baseEndpoint)) {
      // Extract page and limit from query params
      const url = new URL(`http://localhost${endpoint}`);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = Array.isArray(data) ? data.slice(startIndex, endIndex) : data;
      
      return {
        data: paginatedData,
        success: true,
        pagination: Array.isArray(data) ? {
          page,
          limit,
          total: data.length,
          totalPages: Math.ceil(data.length / limit),
        } : undefined,
      };
    }
    
    return {
      data,
      success: true,
    };
  }

  return {
    data: {} as T,
    success: false,
    message: 'Endpoint not found in mock data',
  };
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiCall<{ user: User; token: string }>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return apiCall<null>('/user/logout', { method: 'POST' });
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiCall<User>('/user/getuserbyid');
  },
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      // Fetch real data from bookings and properties
      const [bookingsResponse, propertiesResponse, leadsResponse] = await Promise.all([
        apiCall<Booking[]>('/booking/getallbooking?limit=1000'), // Get all bookings
        apiCall<Property[]>('/property/getproperties'),
        apiCall<Lead[]>('/enquiry/getenquiries?limit=1000'), // Get all leads
      ]);

      const bookings = bookingsResponse.data || [];
      const properties = propertiesResponse.data || [];
      const leads = leadsResponse.data || [];

      // Calculate real stats
      const totalBookings = bookings.length;
      const totalProperties = properties.length;
      const totalLeads = leads.length;
      
      // Calculate total revenue from confirmed bookings
      const confirmedBookings = bookings.filter(booking => 
        booking.status === 'Confirmed' || booking.status === 'Completed'
      );
      const revenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

      // Calculate growth percentages (simplified - you might want to compare with previous month)
      const revenueGrowth = 12.5; // This would need to be calculated from historical data
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
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      // Fallback to mock data
      return {
        data: mockDashboardStats,
        success: false,
        message: 'Failed to fetch real stats, using mock data',
      };
    }
  },

  getLeadConversion: async (): Promise<ApiResponse<LeadConversionData[]>> => {
    return apiCall<LeadConversionData[]>('/dashboard/lead-conversion');
  },

  getCityDemand: async (): Promise<ApiResponse<CityDemandData[]>> => {
    return apiCall<CityDemandData[]>('/dashboard/city-demand');
  },
};



// Users API
export const usersApi = {
  getUsers: async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    return apiCall<User[]>(`/user/getuser?page=${page}&limit=${limit}`);
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/user/getuserbyid/${id}`);
  },

  createUser: async (userData: Omit<User, 'id' | 'joinedDate'>): Promise<ApiResponse<User>> => {
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

// Leads API (using enquiries endpoint)
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

    return apiCall<Lead[]>(`/enquiry/getenquiries?${params.toString()}`);
  },

  updateLeadStatus: async (id: string, status: Lead['status']): Promise<ApiResponse<Lead>> => {
    return apiCall<Lead>(`/enquiry/updateenquiry/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  assignLead: async (id: string, assignedTo: string): Promise<ApiResponse<Lead>> => {
    return apiCall<Lead>(`/enquiry/assignenquiry/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ assignedTo }),
    });
  },

  createLead: async (leadData: Omit<Lead, 'id' | 'createdDate'>): Promise<ApiResponse<Lead>> => {
    return apiCall<Lead>('/enquiry/add', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  updateLead: async (id: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    return apiCall<Lead>(`/enquiry/updateenquiry/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    return apiCall<null>(`/enquiry/deleteenquiry/${id}`, {
      method: 'DELETE',
    });
  },
};

// Call History API
export const callHistoryApi = {
  getCallHistory: async (
    page = 1, 
    limit = 10, 
    filters?: CallHistoryFilters
  ): Promise<ApiResponse<CallRecord[]>> => {
    await delay(500);
    let filteredCalls = [...mockCallRecords];

    // Apply filters
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
  },

  exportCallHistory: async (filters?: CallHistoryFilters): Promise<ApiResponse<string>> => {
    await delay(1000);
    let filteredCalls = [...mockCallRecords];

    // Apply filters (same logic as getCallHistory)
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
  },
};

// Bookings API
// Bookings API - Fixed version
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

    // Fixed: Removed trailing slash and question mark
    return apiCall<Booking[]>(`/booking/getallbooking?${params.toString()}`);
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>(`/booking/getbooking/${id}`); // More consistent naming
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'createdDate'>): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>('/booking/createbooking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  updateBooking: async (id: string, bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>(`/booking/updatebooking/${id}`, { // More consistent naming
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  deleteBooking: async (id: string): Promise<ApiResponse<null>> => {
    return apiCall<null>(`/booking/deletebooking/${id}`, { // More consistent naming
      method: 'DELETE',
    });
  },

  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>(`/booking/cancel/${id}`, {
      method: 'PUT',
    });
  },

  createManualBooking: async (bookingData: any): Promise<ApiResponse<Booking>> => {
    return apiCall<Booking>('/booking/admin/manual-booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
};

// Properties API
export const propertiesApi = {
  getProperties: async (): Promise<ApiResponse<Property[]>> => {
    return apiCall<Property[]>('/property/getproperties');
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