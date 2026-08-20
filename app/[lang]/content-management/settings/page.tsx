"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout, CmsLoading, CmsAlert } from "@/components/cms/CmsLayout";

interface UserItem {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

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

  const { token, role, isReady } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

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

  // Auth guard
  useEffect(() => {
    if (!isReady) return;
    if (!token || role !== "god") {
      router.push(`/${lang}/content-management`);
    }
  }, [isReady, token, role, lang, router]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await cmsFetch("/api/cms/users");
      if (res.status === 401 || res.status === 403) {
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
  }, [token, lang, router, cmsFetch]);

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
      const res = await cmsFetch("/api/cms/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      const res = await cmsFetch(`/api/cms/users/${id}`, { method: "DELETE" });
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
    return <CmsLoading message={role !== "god" ? "Acces refuse..." : "Redirection..."} />;
  }

  return (
    <CmsLayout
      lang={lang}
      token={token}
      role={role}
      title="Parametres"
      subtitle="Gestion des utilisateurs et droits d'acces"
      maxWidth={1000}
    >
      {error && <CmsAlert type="error" message={error} onDismiss={() => setError("")} />}
      {success && <CmsAlert type="success" message={success} onDismiss={() => setSuccess("")} />}

      {/* Invite form */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 20 }}>Inviter un utilisateur</h2>
        <form onSubmit={handleInvite} autoComplete="on">
          <div className="cms-grid-2" style={{ marginBottom: 16 }}>
            <div>
              <label htmlFor="invite-email" style={labelStyle}>Email *</label>
              <input id="invite-email" name="email" type="email" autoComplete="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required style={inputStyle} placeholder="nom@mentivis.com" />
            </div>
            <div>
              <label htmlFor="invite-name" style={labelStyle}>Nom</label>
              <input id="invite-name" name="name" type="text" autoComplete="name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} style={inputStyle} placeholder="Prenom Nom" />
            </div>
          </div>
          <div className="cms-grid-2" style={{ marginBottom: 16 }}>
            <div>
              <label htmlFor="invite-role" style={labelStyle}>Role *</label>
              <select id="invite-role" name="role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "editorial" | "tarifs" | "god")} style={inputStyle}>
                <option value="editorial">Editorial (articles)</option>
                <option value="tarifs">Tarifs (prix)</option>
                <option value="god">God (admin complet)</option>
              </select>
            </div>
            <div>
              <label htmlFor="invite-password" style={labelStyle}>Mot de passe initial *</label>
              <input id="invite-password" name="password" type="password" autoComplete="new-password" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} required style={inputStyle} />
            </div>
          </div>
          <button type="submit" disabled={inviting} style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, color: "#fff", background: "#0A0A0A", border: "none", borderRadius: 10, cursor: inviting ? "not-allowed" : "pointer", opacity: inviting ? 0.6 : 1 }}>
            {inviting ? "Creation..." : "Creer l'utilisateur"}
          </button>
        </form>
      </div>

      {/* Users table */}
      <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 20 }}>Utilisateurs</h2>
      {loading ? (
        <p style={{ color: "#4e4e4e" }}>Chargement...</p>
      ) : users.length === 0 ? (
        <p style={{ color: "#4e4e4e" }}>Aucun utilisateur.</p>
      ) : (
        <div className="cms-table-scroll" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
                <tr key={user.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: "4px 10px", fontSize: 12, fontWeight: 500, borderRadius: 999, background: ROLE_COLORS[user.role]?.bg || "#e5e5e5", color: ROLE_COLORS[user.role]?.color || "#4e4e4e" }}>
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
                        background: user.email === "steven.delcourt@mentivis.com" ? "#f5f5f5" : "#FEF2F0",
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
    </CmsLayout>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#4e4e4e", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: 15, border: "1px solid #e5e5e5", borderRadius: 10, background: "#FAFAF8", outline: "none", boxSizing: "border-box" };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "16px 20px", fontWeight: 500, color: "#4e4e4e", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "16px 20px", color: "#4e4e4e" };
