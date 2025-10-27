import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RISS Chronicles – Demo",
  description: "Interactive world demo with AI guide and LT-Bar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<body className="bg-fantasy grain min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
              <span className="text-[var(--accent)]">RISS</span> Chronicles — Demo
            </h1>
            <span className="text-sm opacity-70">v0.1</span>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
