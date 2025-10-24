import { useState, useCallback } from "react";

type MutationFunction<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

type MutationLifecycle<TInput, TOutput> = {
  onLoading?: (variables: TInput) => void;
  onSuccess?: (data: TOutput, variables: TInput) => void;
  onError?: (error: string, variables: TInput) => void;
  onSettled?: (
    data: TOutput | undefined,
    error: string | null,
    variables: TInput
  ) => void;
};

export function useConvexMutationHandler<TInput, TOutput>(
  mutationFn: MutationFunction<TInput, TOutput>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TOutput | null>(null);

  const mutate = useCallback(
    async (
      input: TInput,
      callbacks: MutationLifecycle<TInput, TOutput> = {}
    ) => {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      setError(null);
      setData(null);

      callbacks.onLoading?.(input); // ✅ onLoading runs first

      try {
        const result = await mutationFn(input);
        setData(result);
        setIsSuccess(true);
        callbacks.onSuccess?.(result, input);
        return result;
      } catch (err) {
        const error =
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : JSON.stringify(err);

        setError(error);
        setIsError(true);
        callbacks.onError?.(error, input);
      } finally {
        setIsLoading(false);
        callbacks.onSettled?.(data ?? undefined, error, input);
      }
    },
    [mutationFn, data, error]
  );

  return {
    mutate,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  };
}
