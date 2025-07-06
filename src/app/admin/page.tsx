import Link from "next/link";

export default async function AdminDashboard() {
  return (
    <section className="space-y-6">
      {/* Menu Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center sm:text-left">Menu</h2>

        <Link
          href="/admin/bikes"
          className="block rounded-xl border p-6 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition"
        >
          <h3 className="text-lg font-semibold">Manage Bikes</h3>
          <p className="text-sm opacity-80 mt-1">
            View, add, edit, or remove bike listings
          </p>
        </Link>
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        <p>
          This is the admin dashboard. From here you can manage bikes and more.
        </p>
        <p>Tap one of the buttons to access it&rsquo;s feature</p>
      </div>
    </section>
  );
}
