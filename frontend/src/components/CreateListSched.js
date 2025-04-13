import React, { useState } from 'react';
import './styles/CreateListSched.css';
import { useNavigate } from 'react-router-dom';
import { useCreateList } from '../hooks/useCreateList';
import { FiEdit2, FiTrash2, FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

const CreateListSched = () => {
  const {
    schedules,
    isLoading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    formatDateDisplay,
    formatTimeDisplay
  } = useCreateList();

  const [newSchedule, setNewSchedule] = useState({
    course: '',
    subject: '',
    room: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert date to ISO format before sending
      const payload = {
        ...newSchedule,
        date: new Date(newSchedule.date).toISOString() // Add this line
      };
  
      if (editingId) {
        await updateSchedule(editingId, payload); // Use payload instead of newSchedule
      } else {
        await addSchedule(payload); // Use payload instead of newSchedule
      }
      
      // Reset form
      setNewSchedule({
        course: '',
        subject: '',
        room: '',
        date: '',
        startTime: '',
        endTime: ''
      });
    } catch (error) {
      // Error handling is already done in the hook
    }
  };

  const handleEdit = (schedule) => {
    // Convert ISO date back to input format (YYYY-MM-DD)
    const editData = {
      ...schedule,
      date: schedule.date.split('T')[0] // Extract just the date part
    };
    
    setNewSchedule(editData);
    setEditingId(schedule.id);
    document.querySelector('.cls1-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      await deleteSchedule(id);
    }
  };

  if (isLoading) return <div className="cls1-loading">Loading schedules...</div>;
  if (error) return <div className="cls1-error">Error: {error}</div>;

  return (
    <div className="cls1-container">
      <button 
        className="back-button"
        onClick={() => navigate('/dashboard')}
      >
        <FiArrowLeft /> Back to Dashboard
      </button>
      
      <h2>Course Schedule Management</h2>
      
      <form onSubmit={handleSubmit} className="cls1-form">
        <div className="cls1-form-row">
          <div className="cls1-form-group">
            <label>Course</label>
            <input
              type="text"
              name="course"
              value={newSchedule.course}
              onChange={handleInputChange}
              required
              placeholder="e.g. Computer Science"
            />
          </div>
          
          <div className="cls1-form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={newSchedule.subject}
              onChange={handleInputChange}
              required
              placeholder="e.g. Data Structures"
            />
          </div>
          
          <div className="cls1-form-group">
            <label>Room</label>
            <input
              type="text"
              name="room"
              value={newSchedule.room}
              onChange={handleInputChange}
              required
              placeholder="e.g. Room 205"
            />
          </div>
        </div>

        <div className="cls1-form-row">
          <div className="cls1-form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={newSchedule.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="cls1-form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={newSchedule.startTime}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="cls1-form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={newSchedule.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="cls1-form-actions">
          <button type="submit" className="cls1-submit-btn">
            {editingId ? <><FiSave /> Update</> : <><FiSave /> Add Schedule</>}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="cls1-cancel-btn"
              onClick={() => {
                setNewSchedule({
                  course: '',
                  subject: '',
                  room: '',
                  date: '',
                  startTime: '',
                  endTime: ''
                });
                setEditingId(null);
              }}
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="cls1-table-container">
        <h3>Schedules</h3>
        {schedules.length === 0 ? (
          <p>No schedules found. Add one above!</p>
        ) : (
          <table className="cls1-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Subject</th>
                <th>Room</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule.id}>
                  <td>{schedule.course}</td>
                  <td>{schedule.subject}</td>
                  <td>{schedule.room}</td>
                  <td>{formatDateDisplay(schedule.date)}</td>
                  <td>{formatTimeDisplay(schedule.startTime, schedule.endTime)}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(schedule)}
                      className="cls1-edit-btn"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="cls1-delete-btn"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CreateListSched;