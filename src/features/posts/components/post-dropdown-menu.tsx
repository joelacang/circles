import MyDropdownMenuItem from "@/components/my-dropdown-menu-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItem } from "@/features/navigation/types";
import {
  CopyIcon,
  FlagIcon,
  ForwardIcon,
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { RiTwitterXLine } from "react-icons/ri";
import { FiFacebook } from "react-icons/fi";

const PostDropdownMenu = () => {
  const items: MenuItem[] = [
    {
      id: "go-to-post",
      label: "Go To Post",
      icon: ForwardIcon,
      withSeparator: true,
    },
    {
      id: "pin-post-to-profile",
      label: "Pin  Post To Profile",
      icon: PinIcon,
    },
    {
      id: "share-post",
      label: "Share Post",
      icon: ShareIcon,
      subMenus: [
        {
          id: "copy-post-url",
          label: "Copy Post Url",
          icon: CopyIcon,
        },
        {
          id: "share-to-email",
          label: "Share To E-mail",
          icon: MailIcon,
        },
        {
          id: "share-to-facebook",
          label: "Share To Facebook",
          icon: FiFacebook,
        },
        {
          id: "share-to-x",
          label: "Share To X",
          icon: RiTwitterXLine,
        },
      ],
    },
    {
      id: "edit-post",
      label: "Edit Post",
      icon: PencilIcon,
      withSeparator: true,
    },
    {
      id: "report-post",
      label: "Report Post",
      icon: FlagIcon,
    },
    {
      id: "delete-post",
      label: "Delete Post",
      icon: TrashIcon,
      mode: "destructive",
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Button
          className="rounded-full cursor-pointer"
          variant="ghost"
          size="sm"
        >
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-xl">
        {items.map((item) => (
          <MyDropdownMenuItem key={item.id} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostDropdownMenu;
