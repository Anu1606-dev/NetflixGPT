import { useState, useEffect } from "react";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import logoCache from "../Utils/logoCache";

// Fetches TMDB's official transparent title-logo art for a movie or TV show.
// `shouldFetch` gates the actual network call — pass false until the card
// is visible on screen, so we don't fire 100+ requests instantly on page load.
const useTitleLogo = (id, mediaType = "movie", shouldFetch = true) => {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    if (!id || !shouldFetch) return;

    const cacheKey = `${mediaType}-${id}`;

    if (logoCache.has(cacheKey)) {
      setLogoUrl(logoCache.get(cacheKey));
      return;
    }

    let isMounted = true;

    const fetchLogo = async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/${mediaType}/${id}/images`,
          API_OPTIONS
        );
        const json = await res.json();
        const logos = json.logos || [];

        // Prefer an English logo; fall back to any available logo
        const bestLogo = logos.find((l) => l.iso_639_1 === "en") || logos[0] || null;
        const url = bestLogo ? `https://image.tmdb.org/t/p/w500${bestLogo.file_path}` : null;

        logoCache.set(cacheKey, url); // cache even a "no logo found" result, so we never retry pointlessly

        if (isMounted) setLogoUrl(url);
      } catch {
        logoCache.set(cacheKey, null);
        if (isMounted) setLogoUrl(null);
      }
    };

    fetchLogo();
    return () => { isMounted = false; };
  }, [id, mediaType, shouldFetch]);

  return logoUrl;
};

export default useTitleLogo;