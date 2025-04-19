import React from 'react';

const FilterBar = ({ onFilterChange }) => (
  <div className="filter-bar">
    <input
      type="text"
      placeholder="Search by name"
      onChange={(e) => onFilterChange('name', e.target.value)}
    />
    <input
      type="date"
      onChange={(e) => onFilterChange('date', e.target.value)}
    />
    <select onChange={(e) => onFilterChange('region', e.target.value)}>
      <option value="">All Regions</option>
      <option value="north">North</option>
      <option value="south">South</option>
    </select>
  </div>
);

export default FilterBar;
