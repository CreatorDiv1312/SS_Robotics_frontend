// api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL:'https://4b0926e9-9bf9-4356-8fda-d07538876873-00-3d2g23pbmlfua.sisko.replit.dev/',
  withCredentials: true,
});

// Automatically adding token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
