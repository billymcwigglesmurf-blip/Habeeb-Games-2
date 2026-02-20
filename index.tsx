import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Search, Rocket, ShieldCheck, Play, Flame, 
  ArrowLeft, RotateCcw, Volume2, VolumeX, Share2, Info, Trophy, Clock, Maximize2
} from 'lucide-react';

// --- TYPES & INTERFACES ---
export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  iframeUrl: string;
  isHot?: boolean;
}

// --- EMBEDDED DATA (Prevents 404 on games.json) ---
const GAMES_CATALOG: Game[] = [
  {
    "id": "pac-man",
    "title": "Pac-Man",
    "description": "The classic arcade phenomenon, built natively for Habeeb Games. Navigate the maze, eat all the dots, and avoid the ghosts! Grab a power pellet to turn the tables on your spectral foes.",
    "category": "Classic",
    "thumbnail": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop",
    "iframeUrl": "internal:pacman",
    "isHot": true
  },
  {
    "id": "basket-hoop",
    "title": "Basket Hoop",
    "description": "Show off your basketball skills! Aim, shoot, and score in this addictive sports challenge. Perfect your technique and climb the leaderboards.",
    "category": "Sports",
    "thumbnail": "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    "iframeUrl": "https://d11jzht7mj96rr.cloudfront.net/games/2024/construct/311/basket-hoop/index-gg.html",
    "isHot": true
  },
  {
    "id": "cookie-clicker-save-the-world",
    "title": "Cookie Clicker: Save the World",
    "description": "An interesting Cookie Clicker variation. Click to collect as many cookies as possible and save the world! Build your cookie empire and help humanity through the power of sweets.",
    "category": "Arcade",
    "thumbnail": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
    "iframeUrl": "https://games.crazygames.com/en_US/cookie-clicker-save-the-world/index.html?skipPrerollFirstSession=true&v=1.351",
    "isHot": true
  },
  {
    "id": "dogeminer",
    "title": "Dogeminer",
    "description": "The legendary Dogecoin mining simulator! Mine Dogecoin, hire helper pups, buy upgrades, and eventually travel to the moon in this iconic idle clicker game.",
    "category": "Arcade",
    "thumbnail": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
    "iframeUrl": "https://dogeminer.se/",
    "isHot": true
  },
  {
    "id": "grand-action-simulator",
    "title": "Grand Action Simulator",
    "description": "A high-stakes action simulator in New York. Steal cars, fight gangs, and dominate the city streets in this open-world crime thriller!",
    "category": "Action",
    "thumbnail": "https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=800&auto=format&fit=crop",
    "iframeUrl": "https://grand-action-simulator-new-york-car-gang.game-files.crazygames.com/unity/unity56/grand-action-simulator-new-york-car-gang.html?isNewUser=false&skipPrerollFirstSession=true&v=1.351",
    "isHot": true
  },
  {
    "id": "jelly-mario",
    "title": "Jelly Mario",
    "description": "A surreal reimagining of the classic platformer where everything—Mario, enemies, and even the blocks—behaves like jelly. Bounce, stretch, and wiggle your way through the Mushroom Kingdom.",
    "category": "Arcade",
    "thumbnail": "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&auto=format&fit=crop",
    "iframeUrl": "https://jellymar.io/",
    "isHot": true
  }
];

// --- PAC-MAN NATIVE COMPONENT ---
const PacManGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'gameover' | 'win'>('playing');

  const MAZE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,3,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,3,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
    [1,1,1,1,0,1,2,1,1,4,1,1,2,1,0,1,1,1,1],
    [2,2,2,2,0,2,2,1,2,2,2,1,2,2,0,2,2,2,2],
    [1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
    [1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,3,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,3,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameStatus !== 'playing') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pacman = { x: 9, y: 15, dir: 0, nextDir: 0, speed: 0.15 };
    let dots = [];
    let localScore = 0;

    for(let y=0; y<MAZE.length; y++) {
      for(let x=0; x<MAZE[0].length; x++) {
        if(MAZE[y][x] === 0) dots.push({x,y});
      }
    }

    const keyHandler = (e: KeyboardEvent) => {
      if(['ArrowUp','w'].includes(e.key)) pacman.nextDir = 3;
      if(['ArrowRight','d'].includes(e.key)) pacman.nextDir = 0;
      if(['ArrowDown','s'].includes(e.key)) pacman.nextDir = 1;
      if(['ArrowLeft','a'].includes(e.key)) pacman.nextDir = 2;
    };
    window.addEventListener('keydown', keyHandler);

    const isWall = (x: number, y: number) => {
      const tx = Math.floor(x); const ty = Math.floor(y);
      if(tx<0||tx>=19||ty<0||ty>=19) return true;
      return MAZE[ty][tx] === 1;
    };

    const loop = () => {
      if(gameStatus !== 'playing') return;
      const tryMove = (d: number) => {
        let nx = pacman.x, ny = pacman.y;
        if(d===0) nx += pacman.speed; if(d===1) ny += pacman.speed;
        if(d===2) nx -= pacman.speed; if(d===3) ny -= pacman.speed;
        if(!isWall(nx+(d===0?.5:d===2?-.5:0), ny+(d===1?.5:d===3?-.5:0))) {
          pacman.x = nx; pacman.y = ny; return true;
        }
        return false;
      };

      if(!tryMove(pacman.nextDir)) tryMove(pacman.dir); else pacman.dir = pacman.nextDir;
      if(pacman.x < 0) pacman.x = 18; if(pacman.x > 18) pacman.x = 0;

      const px = Math.round(pacman.x), py = Math.round(pacman.y);
      const di = dots.findIndex(d=>d.x===px&&d.y===py);
      if(di!==-1) { dots.splice(di, 1); localScore += 10; setScore(localScore); if(!dots.length) setGameStatus('win'); }

      ctx.fillStyle = '#000'; ctx.fillRect(0,0,380,380);
      MAZE.forEach((r,y) => r.forEach((c,x) => {
        if(c===1) { ctx.fillStyle='#1e40af'; ctx.fillRect(x*20+2, y*20+2, 16, 16); }
      }));
      ctx.fillStyle='#ffb8ae'; dots.forEach(d=> { ctx.beginPath(); ctx.arc(d.x*20+10, d.y*20+10, 2, 0, 7); ctx.fill(); });
      ctx.fillStyle='#ffff00'; ctx.beginPath(); ctx.arc(pacman.x*20+10, pacman.y*20+10, 8, 0, 7); ctx.fill();
      
      requestAnimationFrame(loop);
    };
    loop();
    return () => window.removeEventListener('keydown', keyHandler);
  }, [gameStatus]);

  return (
    <div className="flex flex-col items-center bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="mb-6 text-yellow-400 font-black text-3xl font-outfit tracking-tight">SCORE: {score}</div>
      <div className="relative border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} width={380} height={380} className="bg-black" />
        {gameStatus !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <h2 className="text-4xl font-black text-white font-outfit mb-4 uppercase tracking-tight">{gameStatus === 'win' ? 'VICTORY!' : 'GAME OVER'}</h2>
            <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors shadow-lg">RESTART_SYSTEM</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTS ---
const Navbar: React.FC<{ onSearch: (t: string) => void; onHome: () => void }> = ({ onSearch, onHome }) => {
  const handleProxy = () => {
    const w = window.open();
    if(!w) return alert("Popup blocked!");
    w.document.body.innerHTML = `<iframe src="${window.location.href}" style="width:100%;height:100vh;border:none;margin:0;padding:0;"></iframe>`;
    w.document.title = "Google Docs";
  };
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div onClick={onHome} className="flex items-center gap-2 cursor-pointer group">
        <Rocket className="w-8 h-8 text-red-500 group-hover:rotate-12 transition-transform" />
        <span className="text-2xl font-black font-outfit text-white">HABEEB <span className="text-red-500">GAMES</span></span>
      </div>
      <div className="flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder="Search unblocked..." className="w-full bg-slate-900 border border-slate-800 rounded-full pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500/50 text-sm transition-all text-white" onChange={e => onSearch(e.target.value)} />
      </div>
      <button onClick={handleProxy} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20 text-sm">
        <ShieldCheck className="w-4 h-4" /> Proxy Mode
      </button>
    </nav>
  );
};

const GameCard: React.FC<{ game: Game; onSelect: (g: Game) => void }> = ({ game, onSelect }) => (
  <div onClick={() => onSelect(game)} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-red-500 transition-all cursor-pointer group hover:-translate-y-2 shadow-xl hover:shadow-red-500/5">
    <div className="aspect-video relative overflow-hidden">
      <img src={game.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={game.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
      {game.isHot && <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg">HOT</div>}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-red-600 p-4 rounded-full text-white shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
          <Play className="w-8 h-8 fill-white" />
        </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors truncate">{game.title}</h3>
      <p className="text-slate-500 text-xs mt-1.5 line-clamp-1">{game.category} • Unblocked Access</p>
    </div>
  </div>
);

// --- MAIN APP ---
const App: React.FC = () => {
  const [selected, setSelected] = useState<Game | null>(null);
  const [query, setQuery] = useState('');
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => GAMES_CATALOG.filter(g => g.title.toLowerCase().includes(query.toLowerCase())), [query]);

  const toggleFullscreen = () => {
    if (gameContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        gameContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    }
  };

  const reloadGame = () => {
    if (!selected) return;
    if (selected.iframeUrl !== 'internal:pacman') {
      const iframe = document.getElementById('game-viewport') as HTMLIFrameElement;
      if (iframe) iframe.src = iframe.src;
    } else {
      // For native games we just reload the app instance or let it be
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-inter">
      <Navbar onSearch={setQuery} onHome={() => setSelected(null)} />
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {selected ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelected(null)} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all border border-slate-800 shadow-xl" title="Go Back"><ArrowLeft className="w-6 h-6 text-white" /></button>
                <h2 className="text-2xl md:text-4xl font-black text-white font-outfit uppercase tracking-tighter">{selected.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={reloadGame} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all border border-slate-800 text-slate-400 hover:text-white" title="Reload Game"><RotateCcw className="w-6 h-6" /></button>
                 <button onClick={toggleFullscreen} className="p-3 bg-red-600 hover:bg-red-500 rounded-2xl transition-all border border-red-500 shadow-xl text-white flex items-center gap-2" title="Fullscreen Mode">
                    <Maximize2 className="w-6 h-6" />
                    <span className="hidden sm:inline font-bold text-sm">FULLSCREEN</span>
                 </button>
              </div>
            </div>
            
            <div ref={gameContainerRef} className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl shadow-red-500/5 relative">
              {selected.iframeUrl === 'internal:pacman' ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-950"><PacManGame /></div>
              ) : (
                <iframe id="game-viewport" src={selected.iframeUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope; microphone; clipboard-read; clipboard-write" />
              )}
            </div>

            <div className="mt-10 bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-2xl font-outfit flex items-center gap-3"><Info className="w-6 h-6 text-red-500" /> SYSTEM_INFO</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 border border-slate-700">ID: {selected.id}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 border border-slate-700">{selected.category}</span>
                  </div>
               </div>
               <p className="text-slate-400 text-lg leading-relaxed">{selected.description}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-20 p-12 md:p-24 bg-gradient-to-br from-red-600 to-red-900 rounded-[4rem] relative overflow-hidden shadow-2xl shadow-red-600/20">
              <div className="relative z-10">
                <h1 className="text-6xl md:text-9xl font-black text-white font-outfit mb-8 leading-[0.85] tracking-tighter">GAMING <br/><span className="text-red-300">UNFILTERED.</span></h1>
                <p className="text-red-100 text-xl md:text-3xl max-w-2xl opacity-90 mb-12 font-medium tracking-tight">Access the elite catalog of unblocked high-performance entertainment.</p>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-3xl inline-flex items-center gap-3 text-white font-bold shadow-2xl">
                  <Rocket className="w-6 h-6" /> DIRECT_LINK_ACTIVE
                </div>
              </div>
              <div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-white/10 rounded-full blur-[120px]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {filtered.map(g => <GameCard key={g.id} game={g} onSelect={setSelected} />)}
              {filtered.length === 0 && (
                 <div className="col-span-full py-32 text-center text-slate-500 font-bold text-xl uppercase tracking-widest opacity-50">NULL_SEARCH_RESULTS</div>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="mt-40 border-t border-slate-900 bg-slate-950 py-24 px-6 text-center">
        <Rocket className="w-8 h-8 text-slate-800 mx-auto mb-6" />
        <p className="text-slate-600 text-lg font-medium">Habeeb Games © 2026 • SYSTEM_V_3.5_STABLE</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);