import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-td-surface text-td-on-surface">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
