import React, { useState, useMemo } from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { Star, Heart, Bookmark, Play, Edit3, Trash2, Share2, Film, Sparkles, Check } from 'lucide-react';

export const MyRatingsView = () => {
  const {
    myRatedMovies,
    averageUserScore,
    watchlistMovies,
    favoriteMovies,
    openRatingModal,
    openTrailer,
    removeRating,
  } = useMovies();

  const [filterType, setFilterType] = useState('all');
  const [copiedShare, setCopiedShare] = useState(false);

  // Score distribution calculation (10, 9, 8, 7, 6, <=5)
  const scoreDistribution = useMemo(() => {
    const buckets = { 10: 0, 9: 0, 8: 0, 7: 0, 6: 0, lower: 0 };
    myRatedMovies.forEach(({ userRating }) => {
      const s = Math.floor(userRating.score);
      if (s === 10) buckets[10]++;
      else if (s === 9) buckets[9]++;
      else if (s === 8) buckets[8]++;
      else if (s === 7) buckets[7]++;
      else if (s === 6) buckets[6]++;
      else buckets.lower++;
    });
    return buckets;
  }, [myRatedMovies]);

  // Filtered rated list
  const filteredList = useMemo(() => {
    return myRatedMovies.filter(({ userRating }) => {
      if (filterType === 'masterpieces') return userRating.score >= 9.0;
      if (filterType === 'favorites') return userRating.isFavorite;
      if (filterType === 'reviews') return userRating.review && userRating.review.trim().length > 0;
      return true;
    });
  }, [myRatedMovies, filterType]);

  // Handle export & share
  const handleShareSummary = () => {
    const summary = [
      `🎬 CineSphere Film Diary`,
      `Total Films Rated: ${myRatedMovies.length} | Avg Score: ${averageUserScore}/10`,
      `Favorites: ${favoriteMovies.length} | Watchlist: ${watchlistMovies.length}`,
      ``,
      `Top Rated Cinema:`,
      ...myRatedMovies
        .slice(0, 5)
        .map(({ movie, userRating }) => `• ${movie.title} (${movie.year}): ${userRating.score}/10★`),
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Personal Film Diary
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            My Rated Movies
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Track your personal scores, critiques, and favorite cinematic moments.
          </p>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShareSummary}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-colors cursor-pointer self-start md:self-auto"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied Summary!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Diary Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Quantitative Stats Matrix (Adheres to Section 1.D Tabular Figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-500 font-medium block">Films Rated</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
            {myRatedMovies.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-500 font-medium block">Your Avg Score</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400" />
            <span>{averageUserScore > 0 ? averageUserScore : '—'}</span>
            <span className="text-xs text-zinc-500 font-normal">/ 10</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-500 font-medium block">Favorites</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums mt-1 flex items-center gap-1">
            <Heart className="w-5 h-5 fill-rose-500" />
            <span>{favoriteMovies.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-500 font-medium block">In Watchlist</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1 flex items-center gap-1">
            <Bookmark className="w-5 h-5" />
            <span>{watchlistMovies.length}</span>
          </div>
        </div>
      </div>

      {/* Score Distribution Breakdown Bar */}
      {myRatedMovies.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Your Score Distribution
          </h4>
          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            {[
              { label: '10★', count: scoreDistribution[10] },
              { label: '9★', count: scoreDistribution[9] },
              { label: '8★', count: scoreDistribution[8] },
              { label: '7★', count: scoreDistribution[7] },
              { label: '6★', count: scoreDistribution[6] },
              { label: '≤5★', count: scoreDistribution.lower },
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="font-mono text-zinc-400 text-[11px] mb-1">{col.label}</span>
                <div className="w-full bg-zinc-800 h-16 rounded flex items-end p-1 justify-center">
                  <div
                    style={{
                      height: `${myRatedMovies.length ? Math.max((col.count / myRatedMovies.length) * 100, 8) : 8}%`,
                    }}
                    className={`w-full rounded-sm transition-all ${
                      col.count > 0 ? 'bg-amber-400' : 'bg-zinc-700/40'
                    }`}
                  />
                </div>
                <span className="font-mono font-bold text-zinc-200 mt-1 tabular-nums">
                  {col.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs for Rated Movies (Segmented Controls) */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 w-fit">
        {[
          { id: 'all', label: `All Rated (${myRatedMovies.length})` },
          { id: 'masterpieces', label: 'Masterpieces (9.0+)' },
          { id: 'favorites', label: `Favorites (${favoriteMovies.length})` },
          { id: 'reviews', label: 'Written Reviews' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterType === tab.id
                ? 'bg-amber-500/15 text-amber-300 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rated Movie Cards List */}
      {filteredList.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 rounded-xl border border-dashed border-zinc-800">
          <Film className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No rated films match this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map(({ movie, userRating }) => (
            <div
              key={movie.id}
              className="p-4 sm:p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start transition-colors"
            >
              {/* Poster */}
              <div
                onClick={() => openTrailer(movie)}
                className="relative w-20 sm:w-24 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-950 shrink-0 cursor-pointer group"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
              </div>

              {/* Review & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      {movie.title}
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono">({movie.year})</span>
                    {userRating.isFavorite && (
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    )}
                  </div>

                  {/* Rating Tag */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm tabular-nums">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{userRating.score} / 10</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                  <span>Dir. {movie.director}</span>
                  <span aria-hidden="true">·</span>
                  <span>{movie.genres?.join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>Rated on {userRating.ratedAt}</span>
                </div>

                {/* Written Review */}
                {userRating.review ? (
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60 mb-3">
                    "{userRating.review}"
                  </p>
                ) : (
                  <p className="text-xs text-zinc-500 italic mb-3">
                    No written critique added yet.
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => openTrailer(movie)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch Trailer</span>
                  </button>

                  <span className="text-zinc-700">|</span>

                  <button
                    onClick={() => openRatingModal(movie)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Rating</span>
                  </button>

                  <span className="text-zinc-700">|</span>

                  <button
                    onClick={() => removeRating(movie.id)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
