import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";

export const getItemId = (mediaType, id) => `${mediaType}_${id}`;

export const addToMyList = async (uid, item) => {
  const itemId = getItemId(item.mediaType, item.id);
  const itemRef = doc(db, "users", uid, "myList", itemId);
  await setDoc(itemRef, {
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    image: item.image,
    itemId,
    addedAt: serverTimestamp(),
  });
};

export const removeFromMyList = async (uid, mediaType, id) => {
  const itemId = getItemId(mediaType, id);
  const itemRef = doc(db, "users", uid, "myList", itemId);
  await deleteDoc(itemRef);
};

// Live subscription — fires immediately with current data, then again on every change
export const subscribeToMyList = (uid, callback) => {
  const listRef = collection(db, "users", uid, "myList");
  return onSnapshot(listRef, (snapshot) => {
    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        addedAt: data.addedAt?.toMillis?.() || null, // convert Firestore Timestamp to a plain number
      };
    });
    items.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    callback(items);
  });
};