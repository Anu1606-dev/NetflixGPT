import { MyListItem, ContinueWatchingItem } from "./types";

// Builds a short plain-text summary of what the user has saved/watched.
// This is the "retrieval" half of a lightweight RAG pattern — we're not
// using embeddings or a vector database, just directly reading their
// existing Firestore-synced state and turning it into readable context.
export const buildTasteProfile = (
  myListItems: MyListItem[] = [],
  continueWatchingItems: ContinueWatchingItem[] = []
): string | null => {
  if (myListItems.length === 0 && continueWatchingItems.length === 0) {
    return null; // nothing to personalize with yet
  }

  const savedTitles = myListItems.slice(0, 10).map((item) => item.title);
  const watchingTitles = continueWatchingItems.slice(0, 5).map((item) => item.title);

  let profile = "";
  if (savedTitles.length > 0) {
    profile += `The user has saved these titles to their list: ${savedTitles.join(", ")}. `;
  }
  if (watchingTitles.length > 0) {
    profile += `They are currently watching: ${watchingTitles.join(", ")}. `;
  }
  profile +=
    "Use this only as light context to personalize tone or suggestions if relevant. " +
    "Don't mention this list explicitly unless the user directly asks about their list or watch history.";

  return profile;
};