import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup  = (data)      => api.post('/auth/signup', data);
export const login   = (data)      => api.post('/auth/login',  data);

export const getProjects   = ()         => api.get('/projects');
export const getProject    = (id)       => api.get(`/projects/${id}`);
export const createProject = (data)     => api.post('/projects', data);
export const inviteMember  = (id, data) => api.post(`/projects/${id}/invite`, data);

export const getDashboard = ()          => api.get('/tasks/dashboard');
export const createTask   = (data)      => api.post('/tasks', data);
export const updateTask   = (id, data)  => api.put(`/tasks/${id}`, data);
export const deleteTask   = (id)        => api.delete(`/tasks/${id}`);