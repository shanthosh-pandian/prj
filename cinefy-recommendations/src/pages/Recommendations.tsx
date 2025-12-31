import React from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Film } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { getMovies } from '@/data/movies';


const Recommendations: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();

  const language = searchParams.get('language') || '';
  const genre = searchParams.get('genre') || '';
  const mood = searchParams.get('mood') || '';
  const rating = parseFloat(searchParams.get('rating') || '5');

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const query = `${language} ${genre} ${mood} rating ${rating}`;
        console.log('Fetching with query:', query);
        
        const result = await getMovies(query);
        console.log('API Response:', result);
        
        if (result && Array.isArray(result)) {
          setRecommendations(result);
        } else if (result && result.recommendation && Array.isArray(result.recommendation)) {
          setRecommendations(result.recommendation);
        } else {
          console.error('Unexpected response format:', result);
          setRecommendations([]);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
        setError("Failed to load recommendations. Please try again.");
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [language, genre, mood, rating]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cinema">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Finding perfect movies for you...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-cinema">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Your Recommendations
          </h1>
          <p className="text-muted-foreground">
            Based on: {language} • {genre} • {mood} • Rating {rating}+
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((movie, index) => (
              <MovieCard key={movie.id || index} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl text-muted-foreground mb-2">
              No recommendations found
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your preferences
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;