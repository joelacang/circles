/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bookmarks from "../bookmarks.js";
import type * as chatParticipants from "../chatParticipants.js";
import type * as chats from "../chats.js";
import type * as commentLikes from "../commentLikes.js";
import type * as comments from "../comments.js";
import type * as follows from "../follows.js";
import type * as helpers_chatParticipants from "../helpers/chatParticipants.js";
import type * as helpers_chats from "../helpers/chats.js";
import type * as helpers_comments from "../helpers/comments.js";
import type * as helpers_follows from "../helpers/follows.js";
import type * as helpers_messageReactions from "../helpers/messageReactions.js";
import type * as helpers_messages from "../helpers/messages.js";
import type * as helpers_notifications from "../helpers/notifications.js";
import type * as helpers_posts from "../helpers/posts.js";
import type * as helpers_stats from "../helpers/stats.js";
import type * as helpers_users from "../helpers/users.js";
import type * as likes from "../likes.js";
import type * as messageDrafts from "../messageDrafts.js";
import type * as messageReactions from "../messageReactions.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as posts from "../posts.js";
import type * as profiles from "../profiles.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bookmarks: typeof bookmarks;
  chatParticipants: typeof chatParticipants;
  chats: typeof chats;
  commentLikes: typeof commentLikes;
  comments: typeof comments;
  follows: typeof follows;
  "helpers/chatParticipants": typeof helpers_chatParticipants;
  "helpers/chats": typeof helpers_chats;
  "helpers/comments": typeof helpers_comments;
  "helpers/follows": typeof helpers_follows;
  "helpers/messageReactions": typeof helpers_messageReactions;
  "helpers/messages": typeof helpers_messages;
  "helpers/notifications": typeof helpers_notifications;
  "helpers/posts": typeof helpers_posts;
  "helpers/stats": typeof helpers_stats;
  "helpers/users": typeof helpers_users;
  likes: typeof likes;
  messageDrafts: typeof messageDrafts;
  messageReactions: typeof messageReactions;
  messages: typeof messages;
  notifications: typeof notifications;
  posts: typeof posts;
  profiles: typeof profiles;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
