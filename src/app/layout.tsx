"use client";

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

import { LoadingProvider } from "@/context/LoadingContext";
import LoadingComponent from "@/components/Loading/LoadingComponent"; // 👈 Importamos el componente de carga

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProvider>
          <SessionProvider>
            <LoadingProvider> {/* ✅ Envolvemos todo con el LoadingProvider */}
              <LoadingComponent /> {/* ✅ Agregamos el componente de carga */}
              <AuthGuard>
                <SidebarProvider>{children}</SidebarProvider>
              </AuthGuard>
            </LoadingProvider>
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
    if (status === "loading") return;
    if (status === "unauthenticated" || !session) {
      router.push("/login");
    }
    console.log({ status, router, session });
  }, [status, router, session]);

  if (status === "loading") return <LoadingComponent />; // 🔥 Reemplazamos el texto "Loading..." por el Spinner global

  return <>{children}</>;
}
