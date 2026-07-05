import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    FaUsers, 
    FaLaptop, 
    FaMicrochip, 
    FaWindowMaximize, 
    FaClock, 
    FaServer 
} from "react-icons/fa";

const StatsCards = ({ stats, loading }) => {
    const navigate = useNavigate();
    const [animatedValues, setAnimatedValues] = useState({});

    // Animate values when stats change
    useEffect(() => {
        const newValues = {};
        Object.keys(stats).forEach(key => {
            const target = stats[key] || 0;
            const current = animatedValues[key] || 0;
            if (current !== target) {
                const diff = target - current;
                const step = diff > 0 ? Math.ceil(diff / 10) : Math.floor(diff / 10);
                let value = current;
                const interval = setInterval(() => {
                    value += step;
                    if ((step > 0 && value >= target) || (step < 0 && value <= target)) {
                        value = target;
                        clearInterval(interval);
                    }
                    setAnimatedValues(prev => ({ ...prev, [key]: value }));
                }, 20);
                return () => clearInterval(interval);
            }
        });
    }, [stats]);

    const cards = [
        {
            title: "Total Users",
            value: stats?.users || 0,
            key: "users",
            icon: FaUsers,
            color: "#0d6efd",
            bgColor: "rgba(13, 110, 253, 0.1)",
            path: "/users",
            type: "users"
        },
        {
            title: "Total Devices",
            value: stats?.devices || 0,
            key: "devices",
            icon: FaLaptop,
            color: "#198754",
            bgColor: "rgba(25, 135, 84, 0.1)",
            path: "/devices",
            type: "devices"
        },
        {
            title: "Processes",
            value: stats?.processes || 0,
            key: "processes",
            icon: FaMicrochip,
            color: "#0dcaf0",
            bgColor: "rgba(13, 202, 240, 0.1)",
            path: "/processes",
            type: "processes"
        },
        {
            title: "Windows",
            value: stats?.windows || 0,
            key: "windows",
            icon: FaWindowMaximize,
            color: "#ffc107",
            bgColor: "rgba(255, 193, 7, 0.1)",
            path: "/windows",
            type: "windows"
        },
        {
            title: "Idle Activities",
            value: stats?.idle || 0,
            key: "idle",
            icon: FaClock,
            color: "#dc3545",
            bgColor: "rgba(220, 53, 69, 0.1)",
            path: "/idle",
            type: "idle"
        },
        {
            title: "Sessions",
            value: stats?.sessions || 0,
            key: "sessions",
            icon: FaServer,
            color: "#6c757d",
            bgColor: "rgba(108, 117, 125, 0.1)",
            path: "/sessions",
            type: "sessions"
        }
    ];

    const handleCardClick = (card) => {
        switch(card.type) {
            case 'users':
                navigate('/users');
                break;
            case 'devices':
                toast.info('Please select a user from the Users page to view devices');
                navigate('/users');
                break;
            case 'processes':
                toast.info('Please select a device to view processes');
                navigate('/dashboard');
                break;
            case 'windows':
                toast.info('Please select a device to view windows');
                navigate('/dashboard');
                break;
            case 'idle':
                toast.info('Please select a device to view idle activities');
                navigate('/dashboard');
                break;
            case 'sessions':
                toast.info('Please select a device to view sessions');
                navigate('/dashboard');
                break;
            default:
                navigate('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="row g-4 mb-4">
                {cards.map((card, index) => (
                    <div className="col-xl-2 col-lg-4 col-md-6 col-sm-12" key={index}>
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="text-muted mb-2">{card.title}</h6>
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-6" style={{ height: "32px" }}></span>
                                        </div>
                                    </div>
                                    <div className="rounded-circle p-3 bg-light">
                                        <div className="placeholder" style={{ width: "24px", height: "24px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="row g-4 mb-4">
            {cards.map((card, index) => {
                const IconComponent = card.icon;
                const displayValue = animatedValues[card.key] !== undefined ? 
                    Math.round(animatedValues[card.key]) : card.value;
                
                return (
                    <div className="col-xl-2 col-lg-4 col-md-6 col-sm-12" key={index}>
                        <div 
                            className="card h-100 border-0 shadow-sm hover-card clickable-card"
                            onClick={() => handleCardClick(card)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                                            {card.title}
                                        </h6>
                                        <h2 className="mb-0 fw-bold">
                                            {displayValue.toLocaleString()}
                                        </h2>
                                    </div>
                                    <div 
                                        className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                                        style={{ 
                                            backgroundColor: card.bgColor,
                                            width: "52px",
                                            height: "52px"
                                        }}
                                    >
                                        <IconComponent 
                                            size={24} 
                                            color={card.color}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <style>{`
                .hover-card {
                    transition: all 0.3s ease;
                }
                .clickable-card {
                    cursor: pointer;
                }
                .clickable-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                .clickable-card:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};

export default StatsCards;