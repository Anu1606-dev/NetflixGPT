import { BACKDROP_CDN_URL } from "./constants";

export const toCardData = (items, defaultMediaType = "movie") =>
  items
    ?.filter((item) => item.media_type !== "person" && item.backdrop_path)
    .map((item) => ({
      id: item.id,
      image: BACKDROP_CDN_URL + item.backdrop_path,
      title: item.title || item.name,
      mediaType: item.media_type || defaultMediaType,
    })) || [];