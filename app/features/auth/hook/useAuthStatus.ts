"use client";

import useSWR from "swr";
import { UserSession } from "../types/session";

type AuthStatusResponse = {
  authenticated: boolean;
  session: UserSession | null;
};

const fetcher = async (url: string): Promise<AuthStatusResponse> => {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to check auth status");
  }

  return res.json();
};

export function useAuthStatus() {
  const { data, error, isLoading, mutate } = useSWR<AuthStatusResponse>(
    "/api/auth/status",
    fetcher,
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    },
  );

  return {
    authenticated: data?.authenticated ?? false,
    session: data?.session ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
