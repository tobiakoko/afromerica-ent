import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                {siteConfig.brand.fullName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {siteConfig.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {siteConfig.contact.location}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {siteConfig.footerLinks.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {siteConfig.footerLinks.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Connect</h3>

            {/* Social Links */}
            <div className="flex gap-3 mb-4">
              {siteConfig.footerSocialLinks.map((item) => {
                const Icon = socialIcons[item.platform as keyof typeof socialIcons];
                if (!Icon) return null;

                return (
                  <a
                    key={item.platform}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                {siteConfig.contact.email}
              </a>
              <p className="text-xs text-muted-foreground">
                {siteConfig.contact.businessHours}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} {siteConfig.brand.fullName}. All rights reserved.
            </p>

            {/* Developer Credit */}
            {siteConfig.developer.url !== '#' && (
              <p className="text-xs text-muted-foreground">
                Developed by{' '}
                <a
                  href={siteConfig.developer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {siteConfig.developer.name}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
