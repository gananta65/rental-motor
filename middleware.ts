// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // ⬇️ WAJIB panggil getSession agar cookie di-inject ke response
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
