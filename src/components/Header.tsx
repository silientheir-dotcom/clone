import React from 'react';

export default function Header({ 
  onToggleLeftMenu,
  onToggleRightMenu 
}: { 
  onToggleLeftMenu?: () => void; 
  onToggleRightMenu?: () => void;
}) {
  return (
    <header className="h-[64px] lg:h-[72px] bg-white border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between shrink-0 z-40">
      
      {/* Mobile Left: Hamburger ONLY */}
      <div className="flex items-center lg:hidden">
        <button 
          onClick={onToggleLeftMenu} 
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* Desktop Left: Spacer to center the rest nicely */}
      <div className="hidden lg:block w-[120px]"></div>

      {/* Right Side: Admin Actions & Profile */}
      <div className="flex items-center justify-end shrink-0 gap-3 md:gap-4">
        
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3 border-r border-slate-200 pr-4 mr-1">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-[13px] font-semibold transition-colors border border-slate-200 shadow-sm">
            <i className="far fa-eye text-[14px]"></i> View as User
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#5B62F1] hover:bg-indigo-600 text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
            <i className="fas fa-share-alt text-[14px]"></i> Share Help Center
          </button>
        </div>

      </div>
    </header>
  );
}