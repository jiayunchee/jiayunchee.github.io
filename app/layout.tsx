import type { Metadata, Viewport } from "next";
import { Caveat, DM_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import "./globals.css";

// Body & interface text
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

// Editorial headings
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

// Small labels and status lines
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

// Handwritten scrapbook notes (used sparingly, so not preloaded)
const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_SG",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(sans.variable, serif.variable, mono.variable, hand.variable)}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </MotionProvider>
      </body>
    </html>
  );
}
