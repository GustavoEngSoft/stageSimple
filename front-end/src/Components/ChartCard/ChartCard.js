import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  // Registro obrigatório para o Chart.js funcionar corretamente
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
const ChartCard = ({ title, data, options }) => (
  <div className="chart-card">
    <h3>{title}</h3>
    <Bar data={data} options={options} />
  </div>
);

export default ChartCard;
