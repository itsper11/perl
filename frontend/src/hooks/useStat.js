import { useState } from 'react';

const generateColumnHeaders = (count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    let colName = '';
    let n = i;
    while (n >= 0) {
      colName = String.fromCharCode(65 + (n % 26)) + colName;
      n = Math.floor(n / 26) - 1;
    }
    result.push(colName);
  }
  return result;
};


const useStat = (initialRows = 15, initialCols = 7, initialGrid = null) => {
  const [grid, setGrid] = useState(
    initialGrid || Array(initialRows).fill().map(() => Array(initialCols).fill(''))
  );
  const [activeCell, setActiveCell] = useState(null);
  const [columnCount, setColumnCount] = useState(initialGrid ? initialGrid[0].length : initialCols);
  const [rowCount, setRowCount] = useState(initialGrid ? initialGrid.length : initialRows);
  const [selectedColumnName, setSelectedColumnName] = useState(null);
  const columns = generateColumnHeaders(columnCount);

  const handleCellClick = (rowIndex, colIndex) => {
    setActiveCell({ row: rowIndex, col: colIndex });
    setSelectedColumnName(columns[colIndex]);
  };

  const handleCellChange = (e, row, col) => {
    const newValue = e.target.value;
    const newGrid = [...grid];
    newGrid[row][col] = newValue;
    setGrid(newGrid);
  };

  const handleKeyDown = (e, row, col) => {
    if (e.key === 'ArrowRight' && col < columnCount - 1) {
      setActiveCell({ row, col: col + 1 });
    } else if (e.key === 'ArrowLeft' && col > 0) {
      setActiveCell({ row, col: col - 1 });
    } else if (e.key === 'ArrowDown' && row < rowCount - 1) {
      setActiveCell({ row: row + 1, col });
    } else if (e.key === 'ArrowUp' && row > 0) {
      setActiveCell({ row: row - 1, col });
    }
  };

  const addRow = () => {
    setRowCount(prev => prev + 1);
    setGrid(prev => [...prev, Array(columnCount).fill('')]);
  };

  const addColumn = () => {
    setColumnCount(prev => prev + 1);
    setGrid(prev => prev.map(row => [...row, '']));
  };

  const deleteColumn = (colIndex) => {
    if (columnCount <= 1) return;
    setGrid(prev => prev.map(row => row.filter((_, idx) => idx !== colIndex)));
    setColumnCount(prev => prev - 1);
  };

  const deleteRow = (rowIndex) => {
    if (rowCount <= 1) return; // Prevent deleting the last row
    setGrid(prev => prev.filter((_, idx) => idx !== rowIndex));
    setRowCount(prev => prev - 1);
  };
  

  return {
    grid,
    activeCell,
    columns,
    rowCount,
    columnCount,
    handleCellClick,
    selectedColumnName, 
    handleCellChange,
    handleKeyDown,
    addRow,
    setActiveCell,
    setSelectedColumnName,
    addColumn,
    deleteColumn,
    deleteRow
  };
};

export default useStat;