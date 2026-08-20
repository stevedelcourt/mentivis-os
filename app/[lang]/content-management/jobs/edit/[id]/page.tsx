"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { JobType } from "@/lib/cms/types";
import { htmlToMarkdown } from "@/lib/html-to-markdown";

import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout, CmsLoading } from "@/components/cms/CmsLayout";

const JOB_TYPES: { key: JobType; label: string }[] = [
  { key: "cdi", label: "CDI" },
  { key: "cdd", label: "CDD" },
  { key: "freelance", label: "Freelance" },
  { key: "stage", label: "Stage" },
  { key: "alternance", label: "Alternance" },
];

export default function JobEditorPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const id = params.id as string;
  const isNew = id === "new";

  const { token, role, isReady } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [type, setType] = useState<JobType>("cdi");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [whyJoin, setWhyJoin] = useState(`## À propos de Mentivis & MentivisOS

MentivisOS est le système d'exploitation IA dédié à l'éducation, à la formation et à la transformation des compétences.

Créé par Mentivis, cabinet de conseil et d'ingénierie pédagogique spécialisé dans les systèmes d'apprentissage, la transformation numérique et les stratégies institutionnelles pilotées par l'IA, MentivisOS aide les organisations à concevoir, piloter et faire évoluer des écosystèmes de formation modernes.

Nous accompagnons des écoles, universités, académies d'entreprise, organismes de formation, entreprises et institutions publiques confrontés à un même défi : développer en continu les compétences et les talents dans un monde façonné par l'IA.

MentivisOS combine conseil stratégique, expertise pédagogique, exécution opérationnelle et intelligence artificielle au sein d'un système intégré conçu pour un déploiement concret sur le terrain.

## Notre manière de travailler

• ADN éducation - Notre expertise s'appuie sur des années d'expérience dans l'éducation, la formation, la stratégie institutionnelle et l'ingénierie pédagogique.
• AI-first - Nous intégrons l'IA sur l'ensemble du cycle de développement des compétences : conception des programmes, admissions, accompagnement des apprenants, formation, évaluation, administration, recrutement et pilotage stratégique.
• Pensé pour l'exécution - Nous nous concentrons sur le déploiement, l'adoption, la gouvernance et les résultats mesurables.
• Équipes interdisciplinaires - Nos projets croisent pédagogie, IA, stratégie, opérations, communication, technologie et management institutionnel.
• Transformation centrée sur l'humain - Nous pensons que l'IA doit renforcer les capacités humaines, améliorer l'accès à l'éducation et aider les institutions à s'adapter de manière responsable.

## Ce que nous construisons

• Infrastructures d'apprentissage intelligentes - Un écosystème unique pour gérer la formation, le développement des talents, l'assistance IA et les opérations pédagogiques.
• Transformation institutionnelle - Un accompagnement stratégique et opérationnel pour les organisations confrontées à l'IA, à la transformation numérique et à l'évolution des métiers.
• Accélération des talents - Des systèmes pour recruter, former, fidéliser et faire évoluer les talents à grande échelle.
• Acculturation IA - À travers des initiatives comme ICIA - Institut Collectif de l'Intelligence Artificielle, nous participons à la diffusion massive des connaissances et usages de l'IA.
• Écosystèmes adaptatifs - Des infrastructures flexibles conçues pour évoluer en permanence avec les transformations technologiques, économiques et sociétales.
• Partenariats de long terme - Nous travaillons aux côtés des institutions et des organisations pour co-construire des modèles éducatifs et RH durables dans le temps.`);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.push(`/${lang}/content-management`);
      return;
    }
    if (role !== "god" && role !== "editorial") {
      router.push(`/${lang}/content-management`);
    }
  }, [isReady, token, role, lang, router]);

  const loadJob = useCallback(async () => {
    if (isNew || !token) return;
    setLoading(true);
    try {
      const res = await cmsFetch(`/api/cms/jobs/${id}`);
      if (res.status === 401) {
        router.push(`/${lang}/content-management`);
        return;
      }
      const data = await res.json();
      if (data.job) {
        const j = data.job;
        setTitle(j.title);
        setSlug(j.slug);
        setLocation(j.location);
        setRemote(j.remote);
        setType(j.type);
        setDepartment(j.department);
        setDescription(j.description);
        setWhyJoin(j.whyJoin);
        setPublished(j.published);
      }
    } catch {
      setError("Erreur lors du chargement de l'offre");
    } finally {
      setLoading(false);
    }
  }, [id, isNew, token, lang, router, cmsFetch]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>, setter: (v: string) => void) => {
    const html = e.clipboardData.getData("text/html");
    if (html) {
      e.preventDefault();
      const markdown = htmlToMarkdown(html);
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const before = target.value.slice(0, start);
      const after = target.value.slice(end);
      setter(before + markdown + after);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + markdown.length;
      });
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    const payload = {
      title,
      location,
      remote,
      type,
      department,
      description,
      whyJoin,
      published,
    };

    try {
      let res;
      if (isNew) {
        res = await cmsFetch("/api/cms/jobs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await cmsFetch(`/api/cms/jobs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (isNew) {
          setTimeout(() => {
            router.push(`/${lang}/content-management/jobs/edit/${data.job.id}`);
          }, 500);
        }
      } else {
        setError(data.error || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur reseau");
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return <CmsLoading message="Redirection..." />;
  }

  if (loading) {
    return <CmsLoading />;
  }

  return (
    <CmsLayout
      lang={lang}
      token={token}
      role={role}
      title={isNew ? "Nouvelle offre" : "Modifier l'offre"}
      maxWidth={800}
      showNav={false}
      backHref={`/${lang}/content-management/jobs`}
      backLabel="← Retour aux offres"
    >
      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 20, color: "#c45c4a", fontSize: 14 }}>
          {error}
        </div>
      )}

      {saveSuccess && (
        <div style={{ padding: "12px 16px", background: "#E8F5E9", borderRadius: 10, marginBottom: 20, color: "#2E7D32", fontSize: 14 }}>
          Offre enregistree avec succes !
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
            placeholder="ex: Ingenieur IA"
          />
        </div>

        {slug && (
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>URL publique</label>
            <div
              style={{
                ...inputStyle,
                background: "#F0F0F0",
                color: "#4e4e4e",
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              /carrieres/{slug}
            </div>
            <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
              URL generee automatiquement - non modifiable
            </p>
          </div>
        )}

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Lieu *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={inputStyle}
              placeholder="ex: Paris"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#4e4e4e" }}>
              <input
                type="checkbox"
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
                style={{ width: 22, height: 22 }}
              />
              Remote possible
            </label>
          </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Departement *</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            style={inputStyle}
            placeholder="ex: Produit, Technique, Commercial"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Type de contrat *</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {JOB_TYPES.map((jt) => (
              <label
                key={jt.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: type === jt.key ? "#0A0A0A" : "#F0F0F0",
                  color: type === jt.key ? "#fff" : "#4e4e4e",
                  fontSize: 13,
                  fontWeight: 500,
                  userSelect: "none",
                }}
              >
                <input
                  type="radio"
                  name="job-type"
                  checked={type === jt.key}
                  onChange={() => setType(jt.key)}
                  style={{ display: "none" }}
                />
                {jt.label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Description du poste *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onPaste={(e) => handlePaste(e, setDescription)}
            required
            rows={12}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
            placeholder={`## Missions\n\n• Mission 1\n• Mission 2\n\n## Profil recherche\n\n• Competence 1\n• Competence 2\n\n## Avantages\n\n• Avantage 1\n• Avantage 2`}
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
            Utilisez ## pour les titres et bullet points avec •
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Pourquoi nous rejoindre</label>
          <textarea
            value={whyJoin}
            onChange={(e) => setWhyJoin(e.target.value)}
            onPaste={(e) => handlePaste(e, setWhyJoin)}
            rows={8}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
            placeholder={`Decrivez la culture, les avantages, l'impact du poste...\n\n• Equipe dynamique\n• Projets challenges\n• Impact direct`}
          />
        </div>

        <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#4e4e4e" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 22, height: 22 }}
            />
            Publier immediatement
          </label>
        </div>

        <div className="cms-sticky-actions" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 500,
              color: "#fff",
              background: "#0A0A0A",
              border: "none",
              borderRadius: 10,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          {!isNew && (
            <Link
              href={`/${lang}/carrieres/${slug}`}
              target="_blank"
              style={{
                padding: "14px 24px",
                fontSize: 15,
                color: "#0A0A0A",
                textDecoration: "none",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              Previsualiser
            </Link>
          )}
          <Link
            href={`/${lang}/content-management/jobs`}
            style={{
              padding: "14px 24px",
              fontSize: 15,
              color: "#4e4e4e",
              textDecoration: "none",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              background: "#FAFAF8",
              marginLeft: "auto",
            }}
          >
            ← Retour
          </Link>
        </div>
      </form>
    </CmsLayout>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#4e4e4e",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  border: "1px solid #e5e5e5",
  borderRadius: 10,
  background: "#FAFAF8",
  outline: "none",
  boxSizing: "border-box",
};
