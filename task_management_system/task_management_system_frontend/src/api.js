import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Express backend URL
});

export const getTasks = () => API.get('/tasks');
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
