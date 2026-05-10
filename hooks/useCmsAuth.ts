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

export function useCmsAuth(): CmsAuth {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) || "fr";

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<CmsRole | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("cms_token");
    const storedRole = localStorage.getItem("cms_role") as CmsRole | null;
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
