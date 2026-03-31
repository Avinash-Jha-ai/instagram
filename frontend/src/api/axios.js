import axios from 'axios';

const api = axios.create({
  baseURL: 'https://instagram-1-n0zo.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
