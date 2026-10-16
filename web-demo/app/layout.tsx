import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trash Robot · The passing test that missed the job",
  description: "A presenter controlled, scripted simulation of spec driven development.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
