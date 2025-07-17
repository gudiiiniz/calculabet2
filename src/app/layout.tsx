import type { Metadata } from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import Header from "./components/custom/header";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: "CalculaBet",
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
        <Header />
        {children}
      </body>
    </html>
  );
}
