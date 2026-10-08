import express from 'express';
import {
  getMovies,
  getMovieById,
  getRatings,
  saveRating,
  deleteRating,
  toggleWatchlist,
  toggleFavorite,
  getDatabaseStatus,
} from './db.js';

export const apiRouter = express.Router();

apiRouter.use(express.json());

// GET /api/movies
apiRouter.get('/movies', async (req, res) => {
  try {
    const { search, genre, minRating, sort } = req.query;
    let list = await getMovies();

    if (genre && genre !== 'All') {
      list = list.filter((m) => m.genres.includes(genre));
    }

    if (minRating) {
      const numMin = parseFloat(minRating);
      if (!isNaN(numMin) && numMin > 0) {
        list = list.filter((m) => m.rating >= numMin);
      }
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.name.toLowerCase().includes(q)) ||
          m.synopsis.toLowerCase().includes(q)
      );
    }

    if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      list.sort((a, b) => b.year - a.year);
    } else if (sort === 'popular') {
      list.sort((a, b) => b.voteCount - a.voteCount);
    } else if (sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/movies/:id
apiRouter.get('/movies/:id', async (req, res) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ratings
apiRouter.get('/ratings', async (req, res) => {
  try {
    const ratings = await getRatings();
    res.json({ success: true, data: ratings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ratings
apiRouter.post('/ratings', async (req, res) => {
  try {
    const { movieId, score, review, isFavorite, inWatchlist, watched } = req.body;
    if (!movieId || score === undefined) {
      return res.status(400).json({ success: false, error: 'movieId and score are required' });
    }

    const saved = await saveRating({
      movieId,
      score: parseFloat(score),
      review: review || '',
      isFavorite: Boolean(isFavorite),
      inWatchlist: Boolean(inWatchlist),
      watched: watched !== undefined ? Boolean(watched) : true,
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/ratings/:movieId
apiRouter.delete('/ratings/:movieId', async (req, res) => {
  try {
    const ok = await deleteRating(req.params.movieId);
    res.json({ success: true, removed: ok });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/watchlist/toggle
apiRouter.post('/watchlist/toggle', async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ success: false, error: 'movieId required' });
    }
    const updated = await toggleWatchlist(movieId);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/favorites/toggle
apiRouter.post('/favorites/toggle', async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ success: false, error: 'movieId required' });
    }
    const updated = await toggleFavorite(movieId);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/trailers
apiRouter.get('/trailers', async (req, res) => {
  try {
    const movies = await getMovies();
    const trailers = movies.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      director: m.director,
      genres: m.genres,
      rating: m.rating,
      trailerYoutubeId: m.trailerYoutubeId,
      trailerDuration: m.trailerDuration,
      posterUrl: m.posterUrl,
      backdropUrl: m.backdropUrl,
    }));
    res.json({ success: true, data: trailers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/db-status
apiRouter.get('/db-status', (req, res) => {
  const status = getDatabaseStatus();
  res.json({ success: true, status });
});
