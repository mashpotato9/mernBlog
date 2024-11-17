import axios from 'axios';

console.log('API URL:', import.meta.env.VITE_API_URL); // Add this debug line


const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiRequest;