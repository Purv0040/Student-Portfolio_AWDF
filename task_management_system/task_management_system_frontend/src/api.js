import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Express backend URL with /api prefix
});

// Request interceptor — attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Auth endpoints
export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);

// Task endpoints
export const getTasks = () => API.get('/tasks');
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
