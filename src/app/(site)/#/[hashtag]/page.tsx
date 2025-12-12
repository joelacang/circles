"use client";
import { useParams } from "next/navigation";

const HashtagPage = () => {
  const params = useParams();
  const hashtagParam = params.hashtag;

  return (
    <div>
      <p>{hashtagParam}</p>
    </div>
  );
};

export default HashtagPage;
