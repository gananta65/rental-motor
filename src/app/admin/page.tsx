import AdminMenuCard from "@components/AdminMenuCard";
import { Bike, FileText } from "lucide-react";

const adminMenus = [
  {
    href: "/admin/bikes",
    title: "Manage Bikes",
    desc: "View, add, edit, or remove bike listings",
    icon: Bike,
  },
  {
    href: "/admin/pages",
    title: "Manage Pages",
    desc: "Edit landing page content",
    icon: FileText,
  },
];

export default async function AdminDashboard() {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center sm:text-left">Menu</h2>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {adminMenus.map((menu) => (
            <AdminMenuCard key={menu.href} {...menu} />
          ))}
        </div>
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        <p>
          This is the admin dashboard. From here you can manage bikes and more.
        </p>
        <p>Tap one of the buttons to access its feature.</p>
      </div>
    </section>
  );
}
