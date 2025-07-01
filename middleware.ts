import { NextRequest } from "next/server";
import { createMiddlewareSupabaseClient } from "@/lib/supabaseMiddleware";

export async function middleware(req: NextRequest) {
  const { supabase, response } = createMiddlewareSupabaseClient(req);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Proteksi hanya halaman /admin dan turunannya
  if (req.nextUrl.pathname.startsWith("/admin") && !session) {
    return Response.redirect(new URL("/login", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
