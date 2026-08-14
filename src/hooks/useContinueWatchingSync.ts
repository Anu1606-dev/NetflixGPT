import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { subscribeToContinueWatching } from "../Utils/firestoreProgress";
import { setContinueWatching, clearContinueWatching } from "../Utils/continueWatchingSlice";

const useContinueWatchingSync = (): void => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user);

  useEffect(() => {
    if (!user?.uid) {
      dispatch(clearContinueWatching());
      return;
    }

    const unsubscribe = subscribeToContinueWatching(user.uid, (items: any) => {
      dispatch(setContinueWatching(items));
    });

    return () => unsubscribe();
  }, [user?.uid, dispatch]);
};

export default useContinueWatchingSync;