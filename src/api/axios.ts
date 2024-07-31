// src/api/axios.ts

import axios from 'axios';

import { useAuth } from '../stores/authStore';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useAuth.getState();
      logout();
    }
    return Promise.reject(error);
  }
);

export default instance;
