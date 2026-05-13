"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { useParams } from "next/navigation";
import { JobApplication } from "@/lib/cms/types";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout, CmsLoading } from "@/components/cms/CmsLayout";

export default function CandidaturesPage() {
  const params = useParams();
  const lang = params.lang as string;

  const { token, role } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [hubspotSent, setHubspotSent] = useState<Record<number, boolean>>({});
  const [hubspotSending, setHubspotSending] = useState<Record<number, boolean>>({});

  const canManage = role === "god";

  const fetchApplications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (statusFilter !== "all") qs.set("status", statusFilter);
      const res = await cmsFetch(`/api/cms/job-applications?${qs.toString()}`);
      if (res.status === 401) return;
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, cmsFetch]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleMarkRead = async (id: number, read: boolean) => {
    try {
      const res = await cmsFetch(`/api/cms/job-applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (res.ok) fetchApplications();
    } catch {
      alert("Erreur lors de la mise a jour");
    }
  };

  const handleSaveNote = async (id: number) => {
    const notes = noteInputs[id];
    if (notes === undefined) return;
    try {
      const res = await cmsFetch(`/api/cms/job-applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        fetchApplications();
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
    if (!confirm("Supprimer cette candidature ?")) return;
    try {
      const res = await cmsFetch(`/api/cms/job-applications/${id}`, { method: "DELETE" });
      if (res.ok) fetchApplications();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleSendToHubSpot = async (id: number) => {
    setHubspotSending((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await cmsFetch(`/api/cms/job-applications/${id}/send-to-hubspot`, {
        method: "POST",
      });
      if (res.ok) {
        setHubspotSent((prev) => ({ ...prev, [id]: true }));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erreur lors de l'envoi vers HubSpot");
      }
    } catch {
      alert("Erreur reseau");
    } finally {
      setHubspotSending((prev) => ({ ...prev, [id]: false }));
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
      title="Candidatures"
      subtitle="Postulations aux offres d'emploi"
    >
      {!canManage && (
        <div style={{ padding: "12px 16px", background: "#FFF3E0", borderRadius: 10, marginBottom: 20, color: "#E65100", fontSize: 14 }}>
          Lecture seule — Vous n&apos;avez pas les droits de modification sur cette section.
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
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
          {applications.length} candidature{applications.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <CmsLoading message="Chargement..." />
      ) : applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16 }}>
          <p style={{ color: "#777169" }}>Aucune candidature</p>
        </div>
      ) : (
        <div className="cms-table-scroll" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F0EBE5" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Offre</th>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Statut</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <Fragment key={a.id}>
                  <tr
                    style={{
                      borderBottom: "1px solid #F5F3F0",
                      borderLeft: a.read ? "3px solid transparent" : "3px solid #2563EB",
                      background: expandedId === a.id ? "#FAFAF8" : "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedId((id) => (id === a.id ? null : a.id))}
                  >
                    <td style={tdStyle}>#{a.id}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500, color: "#0A0A0A" }}>{a.jobTitle}</div>
                      <div style={{ fontSize: 12, color: "#A8A29E" }}>{a.jobReference}</div>
                    </td>
                    <td style={tdStyle}>{a.firstName} {a.lastName}</td>
                    <td style={tdStyle}>{a.email}</td>
                    <td style={tdStyle}>{formatDate(a.createdAt)}</td>
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
                          background: a.read ? "#E8F5E9" : "#FFF3E0",
                          color: a.read ? "#2E7D32" : "#E65100",
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.read ? "#2E7D32" : "#E65100" }} />
                        {a.read ? "Lu" : "Non lu"}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {canManage && (
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleMarkRead(a.id, !a.read)}
                            style={{
                              padding: "6px 12px",
                              fontSize: 12,
                              color: a.read ? "#E65100" : "#2E7D32",
                              border: "1px solid #E5E0DA",
                              borderRadius: 8,
                              background: "#FAFAF8",
                              cursor: "pointer",
                            }}
                          >
                            {a.read ? "Marquer non lu" : "Marquer lu"}
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
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
                  {expandedId === a.id && (
                    <tr>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div style={{ padding: "20px 24px", background: "#FAFAF8", borderBottom: "1px solid #F0EBE5" }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", marginBottom: 12 }}>
                            Details de la candidature
                          </h4>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px 24px", marginBottom: 16 }}>
                            <div>
                              <span style={{ fontSize: 12, color: "#A8A29E" }}>Reference</span>
                              <p style={{ fontSize: 14, color: "#3E3B38", marginTop: 2 }}>{a.jobReference}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: 12, color: "#A8A29E" }}>Telephone</span>
                              <p style={{ fontSize: 14, color: "#3E3B38", marginTop: 2 }}>{a.phone || "—"}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: 12, color: "#A8A29E" }}>LinkedIn</span>
                              <p style={{ fontSize: 14, color: "#3E3B38", marginTop: 2 }}>{a.linkedin || "—"}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: 12, color: "#A8A29E" }}>CV</span>
                              <p style={{ fontSize: 14, marginTop: 2 }}>
                                {a.cvUrl ? (
                                  <a
                                    href={a.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#2563EB", textDecoration: "underline" }}
                                  >
                                    Telecharger le CV
                                  </a>
                                ) : (
                                  <span style={{ color: "#A8A29E" }}>—</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div style={{ marginBottom: 16 }}>
                            <span style={{ fontSize: 12, color: "#A8A29E", display: "block", marginBottom: 6 }}>Message</span>
                            <p style={{ fontSize: 14, color: "#3E3B38", lineHeight: 1.5, whiteSpace: "pre-line" }}>{a.message}</p>
                          </div>
                          {canManage && (
                            <div style={{ marginTop: 16 }}>
                              <label style={{ fontSize: 12, color: "#A8A29E", display: "block", marginBottom: 6 }}>
                                Notes internes
                              </label>
                              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <textarea
                                  value={noteInputs[a.id] ?? a.notes ?? ""}
                                  onChange={(e) => setNoteInputs((prev) => ({ ...prev, [a.id]: e.target.value }))}
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
                                  onClick={() => handleSaveNote(a.id)}
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
                          {canManage && (
                            <div style={{ marginTop: 16 }}>
                              <button
                                onClick={() => handleSendToHubSpot(a.id)}
                                disabled={hubspotSending[a.id] || hubspotSent[a.id]}
                                style={{
                                  padding: "10px 16px",
                                  fontSize: 13,
                                  fontWeight: 500,
                                  borderRadius: 10,
                                  border: "none",
                                  cursor: hubspotSending[a.id] || hubspotSent[a.id] ? "not-allowed" : "pointer",
                                  background: hubspotSent[a.id] ? "#E8F5E9" : "#2563EB",
                                  color: hubspotSent[a.id] ? "#2E7D32" : "#fff",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                {hubspotSent[a.id] ? (
                                  <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Envoye vers HubSpot
                                  </>
                                ) : hubspotSending[a.id] ? (
                                  "Envoi..."
                                ) : (
                                  "Envoyer vers HubSpot"
                                )}
                              </button>
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
