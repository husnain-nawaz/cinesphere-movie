import React, { useEffect, useState } from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { X, Star, Heart, Plus, Check, Play, Maximize2, Sparkles } from 'lucide-react';

export const TrailerModal = () => {
  const {
    trailerMovie,
    closeTrailer,
    movies,
    openTrailer,
    rateMovie,
    getUserRating,
    toggleWatchlist,
    toggleFavorite,
  } = useMovies();

  const [hoverRating, setHoverRating] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeTrailer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeTrailer]);

  if (!trailerMovie) return null;

  const userRating = getUserRating(trailerMovie.id);
  const currentScore = userRating?.score || 0;

  // Next recommended trailers (excluding current)
  const nextTrailers = movies
    .filter((m) => m.id !== trailerMovie.id)
    .slice(0, 5);

  const handleQuickRate = (score) => {
    rateMovie(trailerMovie.id, score);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Ambient Theater Backlight Glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-500/10 via-transparent to-black/80" />

      <div className="relative w-full max-w-5xl bg-[#0d0f17] border border-zinc-800 rounded-2xl shadow-2xl shadow-black overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
              Official Trailer
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate font-display">
              {trailerMovie.title}
            </h2>
            <span className="text-xs text-zinc-500 font-mono">({trailerMovie.year})</span>
          </div>

          <button
            onClick={closeTrailer}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close trailer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 16:9 Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailerMovie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${trailerMovie.title} Official Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Beneath Video: Interactive Rating & Movie Quick Summary */}
        <div className="p-4 sm:p-6 space-y-5 bg-[#0d0f17]">
          {/* Quick Rate Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Your Rating
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleQuickRate(star)}
                    className="p-1 -m-0.5 text-zinc-600 hover:scale-125 transition-transform cursor-pointer"
                    title={`Rate ${star}/10`}
                  >
                    <Star
                      className={`w-4 sm:w-5 h-4 sm:h-5 ${
                        star <= (hoverRating || currentScore)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs sm:text-sm font-mono font-bold text-amber-400 tabular-nums">
                  {(hoverRating || currentScore) > 0
                    ? `${hoverRating || currentScore}/10`
                    : 'Tap to rate'}
                </span>
              </div>
            </div>

            {/* Quick Actions (Watchlist & Favorite) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => toggleWatchlist(trailerMovie.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  userRating?.inWatchlist
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {userRating?.inWatchlist ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Watchlist</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleFavorite(trailerMovie.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  userRating?.isFavorite
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    userRating?.isFavorite ? 'fill-current text-rose-400' : ''
                  }`}
                />
                <span>Favorite</span>
              </button>
            </div>
          </div>

          {/* Film Synopsis & Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
              <span>Directed by <strong className="text-zinc-200">{trailerMovie.director}</strong></span>
              <span aria-hidden="true">·</span>
              <span>{trailerMovie.genres?.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span>{trailerMovie.runtime} mins</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300/80 leading-relaxed line-clamp-2">
              {trailerMovie.synopsis}
            </p>
          </div>

          {/* Up Next Trailers Row */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2.5">
              Up Next in Cinema
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {nextTrailers.map((next) => (
                <div
                  key={next.id}
                  onClick={() => openTrailer(next)}
                  className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/60 cursor-pointer hover:border-amber-500/50 transition-colors"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-950 relative">
                    <img
                      src={next.backdropUrl || next.posterUrl}
                      alt={next.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-7 h-7 rounded-full bg-amber-400 text-black flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-[11px] font-semibold text-zinc-200 truncate group-hover:text-amber-400 transition-colors">
                      {next.title}
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {next.year} · ★ {next.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
