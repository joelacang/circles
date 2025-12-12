/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

export function useScrollTo<T>(
  dependency: T,
  options: ScrollIntoViewOptions = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && dependency) {
      ref.current.scrollIntoView({
        behavior: options.behavior || "smooth",
        block: options.block || "start",
        inline: options.inline || "nearest",
        ...options,
      });
    }
  }, [dependency]);

  return ref;
}
