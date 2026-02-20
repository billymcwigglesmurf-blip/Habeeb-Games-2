import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  category: string;
  thumbnail: string;
  iframeUrl: string;
  isHot?: boolean;
}

// --- PAC-MAN NATIVE IMPLEMENTATION ---
const PacManGame: React.FC<{ onGameOver: (score: number) => void }> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStatus, setGameStatus] = useState<'playing' | 'paused' | 'gameover' | 'win'>('playing');

  // Maze layout: 1=Wall, 0=Dot, 2=Empty, 3=PowerPellet, 4=GhostGate
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

  const TILE_SIZE = 20;
  const WIDTH = MAZE[0].length;
  const HEIGHT = MAZE.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pacman = { x: 9, y: 15, dir: 0, nextDir: 0, speed: 0.15 };
    let ghosts = [
      { x: 9, y: 9, color: '#FF0000', dir: 0, state: 'normal' },
      { x: 8, y: 9, color: '#FFB8FF', dir: 1, state: 'normal' },
      { x: 10, y: 9, color: '#00FFFF', dir: 2, state: 'normal' },
      { x: 9, y: 8, color: '#FFB852', dir: 3, state: 'normal' }
    ];
    let dots = [];
    let powerPellets = [];
    let powerTimer = 0;
    let localScore = 0;
    let localLives = 3;

    // Initialize dots from MAZE
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (MAZE[y][x] === 0) dots.push({ x, y });
        if (MAZE[y][x] === 3) powerPellets.push({ x, y });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') pacman.nextDir = 3;
      if (e.key === 'ArrowRight' || e.key === 'd') pacman.nextDir = 0;
      if (e.key === 'ArrowDown' || e.key === 's') pacman.nextDir = 1;
      if (e.key === 'ArrowLeft' || e.key === 'a') pacman.nextDir = 2;
    };

    window.addEventListener('keydown', handleKeyDown);

    const isWall = (x: number, y: number) => {
      const tx = Math.floor(x);
      const ty = Math.floor(y);
      if (tx < 0 || tx >= WIDTH || ty < 0 || ty >= HEIGHT) return true;
      return MAZE[ty][tx] === 1 || MAZE[ty][tx] === 4;
    };

    const update = () => {
      if (gameStatus !== 'playing') return;

      // Pacman movement logic
      const tryMove = (d: number) => {
        let nx = pacman.x, ny = pacman.y;
        if (d === 0) nx += pacman.speed;
        if (d === 1) ny += pacman.speed;
        if (d === 2) nx -= pacman.speed;
        if (d === 3) ny -= pacman.speed;
        
        // Snap to grid when turning
        if (d === 0 || d === 2) {
           if (Math.abs(pacman.y - Math.round(pacman.y)) < 0.2) {
             if (!isWall(nx + (d === 0 ? 0.5 : -0.5), Math.round(pacman.y))) {
                pacman.x = nx;
                pacman.y = Math.round(pacman.y);
                return true;
             }
           }
        } else {
           if (Math.abs(pacman.x - Math.round(pacman.x)) < 0.2) {
             if (!isWall(Math.round(pacman.x), ny + (d === 1 ? 0.5 : -0.5))) {
                pacman.y = ny;
                pacman.x = Math.round(pacman.x);
                return true;
             }
           }
        }
        return false;
      };

      if (!tryMove(pacman.nextDir)) {
        tryMove(pacman.dir);
      } else {
        pacman.dir = pacman.nextDir;
      }

      // Wrap around
      if (pacman.x < 0) pacman.x = WIDTH - 1;
      if (pacman.x >= WIDTH) pacman.x = 0;

      // Eat dots
      const px = Math.round(pacman.x);
      const py = Math.round(pacman.y);
      const dotIdx = dots.findIndex(d => d.x === px && d.y === py);
      if (dotIdx !== -1) {
        dots.splice(dotIdx, 1);
        localScore += 10;
        setScore(localScore);
        if (dots.length === 0) setGameStatus('win');
      }

      // Eat Power Pellets
      const ppIdx = powerPellets.findIndex(p => p.x === px && p.y === py);
      if (ppIdx !== -1) {
        powerPellets.splice(ppIdx, 1);
        localScore += 50;
        setScore(localScore);
        powerTimer = 600;
        ghosts.forEach(g => g.state = 'frightened');
      }

      if (powerTimer > 0) {
        powerTimer--;
        if (powerTimer === 0) ghosts.forEach(g => g.state = 'normal');
      }

      // Ghost movement
      ghosts.forEach(g => {
        let gx = g.x, gy = g.y;
        if (g.dir === 0) gx += 0.08;
        if (g.dir === 1) gy += 0.08;
        if (g.dir === 2) gx -= 0.08;
        if (g.dir === 3) gy -= 0.08;

        if (isWall(gx + (g.dir === 0 ? 0.5 : (g.dir === 2 ? -0.5 : 0)), gy + (g.dir === 1 ? 0.5 : (g.dir === 3 ? -0.5 : 0)))) {
           g.dir = Math.floor(Math.random() * 4);
        } else {
           g.x = gx; g.y = gy;
        }

        // Wrap around
        if (g.x < 0) g.x = WIDTH - 1;
        if (g.x >= WIDTH) g.x = 0;

        // Collision with Pacman
        const dx = Math.abs(pacman.x - g.x);
        const dy = Math.abs(pacman.y - g.y);
        if (dx < 0.5 && dy < 0.5) {
          if (g.state === 'frightened') {
            g.x = 9; g.y = 9; g.state = 'normal';
            localScore += 200;
            setScore(localScore);
          } else {
            localLives--;
            setLives(localLives);
            if (localLives <= 0) {
              setGameStatus('gameover');
            } else {
              pacman = { x: 9, y: 15, dir: 0, nextDir: 0, speed: 0.15 };
            }
          }
        }
      });
    };

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Maze
      MAZE.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1) {
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          } else if (cell === 4) {
            ctx.fillStyle = '#f87171';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE/2 - 2, TILE_SIZE, 4);
          }
        });
      });

      // Draw Dots
      ctx.fillStyle = '#ffb8ae';
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x * TILE_SIZE + TILE_SIZE/2, d.y * TILE_SIZE + TILE_SIZE/2, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Power Pellets
      powerPellets.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * TILE_SIZE + TILE_SIZE/2, p.y * TILE_SIZE + TILE_SIZE/2, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Pacman
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      const pcX = pacman.x * TILE_SIZE + TILE_SIZE/2;
      const pcY = pacman.y * TILE_SIZE + TILE_SIZE/2;
      const mouthOpen = (Date.now() % 400 < 200) ? 0.2 : 0;
      const angles = [
        [0.2 + mouthOpen, 1.8 - mouthOpen], // Right
        [0.7 + mouthOpen, 2.3 - mouthOpen], // Down
        [1.2 + mouthOpen, 2.8 - mouthOpen], // Left
        [1.7 + mouthOpen, 3.3 - mouthOpen]  // Up
      ];
      ctx.moveTo(pcX, pcY);
      ctx.arc(pcX, pcY, 8, angles[pacman.dir][0] * Math.PI, angles[pacman.dir][1] * Math.PI);
      ctx.fill();

      // Draw Ghosts
      ghosts.forEach(g => {
        ctx.fillStyle = g.state === 'frightened' ? '#2563eb' : g.color;
        const gx = g.x * TILE_SIZE + 2;
        const gy = g.y * TILE_SIZE + 2;
        ctx.beginPath();
        ctx.arc(gx + 8, gy + 8, 8, Math.PI, 0);
        ctx.lineTo(gx + 16, gy + 16);
        ctx.lineTo(gx, gy + 16);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(gx + 5, gy + 6, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(gx + 11, gy + 6, 2, 0, Math.PI * 2); ctx.fill();
      });
    };

    let frameId: number;
    const loop = () => {
      update();
      draw();
      frameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStatus]);

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 p-8 h-full rounded-b-3xl">
      <div className="mb-6 flex gap-12 text-white font-outfit text-xl">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase font-bold">Score</span>
          <span className="font-black text-2xl text-yellow-400">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase font-bold">Lives</span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: lives }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-yellow-400" />
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative border-4 border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10">
        <canvas ref={canvasRef} width={380} height={380} className="bg-black" />
        
        {gameStatus === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <h2 className="text-4xl font-black text-red-500 mb-2 font-outfit">GAME OVER</h2>
            <p className="text-white mb-6">Your final score: {score}</p>
            <button 
              onClick={() => location.reload()}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold transition-all"
            >
              Try Again
            </button>
          </div>
        )}
        
        {gameStatus === 'win' && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <h2 className="text-4xl font-black text-emerald-500 mb-2 font-outfit">YOU WIN!</h2>
            <p className="text-white mb-6">Score: {score}</p>
            <button 
              onClick={() => location.reload()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-slate-500 text-sm flex items-center gap-2">
        <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">WASD</kbd> or <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">ARROWS</kbd> to move
      </p>
    </div>
  );
};

// --- COMPONENTS ---

interface NavbarProps {
  onSearch: (term: string) => void;
  onHomeClick: () => void;
}

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

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

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

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };
  const reloadGame = () => {
    if (game.iframeUrl.startsWith('internal:')) {
      location.reload();
      return;
    }
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) iframe.src = iframe.src;
  };

  const isInternal = game.iframeUrl.startsWith('internal:');

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><ArrowLeft className="w-6 h-6" /></button>
          <div><h2 className="text-xl font-bold text-white font-outfit">{game.title}</h2><p className="text-slate-500 text-xs hidden sm:block">Playing on Habeeb Games</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reloadGame} title="Reload Game" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><RotateCcw className="w-5 h-5" /></button>
          <button onClick={toggleFullscreen} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-all shadow-lg shadow-red-600/20"><Maximize2 className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="flex-1 bg-black overflow-hidden relative">
        <div ref={containerRef} className="w-full h-full relative bg-slate-950 flex items-center justify-center">
          {isInternal ? (
            <PacManGame onGameOver={(s) => console.log('Final Score:', s)} />
          ) : (
            <iframe id="game-iframe" src={game.iframeUrl} className="w-full h-full border-0 bg-white" allowFullScreen loading="lazy" title={game.title} />
          )}
        </div>
      </div>
    </div>
  );
};

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
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
          <ul className="space-y-4 text-slate-400"><li><a href="#" className="hover:text-red-400">Privacy Policy</a></li><li><a href="#" className="hover:text-red-400">DMCA</a></li></ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-900 text-center md:text-left md:flex md:items-center md:justify-between text-slate-500 text-sm">
        <p>© 2026 Habeeb Games. Built for students, by students.</p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./games.json')
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load games:", err);
        setLoading(false);
      });
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, [games]);

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
              </div>
            </header>
            <div className="flex items-center gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}>{cat}</button>
              ))}
            </div>
            
            {loading ? (
              <div className="text-center py-20 text-slate-500">Loading catalog...</div>
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} onClick={setSelectedGame} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-slate-900 p-8 rounded-full mb-6">
                  <Filter className="w-12 h-12 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
                <p className="text-slate-500 max-w-xs">Try adjusting your filters or search term.</p>
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