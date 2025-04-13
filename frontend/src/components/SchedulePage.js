import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedule, useTimePicker } from '../hooks/useSchedule';
import './styles/SchedulePage.css';

const SchedulePage = () => {
  const [newSchedule, setNewSchedule] = useState({ 
    title: '', 
    date: '',
    completed: false 
  });
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  
  // Using our custom hooks
  const {
    schedules,
    isLoading,
    error,
    addSchedule,
    deleteSchedule,
    toggleComplete,
    formatDateTime
  } = useSchedule();

  const {
    time,
    showTimePicker,
    setShowTimePicker,
    incrementTime,
    decrementTime,
    toggleAMPM,
    displayTimeValue,
    get24HourTime
  } = useTimePicker();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('You need to be logged in to view schedules.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!newSchedule.title.trim() || !newSchedule.date) {
      return;
    }
    
    const timeString = get24HourTime();
    
    const result = await addSchedule({
      title: newSchedule.title,
      date: newSchedule.date,
      time: timeString,
      completed: false // Default to not completed
    });

    if (result.success) {
      setNewSchedule({ title: '', date: '', completed: false });
    } else if (String(result.error).includes('401')) {
      setAuthError('Session expired. Please log in again.');
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const result = await toggleComplete(id, !currentStatus);
    if (result?.error?.includes('401')) {
      setAuthError('Session expired. Please log in again.');
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteSchedule(id);
    if (result?.error?.includes('401')) {
      setAuthError('Session expired. Please log in again.');
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="schedule-container">
    <button 
      className="back-button"
      onClick={() => navigate('/dashboard')}
    >
      ← Back to Dashboard
    </button>
      <header className="schedule-header">
        <h1>To Do List</h1>
        <p>Manage your upcoming events and appointments</p>
      </header>

      {authError && (
        <div className="auth-error-message">
          <p>{authError}</p>
          <button 
            className="auth-error-button"
            onClick={redirectToLogin}
          >
            Go to Login
          </button>
        </div>
      )}

<div className="schedule-content">
  <section className="add-schedule-section">
    <h2>Add New Task</h2>  {/* Changed from "Event" to "Task" */}
    <form onSubmit={handleSubmit} className="schedule-form">
      <div className="form-group">
        <label htmlFor="title">Task Title</label>  {/* Changed from "Event Title" */}
        <input
          id="title"
          type="text"
          placeholder="Enter task description"
          value={newSchedule.title}
          onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
          required
          disabled={!!authError}
        />
      </div>
      
      <div className="datetime-container">
        <div className="form-group">
          <label htmlFor="date">Due Date</label>  {/* Changed from "Event Date" */}
          <input
            id="date"
            type="date"
            value={newSchedule.date}
            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
            required
            disabled={!!authError}
          />
        </div>
        
        {/* Keep your existing time picker component */}
        <div className="form-group time-picker-group">
          <label>Due Time</label>  {/* Changed from "Event Time" */}
          <div 
            className="time-display"
            onClick={() => !authError && setShowTimePicker(!showTimePicker)}
            style={{ cursor: authError ? 'not-allowed' : 'pointer' }}
          >
            {displayTimeValue()}
          </div>
          
          {showTimePicker && !authError && (
  <div className="time-picker-popup">
    <div className="time-spinner">
      <button 
        type="button" 
        className="spinner-button up"
        onClick={() => incrementTime('hours')}
      >
        ↑
      </button>
      <div className="time-value">{time.hours}</div>
      <button 
        type="button" 
        className="spinner-button down"
        onClick={() => decrementTime('hours')}
      >
        ↓
      </button>
    </div>
    
    <div className="time-separator">:</div>
    
    <div className="time-spinner">
      <button 
        type="button" 
        className="spinner-button up"
        onClick={() => incrementTime('minutes')}
      >
        ↑
      </button>
      <div className="time-value">{time.minutes}</div>
      <button 
        type="button" 
        className="spinner-button down"
        onClick={() => decrementTime('minutes')}
      >
        ↓
      </button>
    </div>
    
    <div className="ampm-toggle" onClick={toggleAMPM}>
      {time.ampm}
    </div>
  </div>
)}
        </div>
      </div>
      
      <button 
        type="submit" 
        className="submit-btn"
        disabled={!!authError}
      >
        Add Task  {/* Changed from "Add Event" */}
      </button>
    </form>
  </section>

  <section className="schedule-list-section">
    <h2>Your Tasks</h2>  {/* Changed from "Upcoming Events" */}
    
    {isLoading ? (
      <div className="loading-spinner"></div>
    ) : error ? (
      <div className="error-message">
        {error.includes('401') ? (
          <>
            <p>Authentication required to view tasks.</p>
            <button 
              className="error-login-button"
              onClick={redirectToLogin}
            >
              Login
            </button>
          </>
        ) : (
          <p>{error}</p>
        )}
      </div>
    ) : schedules.length === 0 ? (
      <div className="empty-state">
        <p>No tasks yet.</p>  {/* Changed from "No events scheduled yet" */}
        <p>Add your first task using the form above.</p>
      </div>
    ) : (
      <ul className="schedule-items">
        {schedules.map((schedule) => (
          <li 
            key={schedule.id} 
            className={`schedule-item ${schedule.completed ? 'completed' : ''}`}
          >
            {/* Add checkbox input */}
            <div className="task-checkbox">
              <input
                type="checkbox"
                checked={schedule.completed}
                onChange={() => handleToggleComplete(schedule.id, schedule.completed)}
                id={`task-${schedule.id}`}
                disabled={!!authError}
              />
              <label htmlFor={`task-${schedule.id}`}></label>
            </div>
            
            <div className="schedule-details">
              <h3 className="schedule-title">{schedule.title}</h3>
              <time className="schedule-date">
                {formatDateTime(schedule.date, schedule.time)}
              </time>
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDelete(schedule.id)}
              aria-label={`Delete ${schedule.title}`}
              disabled={!!authError}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
</div>
    </div>
  );
};

export default SchedulePage;