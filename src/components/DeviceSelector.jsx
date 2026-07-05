

import { useEffect, useState } from "react";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import StatsCards from "../components/StatsCards";
import ActivityCharts from "../components/ActivityCharts";
import RecentActivityTable from "../components/RecentActivityTable";
import { FaSync } from "react-icons/fa";
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
    const [timeFrame, setTimeFrame] = useState("week"); // week, month, year

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch stats
            const statsResponse = await api.get("/admin/stats");
            setStats(statsResponse.data);

            // Fetch recent processes
            const processesResponse = await api.get("/admin/recent-processes");
            setRecentProcesses(processesResponse.data || []);

            toast.success("Dashboard updated");
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
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
                        <p className="text-muted">Monitor and analyze user activities across all devices</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-outline-primary"
                            onClick={fetchDashboardData}
                            disabled={loading}
                        >
                            <FaSync className={loading ? "fa-spin me-2" : "me-2"} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <StatsCards stats={stats} loading={loading} />

                {/* Charts Section */}
                <ActivityCharts stats={stats} />

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