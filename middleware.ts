// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getUser(); // ini akan refresh session jika expired

  return res;
}

export const config = {
  matcher: ["/admin/:path*"], // sesuaikan path yang ingin dilindungi
};
