import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Clock, Trash2, Film, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useHistory } from '@/context/HistoryContext';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';

const History: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { history, clearHistory } = useHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-cinema">
      <Navbar />
      
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Watch History
                </h1>
                <p className="text-muted-foreground">
                  {history.length} {history.length === 1 ? 'movie' : 'movies'} in your history
                </p>
              </div>
            </div>

            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="btn-secondary flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            )}
          </div>

          {/* History Grid */}
          {history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {history.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-secondary mb-4">
                <Film className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-2">No History Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring movies and your watch history will appear here
              </p>
              <Link to="/" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Discover Movies
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default History;
