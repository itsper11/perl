import React from 'react';
import * as math from 'mathjs';
import './Calculator.css';

const Calculator = ({ onClose }) => {
  const [input, setInput] = React.useState('');
  const [result, setResult] = React.useState('');

  const handleButtonClick = (value) => {
    setInput(prev => prev + value);
  };

  const calculateResult = () => {
    try {
      const calculation = input.replace(/x/g, '*').replace(/÷/g, '/');
      setResult(math.evaluate(calculation).toString());
    } catch (error) {
      setResult('Error');
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="calculator-modal">
      <div className="calculator-content">
        <button className="calculator-close" onClick={onClose}>×</button>
        <h3>Calculator</h3>
        
        <div className="calculator-display">
          <div className="calculator-input">{input}</div>
          <div className="calculator-result">{result}</div>
        </div>

        <div className="calculator-buttons">
          {['7', '8', '9', '÷'].map(num => (
            <button key={num} onClick={() => handleButtonClick(num)}>{num}</button>
          ))}
          {['4', '5', '6', 'x'].map(num => (
            <button key={num} onClick={() => handleButtonClick(num)}>{num}</button>
          ))}
          {['1', '2', '3', '-'].map(num => (
            <button key={num} onClick={() => handleButtonClick(num)}>{num}</button>
          ))}
          {['0', '.', '=', '+'].map(num => (
            <button key={num} onClick={() => num === '=' ? calculateResult() : handleButtonClick(num)}>
              {num}
            </button>
          ))}
          <button onClick={clearInput} className='clear-btn'>C</button>
          <button onClick={() => setInput(prev => prev.slice(0, -1))} className='clear-btn2'>⌫</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;