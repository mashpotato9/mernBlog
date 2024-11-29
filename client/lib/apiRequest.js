import axios from 'axios';

const apiRequest = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiRequest;