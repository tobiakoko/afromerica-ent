import type { ContactInfo } from '../types/contact.types';

interface ContactInfoCardProps extends ContactInfo {}

export function ContactInfoCard({ icon, label, value, href }: ContactInfoCardProps) {
  const content = (
    <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-lime-400/50 transition-all duration-300 hover:bg-white/10">
      <div className="mb-4 text-lime-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-white/60 mb-2">{label}</h3>
      <p className="text-white font-medium group-hover:text-lime-400 transition-colors">
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}