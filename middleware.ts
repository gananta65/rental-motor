import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("🔐 Middleware user:", user);
  console.log("🧾 Middleware error:", error);
  console.log("🍪 Cookies:", req.cookies.getAll());
  console.log("🌐 SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("🌐 BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
  console.log("🌍 NODE_ENV:", process.env.NODE_ENV);

  return res;
}

export const config = {
  matcher: ["/admin/:path*"], // pastikan path sesuai
};
