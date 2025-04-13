import React, { useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import useStatResult from '../hooks/useStatResult';
import './styles/StatResult.css';
import Calculator from '../tools/Calculator';

const StatResult = () => {
  const navigate = useNavigate();
  const {
    sidebarOpen,
    statsData,
    checkedItems,
    toggleSidebar,
    handleCheckboxChange
  } = useStatResult();

  const location = useLocation();
  const fullGrid = location.state?.fullGrid || JSON.parse(localStorage.getItem('fullGrid')) || [];
  
  
  const [showCalculator, setShowCalculator] = useState(false);

  const [showRoundingModal, setShowRoundingModal] = useState(false);
  const [roundInput, setRoundInput] = useState('');
  const [roundedValue, setRoundedValue] = useState('');


  const handleEditData = () => {
    navigate('/create-stat', { state: { grid: fullGrid } });
  };

  return (
    <div className={`stat-result-container ${sidebarOpen ? 'sidebar-stat-open' : ''}`}>
      <button className="sidebar-stat-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? '◄' : '►'}
      </button>

      <div className="sidebar-stat">
        <div className="sidebar-stat-section">
          <h4 className="sidebar-stat-title">Central tendency</h4>
          {['Mean', 'Median', 'Mode', 'Sum'].map(stat => (
            <label key={stat} className="sidebar-stat-checkbox">
              <input
                type="checkbox"
                checked={checkedItems[stat]}
                onChange={() => handleCheckboxChange(stat)}
              />
              {stat}
            </label>
          ))}
        </div>

        <div className="sidebar-stat-section">
          <h4 className="sidebar-stat-title">Distribution</h4>
          {['Skewness', 'Kurtosis', 'Shapiro-wilk test', 'Q1', 'Q3'].map(stat => (
            <label key={stat} className="sidebar-stat-checkbox">
              <input
                type="checkbox"
                checked={checkedItems[stat]}
                onChange={() => handleCheckboxChange(stat)}
              />
              {stat}
            </label>
          ))}
        </div>

        <div className="sidebar-stat-section">
          <h4 className="sidebar-stat-title">Dispersion</h4>
          {['Standard Deviation', 'MAD', 'IQR', 'Range', 'Maximum', 
            'Coefficient of variation', 'MAD robust', 'Variance', 'Minimum'].map(stat => (
            <label key={stat} className="sidebar-stat-checkbox">
              <input
                type="checkbox"
                checked={checkedItems[stat]}
                onChange={() => handleCheckboxChange(stat)}
              />
              {stat}
            </label>
          ))}
        </div>

        <div className="sidebar-stat-section">
          <h4 className="sidebar-stat-title">Characteristics of Dataset</h4>
          <label className="sidebar-stat-checkbox">
            <input
              type="checkbox"
              checked={checkedItems['Modality']}
              onChange={() => handleCheckboxChange('Modality')}
            />
            Modality
          </label>
        </div>
      </div>

      <div className="stats-container">
        <h2 className="stats-title">Result</h2>
        <button 
          className="back3-button"
          onClick={() => navigate('/dashboard')}
        >
          Home
        </button>
        <button 
          className="Editdata-btn"
          onClick={() => navigate('/stat-module', { state: { fullGrid } })}
        >
          Booklet
        </button>
        <button onClick={handleEditData} className='Editdata-btn'>Edit Data</button>
        <button 
          onClick={() => setShowCalculator(true)} 
          className="Editdata-btn"
        >
          Calculator
        </button>
        <button 
          onClick={() => setShowRoundingModal(true)} 
          className="Editdata-btn"
        >
          Rounding
        </button>
        <h3 className="stats-subtitle">
          Descriptive Statistics
        </h3>     
        <div className="stats-table-container">
          {statsData.map(({ column, stats }) => (
            <div key={column} className="column-stats-container">
              <h3 className='column-id'>Column {column} 📝</h3>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th className="stats-header">Stat</th>
                    <th className="stats-header">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {stats
                    .filter(item => checkedItems[item.stat])
                    .map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'stats-row-even' : 'stats-row-odd'}>
                        <td className="stats-cell stat-name">{item.stat}</td>
                        <td className="stats-cell stat-value">{item.value}</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}
      {showRoundingModal && (
  <div className="modal-overlay">
    <div className="rounding-modal">
      <h3>Rounding Tool</h3>
      <input
        type="number"
        step="any"
        value={roundInput}
        onChange={(e) => setRoundInput(e.target.value)}
        placeholder="Enter a number"
        className="rounding-input"
      />
      <div className="modal-buttons">
        <button 
          onClick={() => {
            const num = parseFloat(roundInput);
            if (!isNaN(num)) {
              setRoundedValue(num.toFixed(2));
            }
          }}
          className="apply-button"
        >
          Apply
        </button>
        <button 
          onClick={() => setShowRoundingModal(false)}
          className="cancel-button"
        >
          Close
        </button>
      </div>
      {roundedValue && (
        <p className="rounded-result">Rounded: {roundedValue}</p>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default StatResult;