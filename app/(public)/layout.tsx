"use client";

import { HomeNavigation } from "@/components/layout/navigation"
import { Footer } from '@/components/layout/Footer';
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Home page has its own navigation and layout
  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <HomeNavigation />
      {children}
      <Footer />
    </div>
  );
}