import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; 
import 'react-toastify/dist/ReactToastify.css';
import './styles/Login.css';
import { FiCalendar, FiActivity, FiShield } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const requestBody = isLogin 
        ? { username, password } 
        : { username, email, password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      toast.success(isLogin ? 'Login successful!' : 'Account created successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      // Use the context login function instead of direct localStorage
      login(data.token, {
        username: data.user.username,
        email: data.user.email,
        id: data.user.id
      });
      
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      let errorMessage = error.message || 'An error occurred';
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark-theme">
      <ToastContainer />
      
      {/* Landing Page Content */}
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">Productivity<span className="accent">App</span></h1>
          <p className="landing-subtitle">Your personal assistant</p>
          
          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon"><FiCalendar /></div>
              <h3>Smart Scheduling</h3>
              <p>Organize your day with our intelligent system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiActivity /></div>
              <h3>Easy Management</h3>
              <p>Simple and intuitive interface</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiShield /></div>
              <h3>Secure Access</h3>
              <p>Your data is always protected</p>
            </div>
          </div>
          
          <button 
            className="cta-button"
            onClick={() => setShowModal(true)}
          >
            Get Started
          </button>
        </div>
      </div>
      
      {/* Auth Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="auth-modal">
            <button 
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            
            <div className="auth-container">
              <div className="auth-header">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="auth-subheader">
                  {isLogin ? 'Sign in to continue to ProductivityApp' : 'Join us to get started'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="dark-input"
                  />
                </div>

                {!isLogin && (
                  <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="dark-input"
                    />
                  </div>
                )}
                
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    className="dark-input"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="auth-button"
                >
                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : isLogin ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>
              
              <div className="auth-footer">
                <p>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="toggle-button"
                    disabled={isLoading}
                  >
                    {isLogin ? ' Sign Up' : ' Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;