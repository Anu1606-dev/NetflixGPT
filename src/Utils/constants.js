// TMDB API config
export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
  },
};

export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_CDN_URL = "https://image.tmdb.org/t/p/w1280";
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Branding / static assets
export const LOGO_URL =
  "https://occ.a.nflxso.net/dnmt/api/v6/iL4oJVDYZ8KLSrJ6eG2OwtghbfQ/AAAAAVvRDRqBcLS7fk0Qpns6gQSS3VdMMYtpN_ba4Nzu63yuVrE7JHt-MdKCNAQnJ8SrsPBqivurwF6ugwnAa54jBGNohFD6CNLHDjwQUnPO_cKrHSqgmLOAw0zUe2dRClJd4cchXguY1Bjj.svg";

export const LANDING_BG_URL =
  "https://assets.nflxext.com/ffe/siteui/vlv3/42f3cd9f-c9a8-4cae-8c03-3e7aa13e0154/web/IN-en-20260727-TRIFECTA-perspective_83c6fd6c-bc2e-4518-80be-359a85c542a2_medium.jpg";

export const DEFAULT_PHOTO_URL =
  "https://i.pinimg.com/736x/d7/19/6a/d7196adc7c4f353d52235c5e6ed12e65.jpg";

export const AVATARS = [
  "https://i.pinimg.com/736x/d7/19/6a/d7196adc7c4f353d52235c5e6ed12e65.jpg",
  "https://github.com/Anu1606-dev/NetflixGPT/blob/main/netflix_avatar.jpg?raw=true",
  "https://i.pinimg.com/474x/5b/50/e7/5b50e75d07c726d36f397f6359098f58.jpg",
  "https://occ-0-2232-2186.1.nflxso.net/dnm/api/v6/SO2HoVCx33X8phZh2pZZmQ4QgNY/AAAABRSzRacW3r_cmBGpsUArW055MeDHm-e-5QQ2S2dJhAKGb1wxxJzhDtHqe7WXCr-0_JqehuLMy0nphR19_S1J5AA4TQe4O3A.png?r=d8a",
];

export const LANGUAGES = ["English", "हिन्दी"];

export const NAV_LINKS = [
  "Home",
  "Shows",
  "Movies",
  "Games",
  "New & Popular",
  "My List",
  "Browse by Languages",
];