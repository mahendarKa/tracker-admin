
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import NavigationButtons from "../components/NavigationButtons";
import { FaSearch, FaSync, FaFilter, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Windows() {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [windows, setWindows] = useState([]);
    const [filteredWindows, setFilteredWindows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [filters, setFilters] = useState({
        windowTitle: "",
        status: "",
        fromDate: "",
        endDate: "",
        durationMin: "",
        durationMax: ""
    });

    useEffect(() => {
        if (!deviceId) {
            toast.warning("Please select a device first");
            navigate("/dashboard");
            return;
        }
        fetchDeviceInfo();
        fetchWindows();
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

    const fetchWindows = async () => {
        if (!deviceId) return;
        
        setLoading(true);
        try {
            const hasFilters = Object.values(filters).some(v => v !== "");
            
            let response;
            if (hasFilters) {
                const filterData = {
                    deviceId: parseInt(deviceId),
                    ...filters
                };
                Object.keys(filterData).forEach(key => {
                    if (filterData[key] === "") delete filterData[key];
                });
                response = await api.post("/admin/windows/filter", filterData);
            } else {
                response = await api.get(`/admin/windows/${deviceId}`);
            }
            
            setWindows(response.data || []);
            setFilteredWindows(response.data || []);
            if (response.data && response.data.length > 0) {
                toast.success(`Loaded ${response.data.length} windows`);
            } else {
                toast.info("No windows found for this device");
            }
        } catch (error) {
            console.error("Error fetching windows:", error);
            toast.error("Failed to load windows");
            setWindows([]);
            setFilteredWindows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredWindows(windows);
        } else {
            const filtered = windows.filter(window =>
                window.windowTitle?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredWindows(filtered);
        }
    }, [search, windows]);

    const handleFilter = () => {
        fetchWindows();
    };

    const handleReset = () => {
        setFilters({
            windowTitle: "",
            status: "",
            fromDate: "",
            endDate: "",
            durationMin: "",
            durationMax: ""
        });
        setSearch("");
        setTimeout(() => {
            fetchWindows();
        }, 100);
    };

    const exportToExcel = async () => {
        if (!filteredWindows || filteredWindows.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating Excel file...');
            const response = await api.get(`/admin/export/windows/excel/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `windows_${deviceId}_${new Date().toISOString().split('T')[0]}.xlsx`);
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
        if (!filteredWindows || filteredWindows.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating PDF file...');
            const response = await api.get(`/admin/export/windows/pdf/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `windows_${deviceId}_${new Date().toISOString().split('T')[0]}.pdf`);
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
            "IDLE": "bg-warning",
            "CLOSED": "bg-danger"
        };
        return statusMap[status?.toUpperCase()] || "bg-secondary";
    };

    if (loading) {
        return (
            <Layout>
                <div className="container-fluid px-4">
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5 className="mt-3 text-muted">Loading windows...</h5>
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
                                <i className="bi bi-window me-2 text-success"></i>
                                Window Activities
                            </h2>
                            <p className="text-muted mt-1">
                                {deviceName && <span className="me-3">Device: <strong>{deviceName}</strong></span>}
                                Device ID: {deviceId} • Total: {filteredWindows.length} windows
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-success btn-sm"
                                onClick={exportToExcel}
                                disabled={filteredWindows.length === 0}
                                title="Download Excel"
                            >
                                <FaFileExcel className="me-1" />
                                Excel
                            </button>
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={exportToPDF}
                                disabled={filteredWindows.length === 0}
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
                            onClick={fetchWindows}
                            disabled={loading}
                        >
                            <FaSync className={loading ? "fa-spin me-2" : "me-2"} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <FaSearch className="text-muted" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search window titles..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button 
                                            className="btn btn-outline-secondary"
                                            onClick={() => setSearch("")}
                                        >
                                            <i className="bi bi-x-circle"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 text-end">
                                <span className="badge bg-primary">
                                    Total: {filteredWindows.length} windows
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">Advanced Filters</h6>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Window Title</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search window..."
                                        value={filters.windowTitle}
                                        onChange={(e) => setFilters({...filters, windowTitle: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold">Status</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={filters.status}
                                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                                    >
                                        <option value="">All</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="IDLE">Idle</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold">Min Duration (s)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Min"
                                        value={filters.durationMin}
                                        onChange={(e) => setFilters({...filters, durationMin: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold">Max Duration (s)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Max"
                                        value={filters.durationMax}
                                        onChange={(e) => setFilters({...filters, durationMax: e.target.value})}
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
                        {filteredWindows.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-window" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                                <h5 className="mt-3 text-muted">No windows found</h5>
                                <p className="text-muted">Try adjusting your search or filters</p>
                                <button 
                                    className="btn btn-outline-primary mt-2"
                                    onClick={fetchWindows}
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
                                            <th>Window Title</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Duration (s)</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredWindows.map(window => (
                                            <tr key={window.id}>
                                                <td>
                                                    <span className="badge bg-secondary">{window.id}</span>
                                                </td>
                                                <td>
                                                    <span title={window.windowTitle}>
                                                        {window.windowTitle?.length > 50 ? 
                                                            window.windowTitle.substring(0, 50) + "..." : 
                                                            window.windowTitle || "-"
                                                        }
                                                    </span>
                                                </td>
                                                <td>
                                                    {window.startTime ? 
                                                        new Date(window.startTime).toLocaleString() : 
                                                        "-"
                                                    }
                                                </td>
                                                <td>
                                                    {window.endTime ? 
                                                        new Date(window.endTime).toLocaleString() : 
                                                        "-"
                                                    }
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {window.durationSeconds || 0}s
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(window.status)}`}>
                                                        {window.status || 'UNKNOWN'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <small className="text-muted">
                                        Showing {filteredWindows.length} record{filteredWindows.length !== 1 ? "s" : ""}
                                    </small>
                                    <span className="badge bg-light text-dark">
                                        Total: {filteredWindows.length}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}