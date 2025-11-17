"use client";

import NotificationSheet from "@/features/notifications/components/notification-sheet";
import SearchSheet from "@/features/search/components/search-sheet";
import { useEffect, useState } from "react";

const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <>
      <NotificationSheet />
      <SearchSheet />
    </>
  );
};

export default SheetProvider;
