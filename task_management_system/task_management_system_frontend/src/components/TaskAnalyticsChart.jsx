import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const TaskAnalyticsChart = ({ tasks = [] }) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const lowCount = tasks.filter((t) => (t.priority || '').toLowerCase() === 'low').length;
  const mediumCount = tasks.filter((t) => (t.priority || 'medium').toLowerCase() === 'medium').length;
  const highCount = tasks.filter((t) => (t.priority || '').toLowerCase() === 'high').length;

  const doughnutData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: tasks.length > 0 ? [completedCount, pendingCount] : [1, 0],
        backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: tasks.length > 0 ? [lowCount, mediumCount, highCount] : [2, 4, 1],
        backgroundColor: [
          'rgba(59, 130, 246, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(239, 68, 68, 0.75)',
        ],
        borderColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      y: {
        ticks: { color: '#94a3b8', stepSize: 1 },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12 },
        },
      },
    },
  };

  return (
    <div className="analytics-charts-grid">
      <div className="chart-card glass-panel">
        <div className="chart-header">
          <FiTrendingUp className="chart-header-icon" />
          <h3>Completion Distribution</h3>
        </div>
        <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="chart-summary-row">
          <span className="summary-pill success">
            <FiCheckCircle size={14} /> Completed: {completedCount}
          </span>
          <span className="summary-pill danger">
            <FiClock size={14} /> Pending: {pendingCount}
          </span>
        </div>
      </div>

      <div className="chart-card glass-panel">
        <div className="chart-header">
          <FiAlertCircle className="chart-header-icon" />
          <h3>Priority Breakdown</h3>
        </div>
        <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="chart-summary-row">
          <span className="summary-pill info">Low: {lowCount}</span>
          <span className="summary-pill warning">Med: {mediumCount}</span>
          <span className="summary-pill danger">High: {highCount}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalyticsChart;
