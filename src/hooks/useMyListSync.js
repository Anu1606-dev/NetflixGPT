import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToMyList } from "../Utils/firestoreList";
import { setMyList, clearMyList } from "../Utils/myListSlice";

// Keeps Redux's myList in sync with Firestore in real time.
// Runs once at the app root so it stays live no matter which page you're on.
const useMyListSync = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (!user?.uid) {
      dispatch(clearMyList());
      return;
    }

    const unsubscribe = subscribeToMyList(user.uid, (items) => {
      dispatch(setMyList(items));
    });

    return () => unsubscribe();
  }, [user?.uid]);
};

export default useMyListSync;