// app/api/auth/logout/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();

  const res = NextResponse.json({ message: "Logged out" });

  // Optional: bersihkan tambahan cookie jika ada
  res.cookies.set("logged_in", "", { maxAge: 0, path: "/" });

  return res;
}
