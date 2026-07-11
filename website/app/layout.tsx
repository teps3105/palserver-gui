import './globals.css';
import type { Metadata } from 'next';

// 根 layout:提供 <html>/<body>。實際語系由 app/[lang]/layout.tsx 用一小段 inline
// script 設定 document.documentElement.lang;預設先給繁中。
export const metadata: Metadata = {
  metadataBase: new URL('https://palserver-gui.iosoftware.ai'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
