"use client";
import { Locale } from "@/lib/i18n";

interface CgvClientProps {
  lang: Locale;
}

export default function CgvClient({ lang }: CgvClientProps) {
  const isFr = lang === "fr";

  const content = isFr
    ? {
        title: "Conditions générales de vente",
        date: "Dernière mise à jour : 27 avril 2026",
        sections: [
          {
            title: "Objet",
            body: "Les présentes conditions générales de vente régissent la fourniture des services de MentivisOS, plateforme logicielle de gestion pour professionnels du droit. Elles s'appliquent à toute souscription d'abonnement ou achat de services effectué sur notre plateforme.",
          },
          {
            title: "Services proposés",
            body: "MentivisOS propose des abonnements mensuels ou annuels donnant accès à une suite d'outils de gestion incluant :
• Gestion de dossiers clients
• Suivi du temps et des honoraires
• Génération de factures
• Gestion documentaire
• Outils collaboratifs
• Support technique",
          },
          {
            title: "Prix et paiement",
            body: "Les prix de nos services sont indiqués en euros hors taxes. Le paiement s'effectue par prélèvement automatique mensuel ou annuel selon l'option choisie. En cas de défaut de paiement, nous nous réservons le droit de suspendre l'accès aux services jusqu'à régularisation.",
          },
          {
            title: "Durée et renouvellement",
            body: "Les abonnements sont conclus pour une durée indéterminée avec reconduction tacite mensuelle ou annuelle selon l'option choisie. Vous pouvez résilier votre abonnement à tout moment depuis votre espace client. La résiliation prendra effet à la fin de la période en cours.",
          },
          {
            title: "Essai gratuit",
            body: "Nous offrons une période d'essai gratuit de 14 jours pour vous permettre de tester nos services. À l'issue de cette période, si vous ne souhaitez pas continuer, vous devez résilier votre abonnement. Sans résiliation, l'abonnement devient payant automatiquement.",
          },
          {
            title: "Obligations du client",
            body: "En tant que client, vous vous engagez à :
• Fournir des informations exactes et à jour
• Maintenir la confidentialité de vos identifiants
• Ne pas partager votre compte avec des tiers
• Utiliser les services conformément à leur destination
• Respecter les droits de propriété intellectuelle",
          },
          {
            title: "Disponibilité des services",
            body: "Nous nous engageons à mettre en œuvre tous les moyens nécessaires pour assurer la disponibilité de nos services 24h/24 et 7j/7, sauf interruption pour maintenance ou cas de force majeure. Nous nous efforçons de limiter les interruptions et de vous informer préalablement des maintenances planifiées.",
          },
          {
            title: "Propriété intellectuelle",
            body: "Tous les éléments de la plateforme (logiciels, bases de données, textes, images) sont protégés par le droit de la propriété intellectuelle. L'abonnement ne confère aucun droit de propriété sur le logiciel, qui reste la propriété exclusive de Mentivis SAS.",
          },
          {
            title: "Responsabilité",
            body: "Mentivis SAS s'engage à fournir ses services avec professionnalisme et diligence. Notre responsabilité ne saurait être engagée en cas de dommages indirects, pertes de données ou interruption d'activité. Notre responsabilité est limitée au montant des sommes effectivement versées par le client au cours des 12 mois précédents.",
          },
          {
            title: "Protection des données",
            body: "Nous traitons vos données conformément à notre politique de confidentialité. En tant que sous-traitant pour les données de vos clients, nous nous engageons à respecter les obligations du RGPD et à signer avec vous un contrat de sous-traitance si nécessaire.",
          },
          {
            title: "Résiliation",
            body: "En cas de manquement grave aux présentes conditions, nous nous réservons le droit de résilier l'abonnement avec effet immédiat et sans indemnité. En cas de résiliation pour quelque cause que ce soit, vos données vous seront restituées dans un format standard et supprimées de nos serveurs dans un délai de 30 jours.",
          },
          {
            title: "Droit applicable et juridiction",
            body: "Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée préalablement. À défaut, les tribunaux de Paris seront seuls compétents.",
          },
        ],
      }
    : {
        title: "Terms of Sale",
        date: "Last updated: April 27, 2026",
        sections: [
          {
            title: "Purpose",
            body: "These general terms and conditions govern the provision of MentivisOS services, a management software platform for legal professionals. They apply to any subscription or service purchase made on our platform.",
          },
          {
            title: "Services Offered",
            body: "MentivisOS offers monthly or annual subscriptions providing access to a suite of management tools including:
• Client case management
• Time and billing tracking
• Invoice generation
• Document management
• Collaborative tools
• Technical support",
          },
          {
            title: "Pricing and Payment",
            body: "Our service prices are indicated in euros excluding taxes. Payment is made by automatic monthly or annual debit depending on the chosen option. In case of payment default, we reserve the right to suspend access to services until settlement.",
          },
          {
            title: "Duration and Renewal",
            body: "Subscriptions are concluded for an indefinite period with tacit monthly or annual renewal depending on the chosen option. You can cancel your subscription at any time from your client area. Cancellation will take effect at the end of the current period.",
          },
          {
            title: "Free Trial",
            body: "We offer a 14-day free trial period to allow you to test our services. At the end of this period, if you do not wish to continue, you must cancel your subscription. Without cancellation, the subscription automatically becomes paid.",
          },
          {
            title: "Customer Obligations",
            body: "As a customer, you agree to:
• Provide accurate and up-to-date information
• Maintain the confidentiality of your credentials
• Not share your account with third parties
• Use the services in accordance with their purpose
• Respect intellectual property rights",
          },
          {
            title: "Service Availability",
            body: "We commit to implementing all necessary means to ensure the availability of our services 24/7, except for maintenance interruptions or force majeure. We strive to limit interruptions and to inform you in advance of scheduled maintenance.",
          },
          {
            title: "Intellectual Property",
            body: "All elements of the platform (software, databases, texts, images) are protected by intellectual property law. The subscription does not confer any ownership rights over the software, which remains the exclusive property of Mentivis SAS.",
          },
          {
            title: "Liability",
            body: "Mentivis SAS commits to providing its services with professionalism and diligence. Our liability cannot be engaged in case of indirect damages, data loss, or business interruption. Our liability is limited to the amount of sums actually paid by the customer during the previous 12 months.",
          },
          {
            title: "Data Protection",
            body: "We process your data in accordance with our privacy policy. As a data processor for your client data, we commit to respecting GDPR obligations and to signing a data processing agreement with you if necessary.",
          },
          {
            title: "Termination",
            body: "In case of serious breach of these conditions, we reserve the right to terminate the subscription with immediate effect and without compensation. In case of termination for any reason, your data will be returned to you in a standard format and deleted from our servers within 30 days.",
          },
          {
            title: "Governing Law and Jurisdiction",
            body: "These conditions are subject to French law. In case of dispute, an amicable solution will be sought beforehand. Failing that, the courts of Paris will have exclusive jurisdiction.",
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
