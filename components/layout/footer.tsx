import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { APP_METADATA, FOOTER_LINKS, SOCIAL_LINKS, DEVELOPER } from "@/lib/constants";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const footerSocialLinks = [
  { platform: 'facebook', label: 'Facebook', href: SOCIAL_LINKS.FACEBOOK },
  { platform: 'instagram', label: 'Instagram', href: SOCIAL_LINKS.INSTAGRAM },
  { platform: 'twitter', label: 'Twitter', href: SOCIAL_LINKS.TWITTER },
  { platform: 'youtube', label: 'YouTube', href: SOCIAL_LINKS.YOUTUBE },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt={APP_METADATA.NAME}
                width={150}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {APP_METADATA.DESCRIPTION}
            </p>
            <p className="text-xs text-muted-foreground">
              {APP_METADATA.LOCATION}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.COMPANY.map((item) => (
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
              {FOOTER_LINKS.LEGAL.map((item) => (
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
              {footerSocialLinks.map((item) => {
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
                href={`mailto:${APP_METADATA.EMAIL}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                {APP_METADATA.EMAIL}
              </a>
              <p className="text-xs text-muted-foreground">
                {APP_METADATA.BUSINESS_HOURS}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} {APP_METADATA.NAME}. All rights reserved.
            </p>

            {/* Developer Credit */}
            {DEVELOPER.URL && (
              <p className="text-xs text-muted-foreground">
                Developed by{' '}
                <a
                  href={DEVELOPER.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {DEVELOPER.NAME}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
