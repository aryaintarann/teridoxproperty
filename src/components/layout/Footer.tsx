import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

const footerLinks = [
  {
    title: "Perusahaan",
    links: [
      { href: "/about", label: "Tentang Kami" },
      { href: "/contact", label: "Hubungi Kami" },
      { href: "#", label: "Karir" },
    ]
  },
  {
    title: "Layanan",
    links: [
      { href: "/listing", label: "Cari Properti" },
      { href: "/login", label: "Portal Penghuni" },
      { href: "/login", label: "Portal Pemilik" },
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Syarat & Ketentuan" },
      { href: "#", label: "Kebijakan Privasi" },
      { href: "/faq", label: "FAQ" },
    ]
  }
];

export function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1 space-y-4">
            <span className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <MaterialIcon name="real_estate_agent" className="text-3xl" />
              Teridox Property
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mendefinisikan ulang manajemen properti dan pengalaman menyewa hunian modern yang aman, nyaman, dan transparan.
            </p>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="font-heading font-semibold text-foreground text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Teridox Property Management. Hak cipta dilindungi.
          </p>
          <div className="flex gap-4">
            {/* Social Icons (using Material Icons as placeholders) */}
            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
              <MaterialIcon name="public" className="text-xl" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
              <MaterialIcon name="share" className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
