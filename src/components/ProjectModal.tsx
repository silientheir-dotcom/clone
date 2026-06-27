import { useState, useMemo } from 'react';

// Your massive raw list, hardcoded so it never breaks Vercel
const rawProjectList = [
  "ChainGPT Official Chat", "HANDL Community", "Kinza Finance", "ZELWIN", "Dexlab", 
  "Sanity United Community", "Tenset (10set) - Official chat group ENG", "YOM Community Official", 
  "GameGPT by PRISM", "Kingdomstarter Global Chat", "SquadX Chat", "tagSpace", "ZugChain", 
  "Tea Protocol - Official Community", "MIRA", "INSIDERAA Global Chat", "Astra Nova", 
  "OccamDAO Community Group ($OCC)", "Poolz - Official", "Solv Protocol", "AKEDO Chat", 
  "CratD2C SmartChain", "Nexchain", "Reposwap - A VC Module Launchpad", "Binstarter", 
  "ACN Chat Group", "Unich | Official Group", "LeverUp Community", "Gacha Galaxy Official Channel", 
  "Upheaval Group", "GPUNET", "STRATO", "Realio Network Official", "GET Official", "SUBBD", 
  "DePINed Chat", "Warden Protocol", "Cogni-AI Agents", "DOP Official Community", 
  "FIRESTARTER OFFICIAL", "Mandala Chain Official", "Chainflip Community", "Lombard", 
  "BLAZPAY AI", "Botanix Community", "Depinsim Community", "Bluwhale Official", "RICE AI", 
  "DAO Maker Community & Support", "ARCH AI Community", "Kuvi.ai Official", 
  "LEVVA — Official Telegram Channel", "Backstage Official", "Byreal", 
  "Official Rain Community Group", "Stader Labs Official Community", "Scallop", "Trias", "Go!", 
  "Plena Ecosystem", "Velvet Official Chat", "Planck Official Community (English)", 
  "GameFi.org Global Chat", "WandrLust Official", "HyperGPT Official Chat", "BSCS Official [ENG]", 
  "Gems Official Community", "Frax Finance", "Extsy Community", "BENQI Finance - Official", 
  "YieldBricks | Official Community EN", "ShareX Network Official Group", "IXIRPAD Community", 
  "Virtuals Protocol", "Lern360 Community Chat Group", "JUST-DeFi", "CrypCade Metaverse", 
  "DerpDEX Official", "BSClaunch Community", "Maverick Protocol", "GOAT Network", 
  "ALTAVA Global Chat", "Chatllat - The Real Web3 Jobs", "Quranium - Community", 
  "RWAX Chat | Formerly Moon App $APP", "Datai Network Official Chat", "KAIO Community", 
  "ZEROBASE Official Chat Room", "AtlasOra", "SuperWorld", "Polkastarter", "TRUE | Chat", 
  "Nebula3_GameFi", "PublicAI | Community Discussion", "Warp Game Publishing", "TECTUM", 
  "NeurochainAI", "Somm Finance", "The Loyal Community", "Runwago", "Venus Protocol", 
  "Demex Community", "TrustSwap", "CESS Official", "Hey Anon / Wagmi", 
  "Play Cineflicks Community", "ANTDdrop Community", "MetaDAO Community", "Redbelly Network", 
  "WhiteBridge.Network", "GAINS Chat", "Metacces Official Chat", "LightLink", "Arrakis Finance", 
  "Jito Community", "Avici", "revert.finance", "HyperSui", "Kelp", "Forj Official", "RWA OFFICIAL", 
  "MWX_AI", "ProveX Info", "Atlantis", "Reveel Official", "Sentio User Group", 
  "Hydro Protocol Official Channel", "THERAPi Public Chat", "Huostarter", 
  "VOX | Official Community", "Fuel Network Official Community", "CrossFi Community", 
  "SLOHM CENTRAL", "AICre8_HQ (NEW)", "Hyperion Official", "CodeXChain", "WABA Network", "WORM", 
  "Check @artherachainofficial", "BAISHI", "Navi Protocol", "Kamino", "Curve Finance", "Aligned", 
  "Dtec Official Community", "Space Chat", "Solomon Labs", "Go! - Chat 2", 
  "Ispolink Official Community", "Singularity Finance", "Official Seedli Capital Community", "Maple", 
  "Moonwell Chat", "Olympus AI Official Community", "$CIDER - AI Trading Orchard", "Synthswap", 
  "SwapBased", "Lista DAO 中文群", "ALIEN BASE", "SushiSwap [Official]", 
  "Octavia — Your Web3 Assistant & Community", "EarnPark Community", "Treble | Community", 
  "Ticket Group", "Aspecta Official", "Vault777", "Delabs Games Chat", "Hivello Official Community", 
  "Kvants Official Chat", "RAYS Discussion", "Finceptor Global Community", 
  "Kommunitas Official Group", "Seedworld Community HQ", "Gambit Community", "Lido", 
  "EigenCloud Official Telegram", "Helios Blockchain", "Harmonix Finance | Group chat", 
  "PathPulse AI | Chat", "HyperSignals Official", "Sahara AI Official", 
  "Synapse Network | Official Channel", "LEND Official Chat", "Dolomite Official", "TIGA Coin Chat", 
  "KAIF Community | $KAF", "BAS Official Community", "Neurolov.ai", "Meridian Finance", 
  "Rekt Games Official Chat", "Novastro Discussion", "SecantX Labs", "SONAMI-COMMUNITY", 
  "SparkDEX Official", "AlloX", "Bounce Finance", "DexCheck Official Group", "Ondo DAO Community", 
  "THENA", "ZNS Connect Name Service Chat", "ChimpX", "OpenGDP Chat", "Nervos Network", 
  "StakeWise", "Visual World", "Chicha AI", "IMPOSSIBLE", "CeluvPlay Official", 
  "Official Allo Community", "Figure", "Turbo Battle Arena", "CVAlpha Discussion", 
  "Edu3Labs Official", "Gearbox Community Chat", "Fishing Verse", "Exactly Community", 
  "EarnBIT | Chat", "HeyElsa.ai Chat Room", "Starpower Network", "zkStable", "KeetaAI Chat", 
  "Reya", "Tonomy and $TONO Community", "Acurast", "AVAXAI | AIvalanche DeFAI Agents", 
  "POLY PICKS AI Community", "mb.io", "mETH Protocol", "Paystream", "AltsDaddy Discussion", 
  "JustLend DAO Official", "$TNT | Taunt Live | powered by tauntAI", "Nuklai", 
  "Welf | Official Welf Community Channel", "FacilPay - Official", "OpenDelta", "Bullshot", 
  "Adix Community", "Crypto Advertising Hub", "Mind AI", "0xVM", "Boundless", 
  "Silo Intern Says Words", "Spores Network Group", "Sigma.Money", "Resolv Community", 
  "Red Kite Global Chat", "Cryptoindex.com", "Solanium Official Community", "iFlux Global Chat", 
  "QUALNET $QAN", "BETURA COMMUNITY", "Melee", "ZkAGI Community", "CoinTerminal Chat", 
  "Amnis Finance Group", "Astrena AI | GLOBAL", "Aiden Official | Community", "HyperGPT Global", 
  "Kodiak Island Boys", "BELEAF.Ai Official", "MeeFie Official", "Tapzi", "Attractor zkRollup", 
  "Project Merlin", "Starter Official", "t3rn official", "Bitway", "Rapid Chain Official", 
  "ChirpPad", "3VERSE", "Arrow Markets", "MattleFun", "Axone", "Vultisig", "TaleX community", 
  "Oxbull.tech", "Bixplorer Official", "eesee.io Chat", "Chainstack", "Xorion Network", "Probable", 
  "DeFiMarkets", "Illuvium Official Announcements ONLY", "Sakkemotocoin", "GVNR Official", 
  "BNBMONKY", "League of Traders Official", "UOMI Network", "StarLaunch", 
  "Looping Collective (LHYPE, WHLP)", "WeSplit Community", "Blubird Community", "AdLunam Chat", 
  "RWALayer Chat", "Lamas Finance chat", "Adamant Finance", "MOON", "YieldNest - Official", 
  "CRT Official Chat", "Dynamo Protocol", "BrightStart | Official Chat", "ZayaAI", "21X", 
  "Uprising", "Zoo Felines", "Eclipse Fi Community", "Dappad+", "Alliance Games", "Credbull.io", 
  "Timeworx", "Anzen Finance", "BeaverFinance", "Dynasties Ecosystem - $Han Token Community", 
  "Blockbites - Official Group", "CHIPS Protocol", "DexTrader.ai", "Phron AI", "GAIB | RWAiFi", 
  "STELSI-Official Group", "NGRAVE", "Pixel Pix", "RAMSES | Official", "Omnus Community", 
  "LAOS Network", "zkCross Network Community", "$COLLECT on Fanable Chat", "SingularityDAO", 
  "Chat", "Taucoin Community", "DegenPad Official Chat", "DigiMaaya", "NXT", 
  "BullPerks Official Chat", "Script Network", "$LUKAS TOKEN | Official Community", 
  "Zaddy Coin [Official Group]", "Mechaversus Chat", "Dirac Finance Official Announcements", 
  "ATHLERSE_OFFICIAL", "PIN AI Official", "Ordify", "Perle Labs Channel", "InterSwap Group Chat!", 
  "Emmet.Finance"
];

// Smart color generator
const avatarColors = [
  'bg-slate-900', 'bg-emerald-500', 'bg-indigo-500', 'bg-cyan-500',
  'bg-amber-500', 'bg-rose-500', 'bg-violet-500'
];

// Cool FontAwesome icons to randomly assign to projects instead of initials
const projectIcons = [
  'fas fa-rocket', 'far fa-gem', 'fas fa-bolt', 'fas fa-fire', 
  'fas fa-cube', 'fas fa-star', 'fas fa-shield-halved', 'fas fa-globe', 
  'fas fa-coins', 'fas fa-paper-plane', 'fas fa-shapes', 'fas fa-compass',
  'fas fa-leaf', 'fas fa-code-branch', 'fas fa-fingerprint', 'fas fa-meteor'
];

const getDeterministicHash = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getAvatarColor = (name: string) => {
  return avatarColors[getDeterministicHash(name) % avatarColors.length];
};

const getProjectIcon = (name: string) => {
  // Uses a slightly different hash modifier so icons and colors mix randomly
  return projectIcons[(getDeterministicHash(name) + 5) % projectIcons.length];
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSelect?: () => void;
}

export default function ProjectModal({ isOpen, onClose, onProjectSelect }: ProjectModalProps) {
  const [search, setSearch] = useState('');

  // Map the raw strings into rich project objects with generated FontAwesome icons
  const projects = useMemo(() => {
    return rawProjectList.map((name, index) => ({
      id: index.toString(),
      name: name.trim(),
      description: "Official Support Channel",
      iconClass: getProjectIcon(name.trim()),
      color: getAvatarColor(name.trim())
    }));
  }, []);

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    return projects.filter((p: any) => {
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      const query = search.toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }, [projects, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[20px] sm:rounded-[24px] flex flex-col max-h-[90vh] sm:max-h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors z-10"
        >
          <i className="fas fa-times text-[14px]"></i>
        </button>

        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4 flex flex-col items-center text-center">
          <div className="w-[40px] sm:w-[46px] h-[40px] sm:h-[46px] bg-[#EEF0FF] rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
            <i className="fas fa-building text-[#5B62F1] text-[18px] sm:text-[20px]"></i>
          </div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0F172A] mb-1 tracking-tight">Select a project</h2>
          <p className="text-[12px] sm:text-[13px] text-slate-500">Choose from {projects.length} verified projects</p>
        </div>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 pb-2">
          <div className="relative flex items-center">
            <i className="fas fa-search absolute left-3 sm:left-4 text-slate-400 text-[12px] sm:text-[13px]"></i>
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-slate-200 rounded-[12px] sm:rounded-[14px] outline-none focus:border-[#5B62F1] focus:ring-2 focus:ring-[#5B62F1]/10 transition-all text-[13px] sm:text-[14px] text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto px-3 sm:px-4 pb-2 h-[240px] sm:h-[264px] shrink-0 custom-scrollbar">
          {filteredProjects.map((project: any) => {
            return (
              <button 
                key={project.id} 
                onClick={onProjectSelect}
                className="w-full flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3 hover:bg-slate-50 rounded-[12px] sm:rounded-[16px] transition-colors text-left group"
              >
                
                {/* The FontAwesome Avatar Renderer */}
                <div className={`w-[36px] sm:w-[42px] h-[36px] sm:h-[42px] rounded-full flex items-center justify-center text-white shrink-0 ${project.color}`}>
                  <i className={`${project.iconClass} text-[16px] sm:text-[18px]`}></i>
                </div>
                
                {/* Text Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center gap-1 sm:gap-2 mb-0.5 flex-wrap">
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] truncate">{project.name}</span>
                    
                    {/* Official Badge */}
                    <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-[1px] sm:py-[2px] bg-[#EEF0FF] rounded shrink-0">
                      <span className="text-[8px] sm:text-[9px] font-bold text-[#5B62F1] uppercase tracking-wide leading-none mt-[0.5px]">Official</span>
                      <i className="fas fa-check-circle text-[#5B62F1] text-[8px] sm:text-[10px]"></i>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-slate-500 truncate">{project.description}</div>
                </div>

                {/* Arrow */}
                <i className="fas fa-chevron-right text-[11px] sm:text-[12px] text-slate-300 group-hover:text-slate-400 mr-0.5 sm:mr-1 transition-colors"></i>
              </button>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="text-center py-6 sm:py-10 text-slate-500 text-[12px] sm:text-[13px]">
              No projects found matching "{search}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] sm:text-[12px] text-slate-500 shrink-0">
          <i className="fas fa-shield-halved text-[#5B62F1] text-[12px] sm:text-[13px]"></i>
          <span className="font-semibold text-slate-700">Official support only.</span> We will never DM you first.
        </div>

      </div>
    </div>
  );
}