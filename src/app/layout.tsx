import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ZYNC ELECTRONICS', description: 'Calculadora de Importaciones' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body style={{ margin: 0, padding: 0 }}>{children}</body></html>;
}
