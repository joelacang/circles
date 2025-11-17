import { NOTIF_ACTION } from "@/types/enum";
import { Id } from "../../../../convex/_generated/dataModel";
import { LucideIcon } from "lucide-react";
import { UserPreview } from "@/features/users/types";

export type Notification = {
  id: Id<"notifications">;
  groupDate: string;
  recipientType: "author" | "tag" | "mention" | "follow";
  recipientId: Id<"notificationRecipients">;
  senders: {
    details: Sender[];
    remaining: number;
  };
  action: "follow" | "like" | "comment" | "mention" | "quote" | "reply";
  postId?: Id<"posts">;
  commentId?: Id<"comments">;
  dateCreated: number;
  readTime?: number;
  preview?: string | null;
  updateTime: number;
};

export type NotifDisplay = {
  icon: LucideIcon;
  lightColor: string;
  primaryColor: string;
  darkColor: string;
  label: string;
};

export type Recipient = {
  user: UserPreview;
  type: "author" | "tag" | "mention";
};

export type Sender = {
  user: UserPreview;
  dateSent: number;
};
