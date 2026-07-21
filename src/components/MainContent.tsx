import React from 'react';
import backImg from '../assets/back.png';
import walletImg from '../assets/wallet.png';

const popularIssues = [
  { id: '1', title: 'Wallet Connection Issues', description: "Fix problems connecting your wallet to our dApp.", color: 'text-[#5B62F1]', bg: 'bg-[#EEF0FF]', iconClass: "fas fa-link" },
  { id: '2', title: 'Wrong Network or RPC', description: 'Learn how to switch to the correct network.', color: 'text-teal-500', bg: 'bg-teal-50', iconClass: "fas fa-network-wired" },
  { id: '3', title: 'Token Not Showing?', description: 'Add custom tokens and refresh your wallet.', color: 'text-orange-500', bg: 'bg-orange-50', iconClass: "fas fa-circle-notch" },
  { id: '4', title: 'Claim / Staking Problems', description: 'Troubleshoot claim, stake or reward issues.', color: 'text-purple-500', bg: 'bg-purple-50', iconClass: "fas fa-layer-group" },
  { id: '5', title: 'Pending or Failed Transactions', description: 'Fix stuck, pending or failed transactions.', color: 'text-pink-500', bg: 'bg-pink-50', iconClass: "far fa-clock" },
  { id: '6', title: 'Revoke Permissions', description: 'Remove unwanted token approvals and permissions.', color: 'text-teal-600', bg: 'bg-teal-50', iconClass: "fas fa-shield-halved" },
  { id: '7', title: 'Gas / Nonce / Slippage Issues', description: 'Understand gas fees, nonce errors and slippage.', color: 'text-indigo-600', bg: 'bg-indigo-50', iconClass: "fas fa-lock" },
  { id: '8', title: 'Balance Checker', description: 'Check your token and native coin balances.', color: 'text-green-500', bg: 'bg-green-50', iconClass: "fas fa-wallet" },
  // Two new projects
  { id: '9', title: 'Debug Wallet', description: 'Diagnose and fix wallet loading or signing errors.', color: 'text-cyan-500', bg: 'bg-cyan-50', iconClass: "fas fa-bug" },
  { id: '10', title: 'Verify Asset', description: 'Confirm token authenticity and verify wallet holdings.', color: 'text-amber-600', bg: 'bg-amber-50', iconClass: "fas fa-check-double" },
  { id: '11', title: 'Claim Tokens', description: 'Claim presale tokens, vesting, Airdrop allocations.', color: 'text-rose-500', bg: 'bg-rose-50', iconClass: "fas fa-gift" },
  { id: '12', title: 'Ambassadorship Programs', description: 'Apply to be an ambassador of a Specific Project.', color: 'text-blue-500', bg: 'bg-blue-50', iconClass: "fas fa-star" },
];

export default function MainContent({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 w-full flex-1 mx-auto max-w-[1000px]">
      
      {/* Hero Banner */}
      <div 
        className="rounded-[24px] p-8 md:px-12 md:py-10 text-white relative overflow-hidden mb-10 flex flex-col md:flex-row justify-between items-center shadow-lg bg-cover bg-center min-h-[300px]"
        style={{ backgroundImage: `url(${backImg})`, backgroundColor: '#130d26' }}
      >
        <div className="relative z-10 w-full md:w-[60%]">
          <p className="text-[11px] font-bold tracking-[0.15em] text-slate-300 uppercase mb-3">
            Welcome to Team Finance Help Center
          </p>
          <h1 className="text-4xl md:text-[42px] font-bold mb-4 tracking-tight leading-[1.1]">
            How can we help you today?
          </h1>
          <p className="text-slate-300 text-[14px] mb-8 max-w-[400px] leading-relaxed">
            Search for your issue or choose a category below to get step-by-step guidance.
          </p>
          
          <div className="relative w-full max-w-[420px] flex items-center bg-white rounded-xl p-1.5 pl-4 shadow-sm">
            <i className="fas fa-search text-slate-400 text-[15px] mr-2"></i>
            <input
              type="text"
              placeholder='Search for issues like "transaction failed"'
              className="flex-1 bg-transparent outline-none text-slate-800 text-[14px] placeholder:text-slate-400 h-full py-2"
            />
            <button 
              onClick={onOpenModal}
              className="bg-[#5B62F1] hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Massive, fixed Wallet Image bleeding off the edge */}
        <div className="hidden md:block absolute right-[-5%] top-1/2 -translate-y-1/2 z-10 w-[55%] h-[160%] pointer-events-none">
          <img 
            src={walletImg} 
            alt="Crypto Wallet" 
            className="w-full h-full object-contain object-right drop-shadow-2xl scale-[1.4] lg:scale-[1.6]" 
          />
        </div>
      </div>

      {/* Popular Solutions Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-slate-900">Popular Solutions</h2>
          <button className="text-[13px] font-medium text-[#5B62F1] border border-indigo-100 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition-colors">
            View all
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularIssues.map((issue) => (
            <div 
              key={issue.id} 
              onClick={onOpenModal} 
              className="flex flex-col text-left group cursor-pointer bg-white p-5 rounded-[20px] border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-indigo-100 transition-all h-full"
            >
              <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center mb-4 ${issue.bg} ${issue.color}`}>
                <i className={`${issue.iconClass} text-[18px]`}></i>
              </div>
              <h3 className="font-bold text-slate-900 text-[14px] mb-1.5 leading-tight pr-4">{issue.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-4 flex-grow">{issue.description}</p>
              
              <div className="flex justify-end w-full mt-auto">
                <i className="fas fa-arrow-right text-[12px] text-slate-300 group-hover:text-[#5B62F1] transition-transform group-hover:translate-x-1"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Paste Error Message Banner */}
      <div className="bg-[#f9fafb] border border-slate-100 rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12 shadow-sm">
        <div className="w-full md:w-[40%] shrink-0">
          <h3 className="text-[18px] font-bold text-slate-900 mb-2">Paste your error message</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">Copy and paste the full error message you received and we'll explain it in simple terms.</p>
        </div>
        
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="relative w-full h-[56px] mb-3 flex items-center bg-white border border-slate-200 rounded-xl p-1.5 pl-4 shadow-sm">
            <input 
              type="text" 
              placeholder="Paste error message here..." 
              className="flex-1 bg-transparent outline-none text-slate-800 text-[14px] placeholder:text-slate-400 py-2"
            />
            <button 
              onClick={onOpenModal}
              className="h-[40px] px-5 bg-[#5B62F1] hover:bg-indigo-600 text-white rounded-lg text-[13px] font-medium flex items-center gap-2 transition-colors shrink-0 ml-2"
            >
              <i className="fas fa-wand-magic-sparkles"></i> Explain Error
            </button>
          </div>
          <div className="flex items-center justify-start w-full gap-2 text-[11px] text-slate-400 font-medium pl-2">
            <i className="fas fa-lock"></i> We never store your messages or wallet data.
          </div>
        </div>
      </div>

      {/* Features Footer Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#5B62F1] flex items-center justify-center">
            <i className="fas fa-lock text-[16px]"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[13px] mb-1">100% Safe & Secure</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">We never access your funds or private keys.</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#5B62F1] flex items-center justify-center">
            <i className="fas fa-list-ul text-[16px]"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[13px] mb-1">Step-by-Step Guides</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Easy instructions for all wallets.</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#5B62F1] flex items-center justify-center">
            <i className="fas fa-wallet text-[16px]"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[13px] mb-1">Works with all wallets</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">MetaMask, Trust Wallet, OKX, Phantom & more.</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#5B62F1] flex items-center justify-center">
            <i className="fas fa-users text-[16px]"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[13px] mb-1">Community First</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Built to reduce support noise and help users.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}