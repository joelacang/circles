import { useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import type { FunctionReference } from "convex/server";
import { useInView } from "react-intersection-observer";

type PaginationStatus =
  | "LoadingFirstPage"
  | "CanLoadMore"
  | "LoadingMore"
  | "Exhausted";

interface InfiniteQueryResult<T> {
  results: T[];
  isLoadingFirstPage: boolean;
  isLoadingMore: boolean;
  isLoading: boolean;
  hasMore: boolean;
  isDone: boolean;
  status: PaginationStatus;
  loadMore: () => void;
  sentinelRef: (node?: Element | null) => void;
}

export function useInfiniteQuery<TInput extends object, TOutput>(
  queryFn: FunctionReference<"query">,
  args: TInput,
  pageSize: number = 20,
  enableInfiniteScroll: boolean = true
): InfiniteQueryResult<TOutput> {
  const {
    results,
    status,
    loadMore: loadMoreResults,
  } = usePaginatedQuery(queryFn, args, {
    initialNumItems: pageSize,
  });

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
    triggerOnce: false,
    skip: !enableInfiniteScroll, // Only observe when enabled
  });

  useEffect(() => {
    if (enableInfiniteScroll && inView && status === "CanLoadMore") {
      loadMoreResults(pageSize);
    }
  }, [enableInfiniteScroll, inView, status, loadMoreResults, pageSize]);

  return {
    results: results || [],
    isLoadingFirstPage: status === "LoadingFirstPage",
    isLoadingMore: status === "LoadingMore",
    isLoading: status === "LoadingFirstPage" || status === "LoadingMore",
    hasMore: status === "CanLoadMore",
    isDone: status === "Exhausted",
    status,
    loadMore: () => loadMoreResults(pageSize),
    sentinelRef,
  };
}
