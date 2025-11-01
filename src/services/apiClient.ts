import axios from 'axios';
import { TMDB_BASE_URL } from '../constants/tmdb';

const apiClient = axios.create({
  baseURL: TMDB_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = process.env.TMDB_READ_ACCESS_TOKEN || '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
