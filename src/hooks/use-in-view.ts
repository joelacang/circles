import { RefObject, useEffect, useState } from "react";

export function useInView(ref: RefObject<HTMLDivElement | null>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("IntersectionObserver callback:", {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          target: entry.target,
        });
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0,
        root: null,
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isInView;
}
