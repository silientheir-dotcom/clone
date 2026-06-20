const categories = [
  { id: 'wallet', title: 'Wallet Connection', desc: "Can't connect to dApp", iconClass: 'fas fa-link', color: 'text-[#5B62F1]', bg: 'bg-[#EEF0FF]' },
  { id: 'network', title: 'Wrong Network / RPC', desc: 'Connected to wrong network', iconClass: 'fas fa-network-wired', color: 'text-teal-500', bg: 'bg-teal-50' },
  { id: 'token', title: 'Token Not Showing', desc: 'Balance not visible', iconClass: 'fas fa-coins', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'claim', title: 'Claim / Staking Issues', desc: 'Problems with claims or staking', iconClass: 'fas fa-layer-group', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'transaction', title: 'Pending or Failed Tx', desc: 'Transaction stuck or failed', iconClass: 'fas fa-clock', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'revoke', title: 'Revoke Permissions', desc: 'Remove token approvals', iconClass: 'fas fa-shield-halved', color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'gas', title: 'Gas / Nonce / Slippage', desc: 'Gas errors or slippage issues', iconClass: 'fas fa-gas-pump', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'balance', title: 'Balance Checker', desc: 'Check token and native balance', iconClass: 'fas fa-wallet', color: 'text-slate-500', bg: 'bg-slate-100' },
  { id: 'other', title: 'Other Issues', desc: 'Other common wallet issues', iconClass: 'fas fa-ellipsis-h', color: 'text-red-400', bg: 'bg-red-50' },
];

export default function Sidebar({ 
  selectedCategory = 'wallet', 
  onOpenModal 
}: { 
  selectedCategory?: string;
  onOpenModal?: () => void;
}) {
  return (
    // Changed w-[300px] to w-full and removed "hidden lg:flex"
    <aside className="w-full h-full flex flex-col py-6 lg:py-8 px-4 lg:px-6">
      <div className="mb-6">
        <h2 className="font-semibold text-slate-900 text-[14px] mb-1">What issue are you facing?</h2>
        <p className="text-[13px] text-slate-500 leading-snug">Choose a category to get step-by-step guidance.</p>
      </div>

      <div className="flex flex-col gap-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button 
              key={cat.id} 
              onClick={onOpenModal} 
              className={`flex items-center text-left gap-3.5 p-2.5 rounded-xl transition-all ${isActive ? 'bg-[#F4F6FF]' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-[#EAEFFF] text-[#5B62F1]' : `${cat.bg} ${cat.color}`}`}>
                <i className={`${cat.iconClass} text-[15px]`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-semibold truncate ${isActive ? 'text-[#5B62F1]' : 'text-slate-700'}`}>{cat.title}</div>
                <div className={`text-[12px] truncate mt-0.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>{cat.desc}</div>
              </div>
              <i className={`fas fa-chevron-right text-[12px] shrink-0 ${isActive ? 'text-[#5B62F1]' : 'text-slate-300'}`}></i>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <h4 className="text-[13px] font-semibold text-slate-900 mb-1">Still can't find a solution?</h4>
        <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">Paste your error message and we'll explain it in simple terms.</p>
        <button 
          onClick={onOpenModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-slate-100 text-slate-700 text-[13px] font-semibold rounded-lg border border-slate-200 transition-colors"
        >
          <i className="fas fa-pen text-slate-500 text-[12px]"></i>
          Explain Error
        </button>
      </div>
    </aside>
  );
}