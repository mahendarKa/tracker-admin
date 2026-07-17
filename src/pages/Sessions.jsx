import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import NavigationButtons from "../components/NavigationButtons";
import { FaSearch, FaSync, FaFilter, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Sessions() {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [deviceName, setDeviceName] = useState("");
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const [filters, setFilters] = useState({
        fromDate: "",
        endDate: "",
        sessionDurationMin: "",
        sessionDurationMax: ""
    });

    useEffect(() => {
        if (!deviceId) {
            toast.warning("Please select a device first");
            navigate("/dashboard");
            return;
        }
        fetchDeviceInfo();
        fetchSessions();
    }, [deviceId]);

    const fetchDeviceInfo = async () => {
        try {
            const usersResponse = await api.get("/admin/users");
            const users = usersResponse.data || [];
            
            for (const user of users) {
                try {
                    const devicesResponse = await api.get(`/admin/devices/${user.id}`);
                    const devices = devicesResponse.data || [];
                    const found = devices.find(d => d.id === parseInt(deviceId));
                    if (found) {
                        setDeviceName(`${found.machineName} (${user.username})`);
                        break;
                    }
                } catch (error) {
                    console.error(`Error fetching devices for user ${user.id}:`, error);
                }
            }
        } catch (error) {
            console.error("Error fetching device info:", error);
        }
    };

    // Helper function to sort sessions in descending order by startupTime
    const sortSessionsDescending = (sessionData) => {
        return [...sessionData].sort((a, b) => {
            // If both have startupTime, compare them
            if (a.startupTime && b.startupTime) {
                return new Date(b.startupTime) - new Date(a.startupTime);
            }
            // If only a has startupTime, put a first
            if (a.startupTime) return -1;
            // If only b has startupTime, put b first
            if (b.startupTime) return 1;
            // If neither has startupTime, sort by id descending
            return b.id - a.id;
        });
    };

    const fetchSessions = async () => {
        if (!deviceId) return;
        
        setLoading(true);
        try {
            const hasFilters = Object.values(filters).some(v => v !== "");
            setHasActiveFilters(hasFilters);
            
            let response;
            if (hasFilters) {
                const filterData = {
                    deviceId: parseInt(deviceId),
                    ...filters
                };
                Object.keys(filterData).forEach(key => {
                    if (filterData[key] === "") delete filterData[key];
                });
                response = await api.post("/admin/sessions/filter", filterData);
            } else {
                response = await api.get(`/admin/sessions/${deviceId}`);
            }
            
            // Sort data in descending order by startupTime
            const sortedData = sortSessionsDescending(response.data || []);
            
            setSessions(sortedData);
            setFilteredSessions(sortedData);
            if (sortedData.length > 0) {
                toast.success(`Loaded ${sortedData.length} sessions`);
            } else {
                toast.info("No sessions found for this device");
            }
        } catch (error) {
            console.error("Error fetching sessions:", error);
            toast.error("Failed to load sessions");
            setSessions([]);
            setFilteredSessions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        fetchSessions();
    };

    const handleReset = () => {
        setFilters({
            fromDate: "",
            endDate: "",
            sessionDurationMin: "",
            sessionDurationMax: ""
        });
        setHasActiveFilters(false);
        setTimeout(() => {
            fetchSessions();
        }, 100);
    };

    const exportToExcel = async () => {
        if (!filteredSessions || filteredSessions.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating Excel file...');
            const response = await api.get(`/admin/export/sessions/excel/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sessions_${deviceId}_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success('Excel exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export Excel');
        }
    };

    const exportToPDF = async () => {
        if (!filteredSessions || filteredSessions.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating PDF file...');
            const response = await api.get(`/admin/export/sessions/pdf/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sessions_${deviceId}_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success('PDF exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export PDF');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            "ACTIVE": "bg-success",
            "INACTIVE": "bg-secondary",
            "COMPLETED": "bg-primary",
            "RUNNING": "bg-info",
            "ENDED": "bg-danger",
            "CLOSED": "bg-danger"
        };
        return statusMap[status?.toUpperCase()] || "bg-secondary";
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0s";
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    // Calculate total session duration
    const calculateTotalDuration = () => {
        return filteredSessions.reduce((total, session) => {
            return total + (session.sessionDurationSeconds || 0);
        }, 0);
    };

    // Format total duration in a readable format
    const formatTotalDuration = (seconds) => {
        if (!seconds || seconds === 0) return '0s';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        let parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
        
        return parts.join(' ');
    };

    if (loading) {
        return (
            <Layout>
                <div className="container-fluid px-4">
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5 className="mt-3 text-muted">Loading sessions...</h5>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!deviceId) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <h4>No Device Selected</h4>
                    <p className="text-muted">Please select a device from the sidebar or dashboard</p>
                    <Link to="/dashboard" className="btn btn-primary">
                        Go to Dashboard
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid px-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <div className="d-flex align-items-center">
                        <NavigationButtons backPath="/dashboard" backLabel="Back" />
                        <div>
                            <h2 className="d-inline-block mb-0 fw-bold">
                                <i className="bi bi-laptop me-2 text-info"></i>
                                Device Sessions
                            </h2>
                            <p className="text-muted mt-1">
                                {deviceName && <span className="me-3">Device: <strong>{deviceName}</strong></span>}
                                Device ID: {deviceId} • Total: {filteredSessions.length} sessions
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-success btn-sm"
                                onClick={exportToExcel}
                                disabled={filteredSessions.length === 0}
                                title="Download Excel"
                            >
                                <FaFileExcel className="me-1" />
                                Excel
                            </button>
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={exportToPDF}
                                disabled={filteredSessions.length === 0}
                                title="Download PDF"
                            >
                                <FaFilePdf className="me-1" />
                                PDF
                            </button>
                        </div>
                        <button 
                            className="btn btn-outline-warning"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter className="me-2" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={fetchSessions}
                            disabled={loading}
                        >
                            <FaSync className={loading ? "fa-spin me-2" : "me-2"} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">Advanced Filters</h6>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Min Duration (s)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Min seconds"
                                        value={filters.sessionDurationMin}
                                        onChange={(e) => setFilters({...filters, sessionDurationMin: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Max Duration (s)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Max seconds"
                                        value={filters.sessionDurationMax}
                                        onChange={(e) => setFilters({...filters, sessionDurationMax: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">From Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={filters.fromDate}
                                        onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">To Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                                    />
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary btn-sm me-2" onClick={handleFilter}>
                                        <FaSearch className="me-1" /> Apply Filters
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        {filteredSessions.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-laptop" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                                <h5 className="mt-3 text-muted">No sessions found</h5>
                                <p className="text-muted">Try adjusting your filters</p>
                                <button 
                                    className="btn btn-outline-primary mt-2"
                                    onClick={fetchSessions}
                                >
                                    <FaSync className="me-2" />
                                    Refresh Data
                                </button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>
                                                Startup Time
                                                <span className="ms-1">
                                                    <i className="bi bi-arrow-down text-primary"></i>
                                                </span>
                                            </th>
                                            <th>Shutdown Time</th>
                                            <th>Session Duration</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSessions.map(session => (
                                            <tr key={session.id}>
                                                <td>
                                                    <span className="badge bg-secondary">{session.id}</span>
                                                </td>
                                                <td>
                                                    {session.startupTime ? 
                                                        new Date(session.startupTime).toLocaleString() : 
                                                        "-"
                                                    }
                                                </td>
                                                <td>
                                                    {session.shutdownTime ? 
                                                        new Date(session.shutdownTime).toLocaleString() : 
                                                        "Still Running"
                                                    }
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {formatDuration(session.sessionDurationSeconds)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(session.status)}`}>
                                                        {session.status || 'UNKNOWN'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {/* Show total duration only when filters are applied */}
                                    {hasActiveFilters && (
                                        <tfoot className="table-secondary">
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">
                                                    Total Session Duration (Filtered):
                                                </td>
                                                <td className="fw-bold text-info">
                                                    {formatTotalDuration(calculateTotalDuration())}
                                                    <small className="text-muted ms-1">
                                                        ({calculateTotalDuration().toFixed(0)}s)
                                                    </small>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <small className="text-muted">
                                        Showing {filteredSessions.length} record{filteredSessions.length !== 1 ? "s" : ""}
                                    </small>
                                    <div>
                                        <span className="badge bg-light text-dark me-2">
                                            Total Records: {filteredSessions.length}
                                        </span>
                                        {hasActiveFilters && (
                                            <span className="badge bg-info text-white">
                                                Total Duration: {formatTotalDuration(calculateTotalDuration())}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}