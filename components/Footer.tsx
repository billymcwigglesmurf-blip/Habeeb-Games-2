import React from 'react';
import { Rocket, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-red-600 p-2 rounded-xl">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black font-outfit tracking-tight text-white">
                HABEEB <span className="text-red-400">GAMES</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
              The ultimate unblocked gaming destination. High speed, no lags, and always free to play. Dive into a universe of fun!
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-full transition-all hover:bg-red-600">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-full transition-all hover:bg-red-600">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-full transition-all hover:bg-red-600">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">How it works</a></li>
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">Games list</a></li>
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">Trending</a></li>
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">Feedback</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">DMCA</a></li>
              <li><a href="#" className="text-slate-400 hover:text-red-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center md:text-left md:flex md:items-center md:justify-between text-slate-500 text-sm">
          <p>© 2026 Habeeb Games. Built for students, by students.</p>
          <div className="mt-4 md:mt-0">
            Managed by the community.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;