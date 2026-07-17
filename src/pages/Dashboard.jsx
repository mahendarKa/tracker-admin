import { useEffect, useState, useRef } from "react";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import StatsCards from "../components/StatsCards";
import ActivityCharts from "../components/ActivityCharts";
import RecentActivityTable from "../components/RecentActivityTable";
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
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container-fluid px-4">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="fw-bold">
                        <i className="bi bi-grid-1x2-fill me-2 text-primary"></i>
                        Activity Tracker Dashboard
                    </h2>
                    <p className="text-muted">
                        Monitor and analyze user activities across all devices
                    </p>
                </div>

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
                                <span className="badge bg-primary">
                                    Last 10 records
                                </span>
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