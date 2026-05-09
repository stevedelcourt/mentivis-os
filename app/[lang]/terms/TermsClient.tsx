"use client";
import { Locale } from "@/lib/i18n";

interface TermsClientProps {
  lang: Locale;
}

export default function TermsClient({ lang }: TermsClientProps) {
  const isFr = lang === "fr";

  const content = isFr
    ? {
        title: "Conditions générales d'utilisation",
        date: "Dernière mise à jour : 27 avril 2026",
        sections: [
          {
            title: "Acceptation des conditions",
            body: "En accédant à notre plateforme et en utilisant nos services, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.",
          },
          {
            title: "Description du service",
            body: "MentivisOS fournit une plateforme logicielle de gestion pour les cabinets d'avocats et les professionnels du droit. Nos services incluent la gestion de dossiers, le suivi du temps, la facturation et d'autres outils de productivité.",
          },
          {
            title: "Compte utilisateur",
            body: "Pour accéder à certains services, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte.",
          },
          {
            title: "Utilisation acceptable",
            body: "Vous vous engagez à utiliser nos services uniquement à des fins légales et conformément aux présentes conditions. Il est interdit de :
• Violer les lois applicables
• Transmettre des virus ou code malveillant
• Tenter d'accéder sans autorisation à nos systèmes
• Interférer avec d'autres utilisateurs
• Utiliser nos services pour du spam ou du harcèlement",
          },
          {
            title: "Propriété intellectuelle",
            body: "Notre plateforme et son contenu original, fonctionnalités et design sont la propriété exclusive de Mentivis SAS et sont protégés par les lois sur la propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer ou créer des œuvres dérivées sans notre autorisation écrite.",
          },
          {
            title: "Limitation de responsabilité",
            body: "Dans toute la mesure permise par la loi, Mentivis SAS ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de votre utilisation ou de votre incapacité à utiliser nos services.",
          },
          {
            title: "Modification des conditions",
            body: "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication. Votre utilisation continue de nos services après toute modification constitue votre acceptation des nouvelles conditions.",
          },
          {
            title: "Résiliation",
            body: "Nous pouvons résilier ou suspendre votre accès à nos services immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris en cas de violation des présentes conditions.",
          },
          {
            title: "Droit applicable",
            body: "Les présentes conditions sont régies par le droit français. Tout litige relatif à ces conditions sera soumis à la compétence exclusive des tribunaux de Paris.",
          },
        ],
      }
    : {
        title: "Terms of Use",
        date: "Last updated: April 27, 2026",
        sections: [
          {
            title: "Acceptance of Terms",
            body: "By accessing our platform and using our services, you agree to be bound by these terms of use. If you do not accept these terms, please do not use our services.",
          },
          {
            title: "Service Description",
            body: "MentivisOS provides a management software platform for law firms and legal professionals. Our services include case management, time tracking, billing, and other productivity tools.",
          },
          {
            title: "User Account",
            body: "To access certain services, you must create an account. You are responsible for maintaining the confidentiality of your credentials and all activities performed under your account. You must inform us immediately of any unauthorized use of your account.",
          },
          {
            title: "Acceptable Use",
            body: "You agree to use our services only for lawful purposes and in accordance with these terms. It is prohibited to:
• Violate applicable laws
• Transmit viruses or malicious code
• Attempt to access our systems without authorization
• Interfere with other users
• Use our services for spam or harassment",
          },
          {
            title: "Intellectual Property",
            body: "Our platform and its original content, features, and design are the exclusive property of Mentivis SAS and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.",
          },
          {
            title: "Limitation of Liability",
            body: "To the fullest extent permitted by law, Mentivis SAS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.",
          },
          {
            title: "Modification of Terms",
            body: "We reserve the right to modify these terms at any time. Modifications will take effect upon publication. Your continued use of our services after any modification constitutes your acceptance of the new terms.",
          },
          {
            title: "Termination",
            body: "We may terminate or suspend your access to our services immediately, without notice or liability, for any reason whatsoever, including in the event of a breach of these terms.",
          },
          {
            title: "Governing Law",
            body: "These terms are governed by French law. Any dispute relating to these terms will be subject to the exclusive jurisdiction of the courts of Paris.",
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
