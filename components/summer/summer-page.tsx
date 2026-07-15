"use client";

import Script from "next/script";
import { useVisible, sectionAnim } from "@/hooks/use-visible";
import ContactForm from "@/components/contact-form";
import type { Locale } from "@/lib/i18n";

const S = (s: string) => ({ __html: s });

function CtaBtn({ href, children, dark }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      className="cta-summer"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 32px",
        fontSize: 15,
        fontWeight: 600,
        color: dark ? "#99219b" : "#fff",
        background: dark ? "#fff" : "#99219b",
        borderRadius: 12,
        textDecoration: "none",
        letterSpacing: "-0.01em",
        transition: "all 0.2s ease",
        boxShadow: dark ? "none" : "0 4px 16px rgba(153,33,155,0.3)",
      }}
      onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
    >
      {children}
    </a>
  );
}

export default function SummerPage({ lang }: { lang: string }) {
  const { ref: heroRef, visible: heroVis } = useVisible(0.01);
  const { ref: offerRef, visible: offerVis } = useVisible(0.05);
  const { ref: whyRef, visible: whyVis } = useVisible(0.05);
  const { ref: discoverRef, visible: discoverVis } = useVisible(0.05);
  const { ref: ctaRef, visible: ctaVis } = useVisible(0.05);

  return (
    <>
      <Script
        id="build-summer-url"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={S(`
          (function() {
            var ps = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
            var q = {};
            ps.forEach(function(p) {
              var v = new URLSearchParams(window.location.search).get(p) || localStorage.getItem(p);
              if (v) q[p] = v;
            });
            if (Object.keys(q).length) {
              var s = Object.entries(q).map(function(kv) { return kv[0] + '=' + encodeURIComponent(kv[1]); }).join('&');
              document.querySelectorAll('.cta-summer').forEach(function(a) {
                a.href += (a.href.indexOf('?') > -1 ? '&' : '?') + s;
              });
            }
          })();
        `)}
      />

      <section
        ref={heroRef}
        style={{
          background: "linear-gradient(135deg, #FFECD2 0%, #FCB69F 50%, #FF8C5A 100%)",
          padding: "clamp(80px, 10vw, 140px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 80px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(32px, 5vw, 64px)",
          }}
        >
          <div style={{ maxWidth: 640, flex: 1, minWidth: 0 }}>
            <p
              style={{
                ...sectionAnim(heroVis, 0.05),
                marginBottom: 12,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#99219b",
              }}
            >
              Offre \u00C9t\u00E9 2026
            </p>
            <h1
              style={{
                ...sectionAnim(heroVis, 0.1),
                marginBottom: 16,
                fontWeight: 300,
                fontSize: "clamp(34px, 5vw, 52px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#1A1A18",
              }}
            >
              {"Cet \u00E9t\u00E9, pr\u00E9parez la rentr\u00E9e sans la pression."}
            </h1>
            <p
              style={{
                ...sectionAnim(heroVis, 0.15),
                margin: "0 0 8px",
                fontSize: 18,
                fontWeight: 600,
                color: "#631A96",
                lineHeight: 1.4,
              }}
            >
              {"50% sur le d\u00E9ploiement \u00B7 3 mois de licences offerts"}
            </p>
            <p
              style={{
                ...sectionAnim(heroVis, 0.2),
                margin: "0 0 36px",
                fontSize: 16,
                lineHeight: 1.7,
                color: "#5A3A2A",
                maxWidth: 540,
              }}
            >
              {"Pendant que l\u2019activit\u00E9 ralentit, vos \u00E9quipes montent en comp\u00E9tences et votre dispositif de formation se met en place. Sans la pression du quotidien."}
            </p>
            <div style={{ ...sectionAnim(heroVis, 0.25) }}>
              <CtaBtn href={"https://mentivisos.com/fr/demo/?utm_source=newsletter&utm_medium=email&utm_campaign=ete-2026"}>
                {"R\u00E9server un \u00E9change \u2192"}
              </CtaBtn>
            </div>
          </div>

          <img
            src="https://mntvis-xchange.vercel.app/summer/summer-hero.png"
            alt=""
            style={{
              width: "clamp(200px, 30vw, 400px)",
              height: "auto",
              borderRadius: 24,
              flexShrink: 0,
              boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
            }}
            className="summer-hero-img"
          />
        </div>
        <style>{`
          @media (max-width: 768px) { .summer-hero-img { display: none !important; } }
        `}</style>
      </section>

      <section ref={offerRef} style={{ background: "#ffffff", padding: "clamp(80px, 10vw, 120px) 0" }}>
        <div className="container" style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 32 }}>
            {[
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#99219b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                ),
                value: "50%",
                label: "de r\u00E9duction",
                desc: "Sur la customisation et le d\u00E9ploiement de votre plateforme MentivisOS \u00E0 vos couleurs, vos parcours et vos objectifs.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#99219b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                value: "3 mois",
                label: "de licences offerts",
                desc: "Pour tous vos collaborateurs, quel que soit leur nombre. Aucune limite de si\u00E8ges.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#99219b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                ),
                value: "Sereine",
                label: "Une rentr\u00E9e sans stress",
                desc: "Une plateforme de formation native IA enti\u00E8rement configur\u00E9e et op\u00E9rationnelle d\u00E8s septembre.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  ...sectionAnim(offerVis, 0.1 + i * 0.08),
                  background: "#FFF8F5",
                  borderRadius: 24,
                  padding: "40px 36px",
                  border: "1px solid rgba(153,33,155,0.08)",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 36, fontWeight: 700, color: "#99219b", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    {item.value}
                  </p>
                  <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 500, color: "#1A1A18" }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#666" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ ...sectionAnim(offerVis, 0.25), textAlign: "center", fontSize: 14, color: "#999", marginBottom: 28 }}>
            {"Offre valable jusqu\u2019au 31 ao\u00FBt 2026 pour les organismes de formation et les entreprises."}
          </p>

          <div style={{ ...sectionAnim(offerVis, 0.3), textAlign: "center" }}>
            <CtaBtn href="https://mentivisos.com/fr/demo/?utm_source=newsletter&utm_medium=email&utm_campaign=ete-2026">
              {"Profiter de l\u2019offre \u2192"}
            </CtaBtn>
          </div>
        </div>
      </section>

      <section ref={whyRef} style={{ background: "#F8F6F4", padding: "clamp(80px, 10vw, 120px) 0" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <h2 style={{ ...sectionAnim(whyVis, 0), fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.025em", textAlign: "center", marginBottom: 12, color: "#1A1A18" }}>
            {"Pourquoi lancer votre projet cet \u00E9t\u00E9 ?"}
          </h2>
          <p style={{ ...sectionAnim(whyVis, 0.05), textAlign: "center", color: "#888", fontSize: 16, marginBottom: 56 }}>
            {"Trois bonnes raisons de ne pas attendre septembre"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              {
                emoji: "\u26F5",
                title: "Un temps mort strat\u00E9gique",
                text: "L\u2019activit\u00E9 ralentit, vos \u00E9quipes ont de la disponibilit\u00E9. C\u2019est le moment id\u00E9al pour d\u00E9ployer sans perturber le quotidien.",
              },
              {
                emoji: "\uD83D\uDE80",
                title: "Pr\u00EAt pour la rentr\u00E9e",
                text: "Arrivez en septembre avec une plateforme op\u00E9rationnelle, des parcours configur\u00E9s et des \u00E9quipes d\u00E9j\u00E0 form\u00E9es \u00E0 l\u2019outil.",
              },
              {
                emoji: "\uD83C\uDF89",
                title: "Une offre exceptionnelle",
                text: "50% sur le d\u00E9ploiement et 3 mois offerts. Une opportunit\u00E9 unique pour \u00E9quiper votre organisation sans d\u00E9passer le budget.",
              },
            ].map((item, i) => (
              <div key={i} style={{ ...sectionAnim(whyVis, 0.1 + i * 0.08), textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>{item.emoji}</div>
                <h3 style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.3, marginBottom: 10, color: "#1a1a1a" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666", margin: 0, maxWidth: "30ch", marginLeft: "auto", marginRight: "auto" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={discoverRef} style={{ background: "#ffffff", padding: "clamp(80px, 10vw, 120px) 0" }}>
        <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", textAlign: "center" }}>
          <h2 style={{ ...sectionAnim(discoverVis, 0), fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 8, color: "#1A1A18" }}>
            {"Testez gratuitement"}
          </h2>
          <p style={{ ...sectionAnim(discoverVis, 0.05), margin: "0 0 40px", fontSize: 16, color: "#888", lineHeight: 1.6, maxWidth: 500 }}>
            {"Avant de d\u00E9ployer votre version sur mesure, d\u00E9couvrez ce que MentivisOS g\u00E9n\u00E8re en quelques secondes."}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              {
                href: "https://iciafrance.com/fr/mentivisos/?utm_source=newsletter&utm_medium=email&utm_campaign=ete-2026",
                icon: "\uD83C\uDFAF",
                label: "MentivisOS ICIA",
                desc: "La version d\u00E9di\u00E9e \u00E0 la formation \u00E0 l\u2019intelligence artificielle, de d\u00E9butant \u00E0 expert.",
              },
              {
                href: "https://mentivisos.com/fr/openos/?utm_source=newsletter&utm_medium=email&utm_campaign=ete-2026",
                icon: "\uD83C\uDF10",
                label: "MentivisOS Open",
                desc: "La version universelle et totalement d\u00E9brid\u00E9e, pour apprendre sur tous les sujets.",
              },
            ].map((card, i) => (
              <a
                key={i}
                href={card.href}
                className="cta-summer"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...sectionAnim(discoverVis, 0.1 + i * 0.08),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "clamp(28px, 3vw, 36px) clamp(20px, 2vw, 28px)",
                  background: "#FFF8F5",
                  borderRadius: 20,
                  textDecoration: "none",
                  border: "1px solid rgba(153,33,155,0.08)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#99219b"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(153,33,155,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(153,33,155,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 36, marginBottom: 12 }}>{card.icon}</span>
                <span style={{ color: "#99219b", fontWeight: 700, fontSize: 15, display: "block", marginBottom: 8 }}>{card.label}</span>
                <span style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{card.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} style={{ background: "#ffffff", padding: "clamp(80px, 10vw, 120px) 0" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <h2 style={{ ...sectionAnim(ctaVis, 0), fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.025em", textAlign: "center", marginBottom: 8, color: "#1A1A18" }}>
            {"Parlons de votre rentr\u00E9e."}
          </h2>
          <p style={{ ...sectionAnim(ctaVis, 0.05), textAlign: "center", color: "#888", fontSize: 16, marginBottom: 48, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
            {"Construisons ensemble le dispositif adapt\u00E9 \u00E0 vos besoins. Profitez de l\u2019offre estivale avant le 31 ao\u00FBt."}
          </p>

          <div className="summer-contact-row" style={{ ...sectionAnim(ctaVis, 0.1), display: "flex", alignItems: "center", gap: "clamp(32px, 5vw, 64px)", justifyContent: "center" }}>
            <img
              src="/images/team/mathias-costes.avif"
              alt="Mathias Costes"
              style={{
                width: "clamp(120px, 18vw, 200px)",
                height: "clamp(120px, 18vw, 200px)",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            />
            <ContactForm lang={lang as Locale} mode="demo" formContext="summer26" subject="Offre Summer'26" />
          </div>
          <style>{`
            @media (max-width: 768px) {
              .summer-contact-row {
                flex-direction: column !important;
                text-align: center;
              }
            }
          `}</style>
        </div>
      </section>
    </>
  );
}
