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
import { Suspense, useEffect } from "react";
import { Outfit } from "next/font/google";

import { LoadingProvider } from "@/context/LoadingContext";
import LoadingComponent from "@/components/Loading/LoadingComponent";

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
            <LoadingProvider>
              <Suspense fallback={<LoadingComponent />}>
                <AuthGuard>
                  <SidebarProvider>{children}</SidebarProvider>
                </AuthGuard>
              </Suspense>
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
  }, [status, router, session]);

  if (status === "loading")
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LoadingComponent />
      </Suspense>
    );

  return <>{children}</>;
}
