import React from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { FiCheckCircle, FiClock, FiList, FiAlertCircle } from 'react-icons/fi';

const Home = ({ tasks, loading, error, onTaskAdded, onTaskUpdate, onTaskDelete, onRetry }) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="page-wrapper home-page">
      <div className="page-header">
        <div>
          <h2>Tasks Dashboard</h2>
          <p className="page-subtitle">Manage your daily priorities, deadlines, and progress.</p>
        </div>
        <div className="stats-row">
          <div className="stat-pill glass-panel">
            <FiList className="stat-icon" />
            <div>
              <span className="stat-num">{tasks.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-pill glass-panel">
            <FiCheckCircle className="stat-icon success" />
            <div>
              <span className="stat-num">{completedCount}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>
          <div className="stat-pill glass-panel">
            <FiClock className="stat-icon warning" />
            <div>
              <span className="stat-num">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <FiAlertCircle size={22} style={{ marginRight: '0.75rem', flexShrink: 0 }} />
          <span>{error}</span>
          <button onClick={onRetry} style={{ marginLeft: 'auto', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>Retry</button>
        </div>
      )}

      <TaskForm onTaskAdded={onTaskAdded} />

      {loading ? (
        <div className="glass-panel center-content" style={{ minHeight: '180px' }}>
          <span className="loading-spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></span>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching tasks from backend...</p>
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      )}
    </div>
  );
};

export default Home;
