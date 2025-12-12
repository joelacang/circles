import { NotifDisplay } from "../types";
import {
  AtSign,
  HeartPlus,
  MessageCirclePlus,
  Quote,
  UserPlus,
  X,
} from "lucide-react";
import i18n from "@/i18n";

export function getNotificationDisplay({
  action,
  mode,
  userType,
}: {
  action: "follow" | "like" | "comment" | "mention" | "quote" | "reply";
  mode?: "post" | "comment";
  userType?: "author" | "tag" | "mention";
}): NotifDisplay {
  switch (action) {
    case "follow":
      return {
        icon: UserPlus,
        lightColor: "#E0F2FE", // sky-100
        darkColor: "#0369a1", // sky-900
        primaryColor: "#0284C7", // sky-600
        label: i18n.t("notifications:followAction"),
      };

    case "like":
      return {
        icon: HeartPlus,
        lightColor: "#fca5a5", // red-100
        darkColor: "#b91c1c", // red-900
        primaryColor: "#ef4444", // red-600
        label:
          mode && userType
            ? i18n.t(LIKE_ACTION_MAP[mode][userType] ?? "unknown label")
            : "unknown label",
      };

    case "comment":
      return {
        icon: MessageCirclePlus,
        lightColor: "#E0E7FF", // indigo-100
        darkColor: "#1E1B4B", // indigo-950
        primaryColor: "#4F46E5", // indigo-600
        label:
          mode && userType
            ? i18n.t(COMMENT_ACTION_MAP[userType] ?? "unknown label")
            : "unknown label",
      };

    case "reply": {
      return {
        icon: MessageCirclePlus,
        lightColor: "#E0E7FF", // indigo-100
        darkColor: "#1E1B4B", // indigo-950
        primaryColor: "#4F46E5", // indigo-600
        label:
          mode && userType && (userType === "author" || userType === "mention")
            ? i18n.t(REPLY_ACTION_MAP[userType] ?? "unknown label")
            : "unknown label",
      };
    }
    case "mention":
      return {
        icon: AtSign,
        lightColor: "#F3E8FF", // purple-100
        darkColor: "#3B0764", // purple-950
        primaryColor: "#9333EA", // purple-600
        label:
          mode === "post"
            ? i18n.t("notifications:mentionPostAction")
            : i18n.t("notifications:mentionCommentAction"),
      };

    case "quote":
      return {
        icon: Quote,
        lightColor: "#FFEDD5", // orange-100
        darkColor: "#7C2D12", // orange-900
        primaryColor: "#EA580C", // orange-600
        label:
          mode === "post"
            ? i18n.t("notifications:quotePostAction")
            : i18n.t("notifications:quoteCommentAction"),
      };

    default:
      return {
        icon: X,
        lightColor: "#F3F4F6", // gray-100
        darkColor: "#1F2937", // gray-800
        primaryColor: "#6B7280", // gray-500
        label: `unknown action.`,
      };
  }
}

export const LIKE_ACTION_MAP: Record<
  "post" | "comment",
  Record<"author" | "tag" | "mention", string>
> = {
  post: {
    author: "notifications:likePostAction",
    tag: "notifications:likePostTaggedUserAction",
    mention: "notifications:likePostMentionedUserAction",
  },
  comment: {
    author: "notifications:likeCommentAction",
    tag: "notifications:likeCommentMentionedUserAction",
    mention: "notifications:likeCommentMentionedUserAction",
  },
};

export const COMMENT_ACTION_MAP: Record<"author" | "tag" | "mention", string> =
  {
    author: "notifications:commentPostAction",
    tag: "notifications:commentPostTaggedUserAction",
    mention: "notifications:commentPostMentionedUserAction",
  };

export const QUOTE_ACTION_MAP: Record<"author" | "tag" | "mention", string> = {
  author: "quotePostAction",
  tag: "quotePostTaggedUserAction",
  mention: "quotePostMentionedUserAction",
};

export const REPLY_ACTION_MAP: Record<"author" | "mention", string> = {
  author: "notifications:replyCommentAction",
  mention: "notifications:replyCommentMentionedUserAction",
};
