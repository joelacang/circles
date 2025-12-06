import { RefObject } from "react";
import { useInView } from "react-intersection-observer";

export function useDateInView(
  chatContainerRef: RefObject<HTMLDivElement | null>,
  date: string
) {
  const { ref, inView } = useInView({
    root: chatContainerRef.current ?? undefined,
    threshold: 0.2,
  });

  return { ref, inView };
}
