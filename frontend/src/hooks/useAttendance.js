import { useState, useEffect } from 'react';
import axios from 'axios';

const useAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/attendance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecords(res.data);
      setSuccess('Records loaded successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance records');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (record) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/attendance', record, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecords([res.data, ...records]);
      setSuccess('Attendance recorded successfully');
      return true; // Return success status
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add attendance record');
      console.error('Add record error:', err);
      return false; // Return failure status
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (id, updatedRecord) => {
    console.log('Attempting to update record with ID:', id); // Debug log
    console.log('Updated data:', updatedRecord); // Debug log
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      console.log('Using token:', token); // Debug log
      
      const res = await axios.put(
        `http://localhost:5000/api/attendance/${id}`,
        updatedRecord,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Update response:', res.data); // Debug log
      
      setRecords(records.map(record => 
        record._id === id ? res.data : record
      ));
      setSuccess('Record updated successfully');
      return true;
    } catch (err) {
      console.error('Full error object:', err); // Debug log
      console.error('Error response:', err.response); // Debug log
      setError(err.response?.data?.message || 'Failed to update record');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/attendance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecords(records.filter(record => record._id !== id));
      setSuccess('Record deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record');
      console.error('Delete error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return { 
    records, 
    loading, 
    error,
    success,
    addRecord, 
    updateRecord,
    deleteRecord,
    fetchRecords // For manual refreshes
  };
};

export default useAttendance;