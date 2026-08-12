import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";
import { getItemId } from "./firestoreList";

export const saveWatchProgress = async (uid, item, progressSeconds, durationSeconds) => {
  const itemId = getItemId(item.mediaType, item.id);
  const itemRef = doc(db, "users", uid, "continueWatching", itemId);
  await setDoc(itemRef, {
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    image: item.image,
    itemId,
    progressSeconds,
    durationSeconds,
    updatedAt: serverTimestamp(),
  });
};

export const removeWatchProgress = async (uid, mediaType, id) => {
  const itemId = getItemId(mediaType, id);
  const itemRef = doc(db, "users", uid, "continueWatching", itemId);
  await deleteDoc(itemRef);
};

export const subscribeToContinueWatching = (uid, callback) => {
  const listRef = collection(db, "users", uid, "continueWatching");
  return onSnapshot(listRef, (snapshot) => {
    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return { ...data, updatedAt: data.updatedAt?.toMillis?.() || null };
    });
    items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    callback(items);
  });
};