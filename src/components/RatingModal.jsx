import React, { useState, useEffect } from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { X, Star, Heart, Trash2, Check, Sparkles } from 'lucide-react';

const SCORE_LABELS = {
  10: 'Masterpiece',
  9: 'Incredible',
  8: 'Great',
  7: 'Good',
  6: 'Decent',
  5: 'Average',
  4: 'Below Average',
  3: 'Poor',
  2: 'Terrible',
  1: 'Unwatchable',
};

export const RatingModal = () => {
  const { ratingMovie, closeRatingModal, rateMovie, removeRating, getUserRating, toggleFavorite } =
    useMovies();

  const [score, setScore] = useState(8);
  const [hoverScore, setHoverScore] = useState(0);
  const [review, setReview] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (ratingMovie) {
      const existing = getUserRating(ratingMovie.id);
      if (existing && existing.score > 0) {
        setScore(existing.score);
        setReview(existing.review || '');
        setIsFavorite(existing.isFavorite || false);
      } else {
        setScore(8);
        setReview('');
        setIsFavorite(false);
      }
    }
  }, [ratingMovie, getUserRating]);

  if (!ratingMovie) return null;

  const existingRating = getUserRating(ratingMovie.id);
  const displayScore = hoverScore || score;

  const handleSubmit = (e) => {
    e.preventDefault();
    rateMovie(ratingMovie.id, score, review);
    if (isFavorite !== existingRating?.isFavorite) {
      toggleFavorite(ratingMovie.id);
    }
    closeRatingModal();
  };

  const handleDelete = () => {
    removeRating(ratingMovie.id);
    closeRatingModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0e111a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Rate & Review
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-[280px]">
                {ratingMovie.title} ({ratingMovie.year})
              </p>
            </div>
          </div>

          <button
            onClick={closeRatingModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {/* Rating Stars Selector */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onMouseEnter={() => setHoverScore(num)}
                  onMouseLeave={() => setHoverScore(0)}
                  onClick={() => setScore(num)}
                  className="p-1 text-zinc-700 hover:text-amber-400 hover:scale-125 transition-all cursor-pointer"
                >
                  <Star
                    className={`w-5 sm:w-6 h-5 sm:h-6 ${
                      num <= displayScore
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Score & Verbal Feedback */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
                {displayScore}
              </span>
              <span className="text-sm font-semibold text-zinc-300">
                / 10 — {SCORE_LABELS[Math.round(displayScore)] || 'Good'}
              </span>
            </div>
          </div>

          {/* Written Critique / Review */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Your Review & Reflections (Optional)
            </label>
            <textarea
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What made this film special? Outstanding cinematography, pacing, memorable dialogue..."
              className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-colors"
            />
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'
                }`}
              />
              <span className="text-xs text-zinc-200 font-medium">Add to Favorites List</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`px-3 py-1 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              {isFavorite ? 'Favorited' : 'No'}
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            {existingRating && existingRating.score > 0 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Rating</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeRatingModal}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Save Rating
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
