export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center text-center px-6 min-h-screen overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10 bg-[url('/hero.webp')] bg-cover bg-center opacity-30 dark:opacity-40" />

      {/* Content */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 z-10">
        RENTAL SCOOTER IN CANGGU
      </h1>
      <p className="text-lg md:text-xl max-w-xl mb-6 z-10">
        Explore the island with comfort and freedom. Affordable daily, weekly,
        or monthly rentals. Book now and ride worry-free!
      </p>

      <a
        href="https://wa.me/6281238973985?text=Hi%20I%20want%20to%20book%20a%20motorbike"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg transition inline-flex items-center gap-2 z-10"
        aria-label="Book via WhatsApp"
      >
        {/* WhatsApp icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M380.9 97.1c-42.6-42.6-99.3-65.1-156.3-65.1s-113.7 22.5-156.3 65.1C26.3 139.7 3.8 196.4 3.8 253.4c0 40.4 11.8 79.4 34.2 113.2L0 480l114.6-37.9c32.8 17.9 69.5 27.3 109.1 27.3 56.9 0 113.7-22.5 156.3-65.1s65.1-99.3 65.1-156.3-22.5-113.7-65.1-156.3zM223.7 426.1c-34.5 0-68.1-9.3-97.3-26.8l-6.9-4.1-68.1 22.4 22.7-66.4-4.5-7C53 316.2 42.5 285.4 42.5 253.4c0-100.3 81.3-181.6 181.6-181.6 48.5 0 94.1 18.9 128.4 53.2s53.2 79.9 53.2 128.4c0 100.3-81.3 181.6-181.6 181.6zm101.1-138.6c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.5-14.3 17.9-17.6 21.6-3.2 3.7-6.5 4.1-12 1.4-32.6-16.3-54-29.1-75.3-66.1-5.7-9.8 5.7-9.1 16.3-30.1 1.8-3.7.9-6.9-.5-9.8s-12-28.7-16.4-39.4c-4.3-10.4-8.6-9-12-9.1-3.1-.1-6.8-.1-10.4-.1s-9.6 1.4-14.7 7c-5 5.5-19.1 18.7-19.1 45.4 0 26.6 19.6 52.4 22.3 56 2.8 3.7 38.4 58.7 93.2 82.3 13 5.6 23.1 8.9 31 11.4 13 4.1 24.8 3.5 34.1 2.1 10.4-1.6 32.6-13.3 37.2-26.1 4.6-12.8 4.6-23.9 3.2-26.1-1.3-2.3-5-3.7-10.5-6.4z" />
        </svg>
        <span>Book via WhatsApp</span>
      </a>
    </section>
  );
}
