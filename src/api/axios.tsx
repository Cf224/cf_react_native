import axios from 'axios';
import store from '../store/store';


const api = axios.create({
  baseURL: 'https://cfmilk.onrender.com', 
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
