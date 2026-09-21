import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getTasks } from './api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazyWithDelay } from './utils/lazyWithDelay';

// Static Shell & Eager Route Components
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Contact from './pages/Contact';

// Practical 8: Route-based Code Splitting applied ONLY to Tasks and Analytics
const Home = lazyWithDelay(() => import('./pages/Home'), 200);
const Analytics = lazyWithDelay(() => import('./pages/Analytics'), 200);

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, loading: authLoading } = useAuth();

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
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="container">
      <Navbar />

      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback message="Loading page route chunk..." />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  tasks={tasks}
                  loading={loading}
                  error={error}
                  onTaskAdded={handleTaskAdded}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  onRetry={fetchTasks}
                />
              } 
            />
            <Route path="/analytics" element={<Analytics tasks={tasks} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
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
