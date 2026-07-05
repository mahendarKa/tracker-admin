


// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//     FaHome,
//     FaUsers,
//     FaLaptop,
//     FaMicrochip,
//     FaWindowMaximize,
//     FaClock,
//     FaServer,
//     FaSignOutAlt
// } from "react-icons/fa";
// import { toast } from "react-toastify";

// const Layout = ({ children }) => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [devices, setDevices] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // Check if we're on a device-specific page
//     const isDevicePage = location.pathname.match(/^\/(processes|windows|idle|sessions)\/\d+$/);
//     const isDevicesPage = location.pathname === "/devices" || location.pathname.startsWith("/devices/");

//     useEffect(() => {
//         // Only fetch devices if we're on a page that needs them
//         if (isDevicePage || isDevicesPage) {
//             fetchDevices();
//         }
//     }, [location.pathname]);

//     const fetchDevices = async () => {
//         setLoading(true);
//         try {
//             // Fetch all devices
//             const usersResponse = await fetch("/api/admin/users", {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem("token")}`
//                 }
//             });
//             const users = await usersResponse.json();
            
//             let allDevices = [];
//             for (const user of users) {
//                 try {
//                     const devicesResponse = await fetch(`/api/admin/devices/${user.id}`, {
//                         headers: {
//                             'Authorization': `Bearer ${localStorage.getItem("token")}`
//                         }
//                     });
//                     const userDevices = await devicesResponse.json();
//                     allDevices = [...allDevices, ...userDevices.map(d => ({ 
//                         ...d, 
//                         username: user.username 
//                     }))];
//                 } catch (error) {
//                     console.error(`Error fetching devices for user ${user.id}:`, error);
//                 }
//             }
//             setDevices(allDevices);
//         } catch (error) {
//             console.error("Error fetching devices:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const menuItems = [
//         { path: "/dashboard", icon: FaHome, label: "Dashboard" },
//         { path: "/users", icon: FaUsers, label: "Users" },
//         { path: "/devices", icon: FaLaptop, label: "Devices" },
//     ];

//     // Device-specific menu items - only shown when on device pages
//     const deviceMenuItems = [
//         { path: "/processes", icon: FaMicrochip, label: "Processes" },
//         { path: "/windows", icon: FaWindowMaximize, label: "Windows" },
//         { path: "/idle", icon: FaClock, label: "Idle" },
//         { path: "/sessions", icon: FaServer, label: "Sessions" },
//     ];

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("username");
//         localStorage.removeItem("role");
//         toast.success("Logged out successfully");
//         navigate("/login");
//     };

//     const isActive = (path) => {
//         if (path === "/dashboard") {
//             return location.pathname === "/dashboard" || location.pathname === "/";
//         }
//         if (path === "/devices") {
//             return location.pathname === "/devices" || location.pathname.startsWith("/devices/");
//         }
//         return location.pathname === path || location.pathname.startsWith(path + "/");
//     };

//     // Check if a device menu item is active
//     const isDeviceMenuActive = (path) => {
//         return location.pathname.startsWith(path + "/");
//     };

//     // Get current device ID from URL
//     const getCurrentDeviceId = () => {
//         const match = location.pathname.match(/^\/(processes|windows|idle|sessions)\/(\d+)$/);
//         return match ? match[2] : null;
//     };

//     const currentDeviceId = getCurrentDeviceId();
//     const currentDevice = devices.find(d => d.id === parseInt(currentDeviceId));

//     return (
//         <div className="d-flex min-vh-100">
//             {/* Sidebar */}
//             <div className="sidebar bg-dark text-white d-flex flex-column" style={{ width: "280px", minHeight: "100vh", position: "sticky", top: 0 }}>
//                 <div className="p-3">
//                     {/* Logo */}
//                     <div className="mb-4" style={{ cursor: "pointer" }}
//     onClick={() => navigate("/dashboard")}>
//                         <h4 className="text-white">
//                             <span className="text-primary">Activity</span>Tracker
//                         </h4>
//                         <hr className="border-secondary" />
//                     </div>

//                     {/* Navigation */}
//                     <nav className="nav flex-column flex-grow-1">
//                         {/* Main Menu Items */}
//                         {menuItems.map((item) => (
//                             <Link
//                                 key={item.path}
//                                 to={item.path}
//                                 className={`nav-link text-white d-flex align-items-center gap-3 py-3 px-3 mb-1 ${
//                                     isActive(item.path) ? "active bg-primary" : "hover-bg-light"
//                                 }`}
//                                 style={{ 
//                                     borderRadius: "8px", 
//                                     transition: "all 0.3s"
//                                 }}
//                             >
//                                 <item.icon size={20} />
//                                 <span>{item.label}</span>
//                                 {isActive(item.path) && (
//                                     <span className="ms-auto">
//                                         <i className="bi bi-check-circle-fill" style={{ fontSize: "12px" }}></i>
//                                     </span>
//                                 )}
//                             </Link>
//                         ))}

//                         {/* Device-specific menu items - only shown on device pages */}
//                         {(isDevicePage || isDevicesPage) && devices.length > 0 && (
//                             <>
//                                 <hr className="border-secondary my-2" />
//                                 <div className="text-muted small px-3 py-1">
//                                     <i className="bi bi-laptop me-1"></i> Devices
//                                 </div>
                                
//                                 {/* Show device list */}
//                                 <div className="ms-2 mb-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                                     {devices.map(device => (
//                                         <div key={device.id} className="mb-1">
//                                             <div 
//                                                 className={`text-white d-flex align-items-center gap-2 py-1 px-3 ${
//                                                     currentDeviceId === device.id.toString() ? "bg-primary" : "hover-bg-light"
//                                                 }`}
//                                                 style={{ 
//                                                     borderRadius: "6px", 
//                                                     fontSize: "0.85rem",
//                                                     cursor: "pointer",
//                                                     transition: "all 0.3s"
//                                                 }}
//                                                 onClick={() => {
//                                                     // Navigate to processes page for this device
//                                                     navigate(`/processes/${device.id}`);
//                                                 }}
//                                             >
//                                                 <span>🖥️ {device.machineName}</span>
//                                                 {currentDeviceId === device.id.toString() && (
//                                                     <span className="ms-auto">
//                                                         <i className="bi bi-check-circle-fill" style={{ fontSize: "10px", color: "#fff" }}></i>
//                                                     </span>
//                                                 )}
//                                             </div>
                                            
//                                             {/* Sub-menu for this device - only show if it's the current device */}
//                                             {currentDeviceId === device.id.toString() && (
//                                                 <div className="ms-3 mt-1">
//                                                     {deviceMenuItems.map((subItem) => (
//                                                         <Link
//                                                             key={subItem.path}
//                                                             to={`${subItem.path}/${device.id}`}
//                                                             className={`nav-link text-white d-flex align-items-center gap-2 py-1 px-3 ${
//                                                                 isDeviceMenuActive(subItem.path) ? "bg-primary" : "hover-bg-light"
//                                                             }`}
//                                                             style={{ 
//                                                                 borderRadius: "6px", 
//                                                                 fontSize: "0.85rem",
//                                                                 transition: "all 0.3s"
//                                                             }}
//                                                         >
//                                                             <subItem.icon size={16} />
//                                                             <span>{subItem.label}</span>
//                                                             {isDeviceMenuActive(subItem.path) && (
//                                                                 <span className="ms-auto">
//                                                                     <i className="bi bi-check-circle-fill" style={{ fontSize: "10px" }}></i>
//                                                                 </span>
//                                                             )}
//                                                         </Link>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </>
//                         )}

//                         {/* Show message when on device page but no devices */}
//                         {(isDevicePage || isDevicesPage) && devices.length === 0 && !loading && (
//                             <div className="text-muted small px-3 py-2">
//                                 <i className="bi bi-info-circle me-1"></i>
//                                 No devices available
//                             </div>
//                         )}

//                         {loading && (
//                             <div className="text-muted small px-3 py-2">
//                                 <span className="spinner-border spinner-border-sm me-2" />
//                                 Loading devices...
//                             </div>
//                         )}
//                     </nav>

//                     {/* Footer */}
//                     <div className="mt-auto pt-3 border-top border-secondary">
//                         <div className="text-muted small mb-2">
//                             <div><i className="bi bi-clock me-1"></i> {new Date().toLocaleTimeString()}</div>
//                             <div><i className="bi bi-calendar me-1"></i> {new Date().toLocaleDateString()}</div>
//                         </div>
//                         <button
//                             className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
//                             onClick={handleLogout}
//                         >
//                             <FaSignOutAlt />
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex-grow-1 bg-light" style={{ overflowY: "auto", minHeight: "100vh" }}>
//                 <div className="p-4">
//                     {children}
//                 </div>
//             </div>

//             <style>{`
//                 .sidebar {
//                     z-index: 1000;
//                     flex-shrink: 0;
//                 }
//                 .sidebar .nav-link {
//                     color: rgba(255, 255, 255, 0.7) !important;
//                 }
//                 .sidebar .nav-link:hover:not(.active) {
//                     background: rgba(255, 255, 255, 0.08);
//                 }
//                 .sidebar .nav-link.active {
//                     color: #fff !important;
//                     box-shadow: 0 0 20px rgba(13, 110, 253, 0.3);
//                 }
//                 .sidebar .hover-bg-light:hover {
//                     background: rgba(255, 255, 255, 0.08);
//                 }
//                 .sidebar::-webkit-scrollbar {
//                     width: 4px;
//                 }
//                 .sidebar::-webkit-scrollbar-track {
//                     background: transparent;
//                 }
//                 .sidebar::-webkit-scrollbar-thumb {
//                     background: #444;
//                     border-radius: 4px;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Layout;
















import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaLaptop,
    FaMicrochip,
    FaWindowMaximize,
    FaClock,
    FaServer,
    FaSignOutAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    const isDevicePage = location.pathname.match(/^\/(processes|windows|idle|sessions)\/\d+$/);
    const isDevicesPage = location.pathname === "/devices" || location.pathname.startsWith("/devices/");

    useEffect(() => {
        if (isDevicePage || isDevicesPage) {
            fetchDevices();
        }
    }, [location.pathname]);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const usersResponse = await api.get("/admin/users");
            const users = usersResponse.data || [];
            
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
        } catch (error) {
            console.error("Error fetching devices:", error);
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { path: "/dashboard", icon: FaHome, label: "Dashboard" },
        { path: "/users", icon: FaUsers, label: "Users" },
        { path: "/devices", icon: FaLaptop, label: "Devices" },
    ];

    const deviceMenuItems = [
        { path: "/processes", icon: FaMicrochip, label: "Processes" },
        { path: "/windows", icon: FaWindowMaximize, label: "Windows" },
        { path: "/idle", icon: FaClock, label: "Idle" },
        { path: "/sessions", icon: FaServer, label: "Sessions" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard" || location.pathname === "/";
        }
        if (path === "/devices") {
            return location.pathname === "/devices" || location.pathname.startsWith("/devices/");
        }
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    const isDeviceMenuActive = (path) => {
        return location.pathname.startsWith(path + "/");
    };

    const getCurrentDeviceId = () => {
        const match = location.pathname.match(/^\/(processes|windows|idle|sessions)\/(\d+)$/);
        return match ? match[2] : null;
    };

    const currentDeviceId = getCurrentDeviceId();
    const currentDevice = devices.find(d => d.id === parseInt(currentDeviceId));

    return (
        <div className="d-flex min-vh-100">
            <div className="sidebar bg-dark text-white d-flex flex-column" style={{ width: "280px", minHeight: "100vh", position: "sticky", top: 0 }}>
                <div className="p-3">
                    <div 
                        className="mb-4" 
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/dashboard")}
                    >
                        <h4 className="text-white">
                            <span className="text-primary">Activity</span>Tracker
                        </h4>
                        <hr className="border-secondary" />
                    </div>

                    <nav className="nav flex-column flex-grow-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link text-white d-flex align-items-center gap-3 py-3 px-3 mb-1 ${
                                    isActive(item.path) ? "active bg-primary" : "hover-bg-light"
                                }`}
                                style={{ 
                                    borderRadius: "8px", 
                                    transition: "all 0.3s"
                                }}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {isActive(item.path) && (
                                    <span className="ms-auto">
                                        <i className="bi bi-check-circle-fill" style={{ fontSize: "12px" }}></i>
                                    </span>
                                )}
                            </Link>
                        ))}

                        {(isDevicePage || isDevicesPage) && devices.length > 0 && (
                            <>
                                <hr className="border-secondary my-2" />
                                <div className="text-muted small px-3 py-1">
                                    <i className="bi bi-laptop me-1"></i> Devices
                                </div>
                                
                                <div className="ms-2 mb-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                    {devices.map(device => (
                                        <div key={device.id} className="mb-1">
                                            <div 
                                                className={`text-white d-flex align-items-center gap-2 py-1 px-3 ${
                                                    currentDeviceId === device.id.toString() ? "bg-primary" : "hover-bg-light"
                                                }`}
                                                style={{ 
                                                    borderRadius: "6px", 
                                                    fontSize: "0.85rem",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s"
                                                }}
                                                onClick={() => {
                                                    navigate(`/processes/${device.id}`);
                                                }}
                                            >
                                                <span>🖥️ {device.machineName}</span>
                                                {currentDeviceId === device.id.toString() && (
                                                    <span className="ms-auto">
                                                        <i className="bi bi-check-circle-fill" style={{ fontSize: "10px", color: "#fff" }}></i>
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {currentDeviceId === device.id.toString() && (
                                                <div className="ms-3 mt-1">
                                                    {deviceMenuItems.map((subItem) => (
                                                        <Link
                                                            key={subItem.path}
                                                            to={`${subItem.path}/${device.id}`}
                                                            className={`nav-link text-white d-flex align-items-center gap-2 py-1 px-3 ${
                                                                isDeviceMenuActive(subItem.path) ? "bg-primary" : "hover-bg-light"
                                                            }`}
                                                            style={{ 
                                                                borderRadius: "6px", 
                                                                fontSize: "0.85rem",
                                                                transition: "all 0.3s"
                                                            }}
                                                        >
                                                            <subItem.icon size={16} />
                                                            <span>{subItem.label}</span>
                                                            {isDeviceMenuActive(subItem.path) && (
                                                                <span className="ms-auto">
                                                                    <i className="bi bi-check-circle-fill" style={{ fontSize: "10px" }}></i>
                                                                </span>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {(isDevicePage || isDevicesPage) && devices.length === 0 && !loading && (
                            <div className="text-muted small px-3 py-2">
                                <i className="bi bi-info-circle me-1"></i>
                                No devices available
                            </div>
                        )}

                        {loading && (
                            <div className="text-muted small px-3 py-2">
                                <span className="spinner-border spinner-border-sm me-2" />
                                Loading devices...
                            </div>
                        )}
                    </nav>

                    <div className="mt-auto pt-3 border-top border-secondary">
                        <div className="text-muted small mb-2">
                            <div><i className="bi bi-clock me-1"></i> {new Date().toLocaleTimeString()}</div>
                            <div><i className="bi bi-calendar me-1"></i> {new Date().toLocaleDateString()}</div>
                        </div>
                        <button
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 bg-light" style={{ overflowY: "auto", minHeight: "100vh" }}>
                <div className="p-4">
                    {children}
                </div>
            </div>

            <style>{`
                .sidebar {
                    z-index: 1000;
                    flex-shrink: 0;
                }
                .sidebar .nav-link {
                    color: rgba(255, 255, 255, 0.7) !important;
                }
                .sidebar .nav-link:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.08);
                }
                .sidebar .nav-link.active {
                    color: #fff !important;
                    box-shadow: 0 0 20px rgba(13, 110, 253, 0.3);
                }
                .sidebar .hover-bg-light:hover {
                    background: rgba(255, 255, 255, 0.08);
                }
                .sidebar::-webkit-scrollbar {
                    width: 4px;
                }
                .sidebar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar::-webkit-scrollbar-thumb {
                    background: #444;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default Layout;