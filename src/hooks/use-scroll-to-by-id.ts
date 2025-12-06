export function useScrollToById() {
  const scrollToById = (
    id: string,
    options: ScrollIntoViewOptions = { behavior: "smooth" }
  ) => {
    const el = document.getElementById(id);
    if (!el) return;

    console.log("FOUND:", !!el, id);

    el.scrollIntoView(options);
  };

  return scrollToById;
}
