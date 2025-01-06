export const axiosInstance = `// src/api/axiosInstance.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: baseURL, 
  withCredentials: true,           // <--- Importante para que envíe las cookies
});

export default axiosInstance;`;
