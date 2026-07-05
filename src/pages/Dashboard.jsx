

// import { useEffect, useState } from "react";
// import api from "../services/axiosConfig";
// import Layout from "../components/Layout";
// import StatsCards from "../components/StatsCards";
// import ActivityCharts from "../components/ActivityCharts";
// import RecentActivityTable from "../components/RecentActivityTable";
// import { FaSync } from "react-icons/fa";
// import { toast } from "react-toastify";

// export default function Dashboard() {
//     const [stats, setStats] = useState({
//         users: 0,
//         devices: 0,
//         processes: 0,
//         windows: 0,
//         idle: 0,
//         sessions: 0
//     });
//     const [recentProcesses, setRecentProcesses] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         setLoading(true);
//         try {
//             // Fetch stats
//             const statsResponse = await api.get("/admin/stats");
            
//             // Fetch users to count only those with role "USER"
//             try {
//                 const usersResponse = await api.get("/admin/users");
//                 const users = usersResponse.data || [];
//                 // Count only users with role "USER"
//                 const userCount = users.filter(user => user.role === "USER").length;
                
//                 // Update stats with correct user count
//                 statsResponse.data.users = userCount;
//             } catch (error) {
//                 console.error("Error fetching users for count:", error);
//             }
            
//             setStats(statsResponse.data);

//             // Fetch recent processes
//             try {
//                 const processesResponse = await api.get("/admin/recent-processes");
//                 setRecentProcesses(processesResponse.data || []);
//             } catch (error) {
//                 console.error("Error fetching recent processes:", error);
//                 setRecentProcesses([]);
//             }

//             toast.success("Dashboard updated");
//         } catch (error) {
//             console.error("Error fetching dashboard data:", error);
//             toast.error("Failed to load dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Layout>
//             <div className="container-fluid px-4">
//                 {/* Header */}
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <div>
//                         <h2 className="fw-bold">
//                             <i className="bi bi-grid-1x2-fill me-2 text-primary"></i>
//                             Activity Tracker Dashboard
//                         </h2>
//                         <p className="text-muted">Monitor and analyze user activities across all devices</p>
//                     </div>
//                     <div className="d-flex gap-2">
//                         <button 
//                             className="btn btn-outline-primary"
//                             onClick={fetchDashboardData}
//                             disabled={loading}
//                         >
//                             <FaSync className={loading ? "fa-spin me-2" : "me-2"} />
//                             Refresh
//                         </button>
//                     </div>
//                 </div>

//                 {/* Stats Cards */}
//                 <StatsCards stats={stats} loading={loading} />

//                 {/* Charts Section */}
//                 <ActivityCharts stats={stats} loading={loading} />

//                 {/* Recent Activity */}
//                 <div className="row mt-4">
//                     <div className="col-12">
//                         <div className="card shadow-sm">
//                             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//                                 <h5 className="mb-0 fw-bold">
//                                     <i className="bi bi-clock-history me-2 text-primary"></i>
//                                     Recent Process Activities
//                                 </h5>
//                                 <span className="badge bg-primary">
//                                     Last 10 records
//                                 </span>
//                             </div>
//                             <div className="card-body">
//                                 <RecentActivityTable 
//                                     processes={recentProcesses} 
//                                     loading={loading}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// }











import { useEffect, useState, useRef } from "react";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import StatsCards from "../components/StatsCards";
import ActivityCharts from "../components/ActivityCharts";
import RecentActivityTable from "../components/RecentActivityTable";
import { FaSync, FaPause, FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Dashboard() {
    const [stats, setStats] = useState({
        users: 0,
        devices: 0,
        processes: 0,
        windows: 0,
        idle: 0,
        sessions: 0
    });
    const [recentProcesses, setRecentProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        fetchDashboardData();
        startAutoRefresh();
        
        // Cleanup on unmount
        return () => {
            stopAutoRefresh();
        };
    }, []);

    const startAutoRefresh = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            if (isAutoRefresh) {
                fetchDashboardData();
            }
        }, 1000); // 1 second
    };

    const stopAutoRefresh = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const toggleAutoRefresh = () => {
        const newState = !isAutoRefresh;
        setIsAutoRefresh(newState);
        if (newState) {
            startAutoRefresh();
            toast.info('Auto-refresh enabled');
        } else {
            stopAutoRefresh();
            toast.info('Auto-refresh paused');
        }
    };

    const fetchDashboardData = async () => {
        try {
            // Fetch stats
            const statsResponse = await api.get("/admin/stats");
            
            // Fetch users and count only role "USER"
            try {
                const usersResponse = await api.get("/admin/users");
                const users = usersResponse.data || [];
                const userCount = users.filter(user => user.role === "USER").length;
                statsResponse.data.users = userCount;
            } catch (error) {
                console.error("Error fetching users for count:", error);
            }
            
            setStats(statsResponse.data);

            // Fetch recent processes
            try {
                const processesResponse = await api.get("/admin/recent-processes");
                setRecentProcesses(processesResponse.data || []);
            } catch (error) {
                console.error("Error fetching recent processes:", error);
                setRecentProcesses([]);
            }

            setLastUpdated(new Date());
            setRefreshCount(prev => prev + 1);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualRefresh = () => {
        fetchDashboardData();
        toast.info('Refreshing data...');
    };

    return (
        <Layout>
            <div className="container-fluid px-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">
                            <i className="bi bi-grid-1x2-fill me-2 text-primary"></i>
                            Activity Tracker Dashboard
                        </h2>
                        <p className="text-muted">
                            Monitor and analyze user activities across all devices
                            {lastUpdated && (
                                <span className="ms-3">
                                    <i className="bi bi-clock me-1"></i>
                                    Last updated: {lastUpdated.toLocaleTimeString()}
                                    <span className="badge bg-primary ms-2">
                                        {refreshCount} refreshes
                                    </span>
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            className={`btn ${isAutoRefresh ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={toggleAutoRefresh}
                            title={isAutoRefresh ? 'Pause auto-refresh' : 'Resume auto-refresh'}
                        >
                            {isAutoRefresh ? (
                                <>
                                    <FaPause className="me-1" />
                                    Live
                                </>
                            ) : (
                                <>
                                    <FaPlay className="me-1" />
                                    Paused
                                </>
                            )}
                        </button>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={handleManualRefresh}
                            disabled={loading}
                        >
                            <FaSync className={loading ? "fa-spin me-2" : "me-2"} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Live indicator */}
                {isAutoRefresh && (
                    <div className="alert alert-success alert-dismissible fade show mb-3 py-2" role="alert">
                        <div className="d-flex align-items-center">
                            <span className="spinner-grow spinner-grow-sm text-success me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </span>
                            <span className="small">
                                <strong>Live Updates:</strong> Dashboard is auto-refreshing every second
                            </span>
                            <span className="ms-auto">
                                <i className="bi bi-dot"></i>
                                {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <StatsCards stats={stats} loading={loading} />

                {/* Charts Section */}
                <ActivityCharts stats={stats} loading={loading} />

                {/* Recent Activity */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">
                                    <i className="bi bi-clock-history me-2 text-primary"></i>
                                    Recent Process Activities
                                </h5>
                                <div>
                                    <span className="badge bg-primary me-2">
                                        Last 10 records
                                    </span>
                                    {isAutoRefresh && (
                                        <span className="badge bg-success">
                                            <span className="spinner-grow spinner-grow-sm me-1" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </span>
                                            Live
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="card-body">
                                <RecentActivityTable 
                                    processes={recentProcesses} 
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}