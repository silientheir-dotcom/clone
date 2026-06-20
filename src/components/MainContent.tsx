const popularIssues = [
  { id: '1', title: 'Wallet Connection Issues', description: "Can't connect your wallet to the dApp or website.", duration: '1-2 min', color: 'text-[#5B62F1]', bg: 'bg-[#EEF0FF]', iconClass: "fas fa-link" },
  { id: '2', title: 'Wrong Network or RPC', description: 'Connected to the wrong network or RPC not working.', duration: '2-3 min', color: 'text-teal-500', bg: 'bg-teal-50', iconClass: "fas fa-network-wired" },
  { id: '3', title: 'Token Not Showing', description: 'Add custom tokens and refresh your wallet.', duration: '1-2 min', color: 'text-orange-500', bg: 'bg-orange-50', iconClass: "fas fa-coins" },
  { id: '4', title: 'Claim / Staking Problems', description: 'Troubleshoot claim, stake or reward issues.', duration: '2-4 min', color: 'text-indigo-500', bg: 'bg-indigo-50', iconClass: "fas fa-layer-group" },
  { id: '5', title: 'Pending or Failed Transactions', description: 'Fix stuck, pending or failed transactions.', duration: '2-5 min', color: 'text-pink-500', bg: 'bg-pink-50', iconClass: "fas fa-clock" },
  { id: '6', title: 'Revoke Permissions', description: 'Remove unwanted token approvals and permissions.', duration: '1-3 min', color: 'text-green-500', bg: 'bg-green-50', iconClass: "fas fa-shield-halved" },
  { id: '7', title: 'Gas / Nonce / Slippage Issues', description: 'Understand gas fees, nonce errors and slippage.', duration: '2-4 min', color: 'text-blue-500', bg: 'bg-blue-50', iconClass: "fas fa-gas-pump" },
  { id: '8', title: 'Balance Checker', description: 'Check your token and native coin balances.', duration: '1 min', color: 'text-slate-500', bg: 'bg-slate-100', iconClass: "fas fa-wallet" },
];

export default function MainContent({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <div className="px-4 md:px-12 py-6 md:py-10 max-w-[760px] w-full flex-1 mx-auto">
      
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-[24px] md:text-[28px] font-bold text-slate-900 tracking-tight mb-2">How can we help you?</h1>
        <p className="text-[14px] md:text-[15px] text-slate-500">Select your issue below and follow our step-by-step guides to fix it quickly.</p>
      </div>

      <div className="relative flex items-center mb-8 md:mb-10">
        <i className="fas fa-search absolute left-4 md:left-5 text-slate-400 text-[16px] md:text-[18px]"></i>
        <input
          type="text"
          placeholder="Search for issues..."
          className="w-full pl-10 md:pl-12 pr-24 md:pr-32 py-3 md:py-3.5 bg-white border border-slate-200 rounded-full outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[13px] md:text-[14px] text-slate-900 placeholder:text-slate-400 shadow-sm"
        />
        <button 
          onClick={onOpenModal}
          className="absolute right-1.5 md:right-2 px-5 md:px-8 py-2 md:py-2 bg-[#5B62F1] hover:bg-indigo-600 text-white text-[13px] md:text-[14px] font-medium rounded-full transition-colors"
        >
          Search
        </button>
      </div>

      <section className="mb-10 md:mb-12">
        <h2 className="text-[16px] font-bold text-slate-900 mb-4 md:mb-6 px-1 md:px-0">Popular Issues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-y-10 gap-x-6 md:gap-x-8">
          {popularIssues.map((issue) => (
            <div 
              key={issue.id} 
              onClick={onOpenModal} 
              className="flex flex-col text-left group cursor-pointer bg-white md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border border-slate-100 md:border-none shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-all"
            >
              <div className={`w-[38px] h-[38px] md:w-[42px] md:h-[42px] rounded-xl flex items-center justify-center mb-3 md:mb-4 ${issue.bg} ${issue.color}`}>
                <i className={`${issue.iconClass} text-[18px] md:text-[20px]`}></i>
              </div>
              <h3 className="font-bold text-slate-900 text-[14px] md:text-[15px] mb-1 md:mb-1.5">{issue.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed pr-2 md:pr-4 mb-3 md:mb-4">{issue.description}</p>
              
              <div className="flex items-center justify-between w-full mt-auto pt-3 md:pt-0 border-t border-slate-50 md:border-none">
                <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-medium text-slate-400">
                  <i className="far fa-clock text-[13px] md:text-[14px]"></i>
                  {issue.duration}
                </div>
                <i className="fas fa-arrow-right text-[13px] md:text-[14px] text-slate-300 group-hover:text-[#5B62F1] transition-all group-hover:translate-x-1"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Warning Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 p-4 md:p-5 bg-[#EEF0FF] rounded-xl w-full border border-indigo-50">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          <i className="fas fa-shield-halved text-[#5B62F1] text-[14px]"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] md:text-[13px] font-bold text-slate-900 leading-snug mb-0.5">We will never DM you first. Never share your seed phrase.</span>
          <span className="text-[11px] md:text-[12px] text-slate-500">This is the only official support page for MoonRise Finance.</span>
        </div>
      </div>

    </div>
  );
}