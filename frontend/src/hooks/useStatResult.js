import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const calculateStatistics = (data) => {
  if (!data || data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / data.length;
  const median = sorted.length % 2 === 0 
    ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 
    : sorted[Math.floor(sorted.length / 2)];
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const frequency = {};
  data.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });
  const modeEntries = Object.entries(frequency);
  const maxFrequency = Math.max(...modeEntries.map(([_, freq]) => freq));
  const modes = modeEntries.filter(([_, freq]) => freq === maxFrequency).map(([val]) => val);

  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  const mad = data.reduce((a, b) => a + Math.abs(b - mean), 0) / data.length;
  const madRobust = data.reduce((a, b) => a + Math.abs(b - median), 0) / data.length;

  // Kurtosis (excess kurtosis using Pearson's definition)
  const n = data.length;
  const fourthMoment = data.reduce((a, b) => a + Math.pow(b - mean, 4), 0) / n;
  const kurtosis = (fourthMoment / Math.pow(stdDev, 4)) - 3;

  // Skewness
  const skewness = (3 * (mean - median)) / stdDev;

  // Determine modality
  let modality = '';
  const allSameFrequency = Object.values(frequency).every(freq => freq === 1);
  
  if (allSameFrequency) {
    modality = 'No clear mode';
  } else if (modes.length === 1) {
    modality = 'Unimodal';
  } else if (modes.length === 2) {
    modality = 'Bimodal';
  } else if (modes.length > 2) {
    modality = 'Multimodal';
  }
  
  return [
    { stat: 'Count', value: data.length },
    { stat: 'Sum', value: sum.toFixed(4) },
    { stat: 'Mean', value: mean.toFixed(4) },
    { stat: 'Median', value: median.toFixed(4) },
    { stat: 'Mode', value: modes.join(', ') },
    { stat: 'Standard Deviation', value: stdDev.toFixed(4) },
    { stat: 'Variance', value: variance.toFixed(4) },
    { stat: 'Range', value: range.toFixed(4) },
    { stat: 'Minimum', value: min.toFixed(4) },
    { stat: 'Maximum', value: max.toFixed(4) },
    { stat: 'IQR', value: iqr.toFixed(4) },
    { stat: 'MAD', value: mad.toFixed(4) },
    { stat: 'MAD robust', value: madRobust.toFixed(4) },
    { stat: 'Q1', value: q1.toFixed(4) },
    { stat: 'Q3', value: q3.toFixed(4) },
    { stat: 'Skewness', value: skewness.toFixed(4) },
    { stat: 'Kurtosis', value: kurtosis.toFixed(4) },
    { stat: 'Modality', value: modality },
    { stat: 'Coefficient of variation', value: ((stdDev / mean) * 100).toFixed(4) + '%' },
    { stat: 'Shapiro-wilk test', value: 'Not available in-browser' }
  ];
};

const useStatResult = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({
    // Central Tendency
    'Mode': true,
    'Median': true,
    'Mean': true,
    // Distribution
    'Skewness': false,
    'Kurtosis': false,
    'Shapiro-wilk test': false,
    'Sum': false,
    // Dispersion
    'Standard Deviation': true,
    'MAD': false,
    'IQR': false,
    'Range': true,
    'Maximum': true,
    'Coefficient of variation': false,
    'MAD robust': false,
    'Variance': true,
    'Minimum': true,
    'Q1': false,
    'Q3': false,
    //Modality
    'Modality': false
  });

  useEffect(() => {
    if (location.state?.data) {
      const data = location.state.data;
      const columnStats = [];
  
      // Handle both grid (2D array) and flat array cases
      if (Array.isArray(data[0])) {
        // Grid structure (2D array)
        for (let col = 0; col < data[0].length; col++) {
          const columnData = data
            .map(row => parseFloat(row[col]))
            .filter(val => !isNaN(val));
  
          if (columnData.length > 0) {
            columnStats.push({
              column: String.fromCharCode(65 + col),
              stats: calculateStatistics(columnData)
            });
          }
        }
      } else {
        // Flat array case
        const numericData = data.map(val => parseFloat(val)).filter(val => !isNaN(val));
        if (numericData.length > 0) {
          columnStats.push({
            column: 'Data',
            stats: calculateStatistics(numericData)
          });
        }
      }
  
      setStatsData(columnStats);
    }
  }, [location.state]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCheckboxChange = (stat) => {
    setCheckedItems(prev => ({
      ...prev,
      [stat]: !prev[stat]
    }));
  };

  return {
    sidebarOpen,
    statsData,
    checkedItems,
    toggleSidebar,
    handleCheckboxChange
  };
};

export default useStatResult;