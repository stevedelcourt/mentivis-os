"use client";

import Script from "next/script";
import { useVisible, sectionAnim } from "@/hooks/use-visible";
import EnviesSplitFlap from "@/components/envies-split-flap";
import OpenOSHero from "./openos-hero";
import OpenOSWorkflow from "./openos-workflow";
import OpenOSPipeline from "./openos-pipeline";
import OpenOSTestimonials from "./openos-testimonials";
import OpenOSFAQ from "./openos-faq";

function OpenOSCTA({ lang, variant }: { lang: string; variant: "intermediate" | "final" }) {
  const { ref, visible } = useVisible(0.05);
  const isFr = lang === "fr";

  if (variant === "intermediate") {
    return (
      <section ref={ref} style={{ padding: "clamp(80px, 10vw, 120px) 0", background: "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              ...sectionAnim(visible, 0),
              color: "#fff",
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 32,
            }}
          >
            {isFr ? "Votre parcours vous attend." : "Your path awaits."}
          </h2>
          <div style={{ ...sectionAnim(visible, 0.1) }}>
            <a
              href="https://open.mentivisos.com/"
              className="cta-open"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 32px",
                fontSize: 17,
                fontWeight: 500,
                color: "#0A0A0A",
                background: "#fff",
                borderRadius: 12,
                textDecoration: "none",
                border: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e5e5e5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              {isFr ? "Commencer gratuitement \u2192" : "Start free \u2192"}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <h2
          style={{
            ...sectionAnim(visible, 0),
            fontWeight: 300,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          {isFr ? "Prêt à commencer ?" : "Ready to start?"}
        </h2>
        <p
          style={{
            ...sectionAnim(visible, 0.05),
            fontSize: 18,
            color: "#4e4e4e",
            marginBottom: 40,
          }}
        >
          {isFr ? "Votre parcours sur mesure en 30 secondes. Gratuit." : "Your custom path in 30 seconds. Free."}
        </p>
        <div style={{ ...sectionAnim(visible, 0.1) }}>
          <a
            href="https://open.mentivisos.com/"
            className="cta-open"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 32px",
                fontSize: 17,
                fontWeight: 500,
                color: "#fff",
                background: "linear-gradient(135deg, #1A2B80, #7030A0, #B02050, #C83040)",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
          >
            {isFr ? "Commencer gratuitement \u2192" : "Start free \u2192"}
          </a>
        </div>
        <p
          style={{
            ...sectionAnim(visible, 0.15),
            marginTop: 24,
            fontSize: 13,
            color: "#888",
          }}
        >
          {isFr
            ? "Sans inscription compliquée \u00B7 Sans carte bancaire \u00B7 Gratuit pour toujours"
            : "No complicated signup \u00B7 No credit card \u00B7 Free forever"}
        </p>
      </div>
    </section>
  );
}

export default function OpenOSPageClient({ lang }: { lang: string }) {
  return (
    <>
      <Script
        id="build-open-url"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function buildOpenURL() {
                var base = 'https://open.mentivisos.com/';
                var params = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
                var query = [];
                var defaults = {utm_source:'openos',utm_medium:'button',utm_campaign:'click'};
                params.forEach(function(p) {
                  var val = new URLSearchParams(window.location.search).get(p)
                         || localStorage.getItem(p);
                  if (val) { query.push(p + '=' + encodeURIComponent(val)); }
                  else if (defaults[p]) { query.push(p + '=' + defaults[p]); }
                });
                return base + (query.length ? '?' + query.join('&') : '');
              }
              document.querySelectorAll('.cta-open').forEach(function(btn) {
                btn.href = buildOpenURL();
              });
            })();
          `,
        }}
      />
      <OpenOSHero lang={lang as any}>
        <EnviesSplitFlap />
      </OpenOSHero>
      <OpenOSWorkflow lang={lang} />
      <OpenOSCTA lang={lang} variant="intermediate" />
      <OpenOSTestimonials lang={lang} />
      <OpenOSPipeline lang={lang} />
      <OpenOSFAQ lang={lang} />
      <OpenOSCTA lang={lang} variant="final" />
    </>
  );
}
