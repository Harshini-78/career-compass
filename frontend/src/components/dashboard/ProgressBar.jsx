import React from 'react';

const ProgressBar = ({ currentStage, totalStages, percentage }) => {
    return (
        <div className="mb-6 mt-auto">
            <div className="flex justify-between items-end mb-2">
                <span className="text-gray-600 font-medium text-[14px]">
                    Stage {Math.min(currentStage, totalStages)} of {totalStages}
                </span>
                <span className="font-extrabold text-[#0f172a] text-[18px]">{percentage}%</span>
            </div>
            <div className="w-full bg-[#F3F4F6] rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-[#5B4BFF] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
