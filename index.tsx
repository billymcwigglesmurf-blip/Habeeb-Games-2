import React, { useState, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Search, Menu, X, Rocket, ShieldCheck, Play, Flame, 
  ExternalLink, ArrowLeft, Maximize2, RotateCcw, 
  Volume2, VolumeX, Share2, Info, LayoutGrid, Filter, 
  Trophy, Clock, Github, Twitter, Instagram 
} from 'lucide-react';

// --- TYPES ---
export enum GameCategory {
  ACTION = 'Action',
  PUZZLE = 'Puzzle',
  ARCADE = 'Arcade',
  SPORTS = 'Sports',
  CLASSIC = 'Classic',
  STRATEGY = 'Strategy'
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  iframeUrl: string;
  isHot?: boolean;
}

// --- DATA ---
const GAMES_DATA: Game[] = [
  {
    id: 'house-of-hazards',
    title: 'House of Hazards',
    description: 'Complete household chores while dodging ridiculous traps set by your opponents! A hilarious physics-based multiplayer challenge where everything in the house is out to get you.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    iframeUrl: '/files/houseofhazards/index.html',
    isHot: true
  }
];

// --- COMPONENTS ---

// Define Props interface for Navbar
interface NavbarProps {
  onSearch: (term: string) => void;
  onHomeClick: () => void;
}

// Fixed Navbar using React.FC
const Navbar: React.FC<NavbarProps> = ({ onSearch, onHomeClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProxySuccess, setShowProxySuccess] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleProxyMode = () => {
    const url = window.location.href;
    const win = window.open();
    if (!win) {
      alert("Popup blocked! Please allow popups to use Proxy Mode.");
      return;
    }
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    win.document.body.style.overflow = 'hidden';
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none'; iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.margin = '0';
    iframe.src = url;
    win.document.body.appendChild(iframe);
    win.document.title = 'Google Docs';
    const link = win.document.createElement('link');
    link.rel = 'icon'; link.type = 'image/x-icon'; link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    win.document.head.appendChild(link);
    setShowProxySuccess(true);
    setTimeout(() => setShowProxySuccess(false), 3000);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div onClick={onHomeClick} className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-red-600 p-2 rounded-xl group-hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            HABEEB <span className="text-red-400">GAMES</span>
          </span>
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search unblocked games..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
            />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button className="text-slate-300 hover:text-white font-medium transition-colors">Categories</button>
          <div className="relative">
            <button onClick={handleProxyMode} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 active:scale-95">
              <ShieldCheck className="w-4 h-4" /> Proxy Mode
            </button>
            {showProxySuccess && <div className="absolute top-full mt-2 right-0 bg-emerald-500 text-white text-[10px] font-bold py-1 px-3 rounded shadow-xl animate-bounce">Tab Cloaked!</div>}
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>
  );
};

// Define Props interface for GameCard
interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

// Fixed GameCard by using React.FC to explicitly support 'key' prop in map iterators
const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => (
  <div onClick={() => onClick(game)} className="group relative bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-2xl hover:shadow-red-500/10">
    <div className="aspect-video relative overflow-hidden">
      <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 transform scale-90 group-hover:scale-100 transition-transform">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
      </div>
      {game.isHot && <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg uppercase tracking-wider"><Flame className="w-3 h-3" />Hot</div>}
      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2 py-1 rounded border border-slate-700 uppercase tracking-tighter">{game.category}</div>
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-slate-100 text-lg group-hover:text-red-400 transition-colors truncate">{game.title}</h3>
        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" />
      </div>
      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{game.description}</p>
    </div>
  </div>
);

// Define Props interface for GamePlayer
interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

// Fixed GamePlayer using React.FC
const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };
  const reloadGame = () => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) iframe.src = iframe.src;
  };
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><ArrowLeft className="w-6 h-6" /></button>
          <div><h2 className="text-xl font-bold text-white font-outfit">{game.title}</h2><p className="text-slate-500 text-xs hidden sm:block">Playing on Habeeb Games</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reloadGame} title="Reload Game" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><RotateCcw className="w-5 h-5" /></button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">{isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</button>
          <button onClick={toggleFullscreen} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-all shadow-lg shadow-red-600/20"><Maximize2 className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row bg-black overflow-hidden relative">
        <div ref={containerRef} className="flex-1 relative bg-slate-950 flex items-center justify-center">
          <iframe id="game-iframe" src={game.iframeUrl} className="w-full h-full border-0 bg-white" allowFullScreen loading="lazy" title={game.title} />
        </div>
      </div>
    </div>
  );
};

// Fixed Footer using React.FC
const Footer: React.FC = () => (
  <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-red-600 p-2 rounded-xl"><Rocket className="w-6 h-6 text-white" /></div>
            <span className="text-2xl font-black font-outfit tracking-tight text-white">HABEEB <span className="text-red-400">GAMES</span></span>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">The ultimate unblocked gaming destination. High speed, no lags, and always free to play.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-full transition-all hover:bg-red-600"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-full transition-all hover:bg-red-600"><Github className="w-5 h-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
          <ul className="space-y-4 text-slate-400"><li><a href="#" className="hover:text-red-400">Trending</a></li><li><a href="#" className="hover:text-red-400">New Games</a></li></ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
          <ul className="space-y-4 text-slate-400"><li><a href="#" className="hover:text-red-400">Privacy Policy</a></li><li><a href="#" className="hover:text-red-400">DMCA</a></li></ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-900 text-center md:text-left md:flex md:items-center md:justify-between text-slate-500 text-sm">
        <p>© 2026 Habeeb Games. Built for students, by students.</p>
        <div>Managed by the community.</div>
      </div>
    </div>
  </footer>
);

// --- MAIN APP ---
// Fixed App using React.FC
const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'All'>('All');

  const filteredGames = useMemo(() => {
    return GAMES_DATA.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Navbar onSearch={setSearchTerm} onHomeClick={() => setSelectedGame(null)} />
      <main className="flex-1">
        {selectedGame ? (
          <GamePlayer game={selectedGame} onBack={() => setSelectedGame(null)} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <header className="mb-12 relative overflow-hidden bg-red-600 rounded-3xl p-12 shadow-2xl shadow-red-600/20">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-6xl font-black font-outfit text-white mb-4 leading-tight">Play Without <span className="text-orange-200">Boundaries.</span></h1>
                <p className="text-red-100 text-xl mb-8 opacity-90 max-w-lg">Access the web's best unblocked games. No downloads, no lag, just pure gaming fun.</p>
                <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all transform hover:-translate-y-1 shadow-xl">Explore Games</button>
              </div>
            </header>
            <div className="flex items-center gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide">
              <button onClick={() => setActiveCategory('All')} className={`px-6 py-2.5 rounded-full font-semibold transition-all ${activeCategory === 'All' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}>All Games</button>
              {Object.values(GameCategory).map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat as GameCategory)} className={`px-6 py-2.5 rounded-full font-semibold transition-all ${activeCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} onClick={setSelectedGame} />
              ))}
            </div>
            {filteredGames.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-slate-900 p-8 rounded-full mb-6">
                  <Filter className="w-12 h-12 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
                <p className="text-slate-500 max-w-xs">
                  The database is currently empty.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      {!selectedGame && <Footer />}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
