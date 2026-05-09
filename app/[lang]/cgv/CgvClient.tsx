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
            body: "Les présentes conditions générales de vente régissent la fourniture des services de MentivisOS, plateforme logicielle de gestion pour professionnels. Elles s'appliquent à toute souscription d'abonnement ou achat de services effectué sur notre plateforme.",
          },
          {
            title: "Services proposés",
            blocks: [
              { type: "paragraph" as const, text: "MentivisOS propose des abonnements mensuels ou annuels donnant accès à une suite d'outils de gestion incluant :" },
              { type: "list" as const, items: [
                "Gestion de dossiers clients",
                "Suivi du temps et des honoraires",
                "Génération de factures",
                "Gestion documentaire",
                "Outils collaboratifs",
                "Support technique",
              ]},
            ],
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
            blocks: [
              { type: "paragraph" as const, text: "En tant que client, vous vous engagez à :" },
              { type: "list" as const, items: [
                "Fournir des informations exactes et à jour",
                "Maintenir la confidentialité de vos identifiants",
                "Ne pas partager votre compte avec des tiers",
                "Utiliser les services conformément à leur destination",
                "Respecter les droits de propriété intellectuelle",
              ]},
            ],
          },
          {
            title: "Responsabilité",
            body: "Mentivis SAS s'engage à fournir ses services avec diligence et selon les règles de l'art. Notre responsabilité ne saurait être engagée en cas de force majeure, d'utilisation non conforme de nos services, ou de faute du client.",
          },
          {
            title: "Propriété intellectuelle",
            body: "Tous les éléments de notre plateforme (logiciels, designs, textes, images) sont protégés par les droits de propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation préalable.",
          },
          {
            title: "Données personnelles",
            body: "Les données personnelles collectées sont traitées conformément à notre politique de confidentialité. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
          },
          {
            title: "Droit applicable",
            body: "Les présentes conditions générales de vente sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.",
          },
        ],
      }
    : {
        title: "General Terms and Conditions of Sale",
        date: "Last updated: April 27, 2026",
        sections: [
          {
            title: "Purpose",
            body: "These general terms and conditions of sale govern the provision of MentivisOS services. They apply to any subscription or service purchase made on our platform.",
          },
          {
            title: "Services Offered",
            blocks: [
              { type: "paragraph" as const, text: "MentivisOS offers monthly or annual subscriptions providing access to a suite of management tools including:" },
              { type: "list" as const, items: [
                "Client case management",
                "Time and billing tracking",
                "Invoice generation",
                "Document management",
                "Collaborative tools",
                "Technical support",
              ]},
            ],
          },
          {
            title: "Pricing and Payment",
            body: "Our service prices are indicated in euros excluding taxes. Payment is made by automatic monthly or annual debit according to the chosen option. In case of payment default, we reserve the right to suspend access to services until regularization.",
          },
          {
            title: "Duration and Renewal",
            body: "Subscriptions are concluded for an indefinite period with tacit monthly or annual renewal according to the chosen option. You may cancel your subscription at any time from your customer account. The cancellation will take effect at the end of the current period.",
          },
          {
            title: "Free Trial",
            body: "We offer a 14-day free trial period to allow you to test our services. At the end of this period, if you do not wish to continue, you must cancel your subscription. Without cancellation, the subscription automatically becomes paid.",
          },
          {
            title: "Customer Obligations",
            blocks: [
              { type: "paragraph" as const, text: "As a customer, you agree to:" },
              { type: "list" as const, items: [
                "Provide accurate and up-to-date information",
                "Maintain the confidentiality of your credentials",
                "Not share your account with third parties",
                "Use the services in accordance with their purpose",
                "Respect intellectual property rights",
              ]},
            ],
          },
          {
            title: "Liability",
            body: "Mentivis SAS undertakes to provide its services with diligence and in accordance with industry standards. Our liability cannot be engaged in case of force majeure, non-compliant use of our services, or customer fault.",
          },
          {
            title: "Intellectual Property",
            body: "All elements of our platform (software, designs, texts, images) are protected by intellectual property rights. Any reproduction or representation, total or partial, is prohibited without prior authorization.",
          },
          {
            title: "Personal Data",
            body: "Personal data collected is processed in accordance with our privacy policy. You have the right to access, rectify, and delete your data.",
          },
          {
            title: "Applicable Law",
            body: "These general terms and conditions of sale are subject to French law. In case of dispute, French courts will have sole jurisdiction.",
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
        {content.sections.map((section: any, i: number) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              {section.title}
            </h2>
            {"body" in section ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                {section.body}
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {section.blocks.map((block: any, j: number) =>
                  block.type === "paragraph" ? (
                    <p key={j} style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                      {block.text}
                    </p>
                  ) : (
                    <ul key={j} style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)" }}>
                      {block.items.map((item: string, k: number) => (
                        <li key={k} style={{ marginBottom: 4 }}>{item}</li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
