"use client";

import Script from "next/script";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const GRADIENT_COLORS = ["#FF6B35", "#FF8C5A", "#99219b", "#631A96", "#06D6A0"];

function GradientBar({ height = 12, reverse = false }: { height?: number; reverse?: boolean }) {
  const colors = reverse ? [...GRADIENT_COLORS].reverse() : GRADIENT_COLORS;
  return (
    <div style={{ display: "flex", width: "100%", height, lineHeight: "0", fontSize: 0 }}>
      {colors.map((c, i) => (
        <div key={i} style={{ width: "20%", height, backgroundColor: c }} />
      ))}
    </div>
  );
}

export default function SummerPage({ lang }: { lang: string }) {
  const { ref: heroRef, visible: heroVis } = useVisible(0.01);
  const { ref: offerRef, visible: offerVis } = useVisible(0.05);
  const { ref: discoverRef, visible: discoverVis } = useVisible(0.05);
  const { ref: ctaRef, visible: ctaVis } = useVisible(0.05);

  const demoUrl = "https://mentivisos.com/fr/demo/?utm_source=newsletter&utm_medium=email&utm_campaign=ete-2026";
  const iciaUrl = "https://iciafrance.com/fr/mentivisos/?utm_source=newsletter&utm_medium=email&utm_campaign=ete-2026";
  const openUrl = "https://mentivisos.com/fr/openos/?utm_source=newsletter&utm_medium=email&utm_campaign=ete-2026";

  const C = (s: string) => ({ __html: s });

  return (
    <>
      <Script
        id="build-summer-url"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={C(`
          (function() {
            var ps = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
            var q = {};
            ps.forEach(function(p) {
              var v = new URLSearchParams(window.location.search).get(p) || localStorage.getItem(p);
              if (v) q[p] = v;
            });
            var ks = Object.keys(q);
            if (ks.length) {
              var s = ks.map(function(k) { return k + '=' + encodeURIComponent(q[k]); }).join('&');
              document.querySelectorAll('.cta-summer').forEach(function(a) {
                a.href += (a.href.indexOf('?') > -1 ? '&' : '?') + s;
              });
            }
          })();
        `)}
      />

      <GradientBar height={12} />

      <section ref={heroRef} style={{ background: "#ffffff", padding: "clamp(32px, 4vw, 48px) 0" }}>
        <div className="container" style={{ maxWidth: 640, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", textAlign: "center" }}>
          <img
            src="https://mntvis-xchange.vercel.app/summer/summer-hero.png"
            alt="MentivisOS Summer"
            style={{ width: "100%", maxWidth: 600, height: "auto", borderRadius: 16, display: "block", margin: "0 auto 32px" }}
          />
          <p style={{ ...sectionAnim(heroVis, 0.05), margin: "0 0 4px", fontSize: 13, color: "#99219b", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
            Offre \u00C9t\u00E9 2026
          </p>
          <h1 style={{ ...sectionAnim(heroVis, 0.1), margin: "0 0 12px", fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "#1A1A18" }}>
            {"Cet \u00E9t\u00E9, MentivisOS s\u2019installe chez vous."}
          </h1>
          <p style={{ ...sectionAnim(heroVis, 0.15), margin: "0 0 8px", fontSize: 17, fontWeight: 600, color: "#1A1A18", lineHeight: 1.5 }}>
            {"50% sur le d\u00E9ploiement, 3 mois offerts."}
          </p>
          <p style={{ ...sectionAnim(heroVis, 0.2), margin: "0 0 28px", fontSize: 15, lineHeight: 1.7, color: "#4E4E4E", maxWidth: 520 }}>
            {"L\u2019\u00E9t\u00E9 est le meilleur moment pour pr\u00E9parer la rentr\u00E9e. Pendant que l\u2019activit\u00E9 ralentit, vos \u00E9quipes peuvent monter en comp\u00E9tences et vos dispositifs de formation se mettre en place sans la pression du quotidien."}
          </p>
        </div>
      </section>

      <section ref={offerRef} style={{ background: "#ffffff" }}>
        <div className="container" style={{ maxWidth: 640, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", textAlign: "center" }}>
          <div style={{ ...sectionAnim(offerVis, 0.1), background: "#FFF0F5", borderRadius: 16, padding: "clamp(24px, 3vw, 32px)", textAlign: "center", marginBottom: 28 }}>
            <p style={{ margin: "0 0 12px", fontSize: 20, color: "#1A1A18", fontWeight: 700, lineHeight: 1.3 }}>
              {"Jusqu\u2019au 31 ao\u00FBt 2026"}
            </p>
            <p style={{ margin: "0 0 10px", fontSize: 17, color: "#4E4E4E", lineHeight: 1.5 }}>
              <span style={{ color: "#99219b", fontWeight: 700 }}>50%</span>
              {" de r\u00E9duction sur la customisation et le d\u00E9ploiement de votre plateforme MentivisOS"}
            </p>
            <p style={{ margin: 0, fontSize: 17, color: "#4E4E4E", lineHeight: 1.5 }}>
              <span style={{ color: "#99219b", fontWeight: 700 }}>3 mois de licences</span>
              {" offertes, pour tous vos collaborateurs, quel que soit leur nombre."}
            </p>
          </div>

          <p style={{ ...sectionAnim(offerVis, 0.15), margin: "0 0 28px", fontSize: 15, lineHeight: 1.6, color: "#4E4E4E" }}>
            {"Vous pr\u00E9parez la rentr\u00E9e en toute s\u00E9r\u00E9nit\u00E9, avec une plateforme de formation native IA enti\u00E8rement configur\u00E9e \u00E0 vos couleurs, vos parcours et vos objectifs."}
          </p>

          <div style={{ ...sectionAnim(offerVis, 0.2), textAlign: "center", marginBottom: 40 }}>
            <a href={demoUrl} className="cta-summer" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "15px 48px", fontSize: 15, fontWeight: 700, color: "#fff", background: "#99219b", borderRadius: 26, textDecoration: "none", letterSpacing: "0.5px", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#7A1A7C"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#99219b"; }}
            >
              {"R\u00E9server un \u00E9change"}
            </a>
          </div>
        </div>
      </section>

      <GradientBar height={3} />

      <section ref={discoverRef} style={{ background: "#ffffff", padding: "clamp(48px, 6vw, 64px) 0" }}>
        <div className="container" style={{ maxWidth: 640, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", textAlign: "center" }}>
          <p style={{ ...sectionAnim(discoverVis, 0.05), margin: "0 0 6px", fontSize: 11, color: "#99219b", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
            Testez gratuitement
          </p>
          <p style={{ ...sectionAnim(discoverVis, 0.1), margin: "0 0 28px", fontSize: 20, color: "#1A1A18", fontWeight: 300, lineHeight: 1.4 }}>
            {"Avant de d\u00E9ployer votre version sur mesure,"}<br />
            <span style={{ color: "#99219b", fontWeight: 600 }}>{"d\u00E9couvrez ce que MentivisOS g\u00E9n\u00E8re en quelques secondes."}</span>
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[
              { href: iciaUrl, label: "MentivisOS ICIA", desc: "La version d\u00E9di\u00E9e \u00E0 la formation \u00E0 l\u2019intelligence artificielle, de d\u00E9butant \u00E0 expert." },
              { href: openUrl, label: "MentivisOS Open", desc: "La version universelle et totalement d\u00E9brid\u00E9e, pour apprendre sur tous les sujets." },
            ].map((card, i) => (
              <a key={i} href={card.href} className="cta-summer" target="_blank" rel="noopener noreferrer" style={{ ...sectionAnim(discoverVis, 0.15 + i * 0.08), display: "block", padding: "clamp(20px, 2vw, 28px) clamp(16px, 2vw, 20px)", background: "#FFF0F5", borderRadius: 12, textDecoration: "none", textAlign: "center", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FDE0E8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FFF0F5"; }}
              >
                <span style={{ color: "#99219b", fontWeight: 700, fontSize: 15, display: "block", marginBottom: 6 }}>{card.label}</span>
                <span style={{ fontSize: 13, color: "#4E4E4E", lineHeight: 1.5 }}>{card.desc}</span>
              </a>
            ))}
          </div>

          <p style={{ ...sectionAnim(discoverVis, 0.25), fontSize: 14, color: "#4E4E4E", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
            {"Deux fa\u00E7ons de mesurer la puissance de la g\u00E9n\u00E9ration de parcours sur mesure avant de la d\u00E9ployer chez vous."}
          </p>
        </div>
      </section>

      <GradientBar height={3} />

      <section ref={ctaRef} style={{ background: "#99219b", padding: "clamp(40px, 5vw, 56px) 0" }}>
        <div className="container" style={{ maxWidth: 640, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", textAlign: "center" }}>
          <p style={{ ...sectionAnim(ctaVis, 0.1), margin: "0 0 16px", fontSize: 20, color: "#fff", fontWeight: 300, lineHeight: 1.3 }}>
            {"Parlons de votre rentr\u00E9e."}
          </p>
          <p style={{ ...sectionAnim(ctaVis, 0.15), margin: "0 0 24px", fontSize: 14, color: "#fff", lineHeight: 1.5, opacity: 0.9 }}>
            {"R\u00E9pondez \u00E0 cet email ou r\u00E9servez un \u00E9change avec notre \u00E9quipe."}<br />
            {"Nous construisons ensemble le dispositif adapt\u00E9 \u00E0 vos besoins, et vous profitez de l\u2019offre estivale avant le 31 ao\u00FBt."}
          </p>
          <a href={demoUrl} className="cta-summer" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "15px 48px", fontSize: 15, fontWeight: 700, color: "#99219b", background: "#fff", borderRadius: 26, textDecoration: "none", letterSpacing: "0.5px", transition: "all 0.2s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F0E0F0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
          >
            {"R\u00E9server un \u00E9change"}
          </a>
        </div>
      </section>

      <GradientBar height={12} reverse />
    </>
  );
}
