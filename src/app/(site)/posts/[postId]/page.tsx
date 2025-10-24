"use client";

import { useParams } from "next/navigation";
import PostLoader from "@/features/posts/components/post-loader";
import { Id } from "../../../../../convex/_generated/dataModel";

const PostDetailPage = () => {
  const params = useParams();
  const postId = params.postId;

  if (!postId) {
    return (
      <div>
        <p>ERROR: No postId.</p>
      </div>
    );
  }

  return <PostLoader postId={postId as Id<"posts">} />;
};

export default PostDetailPage;
