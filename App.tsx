import React, { useState, useMemo } from 'react';
import { Game, GameCategory } from './types.ts';
import { GAMES_DATA } from './data/games.ts';
import Navbar from './components/Navbar.tsx';
import GameCard from './components/GameCard.tsx';
import GamePlayer from './components/GamePlayer.tsx';
import Footer from './components/Footer.tsx';
import { LayoutGrid, Filter, Trophy, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'All'>('All');

  const filteredGames = useMemo(() => {
    return (GAMES_DATA || []).filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Navbar onSearch={setSearchTerm} onHomeClick={handleHomeClick} />

      <main className="flex-1">
        {selectedGame ? (
          <GamePlayer game={selectedGame} onBack={() => setSelectedGame(null)} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <header className="mb-12 relative overflow-hidden bg-red-600 rounded-3xl p-8 md:p-12 shadow-2xl shadow-red-600/20">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-black font-outfit text-white mb-4 leading-tight">
                  Play Without <span className="text-orange-200">Boundaries.</span>
                </h1>
                <p className="text-red-100 text-lg md:text-xl mb-8 opacity-90 max-w-lg">
                  Access the web's best unblocked games. No downloads, no lag, just pure gaming fun from anywhere.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all transform hover:-translate-y-1 shadow-xl">
                    Explore New Releases
                  </button>
                  <button className="bg-red-500/50 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-500/70 transition-all">
                    About Proxy
                  </button>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-[20px] border-white animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full border-[40px] border-white opacity-20" />
              </div>
            </header>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <button 
                  onClick={() => setActiveCategory('All')}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                    activeCategory === 'All' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  All Games
                </button>
                {Object.values(GameCategory).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat as GameCategory)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                      activeCategory === cat 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                  <LayoutGrid className="w-4 h-4" />
                  <span>{filteredGames.length} Games Found</span>
                </div>
              </div>
            </div>

            {filteredGames.length > 0 ? (
              <div className="space-y-16">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-lg">
                        <Trophy className="w-6 h-6 text-amber-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-white font-outfit">
                        {searchTerm ? `Search Results for "${searchTerm}"` : activeCategory === 'All' ? 'Popular Now' : `${activeCategory} Games`}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGames.map(game => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onClick={handleGameSelect} 
                      />
                    ))}
                  </div>
                </section>

                {!searchTerm && activeCategory === 'All' && GAMES_DATA.some(g => g.category === GameCategory.CLASSIC) && (
                  <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="bg-red-500/20 p-2 rounded-lg">
                        <Clock className="w-6 h-6 text-red-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-white font-outfit">Classic Favorites</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {GAMES_DATA.filter(g => g.category === GameCategory.CLASSIC).slice(0, 4).map(game => (
                        <div 
                          key={game.id}
                          onClick={() => handleGameSelect(game)}
                          className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-slate-700"
                        >
                          <img src={game.thumbnail} className="w-16 h-16 rounded-xl object-cover" alt={game.title} />
                          <div>
                            <h4 className="font-bold text-slate-100 group-hover:text-red-400 transition-colors">{game.title}</h4>
                            <span className="text-slate-500 text-xs uppercase font-bold tracking-tighter">{game.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-slate-900 p-8 rounded-full mb-6">
                  <Filter className="w-12 h-12 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
                <p className="text-slate-500 max-w-xs">
                  We couldn't find any games matching your current filters or search term. The database might be empty.
                </p>
                <button 
                  onClick={() => {setSearchTerm(''); setActiveCategory('All')}}
                  className="mt-6 text-red-400 font-bold hover:text-red-300 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {!selectedGame && <Footer />}
    </div>
  );
};

export default App;