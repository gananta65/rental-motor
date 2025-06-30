// components/AboutUs.tsx
"use client";

export default function AboutUs() {
  return (
    <section
      id="contact"
      className="relative py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start rounded-2xl overflow-hidden z-10"
    >
      {/* Background Tropis */}
      <div className="absolute inset-0 -z-10 bg-[url('/bg-tropis.webp')] bg-cover bg-center opacity-10 dark:opacity-15" />

      {/* Info Kontak */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Contact & Location</h2>
        <p className="mb-4">
          <strong>Address:</strong>
          <br />
          Jl. Raya Canggu No.88, Badung, Bali
        </p>
        <p className="mb-6">
          <strong>WhatsApp:</strong>
          <br />
          <a
            href="https://wa.me/6281238973985"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline"
          >
            +62 812-3897-3985
          </a>
        </p>

        <a
          href="https://maps.app.goo.gl/xyz123"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
        >
          View on Google Maps
        </a>
      </div>

      {/* Embed Map */}
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.61080107921!2d115.13090756178566!3d-8.633309991377256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24799191c4b39%3A0x58f4a86c7a03eab!2sRental%20scooter%20in%20canggu!5e0!3m2!1sid!2sid!4v1751194757451!5m2!1sid!2sid"
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          className="w-full h-full border-0"
        ></iframe>
      </div>
    </section>
  );
}
