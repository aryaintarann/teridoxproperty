import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "TeridoxProperty - Smart Property Management",
  description:
    "Sistem Manajemen Properti modern untuk kos-kosan dan hunian sewa. Temukan hunian nyaman dengan fasilitas premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
