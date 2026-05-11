import { Locale } from "@/lib/i18n";
import { getT } from "@/lib/i18n";
import Link from "next/link";
import TesseractColorCanvas from "@/components/tesseract-color-canvas";
import AmbassadorsFaq from "@/components/ambassadors-faq";

export default async function AmbassadorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const t = getT(locale);
  const a = t.ambassadors;

  return (
    <main style={{ background: "#ffffff" }}>
      {/* HERO */}
      <section className="section" style={{ paddingTop: "clamp(80px, 12vh, 140px)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Left: Text */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#777169",
                  marginBottom: 20,
                }}
              >
                {a.hero.eyebrow}
              </p>
              <h1
                className="t-display"
                style={{
                  fontSize: "clamp(32px, 5vw, 56px)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  marginBottom: 24,
                }}
              >
                {a.hero.headline}
              </h1>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "#3a3a3a",
                  marginBottom: 16,
                }}
              >
                {a.hero.body}
              </p>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#777169",
                  marginBottom: 8,
                }}
              >
                {a.hero.commission}
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 36,
                }}
              >
                {a.hero.rate}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href={`/${locale}/contact?subject=MentivisOS+Programme+Ambassador`}
                  style={{
                    background: "#0A0A0A",
                    color: "#ffffff",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  {a.hero.ctaJoin}
                </Link>
                <Link
                  href={`/${locale}/demo`}
                  style={{
                    background: "transparent",
                    color: "#0A0A0A",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  {a.hero.ctaPresentation}
                </Link>
              </div>
            </div>

            {/* Right: Tesseract */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: 24,
                overflow: "hidden",
                background: "#f5f5f5",
              }}
            >
              <TesseractColorCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="section" style={{ background: "#f8f8f8" }}>
        <div className="container">
          <div style={{ maxWidth: 800, marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                marginBottom: 12,
              }}
            >
              {a.who.title}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#777169" }}>
              {a.who.subtitle}
            </p>
          </div>

          {/* Profiles */}
          <div style={{ marginBottom: 56 }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#777169",
                marginBottom: 20,
              }}
            >
              {a.who.profilesTitle}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {a.who.profiles.map((profile: string) => (
                <div
                  key={profile}
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "16px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#0A0A0A",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
                  }}
                >
                  {profile}
                </div>
              ))}
            </div>
          </div>

          {/* Two columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 32,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                {a.who.notSellerTitle}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#3a3a3a" }}>
                {a.who.notSellerBody}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                {a.who.whyTitle}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#3a3a3a" }}>
                {a.who.whyBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="section">
        <div className="container">
          <h2
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
              marginBottom: 48,
            }}
          >
            {a.how.title}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {a.how.steps.map((step: { num: string; title: string; body: string }) => (
              <div
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 24,
                  alignItems: "start",
                  padding: "28px 32px",
                  background: "#f8f8f8",
                  borderRadius: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 28,
                    fontWeight: 400,
                    color: "#c8c8c8",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      color: "#0A0A0A",
                      marginBottom: 8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "#3a3a3a" }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <AmbassadorsFaq
        eyebrow="FAQ"
        title={a.faq.title}
        lead={a.faq.subtitle}
        items={a.faq.items}
      />

      {/* Bottom CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
              marginBottom: 24,
            }}
          >
            {a.hero.headline}
          </h2>
          <Link
            href={`/${locale}/contact?subject=MentivisOS+Programme+Ambassador`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#0A0A0A",
              color: "#ffffff",
              borderRadius: 8,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.25s ease",
            }}
          >
            {a.hero.ctaJoin}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .container > div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          details > summary::-webkit-details-marker {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
