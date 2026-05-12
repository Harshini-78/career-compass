import React from 'react';
import { ExternalLink, Map } from 'lucide-react';

const RoadmapSuggestion = ({ domain }) => {
    // Map domains to their respective roadmap.sh URLs
    const roadmapLinks = {
        'AI/ML': 'https://roadmap.sh/ai-data-scientist',
        'Artificial Intelligence / Machine Learning': 'https://roadmap.sh/ai-data-scientist',
        'Web Development': 'https://roadmap.sh/full-stack',
        'Frontend Development': 'https://roadmap.sh/frontend',
        'Backend Development': 'https://roadmap.sh/backend',
        'DevOps': 'https://roadmap.sh/devops',
        'Cybersecurity': 'https://roadmap.sh/cyber-security',
        'Mobile Development': 'https://roadmap.sh/android',
        'Data Structures & Algorithms': 'https://roadmap.sh/computer-science'
    };

    // Default to a general roadmap if domain isn't explicitly matched
    const roadmapUrl = roadmapLinks[domain] || 'https://roadmap.sh';

    return (
        <div className="bg-white rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-6 relative overflow-hidden flex flex-col items-start">
            {/* Decorative background element */}
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#5B4BFF]/5 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-[10px] bg-[#EEF2FF] text-[#5B4BFF] flex items-center justify-center shrink-0">
                    <Map size={20} strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#0f172a] text-[18px] tracking-tight">Explore Full Roadmap</h3>
            </div>

            <div className="relative z-10 w-full">
                <p className="text-gray-600 text-[14px] leading-relaxed mb-6">
                    Want a detailed visual roadmap for mastering <strong>{domain || "your domain"}</strong>? <br className="hidden sm:block" />
                    Explore the complete learning path used by developers worldwide on roadmap.sh.
                </p>

                <a 
                    href={roadmapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#F8F9FA] hover:bg-[#F1F5F9] text-gray-800 font-bold text-[14px] py-2.5 px-6 rounded-[10px] border border-[#e2e8f0] transition-colors"
                >
                    <span>View Full Roadmap</span>
                    <ExternalLink size={16} className="text-gray-500" />
                </a>
            </div>
        </div>
    );
};

export default RoadmapSuggestion;
