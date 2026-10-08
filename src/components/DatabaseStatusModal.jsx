import React from 'react';
import { useMovies } from '../context/MovieContext.jsx';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Server, Table } from 'lucide-react';

export const DatabaseStatusModal = () => {
  const { isDbModalOpen, setIsDbModalOpen, dbStatus, refreshData } = useMovies();

  if (!isDbModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0e111a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Express Backend & MySQL Architecture
              </h3>
              <p className="text-xs text-zinc-400">
                Database integration and connection details
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDbModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-zinc-300">
          {/* Status Box */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              dbStatus?.connected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {dbStatus?.connected ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            )}
            <div>
              <span className="font-bold text-sm block">
                {dbStatus?.connected
                  ? 'MySQL Database Connected'
                  : 'MySQL Backend Layer Active'}
              </span>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {dbStatus?.message}
              </p>
            </div>
          </div>

          {/* Config Details */}
          <div className="space-y-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px] block">
              Connection Parameters
            </span>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono text-[11px]">
              <div>
                <span className="text-zinc-500">Host:</span>{' '}
                <span className="text-zinc-200">{dbStatus?.config?.host || 'localhost'}</span>
              </div>
              <div>
                <span className="text-zinc-500">Port:</span>{' '}
                <span className="text-zinc-200">{dbStatus?.config?.port || 3306}</span>
              </div>
              <div>
                <span className="text-zinc-500">Database:</span>{' '}
                <span className="text-zinc-200">{dbStatus?.config?.database || 'cinesphere_db'}</span>
              </div>
              <div>
                <span className="text-zinc-500">Driver:</span>{' '}
                <span className="text-zinc-200">mysql2 (promise pool)</span>
              </div>
            </div>
          </div>

          {/* Tables Schema */}
          <div className="space-y-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px] block">
              MySQL Tables Initialized
            </span>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-[11px]">
                <div className="flex items-center justify-between text-zinc-200 font-semibold mb-1">
                  <span className="font-mono text-amber-400">TABLE movies</span>
                  <span className="text-zinc-500">InnoDB</span>
                </div>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  id, title, tagline, year, runtime, age_rating, director, cast_json, synopsis,
                  rating, vote_count, trailer_youtube_id, poster_url, backdrop_url, genres_json
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-[11px]">
                <div className="flex items-center justify-between text-zinc-200 font-semibold mb-1">
                  <span className="font-mono text-amber-400">TABLE ratings</span>
                  <span className="text-zinc-500">InnoDB</span>
                </div>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  id, movie_id, score, review, is_favorite, in_watchlist, watched, rated_at,
                  created_at
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              onClick={() => refreshData()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping & Refresh</span>
            </button>

            <button
              onClick={() => setIsDbModalOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
