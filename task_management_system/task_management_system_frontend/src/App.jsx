import React, { useState, useEffect } from 'react';
import { getTasks } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { FiAlertCircle } from 'react-icons/fi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks from the server. Is the backend running?');
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

  return (
    <div className="container">
      <h1>Task Manager</h1>
      
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

export default App;
