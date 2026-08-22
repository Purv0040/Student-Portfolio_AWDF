import React, { useState } from 'react';
import { createTask } from '../api';
import { FiPlus } from 'react-icons/fi';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await createTask({
        title,
        description,
        priority: priority.toLowerCase(),
      });
      onTaskAdded(data);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>Add New Task</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            disabled={loading}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
            rows="3"
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div className="input-group" style={{ flex: 1 }}>
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !title.trim()} style={{ marginTop: '1rem' }}>
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <FiPlus /> Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
