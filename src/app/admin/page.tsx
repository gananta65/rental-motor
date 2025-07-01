import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton, FloatingButtons } from "@/components";

export default async function AdminPage() {
  const cookieStore = (await cookies()) as unknown as {
    get: (name: string) => { value: string } | undefined;
  };

  // Supabase server client dengan cookie binding
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-3xl font-bold mb-4">Welcome Admin</h1>
      <p className="text-lg">
        You are logged in as <strong>{user.email}</strong>
      </p>
      <div className="mt-6">
        <p>CRUD motor goes here...</p>
      </div>
      <LogoutButton />
      <FloatingButtons />
    </div>
  );
}
