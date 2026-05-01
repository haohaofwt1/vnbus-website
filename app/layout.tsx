import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PublicChrome } from "@/components/PublicChrome";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { getBrandingSettings } from "@/lib/site-settings";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.name,
  description:
    "VNBus helps travelers compare buses, limousines, shuttles, and cross-border coach routes across Vietnam and Southeast Asia.",
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getBrandingSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-[family-name:var(--font-body)] text-ink antialiased">
        <div className="relative flex min-h-screen flex-col">
          <PublicChrome>
            <Header branding={branding} />
          </PublicChrome>
          <main className="flex-1">{children}</main>
          <PublicChrome>
            <Footer />
          </PublicChrome>
        </div>
      </body>
    </html>
  );
}
