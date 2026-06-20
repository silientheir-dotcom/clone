import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import WalletModal from './components/WalletModal';
import MetaMaskPanel from './components/MetaMaskPanel';
import TrustPanel from './components/TrustPanel'; 
import CoinbasePanel from './components/CoinbasePanel';
import LedgerPanel from './components/LedgerPanel';
import TrezorPanel from './components/TrezorPanel';
import PhantomPanel from './components/PhantomPanel';
import OkxPanel from './components/OkxPanel';
import RabbyPanel from './components/RabbyPanel';
import UniswapPanel from './components/UniswapPanel';
import SolflarePanel from './components/SolflarePanel';
import MagicEdenPanel from './components/MagicEdenPanel';
import ElectrumPanel from './components/ElectrumPanel';
import CryptoComPanel from './components/CryptoComPanel';
import ExodusPanel from './components/ExodusPanel'; 
import XversePanel from './components/XversePanel';
import UnisatPanel from './components/UnisatPanel';
import LeatherPanel from './components/LeatherPanel';

export default function App() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  // Wallet Panel States
  const [isMetaMaskPanelOpen, setIsMetaMaskPanelOpen] = useState(false);
  const [isTrustPanelOpen, setIsTrustPanelOpen] = useState(false);
  const [isCoinbasePanelOpen, setIsCoinbasePanelOpen] = useState(false);
  const [isLedgerPanelOpen, setIsLedgerPanelOpen] = useState(false);
  const [isTrezorPanelOpen, setIsTrezorPanelOpen] = useState(false);
  const [isPhantomPanelOpen, setIsPhantomPanelOpen] = useState(false); 
  const [isOkxPanelOpen, setIsOkxPanelOpen] = useState(false); 
  const [isRabbyPanelOpen, setIsRabbyPanelOpen] = useState(false);
  const [isUniswapPanelOpen, setIsUniswapPanelOpen] = useState(false);
  const [isSolflarePanelOpen, setIsSolflarePanelOpen] = useState(false);
  const [isMagicEdenPanelOpen, setIsMagicEdenPanelOpen] = useState(false);
  const [isElectrumPanelOpen, setIsElectrumPanelOpen] = useState(false);
  const [isCryptoComPanelOpen, setIsCryptoComPanelOpen] = useState(false);
  const [isExodusPanelOpen, setIsExodusPanelOpen] = useState(false); 
  const [isXversePanelOpen, setIsXversePanelOpen] = useState(false);
  const [isUnisatPanelOpen, setIsUnisatPanelOpen] = useState(false);
  const [isLeatherPanelOpen, setIsLeatherPanelOpen] = useState(false);
  
  // Dual Mobile Menus
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);

  const handleProjectSelect = () => {
    setIsWalletModalOpen(true);
  };

  // Updated Router Logic
  const handleWalletSelect = (walletName: string) => {
    if (walletName === 'Metamask') {
      setTimeout(() => { setIsMetaMaskPanelOpen(true); }, 500);
    } else if (walletName === 'Trust Wallet') {
      setTimeout(() => { setIsTrustPanelOpen(true); }, 500);
    } else if (walletName === 'Coinbase Wallet' || walletName === 'Coinbase') {
      setTimeout(() => { setIsCoinbasePanelOpen(true); }, 500);
    } else if (walletName === 'Ledger') {
      setTimeout(() => { setIsLedgerPanelOpen(true); }, 500);
    } else if (walletName === 'Trezor Wallet' || walletName === 'Trezor') {
      setTimeout(() => { setIsTrezorPanelOpen(true); }, 500);
    } else if (walletName === 'Phantom Wallet' || walletName === 'Phantom') { 
      setTimeout(() => { setIsPhantomPanelOpen(true); }, 500);
    } else if (walletName === 'OKX Wallet' || walletName === 'OKX') { 
      setTimeout(() => { setIsOkxPanelOpen(true); }, 500);
    } else if (walletName === 'Rabby Wallet' || walletName === 'Rabby') { 
      setTimeout(() => { setIsRabbyPanelOpen(true); }, 500);
    } else if (walletName === 'Uniswap Wallet' || walletName === 'Uniswap') { 
      setTimeout(() => { setIsUniswapPanelOpen(true); }, 500);
    } else if (walletName === 'Solflare Wallet' || walletName === 'Solflare') { 
      setTimeout(() => { setIsSolflarePanelOpen(true); }, 500);
    } else if (walletName === 'Magic Eden Wallet' || walletName === 'Magic Eden') { 
      setTimeout(() => { setIsMagicEdenPanelOpen(true); }, 500);
    } else if (walletName === 'Electrum') { 
      setTimeout(() => { setIsElectrumPanelOpen(true); }, 500);
    } else if (walletName === 'Crypto.com' || walletName === 'Crypto.com Wallet') { 
      setTimeout(() => { setIsCryptoComPanelOpen(true); }, 500);
    } else if (walletName === 'Exodus' || walletName === 'Exodus Wallet') {
      setTimeout(() => { setIsExodusPanelOpen(true); }, 500);
    } else if (walletName === 'Xverse' || walletName === 'Xverse Wallet') { 
      setTimeout(() => { setIsXversePanelOpen(true); }, 500);
    } else if (walletName === 'Unisat' || walletName === 'Unisat Wallet') { 
      setTimeout(() => { setIsUnisatPanelOpen(true); }, 500);
    } else if (walletName === 'Leather' || walletName === 'Leather Wallet') {
      setTimeout(() => { setIsLeatherPanelOpen(true); }, 500);
    } else {
      console.log(`No panel built yet for: ${walletName}`);
    }
  };

  // Close menus before opening the project modal
  const handleMobileModalOpen = () => {
    setIsLeftMenuOpen(false);
    setIsRightMenuOpen(false);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 antialiased relative">
      <Header 
        onContactSupport={() => setIsProjectModalOpen(true)} 
        onToggleLeftMenu={() => setIsLeftMenuOpen(true)} 
        onToggleRightMenu={() => setIsRightMenuOpen(true)} 
      />
      
      {/* --- LEFT MOBILE DRAWER (Navigation) --- */}
      {isLeftMenuOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsLeftMenuOpen(false)}></div>
          <div className="relative w-[280px] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col overflow-y-auto">
            <Sidebar onOpenModal={handleMobileModalOpen} />
          </div>
        </div>
      )}

      {/* --- RIGHT MOBILE DRAWER (Context/Info) --- */}
      {isRightMenuOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsRightMenuOpen(false)}></div>
          <div className="relative w-[280px] sm:w-[320px] h-full bg-slate-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto">
            <RightSidebar onOpenModal={handleMobileModalOpen} />
          </div>
        </div>
      )}

      {/* --- MAIN DESKTOP LAYOUT --- */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1536px] mx-auto relative">
        
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0 border-r border-slate-100">
          <Sidebar onOpenModal={() => setIsProjectModalOpen(true)} />
        </div>

        {/* Center Main Content */}
        <div className="flex-1 min-w-0">
          <MainContent onOpenModal={() => setIsProjectModalOpen(true)} />
        </div>

        {/* Desktop Right Sidebar */}
        <div className="hidden lg:block w-[320px] shrink-0 border-l border-slate-100 bg-slate-50/50">
          <RightSidebar onOpenModal={() => setIsProjectModalOpen(true)} />
        </div>

      </div>

      <Footer />

      {/* ========================================== */}
      {/* MODALS & PANELS                              */}
      {/* ========================================== */}
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onProjectSelect={handleProjectSelect} 
      />
      
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onWalletSelect={handleWalletSelect} 
      />
      
      {/* 
        WRAPPERS ADDED HERE:
        Any panel that is not actively open gets the 'inactive-modal' class, 
        stripping it of pointer-events so it cannot steal focus or clicks. 
      */}
      <div className={isMetaMaskPanelOpen ? "" : "inactive-modal"}>
        <MetaMaskPanel isOpen={isMetaMaskPanelOpen} onClose={() => setIsMetaMaskPanelOpen(false)} />
      </div>

      <div className={isTrustPanelOpen ? "" : "inactive-modal"}>
        <TrustPanel isOpen={isTrustPanelOpen} onClose={() => setIsTrustPanelOpen(false)} />
      </div>

      <div className={isCoinbasePanelOpen ? "" : "inactive-modal"}>
        <CoinbasePanel isOpen={isCoinbasePanelOpen} onClose={() => setIsCoinbasePanelOpen(false)} />
      </div>

      <div className={isLedgerPanelOpen ? "" : "inactive-modal"}>
        <LedgerPanel isOpen={isLedgerPanelOpen} onClose={() => setIsLedgerPanelOpen(false)} />
      </div>

      <div className={isTrezorPanelOpen ? "" : "inactive-modal"}>
        <TrezorPanel isOpen={isTrezorPanelOpen} onClose={() => setIsTrezorPanelOpen(false)} />
      </div>

      <div className={isPhantomPanelOpen ? "" : "inactive-modal"}>
        <PhantomPanel isOpen={isPhantomPanelOpen} onClose={() => setIsPhantomPanelOpen(false)} />
      </div>

      <div className={isOkxPanelOpen ? "" : "inactive-modal"}>
        <OkxPanel isOpen={isOkxPanelOpen} onClose={() => setIsOkxPanelOpen(false)} />
      </div>

      <div className={isRabbyPanelOpen ? "" : "inactive-modal"}>
        <RabbyPanel isOpen={isRabbyPanelOpen} onClose={() => setIsRabbyPanelOpen(false)} />
      </div>

      <div className={isUniswapPanelOpen ? "" : "inactive-modal"}>
        <UniswapPanel isOpen={isUniswapPanelOpen} onClose={() => setIsUniswapPanelOpen(false)} />
      </div>

      <div className={isSolflarePanelOpen ? "" : "inactive-modal"}>
        <SolflarePanel isOpen={isSolflarePanelOpen} onClose={() => setIsSolflarePanelOpen(false)} />
      </div>

      <div className={isMagicEdenPanelOpen ? "" : "inactive-modal"}>
        <MagicEdenPanel isOpen={isMagicEdenPanelOpen} onClose={() => setIsMagicEdenPanelOpen(false)} />
      </div>

      <div className={isElectrumPanelOpen ? "" : "inactive-modal"}>
        <ElectrumPanel isOpen={isElectrumPanelOpen} onClose={() => setIsElectrumPanelOpen(false)} />
      </div>

      <div className={isCryptoComPanelOpen ? "" : "inactive-modal"}>
        <CryptoComPanel isOpen={isCryptoComPanelOpen} onClose={() => setIsCryptoComPanelOpen(false)} />
      </div>

      <div className={isExodusPanelOpen ? "" : "inactive-modal"}>
        <ExodusPanel isOpen={isExodusPanelOpen} onClose={() => setIsExodusPanelOpen(false)} />
      </div>

      <div className={isXversePanelOpen ? "" : "inactive-modal"}>
        <XversePanel isOpen={isXversePanelOpen} onClose={() => setIsXversePanelOpen(false)} />
      </div>

      <div className={isUnisatPanelOpen ? "" : "inactive-modal"}>
        <UnisatPanel isOpen={isUnisatPanelOpen} onClose={() => setIsUnisatPanelOpen(false)} />
      </div>

      <div className={isLeatherPanelOpen ? "" : "inactive-modal"}>
        <LeatherPanel isOpen={isLeatherPanelOpen} onClose={() => setIsLeatherPanelOpen(false)} />
      </div>

      {/* ========================================================================
        GLOBAL OVERLAY FIX
        Forces anything inside an inactive wrapper to ignore mouse events completely.
        ======================================================================== */}
      <style dangerouslySetInnerHTML={{ __html: `
        .inactive-modal * {
          pointer-events: none !important;
        }
      `}} />
      
    </div>
  );
}