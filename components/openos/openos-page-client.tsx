"use client";

import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";
import SuperButton from "@/components/super-button";
import OpenOSHero from "./openos-hero";
import OpenOSPipeline from "./openos-pipeline";
import OpenOSTestimonials from "./openos-testimonials";
import OpenOSFAQ from "./openos-faq";

function OpenOSCTA() {
  const { ref, visible } = useVisible(0.05);
  const gradient = "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)";

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <div
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: "clamp(32px, 4vw, 48px) clamp(24px, 4vw, 44px)",
          }}
        >
          <div
            className="openos-cta-inner"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 40,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="t-display" style={{ ...sectionAnim(visible, 0), fontSize: "clamp(24px, 3.5vw, 40px)", marginBottom: 20, lineHeight: 1.2 }}>
                <span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MentivisOS Open</span>
                {" "}est disponible maintenant.
              </h2>
              <p style={{ ...sectionAnim(visible, 0.05), fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>
                Gratuit pour toujours. Prêt en trente secondes.
              </p>
            </div>
            <SuperButton href="https://open.mentivisos.com" />
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .openos-cta-inner {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 32px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

export default function OpenOSPageClient({ lang }: { lang: Locale }) {
  return (
    <>
      <OpenOSHero lang={lang} />
      <OpenOSPipeline lang={lang} />
      <OpenOSTestimonials />
      <OpenOSFAQ lang={lang} />
      <OpenOSCTA />
    </>
  );
}
