import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL, GEMINI_API_URL } from "../Utils/constants";
import { addGptMovieResult } from "../Utils/gptSlice";

const useGptSearch = () => {
  const dispatch = useDispatch();

  // Step 1 of 2: search TMDB for one movie name
  const searchMovieTMDB = async (movieName) => {
    const data = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(movieName)}&page=1`,
      API_OPTIONS
    );
    const json = await data.json();
    return json.results;
  };

  // Step 2 of 2: the whole flow — ask Gemini, then look up each suggestion on TMDB
  const handleGptSearch = async (searchQuery) => {
    const prompt = `Act as a movie recommendation system and suggest movies for the query: ${searchQuery}. Only give me names of 5 movies, comma separated, like this example format: Gadar, Sholay, Don, Golmaal, Kabhi Khushi Kabhi Gham`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.REACT_APP_GEMINI_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const json = await response.json();
    const geminiAnswer = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!geminiAnswer) {
      console.error("No response from Gemini:", json);
      return;
    }

    const movieNames = geminiAnswer.split(",").map((name) => name.trim());

    const movieResults = await Promise.all(
      movieNames.map((name) => searchMovieTMDB(name))
    );

    dispatch(addGptMovieResult({ movieNames, movieResults }));
  };

  return handleGptSearch;
};

export default useGptSearch;