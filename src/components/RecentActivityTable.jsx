// import React from "react";
// import { Link } from "react-router-dom";

// const RecentActivityTable = ({ processes, loading }) => {
//     const getStatusBadge = (status) => {
//         const statusMap = {
//             "ACTIVE": "bg-success",
//             "INACTIVE": "bg-secondary",
//             "COMPLETED": "bg-primary",
//             "RUNNING": "bg-info",
//             "IDLE": "bg-warning",
//             "ERROR": "bg-danger"
//         };
//         return statusMap[status?.toUpperCase()] || "bg-secondary";
//     };

//     if (loading) {
//         return (
//             <div className="text-center py-4">
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-2 text-muted">Loading recent activities...</p>
//             </div>
//         );
//     }

//     if (!processes || processes.length === 0) {
//         return (
//             <div className="text-center py-5">
//                 <i className="bi bi-inbox" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
//                 <h5 className="mt-3 text-muted">No recent activities found</h5>
//                 <p className="text-muted">Process activities will appear here once available</p>
//             </div>
//         );
//     }

//     return (
//         <div className="table-responsive">
//             <table className="table table-hover table-striped">
//                 <thead className="table-light">
//                     <tr>
//                         <th>Process Name</th>
//                         <th>PID</th>
//                         <th>Start Time</th>
//                         <th>Duration</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {processes.slice(0, 10).map(process => (
//                         <tr key={process.id}>
//                             <td>
//                                 <strong>{process.processName}</strong>
//                             </td>
//                             <td>
//                                 <code>{process.pid}</code>
//                             </td>
//                             <td>
//                                 {process.startTime ? 
//                                     new Date(process.startTime).toLocaleString() : 
//                                     "-"
//                                 }
//                             </td>
//                             <td>
//                                 <span className="badge bg-info">
//                                     {process.durationSeconds || 0}s
//                                 </span>
//                             </td>
//                             <td>
//                                 <span className={`badge ${getStatusBadge(process.status)}`}>
//                                     {process.status || 'UNKNOWN'}
//                                 </span>
//                             </td>
//                             <td>
//                                 <Link 
//                                     to={`/processes/${process.device?.id || 1}`}
//                                     className="btn btn-sm btn-outline-primary"
//                                 >
//                                     <i className="bi bi-eye me-1"></i>
//                                     View
//                                 </Link>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {processes.length > 10 && (
//                 <div className="text-center mt-3">
//                     <small className="text-muted">
//                         Showing 10 of {processes.length} records
//                     </small>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RecentActivityTable;












import React from "react";
import { Link } from "react-router-dom";

const RecentActivityTable = ({ processes, loading }) => {
    const getStatusBadge = (status) => {
        const statusMap = {
            "ACTIVE": "bg-success",
            "INACTIVE": "bg-secondary",
            "COMPLETED": "bg-primary",
            "RUNNING": "bg-info",
            "IDLE": "bg-warning",
            "ERROR": "bg-danger"
        };
        return statusMap[status?.toUpperCase()] || "bg-secondary";
    };

    if (loading && processes.length === 0) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading recent activities...</p>
            </div>
        );
    }

    if (!processes || processes.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="bi bi-inbox" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                <h5 className="mt-3 text-muted">No recent activities found</h5>
                <p className="text-muted">Process activities will appear here once available</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped">
                <thead className="table-light">
                    <tr>
                        <th>Process Name</th>
                        <th>PID</th>
                        <th>Start Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {processes.slice(0, 10).map(process => (
                        <tr key={process.id}>
                            <td>
                                <strong>{process.processName}</strong>
                            </td>
                            <td>
                                <code>{process.pid}</code>
                            </td>
                            <td>
                                {process.startTime ? 
                                    new Date(process.startTime).toLocaleString() : 
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
                            <td>
                                <Link 
                                    to={`/processes/${process.device?.id || 1}`}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    <i className="bi bi-eye me-1"></i>
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {processes.length > 10 && (
                <div className="text-center mt-3">
                    <small className="text-muted">
                        Showing 10 of {processes.length} records
                    </small>
                </div>
            )}
        </div>
    );
};

export default RecentActivityTable;