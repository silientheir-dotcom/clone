export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-6 mt-auto">
      <div className="max-w-[1536px] mx-auto px-6 flex justify-between items-center text-[13px] font-medium">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          WalletHelp by MoonRise Finance.
        </div>
        <p className="text-slate-400">© 2024 All rights reserved.</p>
      </div>
    </footer>
  );
}