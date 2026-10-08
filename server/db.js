import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Default configuration with environment variables
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'cinesphere_db',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isConnectedToMySQL = false;
let dbStatusMessage = 'Initializing database...';

// File-based fallback path for persistent storage when MySQL daemon is not running locally
const FALLBACK_DB_FILE = path.resolve(process.cwd(), '.data_cinesphere.json');

// Initial seed movie data
import { SEED_MOVIES, INITIAL_SEED_RATINGS } from './seedData.js';

class StorageFallback {
  constructor() {
    this.data = {
      movies: [...SEED_MOVIES],
      ratings: { ...INITIAL_SEED_RATINGS },
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(FALLBACK_DB_FILE)) {
        const raw = fs.readFileSync(FALLBACK_DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.movies && parsed.ratings) {
          this.data = parsed;
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.warn('Could not load fallback file, using memory storage:', e.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(FALLBACK_DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write fallback file:', e.message);
    }
  }

  getMovies() {
    return this.data.movies;
  }

  getMovieById(id) {
    return this.data.movies.find((m) => m.id === id) || null;
  }

  getRatings() {
    return this.data.ratings;
  }

  saveRating(rating) {
    this.data.ratings[rating.movieId] = {
      ...this.data.ratings[rating.movieId],
      ...rating,
      ratedAt: rating.ratedAt || new Date().toISOString().split('T')[0],
    };
    this.save();
    return this.data.ratings[rating.movieId];
  }

  deleteRating(movieId) {
    if (this.data.ratings[movieId]) {
      delete this.data.ratings[movieId];
      this.save();
      return true;
    }
    return false;
  }

  toggleWatchlist(movieId) {
    const existing = this.data.ratings[movieId] || {
      movieId,
      score: 0,
      ratedAt: new Date().toISOString().split('T')[0],
      inWatchlist: false,
      isFavorite: false,
    };
    existing.inWatchlist = !existing.inWatchlist;
    this.data.ratings[movieId] = existing;
    this.save();
    return existing;
  }

  toggleFavorite(movieId) {
    const existing = this.data.ratings[movieId] || {
      movieId,
      score: 0,
      ratedAt: new Date().toISOString().split('T')[0],
      inWatchlist: false,
      isFavorite: false,
    };
    existing.isFavorite = !existing.isFavorite;
    this.data.ratings[movieId] = existing;
    this.save();
    return existing;
  }
}

const fallbackStorage = new StorageFallback();

export async function initDatabase() {
  try {
    // Attempt connecting to MySQL server
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    await conn.ping();

    // Create database if not exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await conn.query(`USE \`${dbConfig.database}\`;`);

    // Create movies table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        year INT NOT NULL,
        release_date VARCHAR(50),
        runtime INT NOT NULL,
        age_rating VARCHAR(20),
        director VARCHAR(100),
        cast_json TEXT,
        synopsis TEXT,
        rating DECIMAL(3, 1) DEFAULT 0,
        vote_count INT DEFAULT 0,
        critic_score INT,
        audience_score INT,
        trailer_youtube_id VARCHAR(50),
        trailer_duration VARCHAR(20),
        poster_url TEXT,
        backdrop_url TEXT,
        genres_json TEXT,
        awards_json TEXT,
        quote TEXT,
        box_office VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create ratings table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id VARCHAR(100) NOT NULL UNIQUE,
        score DECIMAL(3, 1) DEFAULT 0,
        review TEXT,
        is_favorite BOOLEAN DEFAULT FALSE,
        in_watchlist BOOLEAN DEFAULT FALSE,
        watched BOOLEAN DEFAULT TRUE,
        rated_at VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_movie (movie_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed movies if table is empty
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM movies');
    if (rows[0].count === 0) {
      console.log('Seeding initial movies into MySQL database...');
      for (const m of SEED_MOVIES) {
        await conn.query(
          `INSERT INTO movies (
            id, title, tagline, year, release_date, runtime, age_rating,
            director, cast_json, synopsis, rating, vote_count, critic_score,
            audience_score, trailer_youtube_id, trailer_duration, poster_url,
            backdrop_url, genres_json, awards_json, quote, box_office
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            m.id,
            m.title,
            m.tagline,
            m.year,
            m.releaseDate,
            m.runtime,
            m.ageRating,
            m.director,
            JSON.stringify(m.cast),
            m.synopsis,
            m.rating,
            m.voteCount,
            m.criticScore,
            m.audienceScore,
            m.trailerYoutubeId,
            m.trailerDuration,
            m.posterUrl,
            m.backdropUrl,
            JSON.stringify(m.genres),
            JSON.stringify(m.awards || []),
            m.quote,
            m.boxOffice,
          ]
        );
      }

      // Seed ratings
      for (const [movieId, r] of Object.entries(INITIAL_SEED_RATINGS)) {
        await conn.query(
          `INSERT INTO ratings (movie_id, score, review, is_favorite, in_watchlist, watched, rated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            movieId,
            r.score,
            r.review || '',
            r.isFavorite ? 1 : 0,
            r.inWatchlist ? 1 : 0,
            r.watched ? 1 : 0,
            r.ratedAt,
          ]
        );
      }
    }

    conn.release();
    isConnectedToMySQL = true;
    dbStatusMessage = `Connected to MySQL (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`;
    console.log(dbStatusMessage);
  } catch (err) {
    isConnectedToMySQL = false;
    dbStatusMessage = `MySQL server not reachable at ${dbConfig.host}:${dbConfig.port} (${err.code || err.message}). Fallback persistent SQL store active.`;
    console.warn('MySQL initialization notice:', dbStatusMessage);
  }
}

export async function getMovies() {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM movies ORDER BY rating DESC');
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        tagline: r.tagline,
        year: r.year,
        releaseDate: r.release_date,
        runtime: r.runtime,
        ageRating: r.age_rating,
        director: r.director,
        cast: JSON.parse(r.cast_json || '[]'),
        synopsis: r.synopsis,
        rating: parseFloat(r.rating),
        voteCount: r.vote_count,
        criticScore: r.critic_score,
        audienceScore: r.audience_score,
        trailerYoutubeId: r.trailer_youtube_id,
        trailerDuration: r.trailer_duration,
        posterUrl: r.poster_url,
        backdropUrl: r.backdrop_url,
        genres: JSON.parse(r.genres_json || '[]'),
        awards: JSON.parse(r.awards_json || '[]'),
        quote: r.quote,
        boxOffice: r.box_office,
      }));
    } catch (e) {
      console.error('MySQL query error in getMovies:', e.message);
    }
  }
  return fallbackStorage.getMovies();
}

export async function getMovieById(id) {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          title: r.title,
          tagline: r.tagline,
          year: r.year,
          releaseDate: r.release_date,
          runtime: r.runtime,
          ageRating: r.age_rating,
          director: r.director,
          cast: JSON.parse(r.cast_json || '[]'),
          synopsis: r.synopsis,
          rating: parseFloat(r.rating),
          voteCount: r.vote_count,
          criticScore: r.critic_score,
          audienceScore: r.audience_score,
          trailerYoutubeId: r.trailer_youtube_id,
          trailerDuration: r.trailer_duration,
          posterUrl: r.poster_url,
          backdropUrl: r.backdrop_url,
          genres: JSON.parse(r.genres_json || '[]'),
          awards: JSON.parse(r.awards_json || '[]'),
          quote: r.quote,
          boxOffice: r.box_office,
        };
      }
    } catch (e) {
      console.error('MySQL query error in getMovieById:', e.message);
    }
  }
  return fallbackStorage.getMovieById(id);
}

export async function getRatings() {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM ratings');
      const ratingsMap = {};
      for (const r of rows) {
        ratingsMap[r.movie_id] = {
          movieId: r.movie_id,
          score: parseFloat(r.score),
          review: r.review || '',
          isFavorite: Boolean(r.is_favorite),
          inWatchlist: Boolean(r.in_watchlist),
          watched: Boolean(r.watched),
          ratedAt: r.rated_at,
        };
      }
      return ratingsMap;
    } catch (e) {
      console.error('MySQL query error in getRatings:', e.message);
    }
  }
  return fallbackStorage.getRatings();
}

export async function saveRating({ movieId, score, review, isFavorite, inWatchlist, watched }) {
  const ratedAt = new Date().toISOString().split('T')[0];
  if (isConnectedToMySQL && pool) {
    try {
      await pool.query(
        `INSERT INTO ratings (movie_id, score, review, is_favorite, in_watchlist, watched, rated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           score = VALUES(score),
           review = VALUES(review),
           is_favorite = VALUES(is_favorite),
           in_watchlist = VALUES(in_watchlist),
           watched = VALUES(watched),
           rated_at = VALUES(rated_at)`,
        [
          movieId,
          score,
          review || '',
          isFavorite ? 1 : 0,
          inWatchlist ? 1 : 0,
          watched !== undefined ? (watched ? 1 : 0) : 1,
          ratedAt,
        ]
      );
      return { movieId, score, review, isFavorite, inWatchlist, watched, ratedAt };
    } catch (e) {
      console.error('MySQL query error in saveRating:', e.message);
    }
  }
  return fallbackStorage.saveRating({ movieId, score, review, isFavorite, inWatchlist, watched, ratedAt });
}

export async function deleteRating(movieId) {
  if (isConnectedToMySQL && pool) {
    try {
      await pool.query('DELETE FROM ratings WHERE movie_id = ?', [movieId]);
      return true;
    } catch (e) {
      console.error('MySQL query error in deleteRating:', e.message);
    }
  }
  return fallbackStorage.deleteRating(movieId);
}

export async function toggleWatchlist(movieId) {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT in_watchlist FROM ratings WHERE movie_id = ?', [movieId]);
      let inWatchlist = true;
      if (rows.length > 0) {
        inWatchlist = !rows[0].in_watchlist;
        await pool.query('UPDATE ratings SET in_watchlist = ? WHERE movie_id = ?', [inWatchlist ? 1 : 0, movieId]);
      } else {
        await pool.query(
          'INSERT INTO ratings (movie_id, score, in_watchlist, rated_at) VALUES (?, 0, 1, ?)',
          [movieId, new Date().toISOString().split('T')[0]]
        );
      }
      return { movieId, inWatchlist };
    } catch (e) {
      console.error('MySQL query error in toggleWatchlist:', e.message);
    }
  }
  return fallbackStorage.toggleWatchlist(movieId);
}

export async function toggleFavorite(movieId) {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT is_favorite FROM ratings WHERE movie_id = ?', [movieId]);
      let isFavorite = true;
      if (rows.length > 0) {
        isFavorite = !rows[0].is_favorite;
        await pool.query('UPDATE ratings SET is_favorite = ? WHERE movie_id = ?', [isFavorite ? 1 : 0, movieId]);
      } else {
        await pool.query(
          'INSERT INTO ratings (movie_id, score, is_favorite, rated_at) VALUES (?, 0, 1, ?)',
          [movieId, new Date().toISOString().split('T')[0]]
        );
      }
      return { movieId, isFavorite };
    } catch (e) {
      console.error('MySQL query error in toggleFavorite:', e.message);
    }
  }
  return fallbackStorage.toggleFavorite(movieId);
}

export function getDatabaseStatus() {
  return {
    engine: 'MySQL',
    connected: isConnectedToMySQL,
    message: dbStatusMessage,
    config: {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
    },
    tables: ['movies', 'ratings'],
  };
}
