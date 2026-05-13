"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormSubmission, JobApplication } from "@/lib/cms/types";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout, CmsLoading } from "@/components/cms/CmsLayout";

export default function SubmissionsPage() {
  const params = useParams();
  const lang = params.lang as string;

  const { token, role } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

  const [view, setView] = useState<"forms" | "jobs">("forms");

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "demo" | "contact">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">("all");
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});

  const canManage = role === "god";

  const fetchSubmissions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (typeFilter !== "all") qs.set("type", typeFilter);
      if (statusFilter !== "all") qs.set("status", statusFilter);
      const res = await cmsFetch(`/api/cms/submissions?${qs.toString()}`);
      if (res.status === 401) return;
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [token, typeFilter, statusFilter, cmsFetch]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleMarkRead = async (id: number, read: boolean) => {
    try {
      const res = await cmsFetch(`/api/cms/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (res.ok) fetchSubmissions();
    } catch {
      alert("Erreur lors de la mise a jour");
    }
  };

  const handleSaveNote = async (id: number) => {
    const notes = noteInputs[id];
    if (notes === undefined) return;
    try {
      const res = await cmsFetch(`/api/cms/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        fetchSubmissions();
        setNoteInputs((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    } catch {
      alert("Erreur lors de la sauvegarde de la note");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette soumission ?")) return;
    try {
      const res = await cmsFetch(`/api/cms/submissions/${id}`, { method: "DELETE" });
      if (res.ok) fetchSubmissions();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!token) {
    return <CmsLoading message="Redirection..." />;
  }

  return (
    <CmsLayout
      lang={lang}
      token={token}
      role={role}
      title="Soumissions"
      subtitle="Demandes de demo, formulaires de contact et candidatures"
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Link
          href={`/${lang}/content-management/soumissions`}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 10,
            textDecoration: "none",
            background: "#0A0A0A",
            color: "#fff",
          }}
        >
          Formulaires ({submissions.length})
        </Link>
        <Link
          href={`/${lang}/content-management/candidatures`}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 10,
            textDecoration: "none",
            background: "#E5E0DA",
            color: "#3E3B38",
          }}
        >
          Candidatures
        </Link>
      </div>
      {!canManage && (
        <div style={{ padding: "12px 16px", background: "#FFF3E0", borderRadius: 10, marginBottom: 20, color: "#E65100", fontSize: 14 }}>
          Lecture seule — Vous n&apos;avez pas les droits de modification sur cette section.
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {(["all", "demo", "contact"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: typeFilter === f ? "#0A0A0A" : "#E5E0DA",
              color: typeFilter === f ? "#fff" : "#3E3B38",
            }}
          >
            {f === "all" ? "Tous" : f === "demo" ? "Demo" : "Contact"}
          </button>
        ))}
        <div style={{ width: 1, background: "#E5E0DA", margin: "0 4px" }} />
        {(["all", "read", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: statusFilter === f ? "#2563EB" : "#E5E0DA",
              color: statusFilter === f ? "#fff" : "#3E3B38",
            }}
          >
            {f === "all" ? "Tous" : f === "read" ? "Lus" : "Non lus"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#777169", alignSelf: "center" }}>
          {submissions.length} soumission{submissions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <CmsLoading message="Chargement..." />
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16 }}>
          <p style={{ color: "#777169" }}>Aucune soumission</p>
        </div>
      ) : (
        <div className="cms-table-scroll" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F0EBE5" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Statut</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <Fragment key={s.id}>
                  <tr
                    style={{
                      borderBottom: "1px solid #F5F3F0",
                      borderLeft: s.read ? "3px solid transparent" : "3px solid #2563EB",
                      background: expandedId === s.id ? "#FAFAF8" : "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedId((id) => (id === s.id ? null : s.id))}
                  >
                    <td style={tdStyle}>#{s.id}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 500,
                          background: s.formType === "demo" ? "#E3F2FD" : "#F3E5F5",
                          color: s.formType === "demo" ? "#1565C0" : "#6A1B9A",
                        }}
                      >
                        {s.formType === "demo" ? "Demo" : "Contact"}
                      </span>
                    </td>
                    <td style={tdStyle}>{s.email}</td>
                    <td style={tdStyle}>{formatDate(s.createdAt)}</td>
                    <td style={tdStyle}>
                      {(s.data.firstname as string) || ""} {(s.data.lastname as string) || ""}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 500,
                          background: s.read ? "#E8F5E9" : "#FFF3E0",
                          color: s.read ? "#2E7D32" : "#E65100",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: s.read ? "#2E7D32" : "#E65100",
                          }}
                        />
                        {s.read ? "Lu" : "Non lu"}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {canManage && (
                        <div
                          style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleMarkRead(s.id, !s.read)}
                            style={{
                              padding: "6px 12px",
                              fontSize: 12,
                              color: s.read ? "#E65100" : "#2E7D32",
                              border: "1px solid #E5E0DA",
                              borderRadius: 8,
                              background: "#FAFAF8",
                              cursor: "pointer",
                            }}
                          >
                            {s.read ? "Marquer non lu" : "Marquer lu"}
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
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
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedId === s.id && (
                    <tr>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div
                          style={{
                            padding: "20px 24px",
                            background: "#FAFAF8",
                            borderBottom: "1px solid #F0EBE5",
                          }}
                        >
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", marginBottom: 12 }}>
                            Details de la soumission
                          </h4>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                              gap: "8px 24px",
                              marginBottom: 16,
                            }}
                          >
                            {Object.entries(s.data).map(([key, value]) => (
                              <div key={key}>
                                <span style={{ fontSize: 12, color: "#A8A29E", textTransform: "capitalize" }}>
                                  {key}
                                </span>
                                <p style={{ fontSize: 14, color: "#3E3B38", marginTop: 2 }}>
                                  {String(value ?? "—")}
                                </p>
                              </div>
                            ))}
                          </div>
                          {canManage && (
                            <div style={{ marginTop: 16 }}>
                              <label style={{ fontSize: 12, color: "#A8A29E", display: "block", marginBottom: 6 }}>
                                Notes internes
                              </label>
                              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <textarea
                                  value={noteInputs[s.id] ?? s.notes ?? ""}
                                  onChange={(e) =>
                                    setNoteInputs((prev) => ({ ...prev, [s.id]: e.target.value }))
                                  }
                                  rows={3}
                                  style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    fontSize: 14,
                                    border: "1px solid #E5E0DA",
                                    borderRadius: 10,
                                    background: "#fff",
                                    outline: "none",
                                    resize: "vertical",
                                  }}
                                  placeholder="Ajouter une note..."
                                />
                                <button
                                  onClick={() => handleSaveNote(s.id)}
                                  style={{
                                    padding: "10px 16px",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "#fff",
                                    background: "#0A0A0A",
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                  }}
                                >
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CmsLayout>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "16px 20px",
  fontWeight: 500,
  color: "#777169",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "16px 20px",
  color: "#3E3B38",
};
