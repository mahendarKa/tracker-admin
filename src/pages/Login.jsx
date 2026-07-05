// import { useState } from "react";
// import api from "../services/axiosConfig";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Login() {
//     const navigate = useNavigate();
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     const login = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const response = await api.post("/auth/admin", {
//                 username,
//                 password
//             });

//             localStorage.setItem("token", response.data.token);
//             localStorage.setItem("username", response.data.username);
//             localStorage.setItem("role", response.data.role || "ADMIN");

//             toast.success("Login successful! Redirecting...");
            
//             setTimeout(() => {
//                 navigate("/dashboard");
//             }, 500);

//         } catch (error) {
//             console.error("Login error:", error);
//             toast.error(error.response?.data?.message || "Invalid Credentials");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
//             <div className="container">
//                 <div className="row justify-content-center">
//                     <div className="col-md-5 col-lg-4">
//                         <div className="card shadow-lg border-0">
//                             <div className="card-body p-5">
//                                 <div className="text-center mb-4">
//                                     <div className="bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
//                                          style={{ width: "60px", height: "60px" }}>
//                                         <i className="bi bi-shield-lock" style={{ fontSize: "30px" }}></i>
//                                     </div>
//                                     <h3 className="fw-bold">Activity Tracker</h3>
//                                     <p className="text-muted small">Admin Login Portal</p>
//                                 </div>

//                                 <form onSubmit={login}>
//                                     <div className="mb-3">
//                                         <label className="form-label fw-semibold">Username</label>
//                                         <div className="input-group">
//                                             <span className="input-group-text">
//                                                 <i className="bi bi-person"></i>
//                                             </span>
//                                             <input
//                                                 className="form-control"
//                                                 placeholder="Enter username"
//                                                 value={username}
//                                                 onChange={(e) => setUsername(e.target.value)}
//                                                 required
//                                                 autoFocus
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="mb-3">
//                                         <label className="form-label fw-semibold">Password</label>
//                                         <div className="input-group">
//                                             <span className="input-group-text">
//                                                 <i className="bi bi-lock"></i>
//                                             </span>
//                                             <input
//                                                 type="password"
//                                                 className="form-control"
//                                                 placeholder="Enter password"
//                                                 value={password}
//                                                 onChange={(e) => setPassword(e.target.value)}
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         className="btn btn-primary w-100 py-2 fw-semibold"
//                                         disabled={loading}
//                                     >
//                                         {loading ? (
//                                             <>
//                                                 <span className="spinner-border spinner-border-sm me-2" />
//                                                 Logging in...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <i className="bi bi-box-arrow-in-right me-2"></i>
//                                                 Login
//                                             </>
//                                         )}
//                                     </button>
//                                 </form>

//                                 <div className="text-center mt-3">
//                                     <small className="text-muted">
//                                         Default: admin / admin
//                                     </small>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <style>{`
//                 .input-group-text {
//                     background-color: #f8f9fa;
//                 }
//                 .form-control:focus {
//                     box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
//                 }
//             `}</style>
//         </div>
//     );
// }









import { useState, useEffect } from "react";
import api from "../services/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if there's a session expired message
        const message = sessionStorage.getItem('loginMessage');
        if (message) {
            toast.warning(message);
            sessionStorage.removeItem('loginMessage');
        }
        
        // Check if user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, []);

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/admin", {
                username,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", response.data.username || username);
                localStorage.setItem("role", response.data.role || "ADMIN");
                
                toast.success("Login successful! Redirecting...");
                
                setTimeout(() => {
                    navigate("/dashboard");
                }, 500);
            } else {
                toast.error("Invalid response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response?.status === 401) {
                toast.error("Invalid username or password");
            } else {
                toast.error(error.response?.data?.message || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <div className="bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                         style={{ width: "60px", height: "60px" }}>
                                        <i className="bi bi-shield-lock" style={{ fontSize: "30px" }}></i>
                                    </div>
                                    <h3 className="fw-bold">Activity Tracker</h3>
                                    <p className="text-muted small">Admin Login Portal</p>
                                </div>

                                <form onSubmit={login}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <input
                                                className="form-control"
                                                placeholder="Enter username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Login
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        Default: admin / admin
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .input-group-text {
                    background-color: #f8f9fa;
                }
                .form-control:focus {
                    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
                }
            `}</style>
        </div>
    );
}