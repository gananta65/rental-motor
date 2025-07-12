import Link from "next/link";
import { LucideIcon } from "lucide-react";

type AdminMenuCardProps = {
  href: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

export default function AdminMenuCard({
  href,
  title,
  desc,
  icon: Icon,
}: AdminMenuCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border p-6 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 text-center sm:text-left">
        <Icon className="w-12 h-12 mx-auto sm:mx-0 text-primary-foreground/80 group-hover:scale-105 transition-transform" />
        <div className="mt-4 sm:mt-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-80 mt-1">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
