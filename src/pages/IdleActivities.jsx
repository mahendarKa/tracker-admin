import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import NavigationButtons from "../components/NavigationButtons";
import { FaSearch, FaSync, FaFilter, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";

export default function IdleActivities() {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [idleList, setIdleList] = useState([]);
    const [filteredIdle, setFilteredIdle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [deviceName, setDeviceName] = useState("");
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const [filters, setFilters] = useState({
        fromDate: "",
        endDate: "",
        idleSecondsMin: "",
        idleSecondsMax: ""
    });

    useEffect(() => {
        if (!deviceId) {
            toast.warning("Please select a device first");
            navigate("/dashboard");
            return;
        }
        fetchDeviceInfo();
        fetchIdleActivities();
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

    // Helper function to sort idle activities in descending order by idleStart
    const sortIdleDescending = (idleData) => {
        return [...idleData].sort((a, b) => {
            // If both have idleStart, compare them
            if (a.idleStart && b.idleStart) {
                return new Date(b.idleStart) - new Date(a.idleStart);
            }
            // If only a has idleStart, put a first
            if (a.idleStart) return -1;
            // If only b has idleStart, put b first
            if (b.idleStart) return 1;
            // If neither has idleStart, sort by id descending
            return b.id - a.id;
        });
    };

    const fetchIdleActivities = async () => {
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
                response = await api.post("/admin/idle/filter", filterData);
            } else {
                response = await api.get(`/admin/idle/${deviceId}`);
            }
            
            // Sort data in descending order by idleStart
            const sortedData = sortIdleDescending(response.data || []);
            
            setIdleList(sortedData);
            setFilteredIdle(sortedData);
            if (sortedData.length > 0) {
                toast.success(`Loaded ${sortedData.length} idle activities`);
            } else {
                toast.info("No idle activities found for this device");
            }
        } catch (error) {
            console.error("Error fetching idle activities:", error);
            toast.error("Failed to load idle activities");
            setIdleList([]);
            setFilteredIdle([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        fetchIdleActivities();
    };

    const handleReset = () => {
        setFilters({
            fromDate: "",
            endDate: "",
            idleSecondsMin: "",
            idleSecondsMax: ""
        });
        setHasActiveFilters(false);
        setTimeout(() => {
            fetchIdleActivities();
        }, 100);
    };

    const exportToExcel = async () => {
        if (!filteredIdle || filteredIdle.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating Excel file...');
            const response = await api.get(`/admin/export/idle/excel/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `idle_${deviceId}_${new Date().toISOString().split('T')[0]}.xlsx`);
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
        if (!filteredIdle || filteredIdle.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating PDF file...');
            const response = await api.get(`/admin/export/idle/pdf/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `idle_${deviceId}_${new Date().toISOString().split('T')[0]}.pdf`);
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
            "IDLE": "bg-warning",
            "RUNNING": "bg-info",
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

    // Calculate total idle duration
    const calculateTotalDuration = () => {
        return filteredIdle.reduce((total, idle) => {
            return total + (idle.idleSeconds || 0);
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
                        <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5 className="mt-3 text-muted">Loading idle activities...</h5>
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
                                <i className="bi bi-clock me-2 text-warning"></i>
                                Idle Activities
                            </h2>
                            <p className="text-muted mt-1">
                                {deviceName && <span className="me-3">Device: <strong>{deviceName}</strong></span>}
                                Device ID: {deviceId} • Total: {filteredIdle.length} idle activities
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-success btn-sm"
                                onClick={exportToExcel}
                                disabled={filteredIdle.length === 0}
                                title="Download Excel"
                            >
                                <FaFileExcel className="me-1" />
                                Excel
                            </button>
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={exportToPDF}
                                disabled={filteredIdle.length === 0}
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
                            onClick={fetchIdleActivities}
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
                                    <label className="form-label small fw-semibold">Min Idle (s)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Min seconds"
                                        value={filters.idleSecondsMin}
                                        onChange={(e) => setFilters({...filters, idleSecondsMin: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Max Idle (s)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Max seconds"
                                        value={filters.idleSecondsMax}
                                        onChange={(e) => setFilters({...filters, idleSecondsMax: e.target.value})}
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
                        {filteredIdle.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-clock" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                                <h5 className="mt-3 text-muted">No idle activities found</h5>
                                <p className="text-muted">Try adjusting your filters</p>
                                <button 
                                    className="btn btn-outline-primary mt-2"
                                    onClick={fetchIdleActivities}
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
                                                Idle Start
                                                <span className="ms-1">
                                                    <i className="bi bi-arrow-down text-primary"></i>
                                                </span>
                                            </th>
                                            <th>Idle End</th>
                                            <th>Idle Duration</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredIdle.map(idle => (
                                            <tr key={idle.id}>
                                                <td>
                                                    <span className="badge bg-secondary">{idle.id}</span>
                                                </td>
                                                <td>
                                                    {idle.idleStart ? 
                                                        new Date(idle.idleStart).toLocaleString() : 
                                                        "-"
                                                    }
                                                </td>
                                                <td>
                                                    {idle.idleEnd ? 
                                                        new Date(idle.idleEnd).toLocaleString() : 
                                                        "-"
                                                    }
                                                </td>
                                                <td>
                                                    <span className="badge bg-warning text-dark">
                                                        {formatDuration(idle.idleSeconds)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(idle.status)}`}>
                                                        {idle.status || 'UNKNOWN'}
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
                                                    Total Idle Duration (Filtered):
                                                </td>
                                                <td className="fw-bold text-warning">
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
                                        Showing {filteredIdle.length} record{filteredIdle.length !== 1 ? "s" : ""}
                                    </small>
                                    <div>
                                        <span className="badge bg-light text-dark me-2">
                                            Total Records: {filteredIdle.length}
                                        </span>
                                        {hasActiveFilters && (
                                            <span className="badge bg-warning text-dark">
                                                Total Idle: {formatTotalDuration(calculateTotalDuration())}
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