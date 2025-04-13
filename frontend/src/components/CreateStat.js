import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import useStat from '../hooks/useStat';
import './styles/CreateStat.css';

const CreateStat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialGrid = location.state?.grid || null;

  const {
    grid,
    activeCell,
    columns,
    handleCellClick,
    handleCellChange,
    handleKeyDown,
    addRow,
    addColumn,
    selectedColumnName,
    deleteColumn,
    deleteRow
  } = useStat(undefined, undefined, initialGrid);

  const handleShowStatistics = () => {
    // Extract numeric data from grid
    const numericData = [];
    grid.forEach(row => {
      row.forEach(cell => {
        const num = parseFloat(cell);
        if (!isNaN(num)) {
          numericData.push(num);
        }
      });
    });
  
    navigate('/stat-result', { 
      state: { 
        data: grid, // Send the grid instead of numericData
        fullGrid: grid, 
        columnName: selectedColumnName
      } 
    });
    
  };
  

  return (
    <div className="create-stat-container">
      <div className='stat-button'>
      <button 
          className='descriptive-btn' 
          onClick={handleShowStatistics}
        >
          Descriptive Statistics
        </button>
        <button className='add-row-btn' onClick={addRow}>Add Row</button>
        <button className='add-column-btn' onClick={addColumn}>Add Column</button>
        <button className='add-column-btn' 
        onClick={() => navigate('/dashboard')}
        >Back to Dashboard</button>
      </div>
      
      <div className="spreadsheet-container">
        <table className="spreadsheet-table">
        <thead>
          <tr>
            <th className="corner-cell"></th>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="column-header" 
                onClick={() => {
                  const confirmDelete = window.confirm(`Do you want to remove this column`);
                  if (confirmDelete) {
                    deleteColumn(index);
                  }
                }}
                title={`Click to delete column`}
                style={{ cursor: 'pointer'}}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td
                className="row-header"
                onClick={() => {
                  const confirmDelete = window.confirm(`Do you want to remove this row?`);
                  if (confirmDelete) {
                    deleteRow(rowIndex);
                  }
                }}
                title="Click to delete row"
                style={{ cursor: 'pointer' }}
              >
                {rowIndex + 1}
              </td>
              {row.map((cell, colIndex) => (
                <td 
                  key={colIndex}
                  className={`cell ${activeCell?.row === rowIndex && activeCell?.col === colIndex ? 'active' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {activeCell?.row === rowIndex && activeCell?.col === colIndex ? (
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      autoFocus
                    />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
         
        </table>
      </div>
    </div>
  );
};

export default CreateStat;