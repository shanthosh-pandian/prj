import React from 'react';
import { Film, Sparkles, Clapperboard, Star } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import PreferenceForm from '@/components/PreferenceForm';

const Index: React.FC = () => {
  const { user, isLoading } = useAuth();

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
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            {/* Logo */}
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-6 animate-pulse-glow">
              <Film className="w-16 h-16 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Welcome to <span className="text-gradient-gold">CINEFY</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your personal AI-powered movie curator. Tell us your mood, preferences, 
              and let us find the perfect film for your next movie night.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 stagger-children">
            <div className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized movie suggestions based on your mood and preferences
              </p>
            </div>

            <div className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <Clapperboard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Multi-Language</h3>
              <p className="text-sm text-muted-foreground">
                Discover films in Tamil, English, Hindi, Malayalam, and Telugu
              </p>
            </div>

            <div className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Top Rated Only</h3>
              <p className="text-sm text-muted-foreground">
                Filter by rating to ensure you watch only the best movies
              </p>
            </div>
          </div>

          {/* Preference Form */}
          <div className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card p-8 shadow-card">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-semibold mb-2">
                  What are you in the mood for?
                </h2>
                <p className="text-muted-foreground">
                  Select your preferences and we'll find the perfect movie for you
                </p>
              </div>
              <PreferenceForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
