import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    // This is crucial for sending cookies (if you use them for auth)
    // and for handling CORS correctly with a separate backend.
    withCredentials: true,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  });
  
  export default apiClient;
