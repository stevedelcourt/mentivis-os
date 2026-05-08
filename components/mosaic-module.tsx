"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function MosaicModule({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tabs = [
    { key: "all", label: t.modules.mosaic.tabs.all },
    { key: "design", label: t.modules.mosaic.tabs.design },
    { key: "content", label: t.modules.mosaic.tabs.content },
    { key: "media", label: t.modules.mosaic.tabs.media },
    { key: "interaction", label: t.modules.mosaic.tabs.interaction },
  ];

  const cards = [
    {
      id: "hero",
      type: "hero",
      title: t.modules.mosaic.heroCard.title,
      subtitle: t.modules.mosaic.heroCard.subtitle,
      gradient: "linear-gradient(135deg, #a89bc2 0%, #d4a0a0 50%, #d4b896 100%)",
      category: "design",
    },
    {
      id: "card1",
      type: "content",
      title: t.modules.mosaic.cards.card1.title,
      body: t.modules.mosaic.cards.card1.body,
      gradient: "linear-gradient(135deg, #7eb8c8 0%, #96c4a8 100%)",
      category: "design",
    },
    {
      id: "card2",
      type: "content",
      title: t.modules.mosaic.cards.card2.title,
      body: t.modules.mosaic.cards.card2.body,
      gradient: "linear-gradient(135deg, #c49696 0%, #d4b896 100%)",
      category: "design",
    },
    {
      id: "card3",
      type: "content",
      title: t.modules.mosaic.cards.card3.title,
      body: t.modules.mosaic.cards.card3.body,
      gradient: "linear-gradient(135deg, #96c4a8 0%, #7eb8c8 100%)",
      category: "content",
    },
    {
      id: "card4",
      type: "content",
      title: t.modules.mosaic.cards.card4.title,
      body: t.modules.mosaic.cards.card4.body,
      gradient: "linear-gradient(135deg, #a89bc2 0%, #96b8c4 100%)",
      category: "interaction",
    },
    {
      id: "card5",
      type: "content",
      title: t.modules.mosaic.cards.card5.title,
      body: t.modules.mosaic.cards.card5.body,
      gradient: "linear-gradient(135deg, #d4b896 0%, #c49696 100%)",
      category: "interaction",
    },
    {
      id: "card6",
      type: "content",
      title: t.modules.mosaic.cards.card6.title,
      body: t.modules.mosaic.cards.card6.body,
      gradient: "linear-gradient(135deg, #96b8c4 0%, #a89bc2 100%)",
      category: "design",
    },
    {
      id: "placeholder1",
      type: "placeholder",
      category: "media",
    },
    {
      id: "placeholder2",
      type: "placeholder",
      category: "media",
    },
  ];

  const filteredCards = activeTab === "all"
    ? cards
    : cards.filter((card) => card.category === activeTab);

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Headline */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p className="t-caption" style={{ marginBottom: 16, color: "var(--text-tertiary)" }}>
            {t.modules.mosaic.eyebrow}
          </p>
          <h1 className="t-display" style={{ fontSize: "var(--text-display)", marginBottom: 16 }}>
            {t.modules.mosaic.title}
          </h1>
          <p className="t-lead" style={{ maxWidth: 600, margin: "0 auto" }}>
            {t.modules.mosaic.description}
          </p>
        </div>

        {/* Pill Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginBottom: 48,
            flexWrap: "wrap",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="mosaic-tab"
              data-active={activeTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mosaic Grid */}
        <div className="mosaic-grid">
          {filteredCards.map((card, i) => {
            if (card.type === "hero") {
              return (
                <div
                  key={card.id}
                  className="mosaic-card mosaic-card--hero"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.4s ${i * 60}ms ease, transform 0.4s ${i * 60}ms ease`,
                  }}
                >
                  <div className="mosaic-card__bg" style={{ background: card.gradient }} />
                  <div className="mosaic-card__grain" />
                  <div className="mosaic-card__content mosaic-card__content--center">
                    <h2 className="mosaic-card__title mosaic-card__title--large">{card.title}</h2>
                    <p className="mosaic-card__subtitle">{card.subtitle}</p>
                  </div>
                </div>
              );
            }

            if (card.type === "placeholder") {
              return (
                <div
                  key={card.id}
                  className="mosaic-card mosaic-card--placeholder"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.4s ${i * 60}ms ease, transform 0.4s ${i * 60}ms ease`,
                  }}
                >
                  <div className="mosaic-card__content mosaic-card__content--center">
                    <p className="mosaic-card__placeholder-text">{t.modules.mosaic.placeholder}</p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={card.id}
                className="mosaic-card"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.4s ${i * 60}ms ease, transform 0.4s ${i * 60}ms ease`,
                }}
              >
                <div className="mosaic-card__bg" style={{ background: card.gradient }} />
                <div className="mosaic-card__grain" />
                <div className="mosaic-card__content">
                  <h3 className="mosaic-card__title">{card.title}</h3>
                  <p className="mosaic-card__body">{card.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .mosaic-tab {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.14px;
          padding: 8px 20px;
          border-radius: var(--r-pill);
          border: 1px solid var(--border-light);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .mosaic-tab:hover {
          border-color: var(--text-tertiary);
          color: var(--text-primary);
        }
        .mosaic-tab[data-active="true"] {
          background: var(--text-primary);
          color: var(--bg-primary);
          border-color: var(--text-primary);
        }

        .mosaic-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: minmax(180px, auto);
          gap: 20px;
        }

        .mosaic-card {
          position: relative;
          border-radius: var(--r-module);
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
        }

        .mosaic-card:hover {
          transform: scale(1.02);
        }

        .mosaic-card--hero {
          grid-column: span 2;
          grid-row: span 2;
          min-height: 380px;
        }

        .mosaic-card--placeholder {
          background: var(--bg-secondary);
          border: 1px dashed var(--border-light);
        }

        .mosaic-card__bg {
          position: absolute;
          inset: 0;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mosaic-card:hover .mosaic-card__bg {
          transform: scale(1.05);
        }

        .mosaic-card__grain {
          position: absolute;
          inset: 0;
          opacity: 0.4;
          mix-blend-mode: overlay;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }

        .mosaic-card__content {
          position: relative;
          z-index: 1;
          padding: 28px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .mosaic-card__content--center {
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .mosaic-card__title {
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 300;
          line-height: 1.3;
          letter-spacing: -0.01em;
          color: #ffffff;
          text-wrap: balance;
          margin-bottom: 8px;
        }

        .mosaic-card__title--large {
          font-size: clamp(24px, 3vw, 32px);
          margin-bottom: 12px;
        }

        .mosaic-card__subtitle {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 300;
          line-height: 1.5;
          letter-spacing: 0.14px;
          color: rgba(255, 255, 255, 0.85);
          text-wrap: balance;
        }

        .mosaic-card__body {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 300;
          line-height: 1.5;
          letter-spacing: 0.14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .mosaic-card__placeholder-text {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.14px;
          color: var(--text-tertiary);
        }

        @media (max-width: 1024px) {
          .mosaic-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .mosaic-card--hero {
            grid-column: span 2;
            grid-row: span 1;
            min-height: 280px;
          }
        }

        @media (max-width: 768px) {
          .mosaic-grid {
            grid-template-columns: 1fr;
          }
          .mosaic-card--hero {
            grid-column: span 1;
            min-height: 240px;
          }
          .mosaic-card:hover {
            transform: none !important;
          }
          .mosaic-card:hover .mosaic-card__bg {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
