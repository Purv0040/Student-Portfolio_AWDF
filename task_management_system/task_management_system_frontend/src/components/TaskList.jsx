import React, { useState } from 'react';
import { updateTask, deleteTask } from '../api';
import { FiCheck, FiTrash2, FiClock } from 'react-icons/fi';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const handleStatusToggle = async (task) => {
    setActionLoading(task._id);
    setError(null);
    try {
      const newCompleted = !task.completed;
      const { data } = await updateTask(task._id, { completed: newCompleted });
      onTaskUpdate(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePriorityChange = async (task, newPriority) => {
    setActionLoading(task._id);
    setError(null);
    try {
      const { data } = await updateTask(task._id, { priority: newPriority });
      onTaskUpdate(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update priority');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    setError(null);
    try {
      await deleteTask(id);
      onTaskDelete(id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
      setActionLoading(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-panel center-content">
        <FiClock size={48} opacity={0.5} />
        <p>No tasks yet. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <h2>Your Tasks</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-item">
            <div className="task-content">
              <h3 className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                {task.title}
              </h3>
              {task.description && <p className="task-desc">{task.description}</p>}
              <div className="task-meta">
                <span className={`badge ${task.completed ? 'completed' : 'pending'}`}>{task.completed ? 'Completed' : 'Pending'}</span>
                <select
                  className={`badge ${(task.priority || 'medium').toLowerCase()}`}
                  value={(task.priority || 'medium').toLowerCase()}
                  onChange={(e) => handlePriorityChange(task, e.target.value)}
                  disabled={actionLoading === task._id}
                  style={{ cursor: 'pointer', border: 'none', appearance: 'auto', outline: 'none' }}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="task-actions">
              <button
                onClick={() => handleStatusToggle(task)}
                disabled={actionLoading === task._id}
                title={task.completed ? 'Mark Pending' : 'Mark Completed'}
                style={{ background: task.completed ? 'var(--text-muted)' : 'var(--success)' }}
              >
                {actionLoading === task._id ? <span className="loading-spinner"></span> : <FiCheck />}
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(task._id)}
                disabled={actionLoading === task._id}
                title="Delete Task"
              >
                {actionLoading === task._id ? <span className="loading-spinner"></span> : <FiTrash2 />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
