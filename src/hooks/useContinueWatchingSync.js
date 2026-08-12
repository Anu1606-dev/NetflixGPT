import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToContinueWatching } from "../Utils/firestoreProgress";
import { setContinueWatching, clearContinueWatching } from "../Utils/continueWatchingSlice";

const useContinueWatchingSync = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (!user?.uid) {
      dispatch(clearContinueWatching());
      return;
    }

    const unsubscribe = subscribeToContinueWatching(user.uid, (items) => {
      dispatch(setContinueWatching(items));
    });

    return () => unsubscribe();
  }, [user?.uid]);
};

export default useContinueWatchingSync;