import { useState, useMemo } from 'react';
import rawProjectData from '../projects.json';

const avatarColors = [
  'bg-slate-900',
  'bg-emerald-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500'
];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSelect?: () => void;
}

export default function ProjectModal({ isOpen, onClose, onProjectSelect }: ProjectModalProps) {
  const [search, setSearch] = useState('');

  // Use the full real list directly from JSON
  const projects = useMemo(() => {
    return Array.isArray(rawProjectData) 
      ? rawProjectData 
      : (rawProjectData as any).data || [];
  }, []);

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    return projects.filter((p: any) => {
      const name = p.name || p.title || '';
      const desc = p.description || p.desc || p.subtitle || '';
      return name.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase());
    });
  }, [projects, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-[480px] bg-white rounded-[20px] sm:rounded-[24px] flex flex-col max-h-[90vh] sm:max-h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors z-10"
        >
          <i className="fas fa-times text-[14px]"></i>
        </button>

        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4 flex flex-col items-center text-center">
          <div className="w-[40px] sm:w-[46px] h-[40px] sm:h-[46px] bg-[#EEF0FF] rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
            <i className="fas fa-building text-[#5B62F1] text-[18px] sm:text-[20px]"></i>
          </div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0F172A] mb-1 tracking-tight">Select a project</h2>
          <p className="text-[12px] sm:text-[13px] text-slate-500">Choose from 349 verified projects</p>
        </div>

        <div className="px-4 sm:px-6 pb-2">
          <div className="relative flex items-center">
            <i className="fas fa-search absolute left-3 sm:left-4 text-slate-400 text-[12px] sm:text-[13px]"></i>
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-slate-200 rounded-[12px] sm:rounded-[14px] outline-none focus:border-[#5B62F1] focus:ring-2 focus:ring-[#5B62F1]/10 transition-all text-[13px] sm:text-[14px] text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-y-auto px-3 sm:px-4 pb-2 h-[240px] sm:h-[264px] shrink-0 custom-scrollbar">
          {filteredProjects.map((project: any, index: number) => {
            const name = project.name || project.title || 'Unknown Project';
            const desc = project.description || project.desc || project.subtitle || '';
            const bgColor = project.color || getAvatarColor(name);

            return (
              <button 
                key={`${project.id || index}`} 
                onClick={onProjectSelect}
                className="w-full flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3 hover:bg-slate-50 rounded-[12px] sm:rounded-[16px] transition-colors text-left group"
              >
                {/* This is the avatar that can show an icon OR an initial – just like before */}
                <div className={`w-[36px] sm:w-[42px] h-[36px] sm:h-[42px] rounded-full flex items-center justify-center text-white text-[14px] sm:text-[16px] font-bold shrink-0 ${bgColor}`}>
                  {project.iconClass ? (
                    <i className={`${project.iconClass} text-[16px] sm:text-[18px]`}></i>
                  ) : (
                    <span>{project.initial || name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center gap-1 sm:gap-2 mb-0.5 flex-wrap">
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] truncate">{name}</span>
                    <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-[1px] sm:py-[2px] bg-[#EEF0FF] rounded shrink-0">
                      <span className="text-[8px] sm:text-[9px] font-bold text-[#5B62F1] uppercase tracking-wide leading-none mt-[0.5px]">Official</span>
                      <i className="fas fa-check-circle text-[#5B62F1] text-[8px] sm:text-[10px]"></i>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-slate-500 truncate">{desc}</div>
                </div>

                <i className="fas fa-chevron-right text-[11px] sm:text-[12px] text-slate-300 group-hover:text-slate-400 mr-0.5 sm:mr-1 transition-colors"></i>
              </button>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="text-center py-6 sm:py-10 text-slate-500 text-[12px] sm:text-[13px]">
              No projects found matching "{search}"
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] sm:text-[12px] text-slate-500 shrink-0">
          <i className="fas fa-shield-halved text-[#5B62F1] text-[12px] sm:text-[13px]"></i>
          <span className="font-semibold text-slate-700">Official support only.</span> We will never DM you first.
        </div>

      </div>
    </div>
  );
}