import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useCreateList = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to create auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
  };

  // Fetch all course schedules
  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/mylistsched`, getAuthHeaders());
      setSchedules(response.data);
    } catch (err) {
      handleApiError(err, 'fetch');
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  // Add a new course schedule
  const addSchedule = async (scheduleData) => {
    try {
      const payload = {
        ...scheduleData,
        date: new Date(scheduleData.date).toISOString(),
        user: localStorage.getItem('token') // Or your auth context user ID
      };
  
      const response = await axios.post(
        `${API_URL}/mylistsched`,
        payload,
        getAuthHeaders()
      );
      
      setSchedules(prev => [...prev, response.data]);
      return { 
        success: true,
        data: response.data
      };
    } catch (err) {
      console.error('Add schedule error:', err.response?.data);
      return handleApiError(err, 'add');
    }
  };

  // Update an existing schedule
  const updateSchedule = async (id, scheduleData) => {
    try {
      const response = await axios.put(
        `${API_URL}/mylistsched/${id}`,
        scheduleData,
        getAuthHeaders()
      );
      setSchedules(prev => prev.map(item => 
        item.id === id ? response.data : item
      ));
      return { success: true, data: response.data };
    } catch (err) {
      return handleApiError(err, 'update');
    }
  };

  // Delete a schedule
  const deleteSchedule = async (id) => {
    try {
      await axios.delete(`${API_URL}/mylistsched/${id}`, getAuthHeaders());
      setSchedules(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      return handleApiError(err, 'delete');
    }
  };

  // Handle API errors consistently
  const handleApiError = (err, action) => {
    let errorMessage = `Failed to ${action} schedule. Please try again.`;
    
    if (err.response?.status === 401) {
      errorMessage = 'Session expired. Please login again.';
      localStorage.removeItem('token');
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    setError(errorMessage);
    console.error(`Error ${action}ing schedule:`, err);
    
    return { 
      success: false, 
      error: errorMessage,
      details: err.response?.data?.details
    };
  };

  // Format date for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  // Format time range for display
  const formatTimeDisplay = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    try {
      return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
    } catch (err) {
      console.error('Error formatting time:', err);
      return `${startTime} - ${endTime}`;
    }
  };

  // Helper to format single time value
  const formatSingleTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Initial fetch
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]); // ✅ no more ESLint warning
  

  return {
    schedules,
    isLoading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    fetchSchedules,
    formatDateDisplay,
    formatTimeDisplay
  };
};