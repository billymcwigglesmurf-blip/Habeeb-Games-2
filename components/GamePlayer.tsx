import React, { useState, useRef } from 'react';
import { ArrowLeft, Maximize2, RotateCcw, Volume2, VolumeX, Share2, Info } from 'lucide-react';
import { Game } from '../types.ts';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const reloadGame = () => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white font-outfit">{game.title}</h2>
            <p className="text-slate-500 text-xs hidden sm:block">Playing on Habeeb Games</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={reloadGame}
            title="Reload Game"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute" : "Mute"}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={toggleFullscreen}
            title="Fullscreen"
            className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-all shadow-lg shadow-red-600/20"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row bg-black overflow-hidden relative">
        <div 
          ref={containerRef}
          className="flex-1 relative bg-slate-950 flex items-center justify-center"
        >
          <iframe 
            id="game-iframe"
            src={game.iframeUrl} 
            className="w-full h-full border-0 bg-white"
            allowFullScreen
            loading="lazy"
            title={game.title}
          />
        </div>

        <div className="hidden lg:flex w-80 bg-slate-900 border-l border-slate-800 p-6 flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-red-400 font-semibold">
              <Info className="w-4 h-4" />
              <span>About Game</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <h4 className="text-white font-bold mb-4">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Plays</div>
                <div className="text-slate-100 font-outfit font-bold">12.5k+</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Rating</div>
                <div className="text-red-400 font-outfit font-bold">4.8/5</div>
              </div>
            </div>
          </div>

          <button className="mt-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all border border-slate-700">
            <Share2 className="w-4 h-4" />
            <span>Share Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;