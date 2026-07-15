import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSE One",
  description: "Intelligent Attendance and Academic Operations Platform",
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
