import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSE One | S.A. Engineering College",
  description: "CSE Department Academic Portal",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CSE One",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
