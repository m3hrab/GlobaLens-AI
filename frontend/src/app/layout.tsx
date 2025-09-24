import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import QueryProvider from '@/components/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GlobaLens AI - Global Supply Chain Risk Monitoring',
  description: 'Real-time, multi-agent AI platform for global supply chain risk monitoring and predictive insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>{children}</main>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}