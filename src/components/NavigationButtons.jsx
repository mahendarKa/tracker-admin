
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const NavigationButtons = ({ 
    backPath = "/dashboard", 
    backLabel = "Back",
    showForward = true 
}) => {
    const navigate = useNavigate();
    const [canGoForward, setCanGoForward] = useState(false);

    useEffect(() => {
        // Check if forward navigation is possible
        const checkForward = () => {
            try {
                // Create a temporary state to test forward navigation
                const currentState = window.history.state;
                // If we have a state, check if we can go forward
                if (currentState && currentState.idx !== undefined) {
                    setCanGoForward(currentState.idx < (window.history.length - 1));
                } else {
                    setCanGoForward(false);
                }
            } catch (e) {
                setCanGoForward(false);
            }
        };

        checkForward();

        // Listen for popstate events (back/forward navigation)
        const handlePopState = () => {
            setTimeout(checkForward, 50); // Small delay to allow state to update
        };

        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Also update when location changes
    useEffect(() => {
        const checkForward = () => {
            try {
                const currentState = window.history.state;
                if (currentState && currentState.idx !== undefined) {
                    setCanGoForward(currentState.idx < (window.history.length - 1));
                } else {
                    setCanGoForward(false);
                }
            } catch (e) {
                setCanGoForward(false);
            }
        };

        checkForward();
    }, [window.location.pathname]);

    const goBack = () => {
        navigate(-1);
    };

    const goForward = () => {
        try {
            navigate(1);
            // After navigating forward, check if we can still go forward
            setTimeout(() => {
                const currentState = window.history.state;
                if (currentState && currentState.idx !== undefined) {
                    setCanGoForward(currentState.idx < (window.history.length - 1));
                }
            }, 50);
        } catch (e) {
            setCanGoForward(false);
        }
    };

    return (
        <div className="btn-group me-3">
            <button 
                className="btn btn-outline-secondary"
                onClick={goBack}
                title="Go Back"
            >
                <FaArrowLeft className="me-1" />
                Back
            </button>
            {showForward && canGoForward && (
                <button 
                    className="btn btn-outline-secondary"
                    onClick={goForward}
                    title="Go Forward"
                >
                    Forward
                    <FaArrowRight className="ms-1" />
                </button>
            )}
        </div>
    );
};

export default NavigationButtons;