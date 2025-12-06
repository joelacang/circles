import { UserPreview } from "@/features/users/types";
import { Id } from "../../../../convex/_generated/dataModel";

export type Chat = {
  id: Id<"chats">;
  name?: string;
  code: string;
  description?: string;
  type: "direct" | "group" | "custom";
  creatorId: Id<"users">;
  latestMessageTime?: number;
  latestMessage?: string;
  latestMessageSenderId?: Id<"users">;
  participantsCount: number;
  dateCreated: number;
  unreadCount: number;
};

export type DirectChat = {
  type: "direct";
  chat: Chat;
  participant: UserPreview;
};

export type CustomChat = {
  type: "custom";
  chat: Chat;
  participants: UserPreview[];
};

export type MessageDraft = {
  id?: Id<"messageDrafts">;
  recipients: UserPreview[];
  body: string;
};

export type ChatDetail = DirectChat | CustomChat;

export type Message = {
  id: Id<"messages">;
  authorId?: Id<"users">;
  body: string;
  dateCreated: number;
  lastUpdateTime?: number;
  parentMessageId?: Id<"messages">;
  chatId: Id<"chats">;
  reacts: EmojiGroupCount[];
  forwardedMessageId?: Id<"messages">;
  dateDeleted?: number;
};

export type MessageReactGroup = {
  emojiCode: string;
  emojiNative: string;
  reactions: MessageReact[];
};

export type MessageReact = {
  id: Id<"messageReactions">;
  reactor: UserPreview;
  dateReacted: number;
  emojiNative: string;
  emojiCode: string;
};

export type EmojiGroupCount = {
  emojiCode: string;
  emojiNative: string;
  count: number;
};

export type GroupedMessages = {
  date: string;
  messages: Message[];
};

export type Emoji = {
  id: string;
  title: string;
  native: string;
  code: string;
};
