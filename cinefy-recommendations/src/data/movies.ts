export const getMovies = async (query: string) => {
  try {
    const response = await fetch('http://localhost:8000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    return data.recommendation || [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};