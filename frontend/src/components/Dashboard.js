import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiCalendar, FiCheckSquare, FiClock, FiBookOpen, FiDivideSquare  } from 'react-icons/fi';
import './styles/Dashboard.css';
import ProfilePic from '../assets/luffy.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

// Mock data
const currentUser = {
  name: user?.username || "User",
  email: user?.email || "user@example.com",
  avatar: ProfilePic,
  role: "Premium Member"
};

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={currentUser} />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ProfileSection user={currentUser} />;
    }
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
      
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className="dashboard-title">Dashboard</h1>
      </div>
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-info">
            <img src={currentUser.avatar} alt="User" className="user-avatar" />
            {sidebarOpen && (
              <div>
                <h3>{currentUser.name}</h3>
                <p className="user-role">{currentUser.role}</p>
              </div>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser className="nav-icon" />
              {sidebarOpen && <span>Profile</span>}
            </li>

            <li onClick={() => navigate('/schedule')}>
              <FiCheckSquare className="nav-icon" />
              {sidebarOpen && <span>To Do List</span>}
            </li>

            <li onClick={() => navigate('/createlistsched')}>
              <FiCalendar className="nav-icon" />
              {sidebarOpen && <span>Schedule</span>}
            </li>

            <li onClick={() => navigate('/create-docs')}>
              <FiBookOpen className="nav-icon" />
              {sidebarOpen && <span>Documents</span>}
            </li>

            <li onClick={() => navigate('/attendance')}>
              <FiClock className="nav-icon" />
              {sidebarOpen && <span>Attendance</span>}
            </li>

            <li onClick={() => navigate('/create-stat')}>
              <FiDivideSquare className="nav-icon" />
              {sidebarOpen && <span>Statistics</span>}
            </li>

            <li 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings className="nav-icon" />
              {sidebarOpen && <span>Settings</span>}
            </li>
          </ul>
        </nav>     
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <FiLogOut className="nav-icon" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

// Sub-components
const ProfileSection = ({ user }) => (
  <div className="content-section">
    <h2>Profile Information</h2>
    <div className="profile-card">
      <div className="profile-header">
        <img src={user.avatar} alt="Profile" className="profile-avatar" />
        <div>
          <h3>{user.name}</h3>
          <p className="user-email">{user.email}</p>
          <span className="user-badge">{user.role}</span>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="detail-item">
          <label>Member Since</label>
          <p>January 2022</p>
        </div>
        <div className="detail-item">
          <label>Last Active</label>
          <p>Today at 09:45 AM</p>
        </div>
        <div className="detail-item">
          <label>Account Status</label>
          <p className="status-active">Active</p>
        </div>
      </div>
    </div>
  </div>
);

const SettingsSection = () => (
  <div className="content-section">
    <h2>Account Settings</h2>
    <div className="settings-grid">
      <div className="settings-card">
        <h3>Personal Information</h3>
        <form className="settings-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" defaultValue="Alex Johnson" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue="alex.johnson@example.com" />
          </div>
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
      
      <div className="settings-card">
        <h3>Security</h3>
        <div className="security-item">
          <div>
            <h4>Password</h4>
            <p>Last changed 3 months ago</p>
          </div>
          <button className="change-btn">Change</button>
        </div>
        <div className="security-item">
          <div>
            <h4>Two-Factor Authentication</h4>
            <p>Disabled</p>
          </div>
          <button className="change-btn">Enable</button>
        </div>
      </div>
      
      <div className="settings-card">
        <h3>Preferences</h3>
        <div className="preference-item">
          <label>Dark Mode</label>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="preference-item">
          <label>Email Notifications</label>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;