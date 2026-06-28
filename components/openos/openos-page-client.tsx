"use client";

import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";
import OpenOSHero from "./openos-hero";
import OpenOSWorkflow from "./openos-workflow";
import OpenOSTestimonials from "./openos-testimonials";
import OpenOSFAQ from "./openos-faq";

function OpenOSCTA() {
  const { ref, visible } = useVisible(0.05);
  const gradient = "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)";

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <h2 className="t-display" style={{ ...sectionAnim(visible, 0), fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16, lineHeight: 1.1 }}>
          <span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MentivisOS Open</span>
          {" "}est disponible maintenant.
        </h2>
        <p style={{ ...sectionAnim(visible, 0.05), fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.6, color: "#4e4e4e", marginBottom: 40 }}>
          Gratuit pour toujours. Prêt en trente secondes.
        </p>
        <Link
          href="https://open.mentivisos.com"
          style={{
            ...sectionAnim(visible, 0.1),
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            background: "#0A0A0A",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0A0A0A"; }}
        >
          C&apos;est gratuit !
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default function OpenOSPageClient({ lang }: { lang: Locale }) {
  return (
    <>
      <OpenOSHero lang={lang} />
      <OpenOSWorkflow lang={lang} />
      <OpenOSTestimonials />
      <OpenOSFAQ />
      <OpenOSCTA />
    </>
  );
}
