"use client";
import { Locale } from "@/lib/i18n";

interface PrivacyClientProps {
  lang: Locale;
}

export default function PrivacyClient({ lang }: PrivacyClientProps) {
  const isFr = lang === "fr";

  const content = isFr
    ? {
        title: "Politique de confidentialité",
        date: "Dernière mise à jour : 27 avril 2026",
        sections: [
          {
            title: "Collecte des données",
            body: "Nous collectons les informations que vous nous fournissez directement, notamment lors de la création de votre compte, de l'utilisation de nos services ou lorsque vous nous contactez. Ces données peuvent inclure votre nom, adresse email, numéro de téléphone et informations de facturation.",
          },
          {
            title: "Utilisation des données",
            body: "Les données collectées sont utilisées pour :
• Fournir et maintenir nos services
• Vous informer des changements concernant nos services
• Permettre votre participation aux fonctionnalités interactives de notre plateforme
• Assurer le service client
• Détecter et prévenir les problèmes techniques",
          },
          {
            title: "Protection des données",
            body: "La sécurité de vos données est importante pour nous. Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisés.",
          },
          {
            title: "Partage des données",
            body: "Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec des prestataires de services de confiance qui nous aident à exploiter notre plateforme, sous réserve qu'ils s'engagent à maintenir la confidentialité de ces informations.",
          },
          {
            title: "Vos droits",
            body: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à privacy@mentivis.com.",
          },
          {
            title: "Cookies",
            body: "Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur.",
          },
          {
            title: "Modifications",
            body: "Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications prendront effet immédiatement après leur publication sur cette page.",
          },
        ],
      }
    : {
        title: "Privacy Policy",
        date: "Last updated: April 27, 2026",
        sections: [
          {
            title: "Data Collection",
            body: "We collect information that you provide directly to us, including when you create your account, use our services, or contact us. This data may include your name, email address, phone number, and billing information.",
          },
          {
            title: "Use of Data",
            body: "The collected data is used to:
• Provide and maintain our services
• Inform you of changes to our services
• Enable your participation in interactive features of our platform
• Provide customer service
• Detect and prevent technical issues",
          },
          {
            title: "Data Protection",
            body: "The security of your data is important to us. We implement appropriate security measures to protect your personal data against any unauthorized access, modification, disclosure, or destruction.",
          },
          {
            title: "Data Sharing",
            body: "We do not sell your personal data. We may share your information with trusted service providers who help us operate our platform, provided they agree to maintain the confidentiality of this information.",
          },
          {
            title: "Your Rights",
            body: "In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify, delete, and port your data. To exercise these rights, contact us at privacy@mentivis.com.",
          },
          {
            title: "Cookies",
            body: "We use cookies and similar technologies to improve your experience, analyze traffic, and personalize content. You can control the use of cookies through your browser settings.",
          },
          {
            title: "Changes",
            body: "We reserve the right to modify this privacy policy at any time. Changes will take effect immediately after being posted on this page.",
          },
        ],
      };

  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1
          className="t-display"
          style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "0 0 16px" }}
        >
          {content.title}
        </h1>
        <p style={{ color: "var(--text-tertiary)", fontSize: 14, marginBottom: 48 }}>
          {content.date}
        </p>
        {content.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 500,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              {section.title}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 16,
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
