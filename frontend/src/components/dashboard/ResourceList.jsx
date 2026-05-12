import React from 'react';
import { ExternalLink, PlayCircle, BookOpen, CheckCircle2, Circle } from 'lucide-react';

const ResourceList = ({ resources, skills, isUnlocked, onToggleSkill }) => {
    return (
        <div className="mt-4 pt-4 border-t border-gray-100/60 pl-[56px] space-y-6">
            {skills && skills.length > 0 && (
                <div>
                    <h4 className="text-[14px] font-bold text-gray-800 flex items-center gap-2 mb-3">
                        <CheckCircle2 size={16} className="text-[#5B4BFF]" />
                        Required Skills
                    </h4>
                    <ul className="space-y-2.5 bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                        {skills.map((skill) => (
                            <li 
                                key={skill.id} 
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isUnlocked ? 'hover:bg-gray-100/80 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                                onClick={() => isUnlocked && onToggleSkill(skill.id, !skill.completed)}
                            >
                                <div className={`shrink-0 transition-colors ${skill.completed ? 'text-[#10B981]' : 'text-gray-300'}`}>
                                    {skill.completed ? <CheckCircle2 size={22} className="fill-[#10B981]/10" /> : <Circle size={22} />}
                                </div>
                                <span className={`text-[14px] font-medium transition-colors ${skill.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                    {skill.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {resources && resources.length > 0 && (
                <div>
                    <h4 className="text-[14px] font-bold text-gray-800 flex items-center gap-2 mb-1">
                        <BookOpen size={16} className="text-[#5B4BFF]" />
                        Learning Resources
                    </h4>
                    <p className="text-[12px] text-gray-500 italic mb-3 ml-[24px]">Don't just stick to these resources... explore everything!</p>
                    <ul className="space-y-2">
                        {resources.map((res, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                                <span className="bg-[#5B4BFF]/10 text-[#5B4BFF] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{idx + 1}</span>
                                <div>
                                    <span className="text-[14px] text-gray-700 font-medium leading-snug block">{res.title}</span>
                                    {res.link && (
                                        <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-[#5B4BFF] hover:underline text-[13px] flex items-center gap-1 mt-0.5 font-medium">
                                            View Resource <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ResourceList;
