"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Post } from "@/lib/cms/types";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout } from "@/components/cms/CmsLayout";

export default function ContentManagementPage() {
  const params = useParams();
  const lang = params.lang as string;

  const { token, role, isReady, logout } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token, logout);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<"title" | "category" | "date" | "status">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const canEditPosts = role === "god" || role === "editorial";

  // Fetch posts when authenticated
  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await cmsFetch(`/api/cms/posts?status=${filter}`);
      if (res.status === 401) return; // handled by useCmsFetch
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token, filter, cmsFetch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("cms_token", data.token);
        localStorage.setItem("cms_role", data.role || "god");
        // Force reload to pick up new auth state
        window.location.href = `/${lang}/content-management`;
      } else {
        setLoginError(data.error || "Erreur de connexion");
      }
    } catch {
      setLoginError("Erreur reseau");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article ? Cette action est irreversible.")) return;
    try {
      const res = await cmsFetch(`/api/cms/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
      }
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleSort = (field: "title" | "category" | "date" | "status") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;
      case "category":
        cmp = a.category.localeCompare(b.category);
        break;
      case "date":
        cmp = new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
        break;
      case "status":
        cmp = Number(a.published) - Number(b.published);
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Login view
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 16, padding: "40px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <img
              src="/images/MentivisOS/mentivisos-logo-anim-drop.svg"
              alt="MentivisOS"
              style={{ height: 56, width: "auto", marginBottom: 12 }}
            />
            <p style={{ fontSize: 14, color: "#777169" }}>Gestion des contenus</p>
          </div>

          <form onSubmit={handleLogin} autoComplete="on">
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="cms-email" style={labelStyle}>Email</label>
              <input
                id="cms-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@mentivis.com"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="cms-password" style={labelStyle}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  id="cms-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, padding: "12px 44px 12px 14px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777169",
                  }}
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 2l20 20" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {loginError && (
              <p style={{ color: "#c45c4a", fontSize: 13, marginBottom: 16 }}>{loginError}</p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 15,
                fontWeight: 500,
                color: "#fff",
                background: "#0A0A0A",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 12, color: "#A8A29E", textAlign: "center" }}>
            @mentivis.com ou @mentivisOS.com requis
          </p>
        </div>
      </div>
    );
  }

  // Dashboard view
  return (
    <CmsLayout
      lang={lang}
      token={token}
      role={role}
      title="Content Management System CMS"
      subtitle="Gestion des articles, pages, tarifs et SEO"
      showBack={false}
      extraActions={
        canEditPosts ? (
          <Link
            href={`/${lang}/content-management/edit/new`}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              background: "#0A0A0A",
              borderRadius: 10,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            + Nouvel article
          </Link>
        ) : undefined
      }
    >
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: filter === f ? "#0A0A0A" : "#E5E0DA",
              color: filter === f ? "#fff" : "#3E3B38",
            }}
          >
            {f === "all" ? "Tous" : f === "published" ? "Publies" : "Brouillons"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#777169", alignSelf: "center" }}>
          {sortedPosts.length} article{sortedPosts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Posts table */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#777169", padding: 40 }}>Chargement...</p>
      ) : sortedPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16 }}>
          <p style={{ color: "#777169", marginBottom: 16 }}>Aucun article</p>
          <Link
            href={`/${lang}/content-management/edit/new`}
            style={{ color: "#0A0A0A", fontWeight: 500, textDecoration: "underline" }}
          >
            Creer votre premier article
          </Link>
        </div>
      ) : (
        <div className="cms-table-scroll" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F0EBE5" }}>
                {[
                  { key: "title", label: "Article" },
                  { key: "category", label: "Categorie" },
                  { key: "date", label: "Date" },
                  { key: "status", label: "Statut" },
                  { key: null, label: "Actions" },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key as "title" | "category" | "date" | "status")}
                    style={{
                      textAlign: col.key ? "left" : "right",
                      padding: "16px 20px",
                      fontWeight: 500,
                      color: sortField === col.key ? "#0A0A0A" : "#777169",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: col.key ? "pointer" : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                    {sortField === col.key && (
                      <span style={{ marginLeft: 6, fontSize: 10 }}>{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post) => (
                <tr
                  key={post.id}
                  style={{
                    borderBottom: "1px solid #F5F3F0",
                    borderLeft: post.featured ? "3px solid #2563EB" : "3px solid transparent",
                  }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 500, color: "#0A0A0A", marginBottom: 2 }}>{post.title}</div>
                    <div style={{ fontSize: 12, color: "#A8A29E" }}>/{post.slug}</div>
                  </td>
                  <td style={{ padding: "16px 20px", color: "#3E3B38" }}>
                    {post.category}
                  </td>
                  <td style={{ padding: "16px 20px", color: "#777169", fontSize: 13 }}>
                    {post.date}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        background: post.published ? "#E8F5E9" : "#FFF3E0",
                        color: post.published ? "#2E7D32" : "#E65100",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: post.published ? "#2E7D32" : "#E65100" }} />
                      {post.published ? "Publie" : "Brouillon"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <Link
                        href={`/${lang}/blog/${post.slug}`}
                        target="_blank"
                        className="cms-touch-target"
                        style={{
                          padding: "10px 16px",
                          fontSize: 12,
                          color: "#777169",
                          textDecoration: "none",
                          border: "1px solid #E5E0DA",
                          borderRadius: 8,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Voir
                      </Link>
                      {canEditPosts && (
                        <>
                          <Link
                            href={`/${lang}/content-management/edit/${post.id}`}
                            className="cms-touch-target"
                            style={{
                              padding: "10px 16px",
                              fontSize: 12,
                              color: "#0A0A0A",
                              textDecoration: "none",
                              border: "1px solid #E5E0DA",
                              borderRadius: 8,
                              background: "#FAFAF8",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="cms-touch-target"
                            style={{
                              padding: "10px 16px",
                              fontSize: 12,
                              color: "#c45c4a",
                              border: "1px solid #F5E0DC",
                              borderRadius: 8,
                              background: "#FEF2F0",
                              cursor: "pointer",
                            }}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CmsLayout>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#3E3B38",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  border: "1px solid #E5E0DA",
  borderRadius: 10,
  background: "#FAFAF8",
  outline: "none",
  boxSizing: "border-box",
};
