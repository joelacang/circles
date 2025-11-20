import React, { useCallback } from "react";

export function useInsertToText(
  value: string,
  setValue: (v: string) => void,
  ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>
) {
  const insertToText = useCallback(
    (text: string) => {
      const el = ref.current;
      if (!el) return;

      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;

      const newValue = value.slice(0, start) + text + value.slice(end);

      setValue(newValue);

      requestAnimationFrame(() => {
        const pos = start + text.length;
        el.selectionStart = el.selectionEnd = pos;
        el.focus();
      });
    },
    [value, ref, setValue]
  );

  return insertToText;
}
