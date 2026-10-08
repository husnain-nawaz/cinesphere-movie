import React from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { Play, Star, Plus, Check, Info } from 'lucide-react';

export const HeroSpotlight = ({ movie }) => {
  const { openTrailer, openDetails, openRatingModal, toggleWatchlist, getUserRating } = useMovies();
  if (!movie) return null;

  const userRating = getUserRating(movie.id);

  const formatRuntime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[650px] flex items-end film-grain border-b border-white/[0.06] bg-[#080b12]">
      {/* Background Media with Measured Scrims */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-70 scale-[1.02] transition-transform duration-1000 ease-out"
        />
        {/* Measured scrim gradients for pristine WCAG AA contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/72 to-transparent w-full lg:w-[82%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 pt-28 sm:pb-20 lg:pb-24">
        <div className="max-w-3xl">
          {/* Unboxed Metadata with Typographic Separators (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold text-zinc-300 mb-5 tracking-[0.12em] uppercase">
            <span className="px-2.5 py-1 rounded-full bg-[#f9735b] text-black tracking-normal">Featured film</span>
            <span className="text-zinc-300 font-semibold">{movie.year}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300">{formatRuntime(movie.runtime)}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300">{movie.genres?.join(' / ')}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-400">{movie.ageRating}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="flex items-center gap-1 text-[#ff9a86] font-semibold font-mono tabular-nums">
              <Star className="w-3.5 h-3.5 fill-[#f9735b] text-[#f9735b]" />
              {Number(movie.rating).toFixed(1)}
              <span className="text-zinc-500 font-normal">
                ({(movie.voteCount / 1000).toFixed(0)}k)
              </span>
            </span>
          </div>

          {/* Headline with Balanced Text */}
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-[0.94] tracking-[-0.055em] text-white mb-5 font-display drop-shadow-2xl"
            style={{ textWrap: 'balance' }}
          >
            {movie.title}
          </h1>

          {/* Editorial Tagline */}
          {movie.tagline && (
            <p className="text-sm sm:text-base text-[#ff9a86] mb-4 font-semibold tracking-wide">
              "{movie.tagline}"
            </p>
          )}

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-zinc-300/90 leading-7 mb-8 max-w-xl line-clamp-3">
            {movie.synopsis}
          </p>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Action: Watch Trailer */}
            <button
              onClick={() => openTrailer(movie)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#f9735b] hover:bg-[#ff846d] text-white font-bold text-sm transition-all shadow-xl shadow-[#f9735b]/20 active:scale-95 cursor-pointer whitespace-nowrap group"
            >
              <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
              <span>Watch Trailer</span>
              <span className="text-xs opacity-75 font-mono ml-1">({movie.trailerDuration})</span>
            </button>

            {/* Rate Film Button */}
            <button
              onClick={() => openRatingModal(movie)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-full border font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
                userRating && userRating.score > 0
                  ? 'bg-[#f9735b]/15 border-[#f9735b]/50 text-[#ff9a86] hover:bg-[#f9735b]/25'
                  : 'bg-white/10 backdrop-blur-md border-white/15 text-white hover:bg-white/15'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  userRating && userRating.score > 0
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-zinc-400'
                }`}
              />
              <span>
                {userRating && userRating.score > 0
                  ? `Your Rating: ${userRating.score}/10`
                  : 'Rate Film'}
              </span>
            </button>

            {/* Watchlist Toggle */}
            <button
              onClick={() => toggleWatchlist(movie.id)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-full border font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
                userRating?.inWatchlist
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80'
              }`}
            >
              {userRating?.inWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-zinc-400" />
                  <span>Watchlist</span>
                </>
              )}
            </button>

            {/* More Details Modal Button */}
            <button
              onClick={() => openDetails(movie)}
              className="flex items-center justify-center p-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-zinc-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="More film information & cast"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
