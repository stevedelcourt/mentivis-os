import { Locale } from "@/lib/i18n";
import { ChatMockup } from "@/components/chat-mockup";
import { ChartMockup } from "@/components/chart-mockup";
import { ModuleCard } from "@/components/module-card";
import TopoLines from "@/components/topo-lines";
import FaqSection from "@/components/faq-section";
import InteractiveExplainer from "@/components/interactive-explainer";

export const metadata = {
  title: "Composants — MentivisOS",
};

const SAMPLE_CHAT = {
  user1: "Puis-je obtenir un remboursement ?",
  agent: "Bien sur. Pouvez-vous partager votre numero de commande s'il vous plait ?",
  user2: "C'est EL4543490",
  agent2: "Merci. J'ai lance le processus de remboursement de la commande.",
  success: "Remboursement effectue",
};

const SAMPLE_CHART = {
  title: "Taux de resolution",
  value: "83.4%",
  v1: "V1: 75.10%",
  v2: "V2: 62.65%",
  dateStart: "17 aout",
  dateEnd: "24 aout",
};

interface ComponentDef {
  name: string;
  file: string;
  desc: string;
  category: string;
  color: string;
  preview?: React.ReactNode;
}

const COMPONENTS: ComponentDef[] = [
  {
    name: "HeroUnit",
    file: "hero-unit.tsx",
    desc: "Hero section avec topo-lines et CTAs",
    category: "Layout",
    color: "#1a1a1a",
    preview: (
      <div style={{ padding: 24, background: "#f5f5f5", borderRadius: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 500, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Mentivis OS</p>
        <h3 style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.2, color: "#1a1a1a", marginBottom: 8 }}>Une plateforme capable de s'adapter en temps reel</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ padding: "6px 12px", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 11, fontWeight: 500 }}>Demarrer</span>
          <span style={{ padding: "6px 12px", borderRadius: 8, background: "#e5e5e5", color: "#1a1a1a", fontSize: 11, fontWeight: 500 }}>Contacter</span>
        </div>
      </div>
    ),
  },
  {
    name: "BentoSection",
    file: "bento-section.tsx",
    desc: "Grille bento avec chat mockup, chart mockup et cartes fonctionnalites",
    category: "Layout",
    color: "#4a7c5c",
    preview: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ padding: 16, background: "#1a3a2a", borderRadius: 16, minHeight: 80 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ alignSelf: "flex-end", padding: "4px 10px", borderRadius: 12, background: "rgba(255,255,255,0.1)", fontSize: 9, color: "#fff" }}>Hello</div>
            <div style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: 12, background: "#fff", fontSize: 9, color: "#1a1a1a" }}>Reponse</div>
          </div>
        </div>
        <div style={{ padding: 16, background: "#f5f5f5", borderRadius: 16, minHeight: 80 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#1a1a1a" }}>83.4%</p>
          <svg width="100%" height="30" viewBox="0 0 100 30">
            <path d="M0 20 Q25 15,50 10 T100 18" fill="none" stroke="#f97316" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    name: "ModulesSection",
    file: "modules-section.tsx",
    desc: "Grille de 6 modules avec illustrations SVG line-art",
    category: "Layout",
    color: "#6058A8",
    preview: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {["Diagnostic", "Accompagnement", "Pilotage"].map((t) => (
          <div key={t} style={{ padding: 12, background: "#f5f5f5", borderRadius: 12, textAlign: "center" }}>
            <svg width="32" height="32" viewBox="0 0 200 200" style={{ margin: "0 auto 6px" }}>
              <circle cx="100" cy="100" r="40" stroke="#1a1a1a" strokeWidth="1" opacity="0.2" fill="none" />
              <line x1="60" y1="100" x2="140" y2="100" stroke="#1a1a1a" strokeWidth="1" opacity="0.2" />
            </svg>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#1a1a1a" }}>{t}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "InteractiveShowcase",
    file: "interactive-showcase.tsx",
    desc: "Carousel d'orbs avec navigation et tabs produits",
    category: "Interactive",
    color: "#D85838",
    preview: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle,#7A6CC4,#DCC8E8)", opacity: 0.6, transform: "scale(0.7)" }} />
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle,#FF6878,#FFC8B8)", opacity: 1 }} />
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle,#7090A8,#B8C8B0)", opacity: 0.6, transform: "scale(0.7)" }} />
      </div>
    ),
  },
  {
    name: "InteractiveExplainer",
    file: "interactive-explainer.tsx",
    desc: "Vitrine produit interactive avec orbs, tabs et audio",
    category: "Interactive",
    color: "#7A6CC4",
    preview: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "radial-gradient(circle,#7A6CC4,#DCC8E8)" }} />
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "radial-gradient(circle,#F0C25C,#F4D8B0)" }} />
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "radial-gradient(circle,#FF6878,#FFC8B8)" }} />
      </div>
    ),
  },
  {
    name: "ImpactSection",
    file: "impact-section.tsx",
    desc: "Bento grid 5 cartes avec gradients et tabs",
    category: "Layout",
    color: "#E89868",
    preview: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gridTemplateRows: "1fr 1fr", gap: 6, height: 80 }}>
        <div style={{ gridRow: 1, gridColumn: 1, borderRadius: 8, background: "linear-gradient(135deg,#f59e0b,#92400e)" }} />
        <div style={{ gridRow: "1/3", gridColumn: 2, borderRadius: 8, background: "linear-gradient(155deg,#2E3D50,#080F1A)" }} />
        <div style={{ gridRow: 1, gridColumn: 3, borderRadius: 8, background: "#ebe7e0" }} />
        <div style={{ gridRow: 2, gridColumn: 1, borderRadius: 8, background: "#ebe7e0" }} />
        <div style={{ gridRow: 2, gridColumn: 3, borderRadius: 8, background: "linear-gradient(150deg,#8C8782,#1C1816)" }} />
      </div>
    ),
  },
  {
    name: "ProblemSection",
    file: "problem-section.tsx",
    desc: "Section probleme/solution",
    category: "Content",
    color: "#3A3A3A",
    preview: (
      <div style={{ padding: 16, background: "#f5f5f5", borderRadius: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 300, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 8 }}>Les LMS diffusent du contenu.</p>
        <p style={{ fontSize: 11, fontWeight: 300, color: "#6b6b6b", lineHeight: 1.4 }}>MentivisOS produit le diagnostic exact.</p>
      </div>
    ),
  },
  {
    name: "ProofSection",
    file: "proof-section.tsx",
    desc: "Cas reel avec outputs du diagnostic",
    category: "Content",
    color: "#4F8068",
    preview: (
      <div style={{ padding: 16, background: "#fff", borderRadius: 12, boxShadow: "0 0 0 1px rgba(0,0,0,.06)" }}>
        <p style={{ fontSize: 9, fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Output MentivisOS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {["Faisabilite: exigeante", "Score: 84/100", "Risque: 22"].map((l) => (
            <div key={l} style={{ fontSize: 10, color: "#1a1a1a", padding: "3px 0", borderBottom: "1px solid #f0f0f0" }}>{l}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "ShiftsSection",
    file: "shifts-section.tsx",
    desc: "4 deplacements pour les directions formation",
    category: "Content",
    color: "#5688C8",
    preview: (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {["01", "02", "03", "04"].map((n) => (
          <div key={n} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 9, color: "#999", fontWeight: 500, marginTop: 2 }}>{n}</span>
            <div style={{ height: 8, background: "#e5e5e5", borderRadius: 4, flex: 1 }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "IntegrationSection",
    file: "integration-section.tsx",
    desc: "3 modes d'integration en cartes gradient",
    category: "Layout",
    color: "#7eb8c8",
    preview: (
      <div style={{ display: "flex", gap: 8 }}>
        {["#7eb8c8", "#c49696", "#a89bc2"].map((c) => (
          <div key={c} style={{ flex: 1, height: 50, borderRadius: 12, background: c }} />
        ))}
      </div>
    ),
  },
  {
    name: "NotLmsSection",
    file: "not-lms-section.tsx",
    desc: "Comparaison LMS vs MentivisOS",
    category: "Content",
    color: "#1a1a1a",
    preview: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: "#999", marginBottom: 6 }}>LMS</p>
          <div style={{ height: 4, background: "#e5e5e5", borderRadius: 2, marginBottom: 4 }} />
          <div style={{ height: 4, background: "#e5e5e5", borderRadius: 2 }} />
        </div>
        <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>MentivisOS</p>
          <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, marginBottom: 4 }} />
          <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2 }} />
        </div>
      </div>
    ),
  },
  {
    name: "CombinationSection",
    file: "combination-section.tsx",
    desc: "Texte de positionnement cabinet",
    category: "Content",
    color: "#777169",
    preview: (
      <div style={{ padding: 16, background: "#f5f5f5", borderRadius: 12 }}>
        <div style={{ height: 6, background: "#e5e5e5", borderRadius: 3, marginBottom: 6, width: "90%" }} />
        <div style={{ height: 6, background: "#e5e5e5", borderRadius: 3, marginBottom: 6, width: "80%" }} />
        <div style={{ height: 6, background: "#e5e5e5", borderRadius: 3, width: "60%" }} />
      </div>
    ),
  },
  {
    name: "CTABlock",
    file: "cta-block.tsx",
    desc: "Bloc d'appel a l'action final",
    category: "Content",
    color: "#1a1a1a",
    preview: (
      <div style={{ padding: 20, background: "#f5f5f5", borderRadius: 12, textAlign: "center" }}>
        <div style={{ height: 8, background: "#e5e5e5", borderRadius: 4, marginBottom: 8, width: "70%", margin: "0 auto 8px" }} />
        <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 10, fontWeight: 500 }}>Demander une demo</span>
      </div>
    ),
  },
  {
    name: "FaqSection",
    file: "faq-section.tsx",
    desc: "Accordeon FAQ numerote avec animation expand/collapse",
    category: "Content",
    color: "#777169",
    preview: (
      <div style={{ padding: 16, background: "#fff", borderRadius: 12, boxShadow: "0 0 0 1px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["01", "02", "03"].map((n, i) => (
            <div key={n} style={{ padding: "8px 0", borderTop: i === 0 ? "none" : "1px solid #e5e5e5", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 500, color: "#999", minWidth: 18 }}>{n}</span>
              <div style={{ height: 6, background: "#e5e5e5", borderRadius: 3, flex: 1 }} />
              <div style={{ width: 10, height: 10, position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 1, background: "#999", transform: "translateY(-50%)" }} />
                <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: "#999", transform: "translateX(-50%)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "NavBar",
    file: "nav-bar.tsx",
    desc: "Navigation fixe avec dropdowns",
    category: "Navigation",
    color: "#1a1a1a",
    preview: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
        <div style={{ width: 60, height: 10, background: "#1a1a1a", borderRadius: 2 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 30, height: 6, background: "#e5e5e5", borderRadius: 3 }} />
          <div style={{ width: 30, height: 6, background: "#e5e5e5", borderRadius: 3 }} />
          <div style={{ width: 30, height: 6, background: "#e5e5e5", borderRadius: 3 }} />
        </div>
        <div style={{ width: 40, height: 14, background: "#1a1a1a", borderRadius: 4 }} />
      </div>
    ),
  },
  {
    name: "FooterBlock",
    file: "footer-block.tsx",
    desc: "Pied de page avec logomark anime",
    category: "Navigation",
    color: "#1a1a1a",
    preview: (
      <div style={{ padding: 16, background: "#1a1a1a", borderRadius: 12 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, background: "#fff", borderRadius: 1, opacity: i % 3 === 0 ? 1 : 0.5 }} />
          ))}
        </div>
        <div style={{ height: 4, background: "#333", borderRadius: 2, width: "60%" }} />
      </div>
    ),
  },
  {
    name: "LogomarkMotion",
    file: "logomark-motion.tsx",
    desc: "Animation SVG 17 carres W02 Drop Physics",
    category: "Motion",
    color: "#1a1a1a",
    preview: (
      <div style={{ display: "flex", justifyContent: "center", padding: 12 }}>
        <svg width="48" height="48" viewBox="0 0 130 130">
          {[
            [20,20],[100,20],[20,40],[40,40],[80,40],[100,40],[20,60],[40,60],[60,60],[80,60],[100,60],[20,80],[40,80],[80,80],[100,80],[20,100],[100,100]
          ].map(([x,y],i) => (
            <rect key={i} x={x} y={y} width="10" height="10" fill="#1a1a1a" opacity={0.6 + (i%3)*0.15} />
          ))}
        </svg>
      </div>
    ),
  },
  {
    name: "ChatMockup",
    file: "chat-mockup.tsx",
    desc: "Mockup de conversation chat en CSS",
    category: "Mockup",
    color: "#4a7c5c",
    preview: <ChatMockup messages={SAMPLE_CHAT} />,
  },
  {
    name: "ChartMockup",
    file: "chart-mockup.tsx",
    desc: "Mockup de graphique SVG avec tooltip",
    category: "Mockup",
    color: "#3b82f6",
    preview: <ChartMockup data={SAMPLE_CHART} />,
  },
  {
    name: "TopoLines",
    file: "topo-lines.tsx",
    desc: "Animation de lignes topographiques",
    category: "Motion",
    color: "#777169",
    preview: (
      <div style={{ height: 80, position: "relative", overflow: "hidden", borderRadius: 8, background: "#f5f5f5" }}>
        <TopoLines count={8} height="80px" lineColor="rgba(0,0,0,0.12)" lineWidth={0.75} speed={0.3} />
      </div>
    ),
  },
  {
    name: "DemoClient",
    file: "demo-client.tsx",
    desc: "Formulaire de demande de demo",
    category: "Form",
    color: "#6058A8",
    preview: (
      <div style={{ padding: 16, background: "#fff", borderRadius: 12, boxShadow: "0 0 0 1px rgba(0,0,0,.06)" }}>
        <div style={{ height: 8, background: "#f5f5f5", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
          <div style={{ height: 8, background: "#f5f5f5", borderRadius: 4 }} />
          <div style={{ height: 8, background: "#f5f5f5", borderRadius: 4 }} />
        </div>
        <div style={{ height: 20, background: "#1a1a1a", borderRadius: 6, width: "50%", marginTop: 8 }} />
      </div>
    ),
  },
  {
    name: "ModuleCard",
    file: "module-card.tsx",
    desc: "Carte de module carree avec gradient",
    category: "Card",
    color: "#a89bc2",
    preview: (
      <div style={{ maxWidth: 140, margin: "0 auto" }}>
        <ModuleCard title="Diagnostic cognitif" href="#" gradientVar="--module-grad-1" />
      </div>
    ),
  },
  {
    name: "AdaptiveIntelligenceModule",
    file: "adaptive-intelligence-module.tsx",
    desc: "Page module Adaptive Intelligence",
    category: "Page",
    color: "#7eb8c8",
    preview: (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 10, background: "linear-gradient(135deg,#7eb8c8,#a89bc2)", borderRadius: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <div style={{ height: 30, background: "#f5f5f5", borderRadius: 6 }} />
          <div style={{ height: 30, background: "#f5f5f5", borderRadius: 6 }} />
        </div>
      </div>
    ),
  },
  {
    name: "VisualIntelligenceModule",
    file: "visual-intelligence-module.tsx",
    desc: "Page module Visual Intelligence",
    category: "Page",
    color: "#96b8c4",
    preview: (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 10, background: "linear-gradient(135deg,#96b8c4,#c49696)", borderRadius: 6 }} />
        <div style={{ height: 30, background: "#f5f5f5", borderRadius: 6 }} />
      </div>
    ),
  },
];

const CATEGORIES = [...new Set(COMPONENTS.map((c) => c.category))];

export default async function ComposantsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh" }}>
      <div className="container">
        <h1
          className="t-display"
          style={{
            fontSize: "var(--text-display)",
            marginBottom: 16,
          }}
        >
          Composants
        </h1>
        <p className="t-lead" style={{ marginBottom: 48, maxWidth: 600 }}>
          {locale === "fr"
            ? "Inventaire interne des composants React de MentivisOS. Chaque composant est illustre par un apercu visuel."
            : "Internal inventory of MentivisOS React components. Each component is shown with a visual preview."}
        </p>

        {CATEGORIES.map((category) => (
          <div key={category} style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: 20,
                paddingBottom: 8,
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              {category}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {COMPONENTS.filter((c) => c.category === category).map((c) => (
                <div
                  key={c.name}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Preview area */}
                  <div
                    style={{
                      padding: 20,
                      background: "var(--bg-secondary)",
                      borderBottom: "1px solid var(--border-light)",
                      minHeight: 140,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.preview || (
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: c.color,
                            opacity: 0.15,
                            margin: "0 auto 8px",
                          }}
                        />
                        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Info area */}
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c.color,
                          flexShrink: 0,
                        }}
                      />
                      <h3
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 16,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {c.name}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: 300,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        marginBottom: 12,
                      }}
                    >
                      {c.desc}
                    </p>
                    <code
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 11,
                        fontWeight: 400,
                        color: "var(--text-tertiary)",
                        background: "var(--bg-secondary)",
                        padding: "3px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {c.file}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── Visual Library ── */}
        <div style={{ marginTop: 80, paddingTop: 48, borderTop: "1px solid var(--border-light)" }}>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 20,
            }}
          >
            {locale === "fr" ? "Bibliotheque visuelle" : "Visual Library"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {[
              { name: "Charts", file: "mentivisOS_charts.html" },
              { name: "Math Visuals", file: "mentivisOS_math_visuals.html" },
              { name: "Articles Features", file: "mentivisOS_articles_features.html" },
              { name: "Impact Section", file: "mentivisOS_impact_section.html" },
              { name: "Interactive Showcase", file: "mentivisOS_interactive_showcase.html" },
              { name: "Logomark Motion", file: "mentivisOS_logomark_motion.html" },
              { name: "Funky Visual Library", file: "mentivisOS_funky_visual_library.html" },
              { name: "Visual Library", file: "mentivisOS_visual_library.html" },
              { name: "Light Visual Library", file: "mentivisOS_light_visual_library.html" },
              { name: "Tesseract Color", file: "tesseract-color.html" },
              { name: "Tesseract Clean", file: "tesseract-clean.html" },
            ].map((v) => (
              <a
                key={v.file}
                href={`/visuals-library/${v.file}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  background: "var(--bg-secondary)",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 400,
                  transition: "background 0.18s ease",
                }}
                className="visual-lib-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {v.name}
              </a>
            ))}
          </div>
        </div>

        <style>{`
          .visual-lib-link:hover {
            background: var(--bg-warm) !important;
          }
        `}</style>
      </div>
    </section>
  );
}
