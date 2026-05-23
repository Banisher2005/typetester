import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TypeTester — Typing Speed Test",
  description:
    "Test your typing speed with TypeTester — a MonkeyType-style typing speed test. Measure WPM, accuracy, and improve your typing skills.",
  keywords: ["typing test", "WPM", "words per minute", "typing speed", "monkeytype"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoMono.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
