import type { Metadata } from "next";
import {Poppins} from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: "Calcula Bet",
  description: "Calculadora de apostas seguras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
