import React from 'react';
import { MovieProvider, useMovies } from './context/MovieContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { HeroSpotlight } from './components/HeroSpotlight.jsx';
import { MovieCard } from './components/MovieCard.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { TrailerModal } from './components/TrailerModal.jsx';
import { RatingModal } from './components/RatingModal.jsx';
import { MovieDetailsModal } from './components/MovieDetailsModal.jsx';
import { TrailersTheaterView } from './components/TrailersTheaterView.jsx';
import { MyRatingsView } from './components/MyRatingsView.jsx';
import { DatabaseStatusModal } from './components/DatabaseStatusModal.jsx';
import { Footer } from './components/Footer.jsx';
import { Film, Play, Sparkles, Star, Bookmark, CheckCircle2 } from 'lucide-react';

function MainContent() {
  const {
    movies,
    filteredMovies,
    topRatedMovies,
    watchlistMovies,
    activeTab,
    setActiveTab,
    loading,
    error,
    toastMessage,
    openTrailer,
  } = useMovies();

  // Find featured spotlight film
  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  // Trending section
  const trendingMovies = movies.filter((m) => m.trending).slice(0, 4);

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans">
      <Navbar />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#f9735b] text-black font-semibold text-xs shadow-2xl shadow-[#f9735b]/20 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-zinc-500">
            <Film className="w-10 h-10 animate-spin text-amber-400 mb-3" />
            <p className="text-sm font-medium">Connecting to Express & MySQL database...</p>
          </div>
        ) : error ? (
          <div className="py-20 max-w-md mx-auto text-center px-4">
            <p className="text-rose-400 text-sm mb-2">{error}</p>
            <p className="text-xs text-zinc-400">
              Please check server logs or click the MySQL icon in the navbar.
            </p>
          </div>
        ) : (
          <>
            {/* TAB: DISCOVER */}
            {activeTab === 'discover' && (
              <>
                {/* Hero Spotlight */}
                {featuredMovie && <HeroSpotlight movie={featuredMovie} />}

                <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-14">
                  {/* Filter & Sort Controls */}
                  <FilterBar />

                  {/* Main Catalog Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div><span className="text-[10px] uppercase tracking-[0.25em] text-[#f9735b] font-bold">Handpicked for you</span><h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">Now showing</h2></div>
                    </div>

                    {filteredMovies.length === 0 ? (
                      <div className="py-20 text-center rounded-2xl border border-dashed border-zinc-800 text-zinc-500">
                        <Film className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No movies match your filter criteria.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                        {filteredMovies.map((movie) => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trending Spotlight Strip */}
                  {trendingMovies.length > 0 && (
                    <div className="pt-8 border-t border-zinc-800/80">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block">
                            Audience Favorites
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                            Trending This Week
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {trendingMovies.map((m) => (
                          <MovieCard key={m.id} movie={m} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB: TRAILERS THEATER */}
            {activeTab === 'trailers' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TrailersTheaterView />
              </div>
            )}

            {/* TAB: TOP RATED */}
            {activeTab === 'top-rated' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                    Critical Acclaim
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    Top Rated Masterpieces
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                    Ranked by global critical reception, Cannes/Oscar accolades, and CineSphere audience scores.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {topRatedMovies.map((movie, index) => (
                    <div key={movie.id} className="relative">
                      {/* Editorial Rank Badge */}
                      <div className="absolute top-2 left-2 z-30 flex items-center justify-center w-7 h-7 rounded-lg bg-black/85 backdrop-blur-md border border-amber-400/40 text-amber-300 font-mono text-xs font-bold shadow-md">
                        #{index + 1}
                      </div>
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MY RATINGS & DIARY */}
            {activeTab === 'my-ratings' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MyRatingsView />
              </div>
            )}

            {/* TAB: WATCHLIST */}
            {activeTab === 'watchlist' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                    Your Queue
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    Watchlist ({watchlistMovies.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                    Films you have saved to stream and review later.
                  </p>
                </div>

                {watchlistMovies.length === 0 ? (
                  <div className="py-20 text-center rounded-2xl border border-dashed border-zinc-800 text-zinc-500">
                    <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-400" />
                    <p className="text-sm text-zinc-300 font-medium">Your watchlist is currently empty.</p>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">
                      Browse movies and click "+ Watchlist" on any card or trailer.
                    </p>
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="px-4 py-2 rounded-lg bg-amber-400 text-black font-semibold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      Browse Discover Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {watchlistMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <TrailerModal />
      <RatingModal />
      <MovieDetailsModal />
      <DatabaseStatusModal />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <MainContent />
    </MovieProvider>
  );
}
