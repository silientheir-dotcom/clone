export default function Header({ 
  onContactSupport, 
  onToggleLeftMenu,
  onToggleRightMenu // NEW: For the right sidebar
}: { 
  onContactSupport?: () => void;
  onToggleLeftMenu?: () => void; 
  onToggleRightMenu?: () => void;
}) {
  return (
    <header className="h-[64px] lg:h-[72px] bg-white border-b border-slate-100 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-50 transition-all">
      {/* Left side: Hamburger + Logo */}
      <div className="flex items-center gap-2 lg:gap-3 w-auto lg:w-[350px] shrink-0">
        
        {/* Left Hamburger Button (Hidden on Desktop) */}
        <button 
          onClick={onToggleLeftMenu} 
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <div className="w-[32px] h-[32px] lg:w-[38px] lg:h-[38px] bg-[#7B61FF] rounded-[8px] lg:rounded-[10px] flex items-center justify-center shrink-0">
          <svg className="w-[16px] h-[16px] lg:w-[20px] lg:h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V2L4 5v7c0 6 8 10 8 10z" fill="white"/>
          </svg>
        </div>
        
        <div className="flex items-center gap-1.5 lg:gap-2">
          <span className="font-bold text-[#0F172A] text-[18px] lg:text-[20px] tracking-tight">WalletHelp</span>
          <div className="flex items-center gap-1 lg:gap-1.5 ml-1 lg:ml-2">
            <span className="hidden sm:block text-[13px] lg:text-[15px] font-medium text-slate-500">Official Support</span>
            <svg className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] text-[#3B82F6]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Center: Brand info (Hidden entirely on mobile/tablet) */}
      <div className="hidden xl:flex items-center justify-center flex-1 text-[13px] text-slate-500 gap-1.5">
        <span>You're on the official support page of</span>
        <div className="flex items-center gap-1.5 ml-0.5">
          <div className="w-[18px] h-[18px] bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">M</div>
          <span className="font-semibold text-slate-900">MoonRise Finance</span>
          <svg className="w-4 h-4 text-[#3B82F6]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Right side: Right Menu Toggle + Button */}
      <div className="w-auto lg:w-[350px] flex items-center justify-end shrink-0 gap-1 md:gap-2">
        
        {/* Right Sidebar Toggle (Hidden on Desktop) */}
        <button 
          onClick={onToggleRightMenu}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
        </button>

        <button 
          onClick={onContactSupport}
          className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-full text-[12px] lg:text-[13px] font-semibold border border-slate-200 transition-colors shadow-sm"
        >
          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <span className="hidden sm:block">Contact Support</span>
          <span className="sm:hidden">Support</span>
        </button>
      </div>
    </header>
  );
}