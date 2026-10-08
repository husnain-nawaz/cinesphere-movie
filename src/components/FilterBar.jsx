import React from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { Filter, SlidersHorizontal, RotateCcw, Star } from 'lucide-react';

const GENRES = [
  'All',
  'Sci-Fi',
  'Drama',
  'Action',
  'Crime',
  'Thriller',
  'Adventure',
  'Animation',
  'Comedy',
  'Horror',
];

export const FilterBar = () => {
  const {
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    minRating,
    setMinRating,
    resetFilters,
    filteredMovies,
    searchQuery,
  } = useMovies();

  const isFiltered =
    selectedGenre !== 'All' || sortBy !== 'popular' || minRating > 0 || searchQuery !== '';

  return (
    <div className="space-y-5 p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] shadow-2xl shadow-black/10">
      {/* Top Row: Genres Segmented Buttons (Interactive filter controls adhering to Section 1.A) */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 hide-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-2 text-xs font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#f9735b] text-white font-semibold shadow-lg shadow-[#f9735b]/10'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Reset button if filters active */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-[#ff9a86] hover:bg-white/5 rounded-full transition-colors cursor-pointer shrink-0 border border-white/10"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Sort & Min Rating & Result Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111620] border border-white/10 text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#f9735b] cursor-pointer"
            >
              <option value="popular">Most Popular (Votes)</option>
              <option value="rating">Highest Rated (★ 10-0)</option>
              <option value="newest">Release Year (Newest)</option>
              <option value="userRating">Your Personal Rating</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Min Rating Threshold */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-medium">Min Score:</span>
            {[
              { val: 0, label: 'Any' },
              { val: 7.5, label: '7.5+' },
              { val: 8.0, label: '8.0+' },
              { val: 8.5, label: '8.5+' },
            ].map((option) => (
              <button
                key={option.val}
                onClick={() => setMinRating(option.val)}
                className={`px-2 py-1 rounded text-[11px] font-mono tabular-nums transition-colors cursor-pointer ${
                  minRating === option.val
                    ? 'bg-[#f9735b]/15 text-[#ff9a86] font-semibold border border-[#f9735b]/40'
                    : 'text-zinc-400 hover:text-zinc-200 bg-white/[0.04] border border-transparent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="text-zinc-500 font-mono text-[11px]">
          Showing <strong className="text-zinc-300">{filteredMovies.length}</strong> films
        </div>
      </div>
    </div>
  );
};
