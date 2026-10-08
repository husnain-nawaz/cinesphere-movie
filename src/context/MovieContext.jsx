import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const MovieContext = createContext(null);

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Database status
  const [dbStatus, setDbStatus] = useState(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [minRating, setMinRating] = useState(0);

  // Active Modals
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [detailsMovie, setDetailsMovie] = useState(null);
  const [ratingMovie, setRatingMovie] = useState(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  // Fetch initial data from Express backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch movies
      const moviesRes = await fetch('/api/movies');
      const moviesJson = await moviesRes.json();
      if (moviesJson.success) {
        setMovies(moviesJson.data);
      }

      // 2. Fetch user ratings
      const ratingsRes = await fetch('/api/ratings');
      const ratingsJson = await ratingsRes.json();
      if (ratingsJson.success) {
        setUserRatings(ratingsJson.data);
      }

      // 3. Fetch DB status
      const statusRes = await fetch('/api/db-status');
      const statusJson = await statusRes.json();
      if (statusJson.success) {
        setDbStatus(statusJson.status);
      }
    } catch (err) {
      console.error('Error fetching data from Express API:', err);
      setError('Failed to connect to Express backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Rate a movie (optimistic update + Express POST /api/ratings)
  const rateMovie = async (movieId, score, review = '') => {
    const previous = userRatings[movieId];
    const updatedRating = {
      movieId,
      score: parseFloat(score),
      review,
      isFavorite: previous?.isFavorite ?? false,
      inWatchlist: false,
      watched: true,
      ratedAt: new Date().toISOString().split('T')[0],
    };

    // Optimistic UI update
    setUserRatings((prev) => ({
      ...prev,
      [movieId]: updatedRating,
    }));

    showToast(`Rated ${score}/10! Saved to database.`);

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRating),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Failed to persist rating to Express backend:', err);
      showToast('Notice: Rating saved in local session.');
    }
  };

  // Remove rating
  const removeRating = async (movieId) => {
    setUserRatings((prev) => {
      const copy = { ...prev };
      delete copy[movieId];
      return copy;
    });

    showToast('Rating removed.');

    try {
      await fetch(`/api/ratings/${movieId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to remove rating on backend:', err);
    }
  };

  // Toggle watchlist
  const toggleWatchlist = async (movieId) => {
    const current = userRatings[movieId]?.inWatchlist;
    const nextState = !current;

    setUserRatings((prev) => ({
      ...prev,
      [movieId]: {
        ...(prev[movieId] || {
          movieId,
          score: 0,
          ratedAt: new Date().toISOString().split('T')[0],
          isFavorite: false,
        }),
        inWatchlist: nextState,
      },
    }));

    showToast(nextState ? 'Added to your Watchlist' : 'Removed from Watchlist');

    try {
      await fetch('/api/watchlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }),
      });
    } catch (err) {
      console.error('Failed to toggle watchlist on backend:', err);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (movieId) => {
    const current = userRatings[movieId]?.isFavorite;
    const nextState = !current;

    setUserRatings((prev) => ({
      ...prev,
      [movieId]: {
        ...(prev[movieId] || {
          movieId,
          score: 0,
          ratedAt: new Date().toISOString().split('T')[0],
          inWatchlist: false,
        }),
        isFavorite: nextState,
      },
    }));

    showToast(nextState ? 'Added to Favorites ❤️' : 'Removed from Favorites');

    try {
      await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }),
      });
    } catch (err) {
      console.error('Failed to toggle favorite on backend:', err);
    }
  };

  const getUserRating = (movieId) => userRatings[movieId];

  const resetFilters = () => {
    setSelectedGenre('All');
    setSearchQuery('');
    setSortBy('popular');
    setMinRating(0);
  };

  const openTrailer = (movie) => setTrailerMovie(movie);
  const closeTrailer = () => setTrailerMovie(null);
  const openDetails = (movie) => setDetailsMovie(movie);
  const closeDetails = () => setDetailsMovie(null);
  const openRatingModal = (movie) => setRatingMovie(movie);
  const closeRatingModal = () => setRatingMovie(null);

  // Computed & Filtered list
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        if (selectedGenre !== 'All' && !movie.genres?.includes(selectedGenre)) {
          return false;
        }

        if (minRating > 0 && movie.rating < minRating) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = movie.title.toLowerCase().includes(q);
          const matchesDirector = movie.director.toLowerCase().includes(q);
          const matchesGenre = movie.genres?.some((g) => g.toLowerCase().includes(q));
          const matchesCast = movie.cast?.some((c) => c.name.toLowerCase().includes(q));
          const matchesSynopsis = movie.synopsis.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDirector && !matchesGenre && !matchesCast && !matchesSynopsis) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.year - a.year;
        if (sortBy === 'popular') return b.voteCount - a.voteCount;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'userRating') {
          const rA = userRatings[a.id]?.score || 0;
          const rB = userRatings[b.id]?.score || 0;
          return rB - rA;
        }
        return 0;
      });
  }, [movies, selectedGenre, minRating, searchQuery, sortBy, userRatings]);

  const topRatedMovies = useMemo(() => {
    return [...movies].sort((a, b) => b.rating - a.rating);
  }, [movies]);

  const myRatedMovies = useMemo(() => {
    const list = [];
    for (const [id, r] of Object.entries(userRatings)) {
      if (r && r.score > 0) {
        const found = movies.find((m) => m.id === id);
        if (found) {
          list.push({ movie: found, userRating: r });
        }
      }
    }
    return list.sort((a, b) => b.userRating.score - a.userRating.score);
  }, [movies, userRatings]);

  const watchlistMovies = useMemo(() => {
    return movies.filter((m) => userRatings[m.id]?.inWatchlist);
  }, [movies, userRatings]);

  const favoriteMovies = useMemo(() => {
    return movies.filter((m) => userRatings[m.id]?.isFavorite);
  }, [movies, userRatings]);

  const averageUserScore = useMemo(() => {
    const rated = Object.values(userRatings).filter((r) => r.score > 0);
    if (rated.length === 0) return 0;
    const sum = rated.reduce((acc, r) => acc + r.score, 0);
    return parseFloat((sum / rated.length).toFixed(1));
  }, [userRatings]);

  return (
    <MovieContext.Provider
      value={{
        movies,
        userRatings,
        loading,
        error,
        dbStatus,
        isDbModalOpen,
        setIsDbModalOpen,
        toastMessage,
        rateMovie,
        removeRating,
        toggleWatchlist,
        toggleFavorite,
        getUserRating,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
        minRating,
        setMinRating,
        resetFilters,
        trailerMovie,
        openTrailer,
        closeTrailer,
        detailsMovie,
        openDetails,
        closeDetails,
        ratingMovie,
        openRatingModal,
        closeRatingModal,
        filteredMovies,
        topRatedMovies,
        myRatedMovies,
        watchlistMovies,
        favoriteMovies,
        averageUserScore,
        refreshData: fetchData,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within MovieProvider');
  }
  return context;
};
