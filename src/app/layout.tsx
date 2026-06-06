import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Paytm Merchant Intelligence Copilot',
  description: 'AI-Powered Business Intelligence and Decision Support Platform for Paytm Merchants.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F7FA] text-[#0A0E1A] selection:bg-[#3199E4]/20 selection:text-[#0A0E1A]">
        {children}
      </body>
    </html>
  );
}
