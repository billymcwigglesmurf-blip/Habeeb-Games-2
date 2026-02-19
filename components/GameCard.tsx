import React from 'react';
import { Play, Flame, ExternalLink } from 'lucide-react';
import { Game } from '../types.ts';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div 
      onClick={() => onClick(game)}
      className="group relative bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-2xl hover:shadow-red-500/10"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        {game.isHot && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg uppercase tracking-wider">
            <Flame className="w-3 h-3" />
            Hot
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2 py-1 rounded border border-slate-700 uppercase tracking-tighter">
          {game.category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-slate-100 text-lg group-hover:text-red-400 transition-colors truncate">
            {game.title}
          </h3>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" />
        </div>
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
          {game.description}
        </p>
      </div>
    </div>
  );
};

export default GameCard;