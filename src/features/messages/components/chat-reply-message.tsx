import { Reply } from "lucide-react";

const ChatReplyMessage = () => {
  return (
    <div className="bg-primary/20 rounded-t-xl rounded-b-none cursor-pointer">
      <div className="p-2 flex flex-row gap-2 items-center justify-start">
        <Reply className="size-4 text-primary" />
        <p className="text-xs font-semibold text-primary">
          Replying from John Smith
        </p>
      </div>
      <div className="pt-2 pb-6 px-4">
        <p className="text-sm line-clamp-2 italic text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non rerum ab
          quo deleniti eaque ratione nostrum libero autem, accusamus ipsa labore
          corrupti cupiditate atque numquam esse rem accusantium repellat
          quidem.
        </p>
      </div>
    </div>
  );
};

export default ChatReplyMessage;
