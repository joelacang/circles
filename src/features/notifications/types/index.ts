import { NOTIF_ACTION } from "@/types/enum";
import { Id } from "../../../../convex/_generated/dataModel";
import { LucideIcon } from "lucide-react";

export type Notification = {
  id: Id<"notifications">;
  groupDate: string;
  recipientId: string;
  senderIds: {
    dateCreated: number;
    senderId: string;
  }[];
  action: NOTIF_ACTION;
  postId?: Id<"posts">;
  commentId?: Id<"comments">;
};

export type NotifDisplay = {
  icon: LucideIcon;
  lightColor: string;
  primaryColor: string;
  darkColor: string;
  label: string;
};
