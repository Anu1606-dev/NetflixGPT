import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { subscribeToMyList } from "../Utils/firestoreList";
import { setMyList, clearMyList } from "../Utils/myListSlice";

const useMyListSync = (): void => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user);

  useEffect(() => {
    if (!user?.uid) {
      dispatch(clearMyList());
      return;
    }

    const unsubscribe = subscribeToMyList(
      user.uid,
      (items: Parameters<typeof setMyList>[0]) => {
      dispatch(setMyList(items));
      }
    );

    return () => unsubscribe();
  }, [dispatch, user?.uid]);
};

export default useMyListSync;

