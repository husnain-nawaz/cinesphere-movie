import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { Play, Star, Plus, Check, Heart, Film } from 'lucide-react';

export const MovieCard = ({ movie }) => {
  const {
    openTrailer,
    openDetails,
    openRatingModal,
    toggleWatchlist,
    toggleFavorite,
    getUserRating,
  } = useMovies();

  const [imgError, setImgError] = useState(false);
  const userRating = getUserRating(movie.id);

  const formatRuntime = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <article className="group relative flex flex-col transition-all duration-300 hover:-translate-y-1.5">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950 rounded-2xl cinema-poster-shadow ring-1 ring-white/[0.07] group-hover:ring-[#f9735b]/40 transition-all">
        {!imgError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-500">
            <Film className="w-10 h-10 mb-2 text-zinc-600" />
            <span className="text-xs font-medium text-zinc-400">{movie.title}</span>
            <span className="text-[10px] text-zinc-600 mt-1">{movie.year}</span>
          </div>
        )}

        {/* Top Floating Actions (Favorite & Watchlist) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Favorite heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(movie.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              userRating?.isFavorite
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-white/10'
            }`}
            title={userRating?.isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
          >
            <Heart className={`w-3.5 h-3.5 ${userRating?.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Watchlist toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              userRating?.inWatchlist
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-white/10'
            }`}
            title={userRating?.inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          >
            {userRating?.inWatchlist ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Hover Center Play Trailer Button */}
        <div
          onClick={() => openTrailer(movie)}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer p-4 text-center"
        >
          <div className="w-13 h-13 rounded-full bg-[#f9735b] text-white flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform mb-2">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">Watch Trailer</span>
          <span className="text-[11px] text-zinc-400 font-mono mt-0.5">({movie.trailerDuration})</span>
        </div>

        {/* Bottom Poster Gradient Scrim */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-transparent pointer-events-none" />

        {/* Score Badges at bottom of poster */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono font-semibold tabular-nums">
            <Star className="w-3 h-3 fill-[#f9735b] text-[#f9735b]" />
            <span>{Number(movie.rating).toFixed(1)}</span>
          </div>

          {/* User Score if rated */}
          {userRating && userRating.score > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-[11px] font-semibold tabular-nums">
              <span>You: {userRating.score}★</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Info Details */}
      <div className="px-1 pt-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
            <span className="font-medium text-zinc-300">{movie.year}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="truncate max-w-[90px]">{movie.genres?.[0]}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => openDetails(movie)}
            className="text-[15px] font-bold text-zinc-100 hover:text-[#ff836c] transition-colors line-clamp-1 cursor-pointer"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Director */}
          <p className="text-xs text-zinc-500 truncate mt-0.5">
            Dir. {movie.director}
          </p>
        </div>

        {/* Interactive Action Row */}
        <div className="mt-3 flex items-center justify-between gap-1 text-xs">
          <button
            onClick={() => openRatingModal(movie)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              userRating && userRating.score > 0
                ? 'text-[#ff9a86] bg-[#f9735b]/10 hover:bg-[#f9735b]/20'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Star
              className={`w-3 h-3 ${
                userRating && userRating.score > 0 ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
            <span>{userRating && userRating.score > 0 ? `${userRating.score}/10` : 'Rate'}</span>
          </button>

          <button
            onClick={() => openDetails(movie)}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-zinc-800/40"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
};
