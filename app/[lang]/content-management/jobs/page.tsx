"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Job } from "@/lib/cms/types";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout } from "@/components/cms/CmsLayout";

export default function JobsListPage() {
  const params = useParams();
  const lang = params.lang as string;

  const { token, role } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(false);

  const canEdit = role === "god" || role === "editorial";

  const fetchJobs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await cmsFetch(`/api/cms/jobs?status=${filter}`);
      if (res.status === 401) return;
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [token, filter, cmsFetch]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette offre ? Cette action est irreversible.")) return;
    try {
      const res = await cmsFetch(`/api/cms/jobs/${id}`, { method: "DELETE" });
      if (res.ok) fetchJobs();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const typeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cdi: "CDI", cdd: "CDD", freelance: "Freelance", stage: "Stage", alternance: "Alternance",
    };
    return labels[type] || type;
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4e4e4e" }}>Redirection...</p>
      </div>
    );
  }

  return (
    <CmsLayout
      lang={lang}
      token={token}
      role={role}
      title="Offres d'emploi"
      subtitle="Gerer les offres publiees sur la page Carrieres"
      showBack={false}
      extraActions={
        canEdit ? (
          <Link
            href={`/${lang}/content-management/jobs/edit/new`}
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
            + Nouvelle offre
          </Link>
        ) : undefined
      }
    >
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
              background: filter === f ? "#0A0A0A" : "#e5e5e5",
              color: filter === f ? "#fff" : "#4e4e4e",
            }}
          >
            {f === "all" ? "Tous" : f === "published" ? "Publiees" : "Brouillons"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#4e4e4e", alignSelf: "center" }}>
          {jobs.length} offre{jobs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#4e4e4e", padding: 40 }}>Chargement...</p>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16 }}>
          <p style={{ color: "#4e4e4e", marginBottom: 16 }}>Aucune offre</p>
          <Link
            href={`/${lang}/content-management/jobs/edit/new`}
            style={{ color: "#0A0A0A", fontWeight: 500, textDecoration: "underline" }}
          >
            Creer votre premiere offre
          </Link>
        </div>
      ) : (
        <div
          className="cms-table-scroll"
          style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F0EBE5" }}>
                <th style={thStyle}>Reference</th>
                <th style={thStyle}>Titre</th>
                <th style={thStyle}>Departement</th>
                <th style={thStyle}>Lieu</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Statut</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                >
                  <td style={{ ...tdStyle, color: "#A8A29E", fontSize: 12 }}>{job.reference}</td>
                  <td style={tdStyle}>
                    <div>
                      <div style={{ fontWeight: 500, color: "#0A0A0A", marginBottom: 2 }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: "#A8A29E" }}>/{job.slug}</div>
                    </div>
                  </td>
                  <td style={tdStyle}>{job.department}</td>
                  <td style={tdStyle}>{job.location}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        background: "#F0F0F0",
                        color: "#4e4e4e",
                      }}
                    >
                      {typeLabel(job.type)}
                    </span>
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
                        background: job.published ? "#E8F5E9" : "#FFF3E0",
                        color: job.published ? "#2E7D32" : "#E65100",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: job.published ? "#2E7D32" : "#E65100",
                        }}
                      />
                      {job.published ? "Publiee" : "Brouillon"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <Link
                        href={`/${lang}/carrieres/${job.slug}`}
                        target="_blank"
                        className="cms-touch-target"
                        style={{
                          padding: "10px 16px",
                          fontSize: 12,
                          color: "#4e4e4e",
                          textDecoration: "none",
                          border: "1px solid #e5e5e5",
                          borderRadius: 8,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Voir
                      </Link>
                      {canEdit && (
                        <>
                          <Link
                            href={`/${lang}/content-management/jobs/edit/${job.id}`}
                            className="cms-touch-target"
                            style={{
                              padding: "10px 16px",
                              fontSize: 12,
                              color: "#0A0A0A",
                              textDecoration: "none",
                              border: "1px solid #e5e5e5",
                              borderRadius: 8,
                              background: "#FAFAF8",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(job.id)}
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

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "16px 20px",
  fontWeight: 500,
  color: "#4e4e4e",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "16px 20px",
  color: "#4e4e4e",
};
