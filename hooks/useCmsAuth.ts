"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

export type CmsRole = "god" | "editorial" | "tarifs";

export interface CmsAuth {
  token: string | null;
  role: CmsRole | null;
  isReady: boolean;
  logout: () => void;
}

function decodeTokenRole(token: string | null): CmsRole | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const payload = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
    const role = payload.role;
    if (role === "god" || role === "editorial" || role === "tarifs") {
      return role;
    }
  } catch {
    // ignore decode errors
  }
  return null;
}

export function useCmsAuth(): CmsAuth {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) || "fr";

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<CmsRole | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("cms_token");
    let storedRole = localStorage.getItem("cms_role") as CmsRole | null;

    // Fallback: decode role from token if localStorage role is missing
    if (storedToken && !storedRole) {
      storedRole = decodeTokenRole(storedToken);
      if (storedRole) {
        localStorage.setItem("cms_role", storedRole);
      }
    }

    setToken(storedToken);
    setRole(storedRole);
    setIsReady(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_role");
    setToken(null);
    setRole(null);
    router.push(`/${lang}/content-management`);
  }, [lang, router]);

  return { token, role, isReady, logout };
}
