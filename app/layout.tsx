import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MapUsingAPIContainer from "@/components/Map/MapUsingAPIContainer";

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Bản đồ 34 Tỉnh/Thành Phố Việt Nam',
  description: 'Bản đồ tương tác hiển thị 34 tỉnh/thành phố và 3321 xã/phường/thị trấn mới của Việt Nam sau sáp nhập',
  keywords: ['bản đồ việt nam', '34 tỉnh', 'sáp nhập tỉnh', 'GeoJSON', 'Leaflet'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
