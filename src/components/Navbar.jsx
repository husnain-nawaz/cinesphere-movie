import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { Aperture, Search, Database, Play, X } from 'lucide-react';

export const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    myRatedMovies,
    watchlistMovies,
    movies,
    openTrailer,
    dbStatus,
    setIsDbModalOpen,
  } = useMovies();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Play random trailer gem
  const handleRandomTrailer = () => {
    if (movies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * movies.length);
    openTrailer(movies[randomIndex]);
  };

  const navItems = [
    { id: 'discover', label: 'Discover' },
    { id: 'trailers', label: 'Trailers Theater' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'my-ratings', label: 'My Ratings', count: myRatedMovies.length },
    { id: 'watchlist', label: 'Watchlist', count: watchlistMovies.length },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#080b12]/80 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f9735b] text-[#090b10] group-hover:rotate-45 transition-transform duration-500">
              <Aperture className="w-[18px] h-[18px]" />
            </span>
            <span className="text-xl font-bold tracking-tight text-zinc-100 font-display flex items-center">
              CINE<span className="text-[#f9735b]">SPHERE</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line text links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-2 text-xs lg:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white after:absolute after:left-0 after:right-0 after:-bottom-[18px] after:h-0.5 after:bg-[#f9735b]'
                    : 'text-zinc-500 hover:text-zinc-100'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-[#f9735b]/15 text-[#ff9a86]' : 'bg-white/5 text-zinc-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* MySQL Database Status Button */}
          <button
            onClick={() => setIsDbModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="View Express & MySQL database configuration"
          >
            <Database className="w-3.5 h-3.5 text-[#f9735b]" />
            <span className="hidden lg:inline">MySQL</span>
            <span
              className={`w-2 h-2 rounded-full ${
                dbStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            ></span>
          </button>

          {/* Search Bar / Input */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search titles, directors, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none w-44 sm:w-60 text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-zinc-500 hover:text-zinc-300 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 ml-2 border-l border-zinc-700 pl-2 text-[10px]"
                >
                  ESC
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 p-2.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-full transition-colors cursor-pointer"
                title="Search movies & trailers"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Random Trailer Action */}
          <button
            onClick={handleRandomTrailer}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#f9735b] hover:bg-[#ff846d] active:scale-95 rounded-full transition-all shadow-lg shadow-[#f9735b]/10 cursor-pointer whitespace-nowrap"
            title="Play a random movie trailer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">Random Trailer</span>
            <span className="sm:hidden">Trailer</span>
          </button>
        </div>
      </div>

      {/* Mobile nav items */}
      <div className="md:hidden flex items-center overflow-x-auto px-5 py-2.5 gap-5 border-t border-white/[0.05] bg-[#080b12]/95 text-xs hide-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === item.id
                ? 'text-[#f9735b] font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {item.label}
            {item.count !== undefined && item.count > 0 && ` (${item.count})`}
          </button>
        ))}
      </div>
    </header>
  );
};
