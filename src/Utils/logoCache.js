// Shared across every MovieCard instance — if "Friends" appears in both
// "Trending TV" and "Popular TV" rows, its logo is only ever fetched once.
const logoCache = new Map();

export default logoCache;