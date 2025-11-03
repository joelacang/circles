import Link from "next/link";
import { useEffect, useMemo } from "react";
import { cn } from "./utils";

interface Props {
  text: string;
  textSize?: "default" | "sm" | "lg";
  maxUrlLength?: number;
  onExtractUrls?: (urls: string[]) => void;
  extractUrls?: boolean;
  linkColor?: string;
}

export const TextProcessor = ({
  text,
  onExtractUrls,
  extractUrls = false,
  textSize = "default",
  linkColor = "text-primary",
}: Props) => {
  const urlRegex = /(https?:\/\/[^\s]+)/;

  const words = text.split(/\s+/);
  const urls = useMemo(() => {
    if (!extractUrls) return [];

    return words.filter((word) => urlRegex.test(word));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, extractUrls]);

  const processText = (text: string) => {
    const combinedRegex = /(@\w+|#\w+|https?:\/\/[^\s]+)/g;

    const parts = text.split(combinedRegex);

    return parts.map((part, index) => {
      if (!part) return null;

      if (part.startsWith("@")) {
        const username = part.slice(1);

        return (
          <Link key={index} href={`/@${username}`}>
            <span
              className={`${linkColor} font-semibold hover:underline underline-offset-2`}
            >
              {part}
            </span>
          </Link>
        );
      }

      if (part.startsWith("#")) {
        const tag = part.slice(1);

        return (
          <Link key={index} href={`/tag/${tag}`}>
            <span
              className={`${linkColor} font-semibold hover:underline underline-offset-2`}
            >
              {part}
            </span>
          </Link>
        );
      }

      if (part.startsWith("http")) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold ${linkColor} hover:underline underline-offset-2 line-clamp-1`}
          >
            {part}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const processedText = processText(text);

  useEffect(() => {
    if (onExtractUrls && extractUrls) {
      onExtractUrls(urls);
    }
  }, [urls, extractUrls, onExtractUrls]);

  return (
    <span
      className={cn(
        textSize === "default"
          ? "text-base"
          : textSize === "lg"
            ? "text-lg"
            : "text-sm",
        " leading-snug whitespace-pre-wrap"
      )}
    >
      {processedText}
    </span>
  );
};
