// import { Navigate } from "react-router-dom";

// export default function PrivateRoute(
//         { children }) {

//     const token =
//             localStorage.getItem(
//                     "token");

//     return token
//             ? children
//             : <Navigate to="/login" />;
// }





import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/axiosConfig";

export default function PrivateRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                // Optional: Verify token validity with backend
                // You can add a /verify endpoint or just check if token exists
                // For now, we'll assume token is valid if it exists
                // But we'll also check if we can make a simple request
                await api.get("/admin/stats", { 
                    timeout: 3000 // 3 second timeout
                });
                setIsAuthenticated(true);
            } catch (error) {
                // If we get 401/403, token is invalid
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("role");
                    setIsAuthenticated(false);
                } else if (error.code === 'ECONNABORTED') {
                    // Timeout - keep the token
                    setIsAuthenticated(true);
                } else {
                    // Other errors - keep the token
                    setIsAuthenticated(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}