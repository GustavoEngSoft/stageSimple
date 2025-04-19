import React from 'react';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

const mockReportData = [
  { name: 'Company A', approved: 10, rejected: 2 },
  { name: 'Company B', approved: 5, rejected: 1 },
];

const Reports = () => {
  return (
    <div>
      <h2>Reports</h2>
      <button onClick={() => exportToExcel(mockReportData, 'Report')}>Export to Excel</button>
      <button onClick={() => exportToPDF(mockReportData, 'Report')}>Export to PDF</button>
    </div>
  );
};

export default Reports;
