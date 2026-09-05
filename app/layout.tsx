import Footer from "./components/footer";
import { Toaster } from "../components/ui/sonner";
import type { Metadata } from "next";

import {
  Manrope,
  Space_Grotesk, Geist } from "next/font/google";

import Script from "next/script";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Aureus — Personal Expense Tracker",
  description:
    "A premium personal finance dashboard for tracking every single penny and building better money habits.",
};


export default function RootLayout({
  children,
}: LayoutProps<"/">) {

  return (

    <html
      lang="en"
      className={cn("h-full", manrope.variable, spaceGrotesk.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >

      <head>

        <Script
          id="theme-script"
          strategy="beforeInteractive"
        >
          {`
            (function () {
              try {
                const savedTheme =
                  localStorage.getItem("takaflow-theme");

                const root =
                  document.documentElement;

                if (savedTheme === "light") {
                  root.classList.remove("dark");
                } else {
                  root.classList.add("dark");
                }
              } catch (error) {
                document.documentElement.classList.add("dark");
              }
            })();
          `}
        </Script>

      </head>


      <body className="min-h-full bg-white antialiased transition-colors dark:bg-slate-950">

        <main>
          {children}
        </main>

        <Footer />

        <Toaster />

      </body>

    </html>

  );

}