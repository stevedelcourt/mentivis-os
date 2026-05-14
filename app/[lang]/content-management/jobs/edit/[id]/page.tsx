"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { JobType } from "@/lib/cms/types";

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
  const [whyJoin, setWhyJoin] = useState(`About MentivisOS

MentivisOS is the AI operating system for education, training, and workforce transformation.

Created by Mentivis, a consulting and educational engineering firm specialized in learning systems, digital transformation, and AI-driven institutional strategy, MentivisOS helps organizations design, operate, and scale modern learning ecosystems.

We work with schools, universities, corporate academies, training providers, companies, and public institutions facing the same challenge: how to continuously develop skills and talent in an AI-shaped world.

MentivisOS combines strategic consulting, pedagogical expertise, operational execution, and artificial intelligence into one integrated system designed for real-world deployment.

Today, MentivisOS supports educational and workforce initiatives across higher education, vocational training, corporate learning, and institutional transformation projects in France and internationally.

Our ecosystem is built around three core dimensions:

• MentivisOS Intelligence powers educational operations, pedagogy, governance, automation, and AI-enhanced learning experiences.
• TalentOS connects recruitment, onboarding, upskilling, and talent pipeline management into a unified intelligence layer.
• Marius AI delivers AI-powered guidance, support, tutoring, automation, and knowledge access for learners, educators, managers, and institutions.

Everything we build is grounded in operational reality. We are not a generic SaaS platform. We are educators, strategists, technologists, and operators working directly with institutions and organizations navigating transformation.

How we work

Education-native
Our foundation comes from years of experience in education, training, institutional strategy, and pedagogical engineering.

AI-first
We integrate AI across the full lifecycle of learning and workforce development - curriculum design, admissions, student support, training delivery, evaluation, administration, recruitment, and strategic decision-making.

Built for implementation
We focus on execution, adoption, governance, and measurable outcomes, not just recommendations or concepts.

Interdisciplinary teams
Our work combines expertise in pedagogy, AI, strategy, operations, communication, technology, and institutional management.

Human-centered transformation
We believe AI should strengthen human capabilities, improve access to education, and help institutions adapt responsibly to technological change.

What we offer

Intelligent learning infrastructure
One ecosystem to manage education, training, talent development, AI support, and operational workflows.

Institutional transformation
Strategic and operational support for organizations adapting to AI, digital transformation, and changing workforce dynamics.

Workforce and talent acceleration
Tools and systems to recruit, train, retain, and evolve talent pipelines at scale.

AI acculturation
Through initiatives such as ICIA - Institut Collectif de l'Intelligence Artificielle, we contribute to large-scale AI literacy and public education.

Adaptive ecosystems
Flexible infrastructures designed to evolve continuously alongside technological, economic, and societal shifts.

Long-term partnerships
We work alongside institutions and organizations to co-build sustainable educational and workforce models over time.`);
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
          method: "POST",
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
                color: "#777169",
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              /carrieres/{slug}
            </div>
            <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
              URL generee automatiquement — non modifiable
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
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3E3B38" }}>
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
                  color: type === jt.key ? "#fff" : "#3E3B38",
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
            rows={8}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
            placeholder={`Decrivez la culture, les avantages, l'impact du poste...\n\n• Equipe dynamique\n• Projets challenges\n• Impact direct`}
          />
        </div>

        <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3E3B38" }}>
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
                border: "1px solid #E5E0DA",
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
              color: "#777169",
              textDecoration: "none",
              border: "1px solid #E5E0DA",
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
