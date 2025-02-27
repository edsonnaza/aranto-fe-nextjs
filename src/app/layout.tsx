"use client";

//import type { Metadata } from "next";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Aranto",
//   description: "Sistema Médico Integral",
// };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProvider>
          <SessionProvider>
            <AuthGuard>
              <SidebarProvider>{children}</SidebarProvider>
            </AuthGuard>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

 

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Espera hasta que el estado de la sesión esté cargado

    if (status === "unauthenticated" || !session) {
      router.push("/login");
    }
    console.log({status,router,session})
  }, [status, router, session]);

  if (status === "loading") return <p>Loading...</p>; // Puedes reemplazar con un Spinner

  return <>{children}</>;
}


