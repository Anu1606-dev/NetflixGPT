import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { loadConversation } from "../Utils/gptSlice";
import { saveConversation, fetchConversation } from "../Utils/firestoreChatHistory";

const useChatHistorySync = (): void => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user);
  const conversation = useAppSelector((store) => store.gpt.conversation);
  const hasHydrated = useRef(false);

  // One-time load from Firestore whenever a user logs in
  useEffect(() => {
    if (!user?.uid) {
      hasHydrated.current = false;
      return;
    }
    if (hasHydrated.current) return;

    const hydrate = async () => {
      const saved = await fetchConversation(user.uid);
      if (saved && saved.length > 0) {
        dispatch(loadConversation(saved));
      }
      hasHydrated.current = true;
    };
    hydrate();
  }, [dispatch, user?.uid]);

  // Persist to Firestore any time the conversation changes
  useEffect(() => {
    if (!user?.uid || conversation.length === 0) return;
    saveConversation(user.uid, conversation);
  }, [conversation, user?.uid]);
};

export default useChatHistorySync;