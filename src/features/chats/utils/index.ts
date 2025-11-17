import { ChatDetail } from "../types";

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
