// src/services/apiService.js

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

// Helper function to handle API requests
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Blood Requests
export const fetchBloodRequests = async (page = 1, limit = 10, filters = {}) => {
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters
  }).toString();
  
  return await apiRequest(`/blood-requests?${queryParams}`, 'GET', null, token);
};

export const createBloodRequest = async (requestData) => {
  const token = localStorage.getItem('token');
  return await apiRequest('/blood-requests', 'POST', requestData, token);
};

export const updateBloodRequest = async (requestId, requestData) => {
  const token = localStorage.getItem('token');
  return await apiRequest(`/blood-requests/${requestId}`, 'PUT', requestData, token);
};

export const deleteBloodRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  return await apiRequest(`/blood-requests/${requestId}`, 'DELETE', null, token);
};

// Authentication
export const login = async (credentials) => {
  return await apiRequest('/auth/login', 'POST', credentials);
};

export const register = async (userData) => {
  return await apiRequest('/auth/register', 'POST', userData);
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  return await apiRequest('/auth/me', 'GET', null, token);
};

// User Actions
export const offerToDonate = async (requestId) => {
  const token = localStorage.getItem('token');
  return await apiRequest(`/requests/${requestId}/donate`, 'POST', null, token);
};

export const revealContact = async (requestId) => {
  const token = localStorage.getItem('token');
  return await apiRequest(`/requests/${requestId}/reveal-contact`, 'POST', null, token);
};

export const reportRequest = async (requestId, reason) => {
  const token = localStorage.getItem('token');
  return await apiRequest(`/requests/${requestId}/report`, 'POST', { reason }, token);
};

// User Profile
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  return await apiRequest('/users/profile', 'PUT', profileData, token);
};

export const getUserRequests = async (userId) => {
  const token = localStorage.getItem('token');
  return await apiRequest(`/users/${userId}/requests`, 'GET', null, token);
};

// Utility
export const calculateDistance = async (userLocation, targetLocation) => {
  const token = localStorage.getItem('token');
  return await apiRequest('/utils/distance', 'POST', { userLocation, targetLocation }, token);
};

export default {
  // Blood Requests
  fetchBloodRequests,
  createBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
  
  // Auth
  login,
  register,
  getCurrentUser,
  
  // User Actions
  offerToDonate,
  revealContact,
  reportRequest,
  
  // Profile
  updateProfile,
  getUserRequests,
  
  // Utility
  calculateDistance
};