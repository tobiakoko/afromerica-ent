import { HomeNavigation } from "@/components/layout/navigation"
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNavigation />
      {children}
      <Footer />
    </div>
  );
}