import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PostCard from "./post-card";
import PostCardSkeleton from "./post-card-skeleton";
import { ORDER } from "@/types/enum";
import { useState } from "react";

import InfoMessage from "@/components/info-message";

interface Props {
  postId: string;
}

const PostLoader = ({ postId }: Props) => {
  const post = useQuery(api.posts.getPostDetail, { postId });
  const [order, setOrder] = useState<ORDER>(ORDER.RECENT);

  if (post === undefined) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-primary py-8">
        <PostCardSkeleton />
      </div>
    );
  }

  if (!post.success) {
    return (
      <InfoMessage
        message={post.error ?? "Error Loading Post"}
        imageUrl="/images/not-found.png"
        className="max-w-[324px]"
      />
    );
  }

  return (
    <div className="py-8 px-4">
      {post.data && (
        <>
          <PostCard detailsPage post={post.data} />
          <div className="py-4 w-full flex items-center justify-between">
            <p className="text-sm font-serif">
              <span className="text-primary font-semibold">
                {post.data.comments}
              </span>
              {` comment${post.data.comments !== 1 ? "s" : ""}`}
            </p>
            <Select value={order} onValueChange={(val: ORDER) => setOrder(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Order By" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ORDER).map((ord) => (
                  <SelectItem key={ord} value={ord}>
                    {ord}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default PostLoader;
