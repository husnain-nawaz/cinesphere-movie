import React from 'react';
import { Film, Star, Heart } from 'lucide-react';
import { useMovies } from '../context/MovieContext.jsx';

export const Footer = () => {
  const { setActiveTab, setSelectedGenre, movies } = useMovies();

  return (
    <footer className="mt-24 border-t border-zinc-800/80 bg-[#06070a] text-zinc-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Film className="w-4 h-4 text-amber-400" />
              </span>
              <span className="text-lg font-bold text-white font-display">CineSphere</span>
            </div>
            <p className="text-zinc-400 max-w-sm text-xs leading-relaxed">
              Curated cinema discovery platform powered by React, Express.js, and MySQL. Browse iconic films, stream official trailers, and curate your personal film ratings diary.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-zinc-200 font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Discover Movies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('trailers')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Trailers Theater
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('top-rated')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Top Rated Films
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('my-ratings')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  My Ratings & Diary
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div>
            <h4 className="text-zinc-200 font-semibold mb-3">Cinema Genres</h4>
            <ul className="space-y-2 text-zinc-400">
              {['Sci-Fi', 'Drama', 'Action', 'Crime'].map((g) => (
                <li key={g}>
                  <button
                    onClick={() => {
                      setSelectedGenre(g);
                      setActiveTab('discover');
                    }}
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {g} Films
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Copyright Line */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} CineSphere. All movie metadata and trademarks belong to their respective copyright holders.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by React & Express</span>
            <span>·</span>
            <span>MySQL Database Storage</span>
            <span>·</span>
            <span className="font-mono text-zinc-400">{movies.length} Films Cataloged</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
