import React from 'react';
import './RiskFilter.css';

function RiskFilter({ selectedRisk, onRiskChange }) {
  const riskLevels = [
    { value: '', label: 'All Risk Levels' },
    { value: 'LOW', label: 'Low Risk' },
    { value: 'MEDIUM', label: 'Medium Risk' },
    { value: 'HIGH', label: 'High Risk' },
    { value: 'NOT_ASSESSED', label: 'Not Assessed' }
  ];

  return (
    <div className="risk-filter">
      <label htmlFor="risk-select">Risk Level:</label>
      <select
        id="risk-select"
        value={selectedRisk}
        onChange={(e) => onRiskChange(e.target.value)}
        className="risk-select"
      >
        {riskLevels.map(level => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RiskFilter;
