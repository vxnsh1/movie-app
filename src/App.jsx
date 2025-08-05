import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
// @ts-ignore
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [movieList, setmovieList] = useState([]);

  const [isLoading, setisLoading] = useState(false);

  const fetchMovies = async () => {
    setisLoading(true);

    setErrorMessage("");

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setmovieList([]);
        return;
      }

      setmovieList(data.results || []);
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero-img.png" alt="Hero Banner" />
          <h1>
            Smarter Movie Search for Smarter{" "}
            <span className="text-gradient">Bingers</span>
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[20px]">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie, id) => (
                <MovieCard key={id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
