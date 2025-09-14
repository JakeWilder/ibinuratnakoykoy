import { NextResponse, NextRequest } from "next/server";
import { isRole } from "./src/lib/roles";

export function middleware(req: NextRequest) {
  const base = process.env.SITE_URL || req.url;
  const mk = (path: string) => new URL(path, base);

  const { pathname } = req.nextUrl;
  const hasSession = !!req.cookies.get("session")?.value;
  const role = req.cookies.get("role")?.value;

  // Guard dashboards
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      return NextResponse.redirect(mk("/login"));
    }
    // /dashboard -> /dashboard/<role>
    const segs = pathname.split("/").filter(Boolean);
    if (segs.length === 1) {
      return NextResponse.redirect(isRole(role || "") ? mk(`/dashboard/${role}`) : mk("/login"));
    }
  }

  // Already logged in -> skip login
  if (pathname === "/login" && hasSession && isRole(role || "")) {
    return NextResponse.redirect(mk(`/dashboard/${role}`));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/login"] };
