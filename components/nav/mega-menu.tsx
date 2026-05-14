"use client";

import Link from "next/link";

interface MegaMenuSection {
  eyebrow: string;
  links: { label: string; href: string }[];
}

interface MegaMenuProps {
  sections: MegaMenuSection[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MegaMenu({ sections, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <div
      className="mega-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1001,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          padding: "28px 32px",
          minWidth: "fit-content",
          maxWidth: 640,
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
          animation: "megaMenuIn 0.2s ease both",
        }}
      >
        {sections.map((section, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#4e4e4e",
              }}
            >
              {section.eyebrow}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {section.links.map((link, linkIdx) => (
                <Link
                  key={linkIdx}
                  href={link.href}
                  className="mega-menu-link"
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#0A0A0A",
                    textDecoration: "none",
                    padding: "4px 0",
                    transition: "color 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#4e4e4e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#0A0A0A";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes megaMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
