import { Instagram, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--foreground)] text-[var(--background)] py-8 mt-20 text-center">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
        {/* Brand & Year */}
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} Arya Sedana Rental. All rights
          reserved.
        </p>

        {/* Social Links */}
        <div className="flex gap-4 items-center justify-center mt-2">
          <a
            href="https://www.instagram.com/rental.scooterincanggu/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:opacity-80 transition text-sm"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>

          <a
            href="https://wa.me/6281238973985"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:opacity-80 transition text-sm"
          >
            <Phone className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
