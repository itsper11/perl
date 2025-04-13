import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

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
  
  // Normalize MongoDB data to match frontend expectations
  const normalizeTask = (task) => ({
    ...task,
    id: task._id // Map _id to id for frontend compatibility
  });

  // Fetch all schedules with authentication
  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/schedules`, getAuthHeaders());
      setSchedules(response.data.map(normalizeTask));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        return;
      }
      setError('Failed to fetch schedules. Please try again later.');
      console.error('Error details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
    
  // Add a new schedule with authentication
  const addSchedule = async (taskData) => {
    try {
      const response = await axios.post(
        `${API_URL}/schedules`, 
        { ...taskData, completed: false },
        getAuthHeaders()
      );
      
      const newTask = normalizeTask(response.data);
      setSchedules(prev => [...prev, newTask]);
      
      return { 
        success: true,
        data: newTask
      };
    } catch (err) {
      const errorMessage = err.response?.status === 401
        ? 'Session expired. Please login again.'
        : 'Failed to add task. Please try again.';
        
      setError(errorMessage);
      console.error('Error adding task:', err);
      return { 
        success: false, 
        error: err.message
      };
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(
        `${API_URL}/schedules/${id}/toggle`,
        { completed },
        getAuthHeaders()
      );      
      
      // Optimistically update the UI
      setSchedules(prev => prev.map(task => 
        task.id === id ? { ...task, completed } : task
      ));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.status === 401
        ? 'Not authorized to update this task.'
        : 'Failed to update task status. Please try again.';
      
      setError(errorMessage);
      console.error('Error toggling completion:', err);
      
      // Revert the optimistic update
      setSchedules(prev => prev.map(task => 
        task.id === id ? { ...task, completed: !completed } : task
      ));
      
      return { 
        success: false, 
        error: err
      };
    }
  };

  // Delete a schedule with authentication
  const deleteSchedule = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/schedules/${id}`, 
        getAuthHeaders()
      );
      setSchedules(prev => prev.filter(task => task.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.status === 401
        ? 'Not authorized to delete this task.'
        : 'Failed to delete task. Please try again.';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return { 
        success: false, 
        error: err
      };
    }
  };

  // Enhanced date/time formatting
  const formatDateTime = (dateString, timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date(dateString);
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return `${dateString} at ${timeString}`;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);
  
  return {
    schedules,
    isLoading,
    error,
    addSchedule,
    deleteSchedule,
    formatDateTime,
    toggleComplete, 
    fetchSchedules,
    getAuthToken
  };
};

// Time picker hook remains unchanged
export const useTimePicker = (initialState = { hours: '12', minutes: '00', ampm: 'PM' }) => {
  const [time, setTime] = useState(initialState);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (field, value) => {
    let newValue = value;
    
    if (field === 'hours') {
      const numValue = parseInt(value, 10) || 1;
      newValue = Math.max(1, Math.min(12, numValue)).toString();
    } else if (field === 'minutes') {
      const numValue = parseInt(value, 10) || 0;
      newValue = Math.max(0, Math.min(59, numValue)).toString().padStart(2, '0');
    }
    
    setTime(prev => ({ ...prev, [field]: newValue }));
  };

  const incrementTime = (field) => {
    if (field === 'hours') {
      const current = parseInt(time.hours, 10);
      const newValue = current === 12 ? 1 : current + 1;
      handleTimeChange('hours', newValue.toString());
    } else if (field === 'minutes') {
      const current = parseInt(time.minutes, 10);
      const newValue = current === 59 ? 0 : current + 1;
      handleTimeChange('minutes', newValue.toString().padStart(2, '0'));
    }
  };

  const decrementTime = (field) => {
    if (field === 'hours') {
      const current = parseInt(time.hours, 10);
      const newValue = current === 1 ? 12 : current - 1;
      handleTimeChange('hours', newValue.toString());
    } else if (field === 'minutes') {
      const current = parseInt(time.minutes, 10);
      const newValue = current === 0 ? 59 : current - 1;
      handleTimeChange('minutes', newValue.toString().padStart(2, '0'));
    }
  };

  const toggleAMPM = () => {
    setTime(prev => ({
      ...prev,
      ampm: prev.ampm === 'AM' ? 'PM' : 'AM'
    }));
  };

  const displayTimeValue = () => {
    try {
      const hours24 = parseInt(time.hours, 10) + (time.ampm === 'PM' && parseInt(time.hours, 10) !== 12 ? 12 : 0);
      const date = new Date();
      date.setHours(hours24);
      date.setMinutes(parseInt(time.minutes, 10));
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      console.error('Error displaying time:', err);
      return `${time.hours}:${time.minutes} ${time.ampm}`;
    }
  };

  const get24HourTime = () => {
    try {
      let hours24 = parseInt(time.hours, 10);
      if (time.ampm === 'PM' && hours24 < 12) hours24 += 12;
      if (time.ampm === 'AM' && hours24 === 12) hours24 = 0;
      return `${hours24.toString().padStart(2, '0')}:${time.minutes}`;
    } catch (err) {
      console.error('Error converting to 24-hour time:', err);
      return '12:00';
    }
  };

  return {
    time,
    showTimePicker,
    setShowTimePicker,
    handleTimeChange,
    incrementTime,
    decrementTime,
    toggleAMPM,
    displayTimeValue,
    get24HourTime
  };
};