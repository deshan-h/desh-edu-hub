export default function manifest() {
  return {
    name: "DESH EduHub | Educational Resources",
    short_name: "DESH EduHub",
    description: "ශ්‍රී ලංකාවේ සාමාන්‍ය පෙළ, උසස් පෙළ සහ 5 ශ්‍රේණිය පසුගිය ප්‍රශ්න පත්‍ර නොමිලේ Download කරගන්න.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#2563eb",
    orientation: "portrait",
    scope: "/",
    lang: "si",
    categories: ["education", "books", "utilities"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
