
import { useEffect, useState } from "react";
import api from "../services/axiosConfig";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaLaptop, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/users");
            // Filter only users with role "USER"
            const userUsers = response.data.filter(user => user.role === "USER");
            setUsers(userUsers);
            setFilteredUsers(userUsers);
            toast.success(`Loaded ${userUsers.length} users`);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.username?.toLowerCase().includes(search.toLowerCase()) ||
                user.id?.toString().includes(search)
            );
            setFilteredUsers(filtered);
        }
    }, [search, users]);

    return (
        <Layout>
            <div className="container-fluid px-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">
                            <FaUser className="me-2 text-primary" />
                            Users
                        </h2>
                        <p className="text-muted">Manage and monitor all system users</p>
                    </div>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={fetchUsers}
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
                                        placeholder="Search users by name or ID..."
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
                                    Total: {filteredUsers.length} users
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Loading users...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-people" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                                <h5 className="mt-3 text-muted">No users found</h5>
                                <p className="text-muted">Try adjusting your search</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Role</th>
                                            <th>Devices</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <span className="badge bg-secondary">{user.id}</span>
                                                </td>
                                                <td>
                                                    <strong>{user.username}</strong>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-info'}`}>
                                                        {user.role || 'USER'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link 
                                                        to={`/devices/${user.id}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <FaLaptop className="me-1" />
                                                        View Devices
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link 
                                                        to={`/devices/${user.id}`}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="bi bi-eye me-1"></i>
                                                        Details
                                                    </Link>
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