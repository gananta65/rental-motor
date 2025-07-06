// app/admin/layout.tsx
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Sidebar from "./components/Sidebar";
import { FloatingButtons } from "@/components";
import SessionExpired from "./components/SessionExpired";
export const dynamic = "force-dynamic"; // untuk App Router

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SessionExpired />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--background)] border-b flex items-center z-50 px-4">
        <h1
          className="absolute left-1/2 -translate-x-1/2 text-xl font-bold
               md:static md:translate-x-0 md:pl-64"
        >
          Admin Panel
        </h1>
      </header>

      {/* Sidebar */}
      <Sidebar email={user.email || ""} />

      {/* Konten utama */}
      <main className="pt-14 md:ml-64 p-6 mt-4">{children}</main>

      <FloatingButtons />
    </div>
  );
}
