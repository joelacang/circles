"use client";

import { useParams } from "next/navigation";
import PostLoader from "@/features/posts/components/post-loader";
import { Id } from "../../../../../convex/_generated/dataModel";
import InfoMessage from "@/components/info-message";

const PostDetailPage = () => {
  const params = useParams();
  const postId = params.postId;

  if (!postId) {
    return (
      <InfoMessage
        message="No PostId found."
        imageUrl="/images/not-found.png"
      />
    );
  }

  return <PostLoader postId={postId as string} />;
};

export default PostDetailPage;
