import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface ReorderPayload {
  heroes: { id: string; order: number }[];
}

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error: authError } = await supabase.auth.getUser();

  if (authError || !data.user) {
    return NextResponse.json(
      { error: authError?.message || "Unauthorized" },
      { status: 401 }
    );
  }

  let body: ReorderPayload;
  try {
    body = (await req.json()) as ReorderPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.heroes)) {
    return NextResponse.json(
      { error: "Invalid payload format." },
      { status: 400 }
    );
  }

  const updates = body.heroes
    .filter((item) => item.id && typeof item.order === "number")
    .map((item) =>
      supabase
        .from("hero_slides")
        .update({ order: item.order })
        .eq("id", item.id)
    );

  try {
    const results = await Promise.all(updates);
    const failed = results.find((res) => res.error);

    if (failed?.error) {
      console.error("Update order error:", failed.error);
      return NextResponse.json(
        { error: failed.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    console.error(err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
