import Link from "next/link";

export default function ManagePages() {
  const sections = [
    {
      name: "Hero Section",
      href: "/admin/pages/hero",
      desc: "Edit title, subtitle, and background image",
    },
    {
      name: "Features Section",
      href: "/admin/pages/features",
      desc: "Manage features or advantages list",
    },
    {
      name: "Testimonials",
      href: "/admin/pages/testimonials",
      desc: "Edit customer reviews and ratings",
    },
    {
      name: "Galleries",
      href: "/admin/pages/galleries",
      desc: "Manage customer gallery images along with optional titles and descriptions shown in the gallery section.",
    },
    {
      name: "Footer Info",
      href: "/admin/pages/footer",
      desc: "Edit contact info and social media links",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center sm:text-left">
          Manage Landing Page
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block rounded-xl border p-6 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              <h3 className="text-lg font-semibold">{section.name}</h3>
              <p className="text-sm opacity-80 mt-1">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        <p>Manage content sections for the landing page here.</p>
      </div>
    </section>
  );
}
