export default function RightSidebar({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    // Changed w-[320px] to w-full and removed "hidden xl:block"
    <aside className="w-full h-full py-6 lg:py-8 px-4 lg:px-6 space-y-6">
      
      {/* Stay Safe Box */}
      <section className="bg-white rounded-[20px] p-5 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <h3 className="flex items-center gap-2.5 font-bold text-[15px] text-[#1E293B] mb-5">
          <svg className="w-[20px] h-[20px] text-[#10B981]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V2L4 5v7c0 6 8 10 8 10z" fill="currentColor"/>
          </svg>
          Stay Safe
        </h3>
        <ul className="space-y-4 text-[13px] text-[#64748B] font-medium tracking-tight">
          <li className="flex gap-3 items-start">
            <div className="w-[20px] h-[20px] rounded-full bg-[#FEF08A]/80 text-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-exclamation text-[11px] font-bold"></i>
            </div>
            <span className="leading-snug">Admins will never DM you first.</span>
          </li>
          <li className="flex gap-3 items-start">
            <div className="w-[20px] h-[20px] rounded-full bg-[#FFEDD5]/80 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-key text-[10px]"></i>
            </div>
            <span className="leading-snug">Never share your seed phrase or private key.</span>
          </li>
          <li className="flex gap-3 items-start">
            <div className="w-[20px] h-[20px] rounded-full bg-[#D1FAE5]/80 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-link text-[10px]"></i>
            </div>
            <span className="leading-snug">Only use official links from our website and socials.</span>
          </li>
          <li className="flex gap-3 items-start">
            <div className="w-[20px] h-[20px] rounded-full bg-[#EDE9FE]/80 text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-search text-[10px]"></i>
            </div>
            <span className="leading-snug">Double-check contract addresses before interacting.</span>
          </li>
        </ul>
      </section>

      {/* Links Box */}
      <section className="bg-white rounded-[20px] p-5 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <h3 className="font-bold text-[14px] text-[#1E293B] mb-3">Official Links</h3>
        <div className="flex flex-col">
          {[
            { iconClass: "fas fa-globe", label: 'Website' },
            { iconClass: "fas fa-book", label: 'Documentation' },
            { iconClass: "fab fa-twitter", label: 'Twitter / X' },
            { iconClass: "fab fa-telegram-plane", label: 'Telegram Group' },
            { iconClass: "fas fa-bell", label: 'Announcements' }
          ].map(link => (
            <button key={link.label} className="flex items-center justify-between w-full py-2.5 hover:bg-slate-50 rounded-lg text-[13px] font-medium text-[#64748B] transition-colors text-left group">
              <div className="flex items-center gap-3">
                <i className={`${link.iconClass} w-4 text-center text-slate-400 text-[14px]`}></i>
                <span>{link.label}</span>
              </div>
              <i className="fas fa-external-link-alt text-[12px] text-slate-300 group-hover:text-slate-400 transition-colors"></i>
            </button>
          ))}
        </div>
      </section>

      {/* Ticket Box */}
      <section className="bg-white rounded-[20px] p-5 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <h3 className="font-bold text-[14px] text-[#1E293B] mb-1.5">Can't find a solution?</h3>
        <p className="text-[12px] text-[#64748B] mb-4 leading-relaxed tracking-tight">Create a support ticket and our team will assist you.</p>
        <button 
          onClick={onOpenModal}
          className="w-full bg-[#5B62F1] hover:bg-indigo-600 text-white py-2.5 rounded-[12px] text-[13px] font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm"
        >
          <i className="fas fa-comment-dots text-[14px]"></i>
          Create Support Ticket
        </button>
      </section>
      
    </aside>
  );
}