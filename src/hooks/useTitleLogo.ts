import { useState, useEffect } from "react";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import logoCache from "../Utils/logoCache";

const useTitleLogo = (
  id: number | undefined,
  mediaType: "movie" | "tv" = "movie",
  shouldFetch: boolean = true
): string | null => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !shouldFetch) return;

    const cacheKey = `${mediaType}-${id}`;

    if (logoCache.has(cacheKey)) {
      setLogoUrl(logoCache.get(cacheKey) ?? null);
      return;
    }

    let isMounted = true;

    const fetchLogo = async (): Promise<void> => {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}/images`, API_OPTIONS);
        const json = await res.json();
        const logos = json.logos || [];

        const bestLogo =
          logos.find((l: any) => l.iso_639_1 === "en") || logos[0] || null;
        const url = bestLogo ? `https://image.tmdb.org/t/p/w500${bestLogo.file_path}` : null;

        logoCache.set(cacheKey, url);
        if (isMounted) setLogoUrl(url);
      } catch {
        logoCache.set(cacheKey, null);
        if (isMounted) setLogoUrl(null);
      }
    };

    fetchLogo();
    return () => {
      isMounted = false;
    };
  }, [id, mediaType, shouldFetch]);

  return logoUrl;
};

export default useTitleLogo;