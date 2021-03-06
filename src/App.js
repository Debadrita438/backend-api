import { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const fetchMovieHandler = () => {
  //   fetch('https://swapi.dev/api/films')
  //     .then(res => res.json())
  //     .then(data => {
  //       const transformedMovies = data.results.map(movie => {
  //         return {
  //           id: movie.episode_id,
  //           title: movie.title,
  //           openingText: movie.opening_crawl,
  //           releaseDate: movie.release_date
  //         }
  //       })
  //       setMovies(transformedMovies);
  //     })
  //     .catch(err => console.log(err.message));
  // }

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-32f77-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json')
      if(!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      const loadedMovies = [];

      for(const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
      setMovies(loadedMovies);
    } catch(err) {
      setError(err.message);
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler])

  const addMovieHandler = async movie => {
    const response = await fetch('https://react-http-32f77-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if(movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  if(error) {
    content = <p>{error}</p>
  }

  if(isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading....</p>} */}
        {content}
      </section>
    </>
  );
}

export default App;
