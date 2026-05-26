import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Youssef | Software Developer & Data Analyst",
  description: "A modern, professional portfolio bridging software development, data analytics & business development.",
  keywords: ["Youssef", "Portfolio", "Software Developer", "Data Analyst", "Business Development", "Web Development", "React", "Next.js"],
  authors: [{ name: "Youssef" }],
  creator: "Youssef",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Youssef | Software Developer & Data Analyst",
    description: "A modern, professional portfolio bridging software development, data analytics & business development.",
    siteName: "Youssef Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Youssef | Software Developer & Data Analyst",
    description: "A modern, professional portfolio bridging software development, data analytics & business development.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
