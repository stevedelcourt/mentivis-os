"use client";

import { useCallback } from "react";

export function useCmsFetch(
  token: string | null,
  onUnauthorized?: () => void
) {
  const cmsFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      const res = await fetch(input, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401 && onUnauthorized) {
        onUnauthorized();
      }
      return res;
    },
    [token, onUnauthorized]
  );

  return { cmsFetch };
}
