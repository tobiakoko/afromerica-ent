import Link from "next/link";
import Image from "next/image";
import { APP_METADATA, FOOTER_LINKS, SOCIAL_LINKS, DEVELOPER } from "@/lib/constants";

const footerSocialLinks = [
  { platform: 'instagram', label: 'Instagram', href: SOCIAL_LINKS.INSTAGRAM, icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { platform: 'facebook', label: 'Facebook', href: SOCIAL_LINKS.FACEBOOK, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { platform: 'twitter', label: 'Twitter', href: SOCIAL_LINKS.TWITTER, icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
  { platform: 'youtube', label: 'YouTube', href: SOCIAL_LINKS.YOUTUBE, icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { platform: 'tiktok', label: 'TikTok', href: SOCIAL_LINKS.TIKTOK, icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-950">
      {/* Apple-style subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-50/50 dark:to-gray-900/20 pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-block group">
              <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-2 inline-flex items-center group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
                <Image
                  src="/logo.png"
                  alt={APP_METADATA.NAME}
                  width={140}
                  height={36}
                  className="h-7 w-auto"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed font-light">
              {APP_METADATA.DESCRIPTION}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
              {APP_METADATA.LOCATION}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 tracking-tight">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.COMPANY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 tracking-tight">Legal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 tracking-tight">Connect</h3>

            {/* Social Links */}
            <div className="flex gap-2 mb-6">
              {footerSocialLinks.map((item) => (
                <a
                  key={item.platform}
                  href={item.href}
                  className="group p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                >
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={item.icon} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${APP_METADATA.EMAIL}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00FFF0] dark:hover:text-[#00FFF0] transition-colors block font-light"
              >
                {APP_METADATA.EMAIL}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {APP_METADATA.BUSINESS_HOURS}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200/60 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left font-light">
              &copy; {currentYear} {APP_METADATA.NAME}. All rights reserved.
            </p>

            {/* Developer Credit */}
            {DEVELOPER.URL && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Developed by{' '}
                <a
                  href={DEVELOPER.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00FFF0] hover:text-[#00E6D8] font-medium transition-colors"
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
