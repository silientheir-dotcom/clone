import React from 'react';
import moonLogo from '../assets/moon.png';

export default function RightSidebar({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <aside className="w-full h-full py-6 lg:py-8 px-4 lg:px-6 space-y-6">
      
      {/* Project Info Box */}
      <section className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="font-bold text-[15px] text-[#1E293B] mb-5">Project Info</h3>
        
        <div className="flex items-center gap-4 mb-6">
          {/* Raw image, no wrapper to chop it */}
          <img src={moonLogo} alt="MoonRise Finance" className="w-[56px] h-[56px] object-contain shrink-0" />
          
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="font-bold text-[#1E293B] text-[16px]">Team Finance</h4>
              <i className="fas fa-circle-check text-[#3B82F6] text-[14px]"></i>
            </div>
            <p className="text-[12px] text-slate-500 font-medium">Building the future of DeFi.</p>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          {[
            { iconClass: "fas fa-globe", label: 'Official Website' },
            { iconClass: "fas fa-file-alt", label: 'Documentation' },
            { iconClass: "fab fa-twitter", label: 'Twitter / X' },
            { iconClass: "fab fa-telegram-plane", label: 'Telegram Group' }
          ].map(link => (
            <button key={link.label} className="flex items-center justify-between w-full py-2.5 px-2 hover:bg-slate-50 rounded-xl text-[13px] font-medium text-[#64748B] transition-colors text-left group">
              <div className="flex items-center gap-3">
                <i className={`${link.iconClass} w-4 text-center text-slate-400 text-[14px]`}></i>
                <span className="group-hover:text-slate-700 transition-colors">{link.label}</span>
              </div>
              <i className="fas fa-external-link-alt text-[11px] text-slate-300 group-hover:text-slate-400 transition-colors"></i>
            </button>
          ))}
        </div>
      </section>

      {/* Stay Safe Box */}
      <section className="bg-[#ECFDF5] rounded-[20px] p-6 border border-[#D1FAE5] shadow-sm relative">
        
        <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-[72px] h-[72px] bg-[#10B981] rounded-[18px] rotate-12 flex items-center justify-center shadow-lg border-[4px] border-white z-20">
          <svg className="w-8 h-8 text-white -rotate-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.642 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.358-.166-2.001A11.954 11.954 0 0110 1.944zM8.707 13.707a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L9.414 11.586 7.707 9.879a1 1 0 00-1.414 1.414l2 2z" clipRule="evenodd" />
          </svg>
        </div>

        <h3 className="font-bold text-[15px] text-[#065F46] mb-4 relative z-10">Stay Safe</h3>
        
        <ul className="space-y-4 text-[12px] text-[#047857] font-medium pr-8 relative z-10">
          <li className="flex gap-2.5 items-start">
            <i className="fas fa-user-shield mt-0.5 text-[#10B981]"></i>
            <span className="leading-snug">Admins will never DM you first</span>
          </li>
          <li className="flex gap-2.5 items-start">
            <i className="fas fa-key mt-0.5 text-[#10B981]"></i>
            <span className="leading-snug">Never share your seed phrase or private key</span>
          </li>
          <li className="flex gap-2.5 items-start">
            <i className="fas fa-link mt-0.5 text-[#10B981]"></i>
            <span className="leading-snug">Only use official links from our website and socials</span>
          </li>
        </ul>
      </section>

      {/* Need More Help Box */}
      <section className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center">
        <h3 className="font-bold text-[16px] text-[#1E293B] mb-2">Need more help?</h3>
        <p className="text-[13px] text-slate-500 mb-6 leading-relaxed px-2">Can't find your solution? Create a ticket and our team will assist you.</p>
        <button 
          onClick={onOpenModal}
          className="w-full bg-white border border-slate-200 hover:border-[#5B62F1] hover:text-[#5B62F1] text-slate-700 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 flex justify-center items-center gap-2 shadow-sm"
        >
          <i className="far fa-paper-plane text-[14px]"></i> Create Support Ticket
        </button>
      </section>
      
    </aside>
  );
}