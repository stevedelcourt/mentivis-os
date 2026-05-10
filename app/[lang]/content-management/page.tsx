"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/lib/cms/types";

export default function ContentManagementPage() {
  const params = useParams();
  const lang = params.lang as string;
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<"title" | "category" | "date" | "status">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const canEditPosts = role === "god" || role === "editorial";

  // Check auth on mount
  useEffect(() => {
    const stored = localStorage.getItem("cms_token");
    const storedRole = localStorage.getItem("cms_role");
    if (stored) {
      setToken(stored);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Fetch posts when authenticated
  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/posts?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("cms_token");
        localStorage.removeItem("cms_role");
        setToken(null);
        setRole(null);
        return;
      }
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

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
        setToken(data.token);
        setRole(data.role || "god");
      } else {
        setLoginError(data.error || "Erreur de connexion");
      }
    } catch {
      setLoginError("Erreur reseau");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_role");
    setToken(null);
    setRole(null);
    setPosts([]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article ? Cette action est irreversible.")) return;
    try {
      const res = await fetch(`/api/cms/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch {
      alert("Erreur lors de la suppression");
    }
    setDeleteId(null);
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

  const filteredPosts = sortedPosts;

  // Login view
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 16, padding: "40px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8, color: "#0A0A0A" }}>Content Management</h1>
          <p style={{ fontSize: 14, color: "#777169", marginBottom: 32 }}>MentivisOS — Gestion des contenus</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#3E3B38", marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@mentivis.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 15,
                  border: "1px solid #E5E0DA",
                  borderRadius: 10,
                  background: "#FAFAF8",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#3E3B38", marginBottom: 6 }}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 14px",
                    fontSize: 15,
                    border: "1px solid #E5E0DA",
                    borderRadius: 10,
                    background: "#FAFAF8",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
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
    <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0A0A0A", marginBottom: 4 }}>Content Management System CMS</h1>
          <p style={{ fontSize: 14, color: "#777169" }}>Gestion des articles, pages, tarifs et SEO</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {role && (
            <span
              style={{
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 999,
                background: role === "god" ? "#0A0A0A" : role === "editorial" ? "#E3F2FD" : "#FFF3E0",
                color: role === "god" ? "#fff" : role === "editorial" ? "#1565C0" : "#E65100",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {role === "god" ? "God" : role === "editorial" ? "Editorial" : "Tarifs"}
            </span>
          )}
          {canEditPosts && (
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
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              fontSize: 14,
              color: "#777169",
              background: "transparent",
              border: "1px solid #E5E0DA",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Deconnexion
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 100, paddingBottom: 16, borderBottom: "1px solid #F0EBE5", flexWrap: "wrap" }}>
        {[
          { label: "Articles", href: `/${lang}/content-management` },
          { label: "Pages (HP)", href: `/${lang}/content-management/pages` },
          { label: "Tarifs", href: `/${lang}/content-management/tarifs` },
          { label: "SEO / JSON-LD", href: `/${lang}/content-management/seo` },
          { label: "Soumissions", href: `/${lang}/content-management/soumissions` },
          ...(role === "god" ? [{ label: "Parametres", href: `/${lang}/content-management/settings` }] : []),
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            style={{
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 500,
              color: "#0A0A0A",
              background: "#F5F3F0",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

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
          {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Posts table */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#777169", padding: 40 }}>Chargement...</p>
      ) : filteredPosts.length === 0 ? (
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
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
              {filteredPosts.map((post) => (
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
                        style={{
                          padding: "6px 12px",
                          fontSize: 12,
                          color: "#777169",
                          textDecoration: "none",
                          border: "1px solid #E5E0DA",
                          borderRadius: 8,
                        }}
                      >
                        Voir
                      </Link>
                      {canEditPosts && (
                        <>
                          <Link
                            href={`/${lang}/content-management/edit/${post.id}`}
                            style={{
                              padding: "6px 12px",
                              fontSize: 12,
                              color: "#0A0A0A",
                              textDecoration: "none",
                              border: "1px solid #E5E0DA",
                              borderRadius: 8,
                              background: "#FAFAF8",
                            }}
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            style={{
                              padding: "6px 12px",
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
    </div>
  );
}
