import React, { useState } from 'react';
import { Search, Menu, X, Rocket, ShieldCheck } from 'lucide-react';

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

    // Set up the about:blank page
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    win.document.body.style.overflow = 'hidden';
    
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = url;
    
    win.document.body.appendChild(iframe);
    
    // Spoof the tab title and favicon
    win.document.title = 'Google Docs';
    const link = win.document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    win.document.head.appendChild(link);

    // Show visual feedback in the current tab
    setShowProxySuccess(true);
    setTimeout(() => setShowProxySuccess(false), 3000);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2 cursor-pointer group"
        >
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
          <button className="text-slate-300 hover:text-white font-medium transition-colors">Trending</button>
          <div className="relative">
            <button 
              onClick={handleProxyMode}
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              Proxy Mode
            </button>
            {showProxySuccess && (
              <div className="absolute top-full mt-2 right-0 bg-emerald-500 text-white text-[10px] font-bold py-1 px-3 rounded shadow-xl animate-bounce">
                Tab Cloaked!
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 pl-10 pr-4 py-3 rounded-xl focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button className="text-left py-3 px-4 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors">Categories</button>
            <button className="text-left py-3 px-4 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors">Trending</button>
            <button 
              onClick={handleProxyMode}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Launch Proxy Mode
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;