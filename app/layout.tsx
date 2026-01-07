import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Donor CRM',
  description: 'Manage your donor relationships and campaigns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main style={{ padding: '20px 0' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
