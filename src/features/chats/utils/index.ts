import { ChatDetail, GroupedMessages, Message } from "../types";

export function getChatName(chatDetail: ChatDetail): string {
  switch (chatDetail.type) {
    case "direct":
      return chatDetail.participant.name ?? "Unknown User";
    case "custom": {
      const names = chatDetail.participants
        .map((p) => p.name ?? "Unknown User")
        .filter((name) => name.trim() !== "");

      if (names.length === 0) return "Untitled Chat";
      if (names.length === 1) return names[0];
      if (names.length === 2) return `${names[0]} and ${names[1]}`;

      // 3+ participants
      return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
    }
  }
}

export function groupMessagesByDate(messages: Message[]): GroupedMessages[] {
  // Sort messages by dateCreated (newest first)
  const sortedMessages = [...messages].sort(
    (a, b) => b.dateCreated - a.dateCreated
  );

  // Group by date
  const grouped = sortedMessages.reduce(
    (acc, message) => {
      const dateKey = getRelativeDate(message.dateCreated);

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(message);
      return acc;
    },
    {} as Record<string, Message[]>
  );

  // Convert to array and sort groups newest to oldest
  const groupedArray = Object.entries(grouped).map(([date, messages]) => ({
    date,
    messages,
    timestamp: messages[0].dateCreated,
  }));

  // Sort groups newest to oldest
  return groupedArray
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(({ date, messages }) => ({ date, messages }));
}

function getRelativeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
