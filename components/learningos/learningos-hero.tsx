import { Locale } from "@/lib/i18n";
import CmsPageHero from "@/components/cms-page-hero";
import { PageHeroContent } from "@/components/page-hero";

const DEFAULTS: Record<string, PageHeroContent> = {
  fr: {
    eyebrow: "LearningOS",
    headline: "Former autrement.\nPerformer durablement.",
    subheadline: "Générez des parcours personnalisés, adaptez les contenus automatiquement\net pilotez la montée en compétences de vos équipes, le tout dans un seul système.",
    ctaPrimary: "Démarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'équipe",
    ctaSecondaryLink: "/contact",
    proof: "Utilisé par les directions de la formation, les CFA, les campus d'entreprise.",
  },
  en: {
    eyebrow: "LearningOS",
    headline: "The AI-native training system\nthat turns your employees into talents.",
    subheadline: "Generate personalized learning paths, automatically adapt content,\nand drive your team's skill development, all in a single system.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
};

const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 580" style="width:100%;height:auto;display:block;color:var(--text-primary,#0A0A0A)">
<g id="scene">
<line x1="290" y1="290" x2="276.89741625689237" y2="289.76724598695733" stroke="currentColor" stroke-opacity="1" stroke-width="0.3520778076368764"></line>
<line x1="290" y1="290" x2="190.72306049744978" y2="321.30541809410926" stroke="currentColor" stroke-opacity="1" stroke-width="0.48235788784331324"></line>
<line x1="290" y1="290" x2="261.61024705646474" y2="186.33102316974578" stroke="currentColor" stroke-opacity="1" stroke-width="0.49123594540319604"></line>
<line x1="290" y1="290" x2="319.5904780192063" y2="396.3312972146273" stroke="currentColor" stroke-opacity="1" stroke-width="0.4990327659104932"></line>
<line x1="290" y1="290" x2="369.27558507962436" y2="184.06841795864295" stroke="currentColor" stroke-opacity="1" stroke-width="0.5657151158945974"></line>
<line x1="290" y1="290" x2="319.6487422259106" y2="427.5379285129442" stroke="currentColor" stroke-opacity="1" stroke-width="0.5948166714323839"></line>
<line x1="290" y1="290" x2="447.8472775664382" y2="193.37494352421874" stroke="currentColor" stroke-opacity="1" stroke-width="0.7880024413792444"></line>
<line x1="290" y1="290" x2="377.2862258946365" y2="464.8411145976694" stroke="currentColor" stroke-opacity="1" stroke-width="0.8450441266921456"></line>
<line x1="290" y1="290" x2="134.30029702493434" y2="408.9710180710474" stroke="currentColor" stroke-opacity="1" stroke-width="0.8481413118049945"></line>
<line x1="290" y1="290" x2="486.3067395378065" y2="266.17161826090455" stroke="currentColor" stroke-opacity="1" stroke-width="0.8587363430372655"></line>
<line x1="290" y1="290" x2="485.50891140522907" y2="335.7768629445392" stroke="currentColor" stroke-opacity="1" stroke-width="0.8771921498560041"></line>
<line x1="290" y1="290" x2="454.01018474879345" y2="413.5387899941712" stroke="currentColor" stroke-opacity="1" stroke-width="0.9058758521099817"></line>
<line x1="290" y1="290" x2="57.21656883901534" y2="268.1216464062059" stroke="currentColor" stroke-opacity="1" stroke-width="1.1462130526723504"></line>
<line x1="290" y1="290" x2="76.87972610190272" y2="173.66753463721315" stroke="currentColor" stroke-opacity="1" stroke-width="1.3337537977383018"></line>
<line x1="290" y1="290" x2="48.72832312759206" y2="318.1082645270562" stroke="currentColor" stroke-opacity="1" stroke-width="1.350550645573024"></line>
<line x1="290" y1="290" x2="305.7488126826781" y2="47.898412064416476" stroke="currentColor" stroke-opacity="1" stroke-width="1.3889150445607346"></line>
<line x1="290" y1="290" x2="80.30351391417838" y2="411.41800885192674" stroke="currentColor" stroke-opacity="1" stroke-width="1.403110171044049"></line>
<line x1="290" y1="290" x2="198.91131587162556" y2="514.2698259028034" stroke="currentColor" stroke-opacity="1" stroke-width="1.4121372247544426"></line>
<line x1="290" y1="290" x2="141.6402108434807" y2="103.08319342678467" stroke="currentColor" stroke-opacity="1" stroke-width="1.4796670945999235"></line>
<line x1="290" y1="290" x2="377.75552270644454" y2="112.1133886316874" stroke="currentColor" stroke-opacity="1" stroke-width="1.7031049667606561"></line>
<line x1="290" y1="290" x2="274.07274169208864" y2="469.2254065933883" stroke="currentColor" stroke-opacity="1" stroke-width="1.7507183029969746"></line>
<line x1="290" y1="290" x2="409.3910079941756" y2="378.29282570018285" stroke="currentColor" stroke-opacity="1" stroke-width="1.8078408571012567"></line>
<line x1="290" y1="290" x2="398.7763175529615" y2="222.01773996778695" stroke="currentColor" stroke-opacity="1" stroke-width="1.8342912144031267"></line>
<line x1="290" y1="290" x2="261.999753853807" y2="256.24245532042056" stroke="currentColor" stroke-opacity="1" stroke-width="1.8930592694733352"></line>
<circle cx="276.89741625689237" cy="289.76724598695733" r="1.5053620842241973" fill="currentColor" fill-opacity="1"></circle>
<circle cx="190.72306049744978" cy="321.30541809410926" r="1.8415687428214536" fill="currentColor" fill-opacity="1"></circle>
<circle cx="261.61024705646474" cy="186.33102316974578" r="1.864479859105022" fill="currentColor" fill-opacity="1"></circle>
<circle cx="319.5904780192063" cy="396.3312972146273" r="1.8846006862206277" fill="currentColor" fill-opacity="1"></circle>
<circle cx="369.27558507962436" cy="184.06841795864295" r="2.0566841700505742" fill="currentColor" fill-opacity="1"></circle>
<circle cx="319.6487422259106" cy="427.5379285129442" r="2.1317849585351842" fill="currentColor" fill-opacity="1"></circle>
<circle cx="447.8472775664382" cy="193.37494352421874" r="2.630328880978695" fill="currentColor" fill-opacity="1"></circle>
<circle cx="377.2862258946365" cy="464.8411145976694" r="2.7775332301732787" fill="currentColor" fill-opacity="1"></circle>
<circle cx="134.30029702493434" cy="408.9710180710474" r="2.7855259659483727" fill="currentColor" fill-opacity="1"></circle>
<circle cx="486.3067395378065" cy="266.17161826090455" r="2.812867982031653" fill="currentColor" fill-opacity="1"></circle>
<circle cx="485.50891140522907" cy="335.7768629445392" r="2.86049587059614" fill="currentColor" fill-opacity="1"></circle>
<circle cx="454.01018474879345" cy="413.5387899941712" r="2.934518328025759" fill="currentColor" fill-opacity="1"></circle>
<circle cx="57.21656883901534" cy="268.1216464062059" r="3.554743361735098" fill="currentColor" fill-opacity="1"></circle>
<circle cx="76.87972610190272" cy="173.66753463721315" r="4.038719478034327" fill="currentColor" fill-opacity="1"></circle>
<circle cx="48.72832312759206" cy="318.1082645270562" r="4.082066182123933" fill="currentColor" fill-opacity="1"></circle>
<circle cx="305.7488126826781" cy="47.898412064416476" r="4.18107108273738" fill="currentColor" fill-opacity="1"></circle>
<circle cx="80.30351391417838" cy="411.41800885192674" r="4.217703667210449" fill="currentColor" fill-opacity="1"></circle>
<circle cx="198.91131587162556" cy="514.2698259028034" r="4.240999289688885" fill="currentColor" fill-opacity="1"></circle>
<circle cx="141.6402108434807" cy="103.08319342678467" r="4.415269921548189" fill="currentColor" fill-opacity="1"></circle>
<circle cx="377.75552270644454" cy="112.1133886316874" r="4.99188378518879" fill="currentColor" fill-opacity="1"></circle>
<circle cx="274.07274169208864" cy="469.2254065933883" r="5.114756910959934" fill="currentColor" fill-opacity="1"></circle>
<circle cx="409.3910079941756" cy="378.29282570018285" r="5.262169953809694" fill="currentColor" fill-opacity="1"></circle>
<circle cx="398.7763175529615" cy="222.01773996778695" r="5.330428940395166" fill="currentColor" fill-opacity="1"></circle>
<circle cx="261.999753853807" cy="256.24245532042056" r="5.4820884373505425" fill="currentColor" fill-opacity="1"></circle>
<circle cx="290" cy="290" r="2.5" fill="currentColor" fill-opacity="1"></circle>
</g>
</svg>`;

const starVisual = (
  <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
    <div
      style={{
        animation: "star-rotate 25s linear infinite",
        width: "100%",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: SVG_CONTENT }} />
    </div>
    <style>{`
      @keyframes star-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function LearningOSHero({ lang }: { lang: Locale }) {
  return (
    <CmsPageHero
      page="learningos"
      lang={lang}
      defaults={DEFAULTS[lang === "fr" ? "fr" : "en"]}
      visual={starVisual}
    />
  );
}