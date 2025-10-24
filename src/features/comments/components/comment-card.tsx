import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PostActionButton from "@/features/posts/components/post-action-button";
import UserAvatar from "@/features/users/components/user-avatar";
import UserItem from "@/features/users/components/user-item";
import { SIZE } from "@/types/enum";
import { useUser } from "@clerk/nextjs";
import { HeartIcon, MessageCircleIcon, MoreHorizontalIcon } from "lucide-react";

const CommentCard = () => {
  const { user } = useUser();

  return (
    <div className="flex w-full items-start justify-start gap-3">
      <div>
        <UserAvatar imageUrl={user?.imageUrl} size={SIZE.MICRO} />
      </div>
      <div>
        <div className="flex flex-row items-center justify-start gap-2">
          <p className="font-semibold text-sm">
            {user?.fullName ?? user?.username}
          </p>
          <p className="text-sm text-muted-foreground">3d ago</p>
          <p className="text-sm text-muted-foreground">(Edited)</p>
        </div>
        <p className=" text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque
          assumenda laborum pariatur vel nostrum illo ratione voluptas, dolorum
          distinctio aspernatur optio libero illum dolorem ad labore quaerat!
          Animi, neque sunt. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Beatae minima temporibus, inventore quas totam porro soluta id
          magnam aut fuga minus consequuntur consequatur! Obcaecati,
          consequuntur aut neque eveniet doloremque ipsam. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Illo, aperiam tempore. Vero rem
          obcaecati ipsam aliquid sit odit libero fugit quos in harum, eius
          autem voluptates itaque mollitia suscipit reprehenderit.
        </p>
        <div className="flex flex-row gap-4">
          <PostActionButton
            tooltip="Like Post"
            icon={HeartIcon}
            count={24}
            action={() => {}}
          />
          <PostActionButton
            tooltip="Comment Post"
            icon={MessageCircleIcon}
            count={36}
          />
          <Button variant="ghost" className="rounded-full">
            <MoreHorizontalIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
