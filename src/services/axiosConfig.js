
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api"
});

// Flag to prevent multiple redirects
let isRedirecting = false;

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Check if error is due to unauthorized (401) or forbidden (403)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Check if the error message indicates token expiration
            const errorMessage = error.response.data?.message || error.response.data?.error || '';
            const isTokenExpired = errorMessage.toLowerCase().includes('expired') || 
                                   errorMessage.toLowerCase().includes('invalid token') ||
                                   errorMessage.toLowerCase().includes('jwt') ||
                                   error.response.status === 401;

            if (isTokenExpired && !isRedirecting) {
                isRedirecting = true;
                
                // Clear all user data from localStorage
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                localStorage.removeItem("user");
                localStorage.removeItem("userData");
                localStorage.removeItem("email");
                
                // Check if we're not already on login page
                if (window.location.pathname !== '/login') {
                    // Redirect to login page
                    window.location.href = '/login?session=expired';
                    
                    // Show toast notification if toast is available
                    // Since we're redirecting, we can't use toast directly
                    // But we can store a message in sessionStorage
                    sessionStorage.setItem('loginMessage', 'Your session has expired. Please login again.');
                }
                
                // Reset the flag after a delay
                setTimeout(() => {
                    isRedirecting = false;
                }, 3000);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;