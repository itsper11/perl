import React from 'react';
import './styles/StatModule.css';
import { useLocation, useNavigate } from 'react-router-dom';

const StatModule = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReturn = () => {
    if (fullGrid?.length) {
      localStorage.setItem('fullGrid', JSON.stringify(fullGrid));
    }
    navigate('/stat-result', { state: { fullGrid } });
  };  

  const { fullGrid } = location.state || { fullGrid: [] };

  return (
    <div className="stat-section-module-container">
      <button className="Editdata-btn" onClick={handleReturn}>
        Return
      </button>

      <h1 className="stat-section-module-title">📘 Understanding Variance & Standard Deviation</h1>

      <section className="stat-section-module">
        <h2>What is Variance?</h2>
        <p>
          Variance is a measure of how spread out a dataset is. It tells us how far each number in the set is from the mean (average), and therefore from every other number in the set.
        </p>

        <h3>Steps to Calculate Variance:</h3>
        <ol>
          <li>Find the mean (average) of the dataset.</li>
          <li>Subtract the mean from each number (get the deviation for each).</li>
          <li>Square each deviation.</li>
          <li>Add all the squared deviations.</li>
          <li>Divide by the total number of values (for population) or by (n - 1) for sample variance.</li>
        </ol>

        <p><strong>Formula (Population):</strong> <code>σ² = Σ(x - μ)² / N</code></p>
        <p><strong>Formula (Sample):</strong> <code>s² = Σ(x - x̄)² / (n - 1)</code></p>
      </section>

      <section className="stat-section-module">
        <h2>What is Standard Deviation?</h2>
        <p>
          Standard deviation is the square root of the variance. It shows how much variation exists from the average (mean), and is in the same units as the original data.
        </p>

        <h3>Formula:</h3>
        <p><strong>Population:</strong> <code>σ = √(Σ(x - μ)² / N)</code></p>
        <p><strong>Sample:</strong> <code>s = √(Σ(x - x̄)² / (n - 1))</code></p>

        <h3>Interpretation:</h3>
        <ul>
          <li>A low standard deviation means the data points are close to the mean.</li>
          <li>A high standard deviation means the data points are spread out over a wide range.</li>
        </ul>
      </section>

      <section className="stat-section-module">
        <h2>Example:</h2>
        <p>Data: 2, 4, 4, 4, 5, 5, 7, 9</p>
        <p>Mean: 5</p>
        <p>Variance: 
          <code> [(2-5)² + (4-5)² + (4-5)² + (4-5)² + (5-5)² + (5-5)² + (7-5)² + (9-5)²] / 8 = 4 </code>
        </p>
        <p>Standard Deviation: <code>√4 = 2</code></p>
      </section>
    </div>
  );
};

export default StatModule;