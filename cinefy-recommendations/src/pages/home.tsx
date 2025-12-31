import { getMovies } from "../api/movies";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleSearch = async () => {
    const recommendation = await getMovies(query);
    setResult(recommendation);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter movie preference"
      />

      <button onClick={handleSearch}>Get Recommendation</button>

      <p>{result}</p>
    </div>
  );
}
