import React from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { X, Play, Star, Plus, Check, Heart, Trophy, Clock, Film } from 'lucide-react';

export const MovieDetailsModal = () => {
  const {
    detailsMovie,
    closeDetails,
    openTrailer,
    openRatingModal,
    toggleWatchlist,
    toggleFavorite,
    getUserRating,
  } = useMovies();

  if (!detailsMovie) return null;

  const userRating = getUserRating(detailsMovie.id);

  const formatRuntime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d0f17] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={closeDetails}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full overflow-hidden bg-zinc-950">
          <img
            src={detailsMovie.backdropUrl || detailsMovie.posterUrl}
            alt={detailsMovie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-[#0d0f17]/60 to-transparent" />

          {/* Quick Play Trailer Overlay Button */}
          <button
            onClick={() => {
              closeDetails();
              openTrailer(detailsMovie);
            }}
            className="absolute bottom-5 right-5 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors shadow-lg cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Trailer ({detailsMovie.trailerDuration})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 -mt-16 sm:-mt-20 relative z-20">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            {/* Poster Thumbnail */}
            <div className="w-32 sm:w-44 shrink-0 rounded-xl overflow-hidden border-2 border-zinc-700/80 shadow-2xl bg-zinc-950 aspect-[2/3] hidden sm:block">
              <img
                src={detailsMovie.posterUrl}
                alt={detailsMovie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Main Info */}
            <div className="flex-1">
              {/* Unboxed Metadata (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-amber-400 mb-2">
                <span className="font-semibold text-zinc-300">{detailsMovie.year}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-zinc-300">{formatRuntime(detailsMovie.runtime)}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-zinc-300">{detailsMovie.genres?.join(' / ')}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-zinc-400">{detailsMovie.ageRating}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-display">
                {detailsMovie.title}
              </h2>

              {detailsMovie.tagline && (
                <p className="text-xs sm:text-sm text-zinc-400 italic mb-4 font-serif">
                  "{detailsMovie.tagline}"
                </p>
              )}

              {/* Score Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    CineSphere
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-base font-bold text-amber-400 font-mono">
                      {Number(detailsMovie.rating).toFixed(1)}
                    </span>
                    <span className="text-[11px] text-zinc-500">/ 10</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    Your Rating
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star
                      className={`w-3.5 h-3.5 ${
                        userRating?.score > 0
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-600'
                      }`}
                    />
                    <span
                      className={`text-base font-bold font-mono ${
                        userRating?.score > 0 ? 'text-amber-400' : 'text-zinc-500'
                      }`}
                    >
                      {userRating?.score > 0 ? `${userRating.score}/10` : 'Not Rated'}
                    </span>
                  </div>
                </div>

                {detailsMovie.criticScore && (
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                      Critics Score
                    </span>
                    <span className="text-base font-bold text-zinc-200 font-mono mt-0.5 block">
                      {detailsMovie.criticScore}%
                    </span>
                  </div>
                )}

                {detailsMovie.boxOffice && (
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                      Box Office
                    </span>
                    <span className="text-base font-bold text-zinc-200 font-mono mt-0.5 block">
                      {detailsMovie.boxOffice}
                    </span>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              <div className="my-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Synopsis
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {detailsMovie.synopsis}
                </p>
              </div>

              {/* Cast & Crew */}
              <div className="my-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Director & Principal Cast
                </h4>
                <div className="text-xs text-zinc-300 space-y-1">
                  <p>
                    <span className="text-zinc-500">Director:</span>{' '}
                    <strong className="text-zinc-200">{detailsMovie.director}</strong>
                  </p>
                  {detailsMovie.cast && detailsMovie.cast.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {detailsMovie.cast.map((actor, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded bg-zinc-800/80 text-[11px] text-zinc-300 border border-zinc-700/60"
                        >
                          <strong className="text-white">{actor.name}</strong> as {actor.role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Awards if present */}
              {detailsMovie.awards && detailsMovie.awards.length > 0 && (
                <div className="my-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Accolades & Recognition</span>
                  </div>
                  <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-0.5">
                    {detailsMovie.awards.map((award, i) => (
                      <li key={i}>{award}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* User review snippet if existing */}
              {userRating?.review && (
                <div className="my-4 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] uppercase font-semibold text-amber-400 block mb-1">
                    Your Review Notes
                  </span>
                  <p className="text-xs text-zinc-300 italic">"{userRating.review}"</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => openRatingModal(detailsMovie)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{userRating?.score > 0 ? 'Edit Your Rating' : 'Rate This Film'}</span>
                </button>

                <button
                  onClick={() => toggleWatchlist(detailsMovie.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
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
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleFavorite(detailsMovie.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
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
          </div>
        </div>
      </div>
    </div>
  );
};
