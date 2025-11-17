"use client";

import MessageDialog from "@/features/chats/components/message-dialog";
import DocumentDialog from "@/features/docs/components/document-dialog";
import FollowDialog from "@/features/follow/components/follow-dialog";
import PostFormDialog from "@/features/posts/components/post-form-dialog";
import UserProfileFormDialog from "@/features/profiles/components/user-profile-form-dialog";
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
      <FollowDialog />
      <MessageDialog />
    </>
  );
};

export default DialogProvider;
