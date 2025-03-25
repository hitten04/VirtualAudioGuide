import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service functions
const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/token/`, credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/register/', userData);
    return response.data;
  },
  
  // Places endpoints
  getPlaces: async () => {
    try {
      const response = await apiClient.get('/places/');
      return response.data;
    } catch (error) {
      console.error('Error fetching places:', error);
      return { results: [] };
    }
  },
  
  getPlace: async (id) => {
    const response = await apiClient.get(`/places/${id}/`);
    return response.data;
  },
  
  getFeaturedPlaces: async () => {
    try {
      const response = await apiClient.get('/featured-places/');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured places:', error);
      return { results: [] };
    }
  },
  
  // Packages endpoints
  getPackages: async () => {
    try {
      const response = await apiClient.get('/packages/');
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      // Return a default structure with empty results to prevent error when destructuring
      return { results: [] };
    }
  },
  
  getPackage: async (id) => {
    const response = await apiClient.get(`/packages/${id}/`);
    return response.data;
  },
  
  getPackageById: async (id) => {
    const response = await apiClient.get(`/packages/${id}/`);
    return response.data;
  },
  
  getFeaturedPackages: async () => {
    try {
      const response = await apiClient.get('/featured-packages/');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured packages:', error);
      return { results: [] };
    }
  },
  
  // User profile
  getUserProfile: async () => {
    const response = await apiClient.get('/profile/');
    return response.data;
  },
  
  updateUserProfile: async (profileData) => {
    const response = await apiClient.patch('/profile/', profileData);
    return response.data;
  },
  
  // Bookings
  getBookings: async () => {
    const response = await apiClient.get('/bookings/');
    return response.data;
  },
  
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings/', bookingData);
    return response.data;
  },
};

export default apiService; 