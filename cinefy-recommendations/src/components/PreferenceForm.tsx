import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Film, Smile, Star, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const languages = ['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu'];
const genres = ['Action', 'Romance', 'Comedy', 'Thriller', 'Sci-Fi'];
const moods = ['Happy', 'Sad', 'Excited', 'Relaxed'];

interface PreferenceFormProps {
  onSubmit?: () => void;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [rating, setRating] = useState([7]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLanguage && selectedGenre && selectedMood) {
      const params = new URLSearchParams({
        language: selectedLanguage,
        genre: selectedGenre,
        mood: selectedMood,
        rating: rating[0].toString(),
      });
      navigate(`/recommendations?${params.toString()}`);
      onSubmit?.();
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'Happy': return '😊';
      case 'Sad': return '😢';
      case 'Excited': return '🤩';
      case 'Relaxed': return '😌';
      default: return '😊';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Language Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Globe className="w-4 h-4 text-primary" />
          Preferred Language
        </label>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedLanguage === lang
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Film className="w-4 h-4 text-primary" />
          Genre
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedGenre === genre
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Smile className="w-4 h-4 text-primary" />
          Current Mood
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => setSelectedMood(mood)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedMood === mood
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <span className="text-lg">{getMoodEmoji(mood)}</span>
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Slider */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Star className="w-4 h-4 text-primary" />
          Minimum Rating: <span className="text-primary font-bold">{rating[0]}/10</span>
        </label>
        <div className="px-2">
          <Slider
            value={rating}
            onValueChange={setRating}
            min={1}
            max={10}
            step={0.5}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!selectedLanguage || !selectedGenre || !selectedMood}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5" />
        Get Recommendations
      </button>
    </form>
  );
};

export default PreferenceForm;
