"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { CmsRole } from "@/hooks/useCmsAuth";
import { useIsMobile } from "@/hooks/useMediaQuery";

export const CMS_TABS = [
  { label: "Articles", href: "content-management" },
  { label: "Offres d'emploi", href: "content-management/jobs" },
  { label: "Pages (HP)", href: "content-management/pages" },
  { label: "Tarifs", href: "content-management/tarifs" },
  { label: "SEO / JSON-LD", href: "content-management/seo" },
  { label: "Soumissions", href: "content-management/soumissions" },
  { label: "Parametres", href: "content-management/settings", godOnly: true },
];

export function RoleBadge({ role }: { role: CmsRole | null }) {
  if (!role) return null;
  const colors =
    role === "god"
      ? { bg: "#0A0A0A", color: "#fff" }
      : role === "editorial"
      ? { bg: "#E3F2FD", color: "#1565C0" }
      : { bg: "#FFF3E0", color: "#E65100" };
  const label = role === "god" ? "God" : role === "editorial" ? "Editorial" : "Tarifs";
  return (
    <span
      style={{
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 999,
        background: colors.bg,
        color: colors.color,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </span>
  );
}

export function CmsNavTabs({
  lang,
  role,
}: {
  lang: string;
  role: CmsRole | null;
}) {
  const isMobile = useIsMobile();
  return (
    <div
      className="cms-nav-scroll"
      style={{
        display: "flex",
        gap: 4,
        marginBottom: isMobile ? 40 : 100,
        paddingBottom: 16,
        borderBottom: "1px solid #F0EBE5",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        flexWrap: isMobile ? "nowrap" : "wrap",
      }}
    >
      {CMS_TABS.filter((t) => !t.godOnly || role === "god").map((tab) => (
        <Link
          key={tab.label}
          href={`/${lang}/${tab.href}`}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 500,
            color: "#0A0A0A",
            background: "#F5F3F0",
            borderRadius: 8,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

export function CmsAlert({
  type,
  message,
  onDismiss,
}: {
  type: "error" | "success";
  message: string;
  onDismiss?: () => void;
}) {
  const isError = type === "error";
  return (
    <div
      style={{
        padding: "12px 16px",
        background: isError ? "#FEF2F0" : "#E8F5E9",
        borderRadius: 10,
        marginBottom: 20,
        color: isError ? "#c45c4a" : "#2E7D32",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="cms-touch-target"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            color: "inherit",
            padding: 8,
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Fermer"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function CmsReadOnlyBanner() {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "#FFF3E0",
        borderRadius: 10,
        marginBottom: 20,
        color: "#E65100",
        fontSize: 14,
      }}
    >
      Lecture seule — Vous n&apos;avez pas les droits de modification sur cette section.
    </div>
  );
}

export function CmsLoading({ message = "Chargement..." }: { message?: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ color: "#777169" }}>{message}</p>
    </div>
  );
}

export function CmsBackLink({
  lang,
  href,
  label = "← Retour au tableau de bord",
}: {
  lang: string;
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href || `/${lang}/content-management`}
      style={{
        fontSize: 13,
        color: "#777169",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "8px 0",
      }}
    >
      {label}
    </Link>
  );
}

interface CmsLayoutProps {
  lang: string;
  token: string | null;
  role: CmsRole | null;
  title: string;
  subtitle?: string;
  children: ReactNode;
  error?: string;
  success?: string;
  readOnly?: boolean;
  showNav?: boolean;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  extraActions?: ReactNode;
  maxWidth?: number;
  onDismissError?: () => void;
  onDismissSuccess?: () => void;
}

export function CmsLayout({
  lang,
  token,
  role,
  title,
  subtitle,
  children,
  error,
  success,
  readOnly,
  showNav = true,
  showBack = true,
  backHref,
  backLabel,
  extraActions,
  maxWidth = 1200,
  onDismissError,
  onDismissSuccess,
}: CmsLayoutProps) {
  const isMobile = useIsMobile();

  if (!token) {
    return <CmsLoading message="Redirection..." />;
  }

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 24px", maxWidth, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 500, color: "#0A0A0A", marginBottom: 4 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 14, color: "#777169" }}>{subtitle}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {role && <RoleBadge role={role} />}
          {extraActions}
          {showBack && (
            <CmsBackLink lang={lang} href={backHref} label={backLabel} />
          )}
        </div>
      </div>

      {showNav && <CmsNavTabs lang={lang} role={role} />}

      {readOnly && <CmsReadOnlyBanner />}
      {error && <CmsAlert type="error" message={error} onDismiss={onDismissError} />}
      {success && <CmsAlert type="success" message={success} onDismiss={onDismissSuccess} />}

      {children}
    </div>
  );
}
