import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";

const MAX_STORED_TURNS = 50; // keeps the document well under Firestore's 1MB limit

const sanitizeConversation = (conversation) =>
  conversation.slice(-MAX_STORED_TURNS).map((turn) => ({
    role: turn.role,
    text: turn.text,
    movies: turn.movies || [],
    movieDetail: turn.movieDetail || null,
    // Uploaded images are intentionally NOT persisted — base64 data URLs are large,
    // and saving the whole array on every turn would risk hitting Firestore's size limit.
    hadImage: !!turn.image,
  }));

export const saveConversation = async (uid, conversation) => {
  if (!conversation || conversation.length === 0) return;
  const ref = doc(db, "users", uid, "aiChat", "history");
  try {
    await setDoc(ref, {
      conversation: sanitizeConversation(conversation),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to save chat history:", err);
  }
};

export const fetchConversation = async (uid) => {
  const ref = doc(db, "users", uid, "aiChat", "history");
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().conversation || [];
    }
  } catch (err) {
    console.error("Failed to load chat history:", err);
  }
  return [];
};

export const clearStoredConversation = async (uid) => {
  const ref = doc(db, "users", uid, "aiChat", "history");
  try {
    await deleteDoc(ref);
  } catch (err) {
    console.error("Failed to clear chat history:", err);
  }
};