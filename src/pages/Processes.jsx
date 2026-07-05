

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import NavigationButtons from "../components/NavigationButtons";
import { FaSearch, FaSync, FaFilter, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Processes() {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [processes, setProcesses] = useState([]);
    const [filteredProcesses, setFilteredProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [deviceName, setDeviceName] = useState("");
    const [filters, setFilters] = useState({
        processName: "",
        status: "",
        pid: "",
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
        fetchProcesses();
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

    const fetchProcesses = async () => {
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
                response = await api.post("/admin/processes/filter", filterData);
            } else {
                response = await api.get(`/admin/processes/${deviceId}`);
            }
            
            setProcesses(response.data || []);
            setFilteredProcesses(response.data || []);
            if (response.data && response.data.length > 0) {
                toast.success(`Loaded ${response.data.length} processes`);
            } else {
                toast.info("No processes found for this device");
            }
        } catch (error) {
            console.error("Error fetching processes:", error);
            toast.error("Failed to load processes");
            setProcesses([]);
            setFilteredProcesses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        fetchProcesses();
    };

    const handleReset = () => {
        setFilters({
            processName: "",
            status: "",
            pid: "",
            fromDate: "",
            endDate: "",
            durationMin: "",
            durationMax: ""
        });
        setTimeout(() => {
            fetchProcesses();
        }, 100);
    };

    const exportToExcel = async () => {
        if (!filteredProcesses || filteredProcesses.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating Excel file...');
            const response = await api.get(`/admin/export/processes/excel/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `processes_${deviceId}_${new Date().toISOString().split('T')[0]}.xlsx`);
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
        if (!filteredProcesses || filteredProcesses.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            toast.info('Generating PDF file...');
            const response = await api.get(`/admin/export/processes/pdf/${deviceId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `processes_${deviceId}_${new Date().toISOString().split('T')[0]}.pdf`);
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
            "ERROR": "bg-danger",
            "CLOSE": "bg-danger",
            "CLOSED": "bg-danger"
        };
        return statusMap[status?.toUpperCase()] || "bg-secondary";
    };

    if (loading) {
        return (
            <Layout>
                <div className="container-fluid px-4">
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5 className="mt-3 text-muted">Loading processes...</h5>
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
                                <i className="bi bi-cpu me-2 text-primary"></i>
                                Process Activities
                            </h2>
                            <p className="text-muted mt-1">
                                {deviceName && <span className="me-3">Device: <strong>{deviceName}</strong></span>}
                                Device ID: {deviceId} • Total: {filteredProcesses.length} processes
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-success btn-sm"
                                onClick={exportToExcel}
                                disabled={filteredProcesses.length === 0}
                                title="Download Excel"
                            >
                                <FaFileExcel className="me-1" />
                                Excel
                            </button>
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={exportToPDF}
                                disabled={filteredProcesses.length === 0}
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
                            onClick={fetchProcesses}
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
                                    <label className="form-label small fw-semibold">Process Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search process..."
                                        value={filters.processName}
                                        onChange={(e) => setFilters({...filters, processName: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label small fw-semibold">PID</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="PID"
                                        value={filters.pid}
                                        onChange={(e) => setFilters({...filters, pid: e.target.value})}
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
                                        <option value="RUNNING">Running</option>
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
                                <div className="col-md-3">
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
                        {filteredProcesses.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-cpu" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                                <h5 className="mt-3 text-muted">No processes found</h5>
                                <p className="text-muted">This device has no process activities recorded</p>
                                <button 
                                    className="btn btn-outline-primary mt-2"
                                    onClick={fetchProcesses}
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
                                            <th>PID</th>
                                            <th>Process Name</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Duration (s)</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProcesses.map(process => (
                                            <tr key={process.id}>
                                                <td>
                                                    <span className="badge bg-secondary">{process.id}</span>
                                                </td>
                                                <td>
                                                    <code>{process.pid}</code>
                                                </td>
                                                <td>
                                                    <strong>{process.processName}</strong>
                                                </td>
                                                <td>
                                                    {process.startTime ? 
                                                        new Date(process.startTime).toLocaleString() : 
                                                        "-"
                                                    }
                                                </td>
                                                <td>
                                                    {process.endTime ? 
                                                        new Date(process.endTime).toLocaleString() : 
                                                        "-"
                                                    }
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {process.durationSeconds || 0}s
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(process.status)}`}>
                                                        {process.status || 'UNKNOWN'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <small className="text-muted">
                                        Showing {filteredProcesses.length} record{filteredProcesses.length !== 1 ? "s" : ""}
                                    </small>
                                    <span className="badge bg-light text-dark">
                                        Total: {filteredProcesses.length}
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