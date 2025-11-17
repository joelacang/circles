"use client";

import ConfirmAlert from "@/features/confirm-dialog/components/confirmation-alert";
import { useEffect, useState } from "react";

const AlertProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <>
      <ConfirmAlert />
    </>
  );
};

export default AlertProvider;
