import { siteConfig } from '@/config/site';

export function SocialIcons() {
  const socialLinks = siteConfig.socialLinks;
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6">
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.href}
          className="text-2xl hover:scale-110 transition-transform duration-200"
          aria-label={social.label}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}