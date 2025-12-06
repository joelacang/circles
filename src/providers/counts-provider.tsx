import React, { createContext, useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type CountsContext = {
  unreadMsgs: number;
  unreadNotifs: number;
};

const CountsContext = createContext<CountsContext | null>(null);

export const useCounts = () => {
  const ctx = useContext(CountsContext);

  if (!ctx) throw new Error("useCounts must be used with CountsProvider.");

  return ctx;
};

interface Props {
  children: React.ReactNode;
}

const CountsProvider = ({ children }: Props) => {
  const unreadMsgs = useQuery(api.messages.getUnreadMessagesCount);
  const unreadNotifs = useQuery(api.notifications.getUnreadNotifCount);

  return (
    <CountsContext.Provider
      value={{
        unreadMsgs: unreadMsgs ?? 0,
        unreadNotifs: unreadNotifs ?? 0,
      }}
    >
      {children}
    </CountsContext.Provider>
  );
};

export default CountsProvider;
