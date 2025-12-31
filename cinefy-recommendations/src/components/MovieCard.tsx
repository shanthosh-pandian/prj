import React from 'react';
import { Star, ExternalLink, Play } from 'lucide-react';
import { Movie } from '@/data/movies';
import { useHistory } from '@/context/HistoryContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { addToHistory } = useHistory();

  const handleWatchClick = () => {
    addToHistory(movie);
    window.open(movie.platformUrl, '_blank');
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Netflix':
        return 'bg-red-600';
      case 'Amazon Prime':
        return 'bg-blue-600';
      case 'Disney+ Hotstar':
        return 'bg-indigo-600';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="movie-card group">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWatchClick}
            className="p-4 rounded-full bg-primary/90 backdrop-blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-300"
          >
            <Play className="w-8 h-8 text-primary-foreground fill-current" />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-semibold">{movie.rating}</span>
        </div>

        {/* Platform badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium text-foreground ${getPlatformColor(movie.platform)}`}>
          {movie.platform}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {movie.genre}
            </span>
            <span className="text-xs text-muted-foreground">
              {movie.language}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {movie.description}
        </p>

        <button
          onClick={handleWatchClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm font-medium"
        >
          <span>Watch on {movie.platform}</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
