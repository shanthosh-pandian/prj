import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '@/data/movies';

interface HistoryContextType {
  history: Movie[];
  addToHistory: (movie: Movie) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<Movie[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('cinefy_history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addToHistory = (movie: Movie) => {
    setHistory(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      const updated = [movie, ...filtered].slice(0, 20);
      localStorage.setItem('cinefy_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cinefy_history');
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
