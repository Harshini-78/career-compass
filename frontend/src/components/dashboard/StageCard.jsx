import React, { useState } from 'react';
import { Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import ResourceList from './ResourceList';

const StageCard = ({ stage, isUnlocked, isCompleted, onToggleSkill }) => {
    // We always want the skills visible, so expand by default. 
    // If there are many stages, we might want to start them collapsed unless they are the active stage.
    // For this design, let's keep the active or completed ones expanded, and locked ones collapsed by default.
    const [expanded, setExpanded] = useState(isUnlocked || isCompleted);

    let bgClass = "bg-white border-gray-200";
    let opacityClass = "opacity-100";
    let pill = null;
    let Avatar = null;
    let hoverClass = "";

    if (isCompleted) {
        bgClass = "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/40";
        Avatar = <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm"><Check size={24} strokeWidth={3} /></div>;
        pill = <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[12px] font-bold px-3 py-1 rounded-md ml-auto tracking-wide uppercase">Completed</span>;
    } else if (isUnlocked) {
        bgClass = "bg-[#F8F9FF] dark:bg-slate-800/50 border-[#5B4BFF]/30 dark:border-indigo-500/30";
        Avatar = <div className="w-12 h-12 rounded-xl bg-[#5B4BFF] dark:bg-indigo-500 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">{stage.order}</div>;
        pill = <span className="bg-[#5B4BFF]/10 dark:bg-indigo-500/20 text-[#5B4BFF] dark:text-indigo-300 text-[12px] font-bold px-3 py-1 rounded-md ml-auto tracking-wide uppercase">Current</span>;
        hoverClass = "hover:shadow-lg hover:shadow-[#5B4BFF]/10 dark:hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300";
    } else {
        bgClass = "bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800";
        opacityClass = "opacity-75";
        Avatar = <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 flex items-center justify-center shrink-0"><Lock size={20} strokeWidth={2} /></div>;
        hoverClass = "hover:border-gray-200 dark:hover:border-slate-700 transition-colors";
    }

    const hasResources = (stage.learning_resources && stage.learning_resources.length > 0);

    return (
        <div className={`p-6 md:p-8 rounded-3xl shadow-sm border flex flex-col gap-5 ${bgClass} ${opacityClass} ${hoverClass}`}>
            <div className="flex items-start gap-4 md:gap-5 cursor-pointer group" onClick={() => setExpanded(!expanded)}>
                {Avatar}
                <div className="flex-1 flex flex-col justify-center pt-0.5">
                    <div className="flex items-start justify-between">
                        <h3 className={`font-extrabold text-[18px] mb-1.5 tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors ${isUnlocked ? 'text-[#0f172a] dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Stage {stage.order}: {stage.title}</h3>
                        <div className="flex items-center gap-3 shrink-0">
                            {pill}
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-gray-400 text-sm group-hover:bg-gray-50 dark:group-hover:bg-slate-700 transition-colors">
                                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                        </div>
                    </div>
                    <p className={`text-[15px] leading-relaxed max-w-[90%] font-medium ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>{stage.description}</p>
                </div>
            </div>

            {expanded && (
                <div className="mt-2 text-left">
                    {stage.skills && stage.skills.length > 0 ? (
                        <ResourceList
                            resources={stage.learning_resources}
                            skills={stage.skills}
                            isUnlocked={isUnlocked}
                            onToggleSkill={onToggleSkill}
                        />
                    ) : (
                        <div className="pl-[56px] text-sm text-gray-400 italic mb-4 mt-4 py-4 border-t border-gray-100">
                            No specific skills mapped for this stage yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StageCard;
