import React, { useState } from 'react';
import useAttendance from '../hooks/useAttendance';
import { useNavigate } from 'react-router-dom';
import './styles/AttendancePage.css';

const AttendancePage = () => {
  const { records, loading, error, success, addRecord, deleteRecord, updateRecord } = useAttendance();
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [status, setStatus] = useState('Present');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    course: '',
    yearLevel: '',
    status: 'Present'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !course || !yearLevel) return;

    await addRecord({ name, course, yearLevel, status });
    setName('');
    setCourse('');
    setYearLevel('');
    setStatus('Present');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteRecord(id);
    }
  };

  const handleEditClick = (record) => {
    setEditingId(record._id);
    setEditFormData({
      name: record.name,
      course: record.course,
      yearLevel: record.yearLevel,
      status: record.status
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (id) => {
    await updateRecord(id, editFormData);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      case 'Excuse': return 'status-excuse';
      default: return '';
    }
  };

  return (
    <div className="attendance-container">
      <button 
        className="return-button"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </button>
      <h1>📋 Attendance Manager</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="attendance-form">
        <input
          type="text"
          className="form-input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-input"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-input"
          placeholder="Year Level/Section"
          value={yearLevel}
          onChange={(e) => setYearLevel(e.target.value)}
          required
        />

        <div className="radio-group">
          {['Present', 'Absent', 'Excuse'].map((option) => (
            <label key={option} className="radio-label">
              <input
                type="radio"
                className="radio-input"
                value={option}
                checked={status === option}
                onChange={(e) => setStatus(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>

        <button type="submit" className="submit-button">
          Mark Attendance
        </button>
      </form>

      {loading ? (
        <p className="Loading-p">Loading records...</p>
      ) : (
        <div>
          <h2 className="H2-title">Attendance Records</h2>
          <table className="records-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Course</th>
                <th className="table-header">Year Level</th>
                <th className="table-header">Status</th>
                <th className="table-header">Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className="table-row">
                  {editingId === record._id ? (
                    <>
                      <td className="table-cell">
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                          className="form-input"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="text"
                          name="course"
                          value={editFormData.course}
                          onChange={handleEditFormChange}
                          className="form-input"
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="text"
                          name="yearLevel"
                          value={editFormData.yearLevel}
                          onChange={handleEditFormChange}
                          className="form-input"
                        />
                      </td>
                      <td className="table-cell">
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditFormChange}
                          className="form-input"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Excuse">Excuse</option>
                        </select>
                      </td>
                      <td className="table-cell">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="table-cell action-buttons">
                        <button 
                          onClick={() => handleEditSubmit(record._id)}
                          className="save-button"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="table-cell">{record.name}</td>
                      <td className="table-cell">{record.course}</td>
                      <td className="table-cell">{record.yearLevel}</td>
                      <td className={`table-cell ${getStatusClass(record.status)}`}>
                        {record.status}
                      </td>
                      <td className="table-cell">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="table-cell action-buttons">
                        <button 
                          onClick={() => handleEditClick(record)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(record._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;