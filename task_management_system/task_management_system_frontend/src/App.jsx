import React, { useState, useEffect } from 'react';
import { getTasks } from './api';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { FiAlertCircle, FiLogOut, FiUser } from 'react-icons/fi';

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks from the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
  };

  const handleTaskDelete = (deletedId) => {
    setTasks(tasks.filter(t => t._id !== deletedId));
  };
 
  if (authLoading) {
    return (
      <div className="container">
        <div className="glass-panel center-content">
          <span className="loading-spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></span>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Task Manager</h1>
        <div className="user-info">
          <span className="user-badge">
            <FiUser /> {user?.name || user?.email}
          </span>
          <button className="btn-logout" onClick={logout} title="Logout">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
      
      {error && (
        <div className="error-message glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
          <FiAlertCircle size={24} />
          <span>{error}</span>
          <button onClick={fetchTasks} style={{ marginLeft: 'auto', padding: '0.5rem 1rem' }}>Retry</button>
        </div>
      )}

      <TaskForm onTaskAdded={handleTaskAdded} />
      
      {loading ? (
        <div className="glass-panel center-content">
          <span className="loading-spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></span>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskApp />
    </AuthProvider>
  );
}

export default App;
