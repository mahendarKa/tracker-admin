// import React from "react";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
//     PointElement,
//     LineElement
// } from "chart.js";
// import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";

// // Register ChartJS components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
//     PointElement,
//     LineElement
// );

// const ActivityCharts = ({ stats, loading }) => {
//     // Chart colors
//     const colors = {
//         primary: "#0d6efd",
//         success: "#198754",
//         info: "#0dcaf0",
//         warning: "#ffc107",
//         danger: "#dc3545",
//         secondary: "#6c757d",
//         purple: "#6f42c1",
//         pink: "#d63384"
//     };

//     // Check if there's any data to show
//     const hasData = (stats?.processes || 0) + (stats?.windows || 0) + (stats?.idle || 0) + (stats?.sessions || 0) > 0;

//     // Distribution chart data (Pie)
//     const distributionData = {
//         labels: ["Processes", "Windows", "Idle", "Sessions"],
//         datasets: [
//             {
//                 data: [
//                     stats?.processes || 0,
//                     stats?.windows || 0,
//                     stats?.idle || 0,
//                     stats?.sessions || 0
//                 ],
//                 backgroundColor: [
//                     colors.info,
//                     colors.warning,
//                     colors.danger,
//                     colors.success
//                 ],
//                 borderColor: "#fff",
//                 borderWidth: 2,
//             },
//         ],
//     };

//     // Bar chart data
//     const barData = {
//         labels: ["Processes", "Windows", "Idle", "Sessions"],
//         datasets: [
//             {
//                 label: "Activity Count",
//                 data: [
//                     stats?.processes || 0,
//                     stats?.windows || 0,
//                     stats?.idle || 0,
//                     stats?.sessions || 0
//                 ],
//                 backgroundColor: [
//                     `rgba(13, 202, 240, 0.7)`,
//                     `rgba(255, 193, 7, 0.7)`,
//                     `rgba(220, 53, 69, 0.7)`,
//                     `rgba(25, 135, 84, 0.7)`
//                 ],
//                 borderColor: [
//                     colors.info,
//                     colors.warning,
//                     colors.danger,
//                     colors.success
//                 ],
//                 borderWidth: 2,
//                 borderRadius: 8,
//             },
//         ],
//     };

//     // Line chart data
//     const lineData = {
//         labels: ["Users", "Devices", "Processes", "Windows", "Idle", "Sessions"],
//         datasets: [
//             {
//                 label: "Activity Statistics",
//                 data: [
//                     stats?.users || 0,
//                     stats?.devices || 0,
//                     stats?.processes || 0,
//                     stats?.windows || 0,
//                     stats?.idle || 0,
//                     stats?.sessions || 0
//                 ],
//                 borderColor: colors.primary,
//                 backgroundColor: `rgba(13, 110, 253, 0.1)`,
//                 fill: true,
//                 tension: 0.4,
//                 pointBackgroundColor: colors.primary,
//                 pointBorderColor: "#fff",
//                 pointBorderWidth: 2,
//                 pointRadius: 6,
//                 pointHoverRadius: 8,
//             },
//         ],
//     };

//     // Chart options
//     const pieOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: "bottom",
//                 labels: {
//                     padding: 20,
//                     usePointStyle: true,
//                     pointStyle: "circle",
//                 },
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function(context) {
//                         const label = context.label || "";
//                         const value = context.parsed || 0;
//                         const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                         const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
//                         return `${label}: ${value} (${percentage}%)`;
//                     }
//                 }
//             }
//         },
//         cutout: "60%",
//     };

//     const barOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false,
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 grid: {
//                     color: "rgba(0, 0, 0, 0.05)",
//                 },
//             },
//             x: {
//                 grid: {
//                     display: false,
//                 },
//             },
//         },
//     };

//     const lineOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: "top",
//                 labels: {
//                     usePointStyle: true,
//                     pointStyle: "circle",
//                 },
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 grid: {
//                     color: "rgba(0, 0, 0, 0.05)",
//                 },
//             },
//             x: {
//                 grid: {
//                     display: false,
//                 },
//             },
//         },
//         interaction: {
//             intersect: false,
//             mode: "index",
//         },
//     };

//     if (loading) {
//         return (
//             <div className="row g-4 mt-2">
//                 <div className="col-12">
//                     <div className="text-center py-5">
//                         <div className="spinner-border text-primary" role="status">
//                             <span className="visually-hidden">Loading charts...</span>
//                         </div>
//                         <p className="mt-2 text-muted">Loading charts...</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (!hasData) {
//         return (
//             <div className="row g-4 mt-2">
//                 <div className="col-12">
//                     <div className="card shadow-sm">
//                         <div className="card-body text-center py-5">
//                             <i className="bi bi-bar-chart" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
//                             <h5 className="mt-3 text-muted">No data available for charts</h5>
//                             <p className="text-muted">Start tracking activities to see visual representations</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="row g-4 mt-2">
//             {/* Pie Chart - Distribution */}
//             <div className="col-xl-4 col-lg-6 col-md-12">
//                 <div className="card h-100 shadow-sm">
//                     <div className="card-body">
//                         <h6 className="fw-bold mb-3">
//                             <i className="bi bi-pie-chart me-2 text-primary"></i>
//                             Activity Distribution
//                         </h6>
//                         <div style={{ height: "300px" }}>
//                             <Pie data={distributionData} options={pieOptions} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Bar Chart - Activity Counts */}
//             <div className="col-xl-4 col-lg-6 col-md-12">
//                 <div className="card h-100 shadow-sm">
//                     <div className="card-body">
//                         <h6 className="fw-bold mb-3">
//                             <i className="bi bi-bar-chart me-2 text-success"></i>
//                             Activity Counts
//                         </h6>
//                         <div style={{ height: "300px" }}>
//                             <Bar data={barData} options={barOptions} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Line Chart - Overall Statistics */}
//             <div className="col-xl-4 col-lg-12 col-md-12">
//                 <div className="card h-100 shadow-sm">
//                     <div className="card-body">
//                         <h6 className="fw-bold mb-3">
//                             <i className="bi bi-graph-up me-2 text-info"></i>
//                             Overall Statistics
//                         </h6>
//                         <div style={{ height: "300px" }}>
//                             <Line data={lineData} options={lineOptions} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ActivityCharts;













import React, { useEffect, useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const ActivityCharts = ({ stats, loading }) => {
    const chartRefs = useRef({});

    const colors = {
        primary: "#0d6efd",
        success: "#198754",
        info: "#0dcaf0",
        warning: "#ffc107",
        danger: "#dc3545",
        secondary: "#6c757d",
        purple: "#6f42c1",
        pink: "#d63384"
    };

    const hasData = (stats?.processes || 0) + (stats?.windows || 0) + (stats?.idle || 0) + (stats?.sessions || 0) > 0;

    const distributionData = {
        labels: ["Processes", "Windows", "Idle", "Sessions"],
        datasets: [
            {
                data: [
                    stats?.processes || 0,
                    stats?.windows || 0,
                    stats?.idle || 0,
                    stats?.sessions || 0
                ],
                backgroundColor: [
                    "#0dcaf0",
                    "#ffc107",
                    "#dc3545",
                    "#198754"
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    const barData = {
        labels: ["Processes", "Windows", "Idle", "Sessions"],
        datasets: [
            {
                label: "Activity Count",
                data: [
                    stats?.processes || 0,
                    stats?.windows || 0,
                    stats?.idle || 0,
                    stats?.sessions || 0
                ],
                backgroundColor: [
                    "rgba(13, 202, 240, 0.7)",
                    "rgba(255, 193, 7, 0.7)",
                    "rgba(220, 53, 69, 0.7)",
                    "rgba(25, 135, 84, 0.7)"
                ],
                borderColor: [
                    "#0dcaf0",
                    "#ffc107",
                    "#dc3545",
                    "#198754"
                ],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const lineData = {
        labels: ["Users", "Devices", "Processes", "Windows", "Idle", "Sessions"],
        datasets: [
            {
                label: "Activity Statistics",
                data: [
                    stats?.users || 0,
                    stats?.devices || 0,
                    stats?.processes || 0,
                    stats?.windows || 0,
                    stats?.idle || 0,
                    stats?.sessions || 0
                ],
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13, 110, 253, 0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#0d6efd",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: { size: 12 }
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: "60%",
        animation: {
            animateRotate: true,
            duration: 1000
        }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
            },
            x: {
                grid: { display: false },
            },
        },
        animation: {
            duration: 1000
        }
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: { size: 12 }
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
            },
            x: {
                grid: { display: false },
            },
        },
        interaction: {
            intersect: false,
            mode: "index",
        },
        animation: {
            duration: 1000
        }
    };

    if (loading) {
        return (
            <div className="row g-4 mt-2">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading charts...</span>
                            </div>
                            <p className="mt-2 text-muted">Loading charts...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="row g-4 mt-2">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="bi bi-bar-chart" style={{ fontSize: "48px", color: "#dee2e6" }}></i>
                            <h5 className="mt-3 text-muted">No data available for charts</h5>
                            <p className="text-muted">Start tracking activities to see visual representations</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row g-4 mt-2">
            <div className="col-xl-4 col-lg-6 col-md-12">
                <div className="card h-100 shadow-sm">
                    <div className="card-body">
                        <h6 className="fw-bold mb-3">
                            <i className="bi bi-pie-chart me-2 text-primary"></i>
                            Activity Distribution
                        </h6>
                        <div style={{ height: "300px", position: "relative" }}>
                            <Pie data={distributionData} options={pieOptions} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-4 col-lg-6 col-md-12">
                <div className="card h-100 shadow-sm">
                    <div className="card-body">
                        <h6 className="fw-bold mb-3">
                            <i className="bi bi-bar-chart me-2 text-success"></i>
                            Activity Counts
                        </h6>
                        <div style={{ height: "300px", position: "relative" }}>
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-4 col-lg-12 col-md-12">
                <div className="card h-100 shadow-sm">
                    <div className="card-body">
                        <h6 className="fw-bold mb-3">
                            <i className="bi bi-graph-up me-2 text-info"></i>
                            Overall Statistics
                        </h6>
                        <div style={{ height: "300px", position: "relative" }}>
                            <Line data={lineData} options={lineOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityCharts;