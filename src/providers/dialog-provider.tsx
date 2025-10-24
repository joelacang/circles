"use client";

import DocumentDialog from "@/features/docs/components/document-dialog";
import PostFormDialog from "@/features/posts/components/post-form-dialog";
import UserProfileFormDialog from "@/features/users/components/user-profile-form-dialog";
import { useEffect, useState } from "react";

const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <>
      <UserProfileFormDialog />
      <PostFormDialog />
      <DocumentDialog />
    </>
  );
};

export default DialogProvider;
