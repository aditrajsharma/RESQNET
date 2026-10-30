import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RESQNET — Multi-Agent Disaster Response and Coordination System",
  description:
    "Intelligent, human-in-the-loop operational command centre for flood-response coordination and rescue management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">
        {children}
      </body>
    </html>
  );
}
