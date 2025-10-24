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
