import Link from "next/link";

interface ModuleCardProps {
  title: string;
  href: string;
  gradientVar: string;
  delay?: number;
}

export function ModuleCard({ title, href, gradientVar, delay = 0 }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="module-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="module-card__bg"
        style={{ background: `var(${gradientVar})` }}
      />
      <div className="module-card__grain" />
      <div className="module-card__content">
        <h3 className="module-card__title">{title}</h3>
      </div>
    </Link>
  );
}
