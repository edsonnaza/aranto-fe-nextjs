import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
 // console.log("Cookies:", req.cookies); // Verifica las cookies

  // Obtén el valor de la cookie directamente
  const tokenNextAuth = req.cookies.get('next-auth.session-token')?.value;
  const tokenAuthJs = req.cookies.get('authjs.session-token')?.value;

  // console.log("Token next-auth.session-token:", tokenNextAuth); // Verifica el token JWT de next-auth
  // console.log("Token authjs.session-token:", tokenAuthJs); // Verifica el token JWT de authjs

  const token = tokenNextAuth || tokenAuthJs;

  if (!token) {
    console.log("Token is null or undefined");
  } else {
    try {
      // Decodifica el token para verificar si es válido
      const secret = process.env.NEXTAUTH_SECRET;
      if (!secret) {
        throw new Error("NEXTAUTH_SECRET is not defined");
      }
      const decodedToken = jwt.verify(token, secret);
      console.log("Decoded Token:", decodedToken);
    } catch (error) {
      console.log("Invalid token:", error);
    }
  }

  const { nextUrl } = req;
  const isLoggedIn = !!token;

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(isLoggedIn ? "/dashboard" : "/login", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

// Configuración de rutas que debe aplicar el middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};