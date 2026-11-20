import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mark Zuckerberg | Facebook (2008 Wall)",
  description:
    "A nostalgic 2008 Facebook Wall recreated with React 19, Next.js 15, Supabase Realtime, and Tailwind CSS.",
  icons: {
    icon: "https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRfl1zRQ0_.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#eceff6] text-[#333333] font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
