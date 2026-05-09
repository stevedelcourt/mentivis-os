"use client";
import { Locale } from "@/lib/i18n";

interface LegalClientProps {
  lang: Locale;
}

export default function LegalClient({ lang }: LegalClientProps) {
  const isFr = lang === "fr";
  
  const content = isFr ? {
    title: "Mentions légales",
    date: "Dernière mise à jour : 27 avril 2026",
    sections: [
      {
        title: "Éditeur du site",
        body: `Mentivis SAS
Société par actions simplifiée au capital de dix mille euros
Siège social : 60 rue François 1er, 75008 Paris
941 914 814 R.C.S. Paris
Email : contact@mentivis.com
Téléphone : +33 1 89 48 10 02`,
      },
      {
        title: "Directeur de la publication",
        body: "Le directeur de la publication est Steven Delcourt.",
      },
      {
        title: "Hébergement",
        body: `O2switch
Siret : 510 909 807 00032
RCS Clermont Ferrand
SAS au capital de 100 000€`,
      },
      {
        title: "Propriété intellectuelle",
        body: "L'ensemble du contenu de ce site (textes, images, logos, arborescence) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.",
      },
      {
        title: "Limitation de responsabilité",
        body: "Les informations contenues sur ce site sont aussi précises que possible. Mentivis ne saurait être tenu responsable des omissions, erreurs ou inexactitudes dans les informations proposées.",
      },
    ],
  } : {
    title: "Legal Notice",
    date: "Last updated: April 27, 2026",
    sections: [
      {
        title: "Website publisher",
        body: `Mentivis SAS
Simplified Joint Stock Company with capital of 10,000 euros
Headquarters: 60 rue François 1er, 75008 Paris
941 914 814 R.C.S. Paris
Email: contact@mentivis.com
Phone: +33 1 89 48 10 02`,
      },
      {
        title: "Publication director",
        body: "The publication director is Steven Delcourt.",
      },
      {
        title: "Hosting",
        body: `O2switch
Siret: 510 909 807 00032
RCS Clermont Ferrand
SAS with capital of 100,000€`,
      },
      {
        title: "Intellectual property",
        body: "All content on this site (texts, images, logos, structure) is protected by copyright. Any reproduction, even partial, is prohibited without prior authorization.",
      },
      {
        title: "Limitation of liability",
        body: "The information on this site is as accurate as possible. Mentivis cannot be held responsible for omissions, errors, or inaccuracies in the information provided.",
      },
    ],
  };

  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="t-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "0 0 16px" }}>
          {content.title}
        </h1>
        <p style={{ color: "var(--text-tertiary)", fontSize: 14, marginBottom: 48 }}>{content.date}</p>
        {content.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              {section.title}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
