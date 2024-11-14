// src/services/api.ts
import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/v1';
const API_URL = 'https://todo-app-backend-wcmc.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api };
