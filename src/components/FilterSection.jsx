import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const FilterSection = ({ 
    filters, 
    setFilters, 
    onFilter, 
    onReset, 
    activeTab,
    loading 
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getFilterFields = () => {
        const commonFields = (
            <>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">User ID</label>
                    <input
                        type="number"
                        className="form-control"
                        name="userId"
                        value={filters.userId}
                        onChange={handleChange}
                        placeholder="Enter user ID"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">Device ID</label>
                    <input
                        type="number"
                        className="form-control"
                        name="deviceId"
                        value={filters.deviceId}
                        onChange={handleChange}
                        placeholder="Enter device ID"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                        className="form-select"
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="RUNNING">Running</option>
                        <option value="IDLE">Idle</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">From Date</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">End Date</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChange}
                    />
                </div>
            </>
        );

        switch (activeTab) {
            case "processes":
                return (
                    <>
                        {commonFields}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Process Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="processName"
                                value={filters.processName}
                                onChange={handleChange}
                                placeholder="Enter process name"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">PID</label>
                            <input
                                type="number"
                                className="form-control"
                                name="pid"
                                value={filters.pid}
                                onChange={handleChange}
                                placeholder="Enter PID"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Min Duration (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="durationMin"
                                value={filters.durationMin}
                                onChange={handleChange}
                                placeholder="Min seconds"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Max Duration (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="durationMax"
                                value={filters.durationMax}
                                onChange={handleChange}
                                placeholder="Max seconds"
                            />
                        </div>
                    </>
                );
            case "windows":
                return (
                    <>
                        {commonFields}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Window Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="windowTitle"
                                value={filters.windowTitle}
                                onChange={handleChange}
                                placeholder="Enter window title"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Min Duration (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="durationMin"
                                value={filters.durationMin}
                                onChange={handleChange}
                                placeholder="Min seconds"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Max Duration (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="durationMax"
                                value={filters.durationMax}
                                onChange={handleChange}
                                placeholder="Max seconds"
                            />
                        </div>
                    </>
                );
            case "idle":
                return (
                    <>
                        {commonFields}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Min Idle (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="idleSecondsMin"
                                value={filters.idleSecondsMin}
                                onChange={handleChange}
                                placeholder="Min seconds"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Max Idle (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="idleSecondsMax"
                                value={filters.idleSecondsMax}
                                onChange={handleChange}
                                placeholder="Max seconds"
                            />
                        </div>
                    </>
                );
            case "sessions":
                return (
                    <>
                        {commonFields}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Min Session (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="sessionDurationMin"
                                value={filters.sessionDurationMin}
                                onChange={handleChange}
                                placeholder="Min seconds"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Max Session (s)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="sessionDurationMax"
                                value={filters.sessionDurationMax}
                                onChange={handleChange}
                                placeholder="Max seconds"
                            />
                        </div>
                    </>
                );
            default:
                return commonFields;
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">
                        <FaSearch className="me-2" />
                        Advanced Filters
                    </h5>
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-danger btn-sm"
                            onClick={onReset}
                            disabled={loading}
                        >
                            <FaTimes className="me-1" />
                            Reset
                        </button>
                    </div>
                </div>
                <div className="row g-3">
                    {getFilterFields()}
                    <div className="col-12">
                        <button 
                            className="btn btn-primary w-100"
                            onClick={onFilter}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Filtering...
                                </>
                            ) : (
                                <>
                                    <FaSearch className="me-2" />
                                    Apply Filters
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;