import React from 'react';

export default function Sidebar({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <aside className="w-full h-full flex flex-col py-6 lg:py-8 px-4 lg:px-6 border-r border-slate-100 bg-white">
      
      {/* Title with the proper Shield Logo */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-[32px] h-[32px] lg:w-[38px] lg:h-[38px] bg-[#5B62F1] rounded-[8px] lg:rounded-[10px] flex items-center justify-center shrink-0 shadow-sm">
          <svg className="w-[18px] h-[18px] lg:w-[22px] lg:h-[22px] text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-[18px] lg:text-[20px] text-[#0F172A] tracking-tight">WalletHelp</h1>
        </div>
      </div>

      <div className="mb-8 px-2">
        <p className="text-[12px] text-slate-400 leading-relaxed font-medium">Self-serve wallet troubleshooting<br/>for crypto communities</p>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto pr-2">
        
        {/* Active Dashboard Link with Custom React SVG House */}
        <button className="flex items-center gap-3.5 bg-[#EEF0FF] text-[#5B62F1] px-4 py-3 rounded-xl font-bold text-[14px] mb-8 transition-colors">
          <svg className="w-5 h-5 text-[#5B62F1]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.04 1.08L20 13.43V20a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4h-4v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-6.57l-.48.49a.75.75 0 11-1.04-1.08l8.99-9z" />
          </svg>
          Dashboard
        </button>

        {/* User Experience Section */}
        <div className="mb-3 px-4">
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">User Experience</p>
        </div>
        <div className="flex flex-col gap-1 mb-8">
          <button onClick={onOpenModal} className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="fas fa-tools w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Troubleshooter
          </button>
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="fas fa-book-open w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Smart Help Center
          </button>
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="fas fa-comment-dots w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Error Decoder
          </button>
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="fas fa-search w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Check Tools
          </button>
        </div>

        {/* Admin Tools Section */}
        <div className="mb-3 px-4">
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Admin Tools</p>
        </div>
        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="far fa-comment-alt w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Reply Templates
          </button>
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="fas fa-cog w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Project Settings
          </button>
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="fas fa-database w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Knowledge Base
          </button>
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="fas fa-chart-bar w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Analytics
          </button>
          <button className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-[14px] transition-colors text-left w-full group">
            <i className="far fa-user w-5 text-center text-slate-400 group-hover:text-slate-600 transition-colors"></i> Team Members
          </button>
        </div>
      </div>

      {/* Need Help Box */}
      <div className="mt-8 px-2">
        <div className="flex items-center gap-2 mb-2">
          <i className="fas fa-headset text-[#5B62F1] text-[16px]"></i>
          <h4 className="text-[14px] font-bold text-slate-900">Need help?</h4>
        </div>
        <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">Our support is here for you</p>
        <button 
          onClick={onOpenModal}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#5B62F1] hover:bg-indigo-600 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
        >
          Contact Support
        </button>
      </div>

    </aside>
  );
}