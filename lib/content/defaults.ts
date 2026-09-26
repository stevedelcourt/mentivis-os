// Valeurs par défaut du contenu éditorial (anciennement dans lib/cms/db.ts).
// content/seo.json les complète ou les remplace.
import type { SeoContent } from "@/lib/cms/types";
import { SITE_URL } from "@/lib/site-url";

export const DEFAULT_SEO: SeoContent = {
  fr: {
    homepage: {
      title: "MentivisOS - Le système de formation native IA",
      description: "MentivisOS mesure les écarts de compétences, génère des parcours personnalisés et pilote la montée en compétences de vos équipes.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "MentivisOS",
        applicationCategory: "EducationApplication",
        description: "Système de formation native IA pour entreprises et institutions.",
        url: SITE_URL,
      },
    },
    blog: {
      title: "News - MentivisOS",
      description: "Actualités, analyses et points de vue sur la formation et l'IA.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "News MentivisOS",
        description: "Actualités et analyses sur la formation et l'IA.",
      },
    },
    business: {
      title: "Mentivis - Coordonnées",
      description: "Adresse, téléphone et localisation de Mentivis, 60 rue François 1er, 75008 Paris.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Mentivis",
        address: {
          "@type": "PostalAddress",
          streetAddress: "60 rue François 1er",
          postalCode: "75008",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
        telephone: "+33189481002",
        url: SITE_URL,
        hasMap: "https://maps.google.com/?q=60+rue+Fran%C3%A7ois+1er+75008+Paris",
      },
    },
  },
  en: {
    homepage: {
      title: "MentivisOS - The AI-native training system",
      description: "MentivisOS measures skill gaps, generates personalised learning paths and drives your teams' skill development.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "MentivisOS",
        applicationCategory: "EducationApplication",
        description: "AI-native training system for enterprises and institutions.",
        url: SITE_URL,
      },
    },
    blog: {
      title: "News - MentivisOS",
      description: "News, insights and perspectives on training and AI.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "MentivisOS News",
        description: "News and analysis on training and AI.",
      },
    },
    business: {
      title: "Mentivis - Contact",
      description: "Address, phone and location of Mentivis, 60 rue François 1er, 75008 Paris, France.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Mentivis",
        address: {
          "@type": "PostalAddress",
          streetAddress: "60 rue François 1er",
          postalCode: "75008",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
        telephone: "+33189481002",
        url: SITE_URL,
        hasMap: "https://maps.google.com/?q=60+rue+Fran%C3%A7ois+1er+75008+Paris",
      },
    },
  },
};
