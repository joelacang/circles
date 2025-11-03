import { v } from "convex/values";

export enum SIZE {
  MICRO,
  SMALL,
  DEFAULT,
  LARGE,
  XLARGE,
}

export const Audience = v.union(
  v.literal("Public"),
  v.literal("Followers"),
  v.literal("Custom"),
  v.literal("Only Me")
);

export enum AUDIENCE {
  PUBLIC = "Public",
  FOLLOWERS = "Followers",
  PERSONAL = "Only Me",
  CUSTOM = "Custom",
}

export const Order = v.union(
  v.literal("Most Recent"),
  v.literal("Most Likes"),
  v.literal("Most Commented")
);

export enum ORDER {
  RECENT = "Most Recent",
  MOST_LIKED = "Most Likes",
  MOST_COMMENTED = "Most Commented",
}

export enum MODE {
  ERROR,
  DEFAULT,
  SUCCESS,
  WARNING,
  INFO,
  LOADING,
}

export const NotifAction = v.union(
  v.literal("follow"),
  v.literal("like"),
  v.literal("comment"),
  v.literal("quote"),
  v.literal("mention")
);

export enum NOTIF_ACTION {
  FOLLOW = "follow",
  LIKE = "like",
  COMMENT = "comment",
  QUOTE = "quote",
  MENTION = "mention",
}
