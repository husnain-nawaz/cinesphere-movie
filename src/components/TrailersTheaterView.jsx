import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { Play, Star, Plus, Check, Heart, Film, Sparkles, Volume2, Monitor } from 'lucide-react';

export const TrailersTheaterView = () => {
  const { movies, rateMovie, getUserRating, toggleWatchlist, toggleFavorite, openRatingModal } =
    useMovies();

  const [activeMovieId, setActiveMovieId] = useState(movies[0]?.id || '');
  const [theaterLighting, setTheaterLighting] = useState(true);

  const activeMovie = movies.find((m) => m.id === activeMovieId) || movies[0];
  const userRating = activeMovie ? getUserRating(activeMovie.id) : null;

  if (!activeMovie) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No trailers available.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${theaterLighting ? 'cinema-backdrop-gradient' : ''}`}>
      {/* Theater Header & Lighting Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Trailers Theater
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            The Cinema Screening Room
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Watch official cinema trailers in high-definition and log your ratings live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Ambient Lighting Toggle */}
          <button
            onClick={() => setTheaterLighting(!theaterLighting)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              theaterLighting
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Theater Atmosphere: {theaterLighting ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Theater Stage (Video Player + Live Interactive Controller) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Center 2 Cols: 16:9 Video Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-2xl shadow-black">
            <iframe
              key={activeMovie.trailerYoutubeId}
              src={`https://www.youtube-nocookie.com/embed/${activeMovie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${activeMovie.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Under-Player Metadata & Live Rating */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
                <span className="font-semibold text-zinc-300">{activeMovie.year}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-zinc-300">{activeMovie.genres?.join(', ')}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>Dir. {activeMovie.director}</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                {activeMovie.title}
              </h3>
            </div>

            {/* Quick Rating Widget */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openRatingModal(activeMovie)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  userRating?.score > 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-amber-400 hover:bg-amber-300 text-black'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    userRating?.score > 0 ? 'fill-amber-400 text-amber-400' : 'fill-current'
                  }`}
                />
                <span>
                  {userRating?.score > 0 ? `Your Rating: ${userRating.score}/10` : 'Rate Movie'}
                </span>
              </button>

              <button
                onClick={() => toggleWatchlist(activeMovie.id)}
                className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                  userRating?.inWatchlist
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
                title="Toggle Watchlist"
              >
                {userRating?.inWatchlist ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => toggleFavorite(activeMovie.id)}
                className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                  userRating?.isFavorite
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
                title="Toggle Favorite"
              >
                <Heart
                  className={`w-4 h-4 ${
                    userRating?.isFavorite ? 'fill-current text-rose-400' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Trailer Playlist Queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Trailer Queue ({movies.length})
            </h4>
            <span className="text-[11px] text-zinc-500 font-mono">Select to Play</span>
          </div>

          <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {movies.map((m) => {
              const isSelected = m.id === activeMovieId;
              const r = getUserRating(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMovieId(m.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-800/40 hover:border-zinc-700'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden bg-zinc-950 shrink-0">
                    <img
                      src={m.backdropUrl || m.posterUrl}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-amber-500/20' : 'bg-black/30'
                      }`}
                    >
                      <Play
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'fill-amber-400 text-amber-400' : 'fill-white text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-amber-300' : 'text-zinc-200'
                      }`}
                    >
                      {m.title}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                      <span>{m.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{m.trailerDuration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400 font-mono">★ {m.rating}</span>
                    </div>
                    {r && r.score > 0 && (
                      <span className="text-[10px] text-amber-300 font-mono block mt-0.5">
                        Your rating: {r.score}★
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
