import useSWR from "swr";
import { User } from "@app/features/auth/types/user";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error("Failed to fetch user");
  }

  const json = await res.json();
  return json.data as User;
};

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    "/api/auth/me",
    fetcher,
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    },
  );

  return {
    user: data ?? null,
    loadingUser: isLoading,
    errorUser: error,
    refetch: mutate,
  };
}


