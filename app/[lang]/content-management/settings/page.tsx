"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface UserItem {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

const TABS = [
  { label: "Articles", href: "content-management" },
  { label: "Pages (HP)", href: "content-management/pages" },
  { label: "Tarifs", href: "content-management/tarifs" },
  { label: "SEO / JSON-LD", href: "content-management/seo" },
  { label: "Soumissions", href: "content-management/soumissions" },
  { label: "Parametres", href: "content-management/settings", godOnly: true },
];

const ROLE_LABELS: Record<string, string> = {
  god: "God",
  editorial: "Editorial",
  tarifs: "Tarifs",
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  god: { bg: "#0A0A0A", color: "#fff" },
  editorial: { bg: "#E3F2FD", color: "#1565C0" },
  tarifs: { bg: "#FFF3E0", color: "#E65100" },
};

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"editorial" | "tarifs" | "god">("editorial");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cms_token");
    const storedRole = localStorage.getItem("cms_role");
    if (!stored) {
      router.push(`/${lang}/content-management`);
      return;
    }
    setToken(stored);
    setRole(storedRole);
    if (storedRole !== "god") {
      // Non-god users shouldn't be here
      router.push(`/${lang}/content-management`);
    }
  }, [lang, router]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cms/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("cms_token");
        localStorage.removeItem("cms_role");
        router.push(`/${lang}/content-management`);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, [token, lang, router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setInviting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/cms/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail, name: inviteName, password: invitePassword, role: inviteRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Utilisateur ${inviteEmail} cree avec succes.`);
        setInviteEmail("");
        setInviteName("");
        setInvitePassword("");
        setInviteRole("editorial");
        fetchUsers();
      } else {
        setError(data.error || "Erreur lors de la creation");
      }
    } catch {
      setError("Erreur reseau");
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`/api/cms/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Utilisateur supprime.");
        fetchUsers();
      } else {
        setError(data.error || "Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur reseau");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (!token || role !== "god") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#777169" }}>{role !== "god" ? "Acces refuse..." : "Redirection..."}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0A0A0A", marginBottom: 4 }}>Parametres</h1>
          <p style={{ fontSize: 14, color: "#777169" }}>Gestion des utilisateurs et droits d&apos;acces</p>
        </div>
        <Link href={`/${lang}/content-management`} style={{ padding: "10px 20px", fontSize: 14, color: "#777169", textDecoration: "none", border: "1px solid #E5E0DA", borderRadius: 10, background: "#FAFAF8" }}>
          ← Retour au tableau de bord
        </Link>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 100, paddingBottom: 16, borderBottom: "1px solid #F0EBE5", flexWrap: "wrap" }}>
        {TABS.filter((t) => !t.godOnly || role === "god").map((tab) => (
          <Link key={tab.label} href={`/${lang}/${tab.href}`} style={{ padding: "8px 16px", fontSize: 14, fontWeight: 500, color: "#0A0A0A", background: "#F5F3F0", borderRadius: 8, textDecoration: "none" }}>
            {tab.label}
          </Link>
        ))}
      </div>

      {error && <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 20, color: "#c45c4a", fontSize: 14 }}>{error}</div>}
      {success && <div style={{ padding: "12px 16px", background: "#E8F5E9", borderRadius: 10, marginBottom: 20, color: "#2E7D32", fontSize: 14 }}>{success}</div>}

      {/* Invite form */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 20 }}>Inviter un utilisateur</h2>
        <form onSubmit={handleInvite}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div><label style={labelStyle}>Email *</label><input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required style={inputStyle} placeholder="nom@mentivis.com" /></div>
            <div><label style={labelStyle}>Nom</label><input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} style={inputStyle} placeholder="Prenom Nom" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Role *</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "editorial" | "tarifs" | "god")} style={inputStyle}>
                <option value="editorial">Editorial (articles)</option>
                <option value="tarifs">Tarifs (prix)</option>
                <option value="god">God (admin complet)</option>
              </select>
            </div>
            <div><label style={labelStyle}>Mot de passe initial *</label><input type="password" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} required style={inputStyle} /></div>
          </div>
          <button type="submit" disabled={inviting} style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, color: "#fff", background: "#0A0A0A", border: "none", borderRadius: 10, cursor: inviting ? "not-allowed" : "pointer", opacity: inviting ? 0.6 : 1 }}>
            {inviting ? "Creation..." : "Creer l'utilisateur"}
          </button>
        </form>
      </div>

      {/* Users table */}
      <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 20 }}>Utilisateurs</h2>
      {loading ? (
        <p style={{ color: "#777169" }}>Chargement...</p>
      ) : users.length === 0 ? (
        <p style={{ color: "#777169" }}>Aucun utilisateur.</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F0EBE5" }}>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Date</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #F5F3F0" }}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: "4px 10px", fontSize: 12, fontWeight: 500, borderRadius: 999, background: ROLE_COLORS[user.role]?.bg || "#E5E0DA", color: ROLE_COLORS[user.role]?.color || "#3E3B38" }}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatDate(user.createdAt)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={user.email === "steven.delcourt@mentivis.com"}
                      style={{
                        padding: "6px 12px",
                        fontSize: 12,
                        color: user.email === "steven.delcourt@mentivis.com" ? "#A8A29E" : "#c45c4a",
                        border: "1px solid #F5E0DC",
                        borderRadius: 8,
                        background: user.email === "steven.delcourt@mentivis.com" ? "#F5F3F0" : "#FEF2F0",
                        cursor: user.email === "steven.delcourt@mentivis.com" ? "not-allowed" : "pointer",
                      }}
                      title={user.email === "steven.delcourt@mentivis.com" ? "Super admin protege" : "Supprimer"}
                    >
                      Supprimer
                    </button>
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

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#3E3B38", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: 15, border: "1px solid #E5E0DA", borderRadius: 10, background: "#FAFAF8", outline: "none", boxSizing: "border-box" };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "16px 20px", fontWeight: 500, color: "#777169", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "16px 20px", color: "#3E3B38" };
