import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SchedulePage from './components/SchedulePage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateListSched from './components/CreateListSched';
import CreateDocs from './components/CreateDocs';
import AttendancePage from './components/AttendancePage';
import StatResult from './components/StatResult'; 
import StatModule from './components/StatModule';
import CreateStat from './components/CreateStat';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Router>
        <AuthProvider>  {/* Now inside Router */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/createlistsched" element={<CreateListSched />} />
              <Route path="/create-docs" element={<CreateDocs />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/stat-result" element={<StatResult />} />
              <Route path="/create-stat" element={<CreateStat />} />
              <Route path="/stat-module" element={<StatModule />} />
            </Route>
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </AuthProvider>
       
      </Router>
    </div>
  );
};

export default App;