import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const cookieStore = cookies(); // ✅ tanpa await
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore }); // ✅ function

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const res = NextResponse.json({ user: data.user });

  res.cookies.set("logged_in", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
