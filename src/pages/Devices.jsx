
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import NavigationButtons from "../components/NavigationButtons";
import { FaSearch, FaLaptop, FaSync, FaMicrochip, FaWindowMaximize, FaClock, FaServer } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Devices() {
    const { userId } = useParams();
    const location = useLocation();
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    const isAllDevices = !userId;

    useEffect(() => {
        if (isAllDevices) {
            fetchAllDevices();
        } else {
            fetchDevicesByUser();
            fetchUser();
        }
    }, [userId]);

    const fetchAllDevices = async () => {
        setLoading(true);
        try {
            const usersResponse = await api.get("/admin/users");
            const users = usersResponse.data || [];
            setAllUsers(users);

            let allDevices = [];
            for (const user of users) {
                try {
                    const devicesResponse = await api.get(`/admin/devices/${user.id}`);
                    const userDevices = devicesResponse.data || [];
                    allDevices = [...allDevices, ...userDevices.map(d => ({ 
                        ...d, 
                        username: user.username 
                    }))];
                } catch (error) {
                    console.error(`Error fetching devices for user ${user.id}:`, error);
                }
            }
            setDevices(allDevices);
            setFilteredDevices(allDevices);
            toast.success(`Loaded ${allDevices.length} devices from all users`);
        } catch (error) {
            console.error("Error fetching devices:", error);
            toast.error("Failed to load devices");
        } finally {
            setLoading(false);
        }
    };

    const fetchDevicesByUser = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/devices/${userId}`);
            const userDevices = response.data || [];
            setDevices(userDevices);
            setFilteredDevices(userDevices);
            toast.success(`Loaded ${userDevices.length} devices`);
        } catch (error) {
            console.error("Error fetching devices:", error);
            toast.error("Failed to load devices");
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await api.get(`/admin/users`);
            const foundUser = response.data.find(u => u.id === parseInt(userId));
            setUser(foundUser);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredDevices(devices);
        } else {
            const filtered = devices.filter(device =>
                device.machineName?.toLowerCase().includes(search.toLowerCase()) ||
                device.osName?.toLowerCase().includes(search.toLowerCase()) ||
                device.macAddress?.toLowerCase().includes(search.toLowerCase()) ||
                device.id?.toString().includes(search) ||
                device.username?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredDevices(filtered);
        }
    }, [search, devices]);

    const formatLastSeen = (lastSeen) => {
        if (!lastSeen) return "Never";
        try {
            return new Date(lastSeen).toLocaleString();
        } catch {
            return "Invalid Date";
        }
    };

    const getStatusBadge = (lastSeen) => {
        if (!lastSeen) return "bg-secondary";
        try {
            const lastSeenTime = new Date(lastSeen).getTime();
            const now = new Date().getTime();
            const diffMinutes = (now - lastSeenTime) / (1000 * 60);
            if (diffMinutes < 5) return "bg-success";
            if (diffMinutes < 30) return "bg-warning";
            return "bg-danger";
        } catch {
            return "bg-secondary";
        }
    };

    const getStatusText = (lastSeen) => {
        if (!lastSeen) return "Unknown";
        try {
            const lastSeenTime = new Date(lastSeen).getTime();
            const now = new Date().getTime();
            const diffMinutes = (now - lastSeenTime) / (1000 * 60);
            if (diffMinutes < 5) return "Online";
            if (diffMinutes < 30) return "Away";
            return "Offline";
        } catch {
            return "Unknown";
        }
    };

    return (
        <Layout>
            <div className="container-fluid px-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <NavigationButtons 
                            backPath={isAllDevices ? "/dashboard" : "/users"} 
                            backLabel={isAllDevices ? "Back to Dashboard" : "Back to Users"}
                        />
                        <div>
                            <h2 className="d-inline-block mb-0 fw-bold">
                                <FaLaptop className="me-2 text-primary" />
                                {isAllDevices ? "All Devices" : "Devices"}
                            </h2>
                            {!isAllDevices && user && (
                                <p className="text-muted mt-1">
                                    User: <strong>{user.username}</strong> (ID: {userId})
                                </p>
                            )}
                            {isAllDevices && (
                                <p className="text-muted mt-1">
                                    Showing all devices from all users
                                </p>
                            )}
                        </div>
                    </div>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={isAllDevices ? fetchAllDevices : fetchDevicesByUser}
                        disabled={loading}
                    >
                        <FaSync className={loading ? "fa-spin me-2" : "me-2"} />
                        Refresh
                    </button>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <FaSearch className="text-muted" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={isAllDevices ? "Search devices by name, OS, MAC, or user..." : "Search devices by name or OS..."}
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
                                    Total: {filteredDevices.length} devices
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Loading devices...</p>
                            </div>
                        ) : filteredDevices.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-laptop" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                                <h5 className="mt-3 text-muted">No devices found</h5>
                                <p className="text-muted">
                                    {!isAllDevices ? "This user has no registered devices" : "No devices are registered yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            {isAllDevices && <th>User</th>}
                                            <th>Machine Name</th>
                                            <th>OS</th>
                                            <th>MAC Address</th>
                                            <th>IP Address</th>
                                            <th>Last Seen</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDevices.map(device => (
                                            <tr key={device.id}>
                                                <td>
                                                    <span className="badge bg-secondary">{device.id}</span>
                                                </td>
                                                {isAllDevices && (
                                                    <td>
                                                        <span className="badge bg-info">
                                                            {device.username || 'Unknown'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td>
                                                    <strong>{device.machineName}</strong>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">{device.osName || 'N/A'}</span>
                                                </td>
                                                <td>
                                                    <code className="small">{device.macAddress || 'N/A'}</code>
                                                </td>
                                                <td>
                                                    <code className="small">{device.lastIpAddress || 'N/A'}</code>
                                                </td>
                                                <td>
                                                    <span className="small">
                                                        {formatLastSeen(device.lastSeen)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(device.lastSeen)}`}>
                                                        {getStatusText(device.lastSeen)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <Link
                                                            to={`/processes/${device.id}`}
                                                            className="btn btn-primary"
                                                            title="View Processes"
                                                        >
                                                            <FaMicrochip />
                                                        </Link>
                                                        <Link
                                                            to={`/windows/${device.id}`}
                                                            className="btn btn-success"
                                                            title="View Windows"
                                                        >
                                                            <FaWindowMaximize />
                                                        </Link>
                                                        <Link
                                                            to={`/idle/${device.id}`}
                                                            className="btn btn-warning"
                                                            title="View Idle"
                                                        >
                                                            <FaClock />
                                                        </Link>
                                                        <Link
                                                            to={`/sessions/${device.id}`}
                                                            className="btn btn-info"
                                                            title="View Sessions"
                                                        >
                                                            <FaServer />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}








