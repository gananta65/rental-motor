// app/admin/page.tsx
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, Admin!</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-6 bg-[var(--card)] text-[var(--foreground)] shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Email</h2>
          <p className="text-sm break-words">{user?.email}</p>
        </div>

        <div className="rounded-xl border p-6 bg-[var(--card)] text-[var(--foreground)] shadow-sm">
          <h2 className="text-lg font-semibold mb-1">User ID</h2>
          <p className="text-sm break-all">{user?.id}</p>
        </div>

        <div className="rounded-xl border p-6 bg-[var(--card)] text-[var(--foreground)] shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Role</h2>
          <p className="text-sm">Authenticated</p>
        </div>
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        This is the admin dashboard. From here you can manage bikes and more.
      </div>
    </section>
  );
}
