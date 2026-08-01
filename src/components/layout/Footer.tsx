import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Syarat & Ketentuan" },
  { href: "#", label: "Kebijakan Privasi" },
  { href: "/login", label: "Portal Penghuni" },
  { href: "/login", label: "Portal Pemilik" },
  { href: "#", label: "Karir" },
];

export function Footer() {
  return (
    <footer className="w-full px-4 md:px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-6 bg-td-on-primary-fixed border-t border-td-outline-variant">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="text-xl font-heading font-semibold text-td-surface-container-lowest">
          Teridox Property
        </span>
        <p className="text-sm text-td-on-primary-fixed-variant">
          © {new Date().getFullYear()} Teridox Property Management. Hak cipta dilindungi.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs font-semibold tracking-wider text-td-on-primary-fixed-variant hover:text-td-tertiary-fixed transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
