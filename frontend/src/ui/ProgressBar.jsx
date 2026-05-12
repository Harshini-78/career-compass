import React from 'react';

const ProgressBar = ({ percentage }) => {
    return (
        <div className="progress-bar-bg">
            <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
