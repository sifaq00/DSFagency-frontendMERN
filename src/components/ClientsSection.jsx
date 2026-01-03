import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../api/axios";

// Helper function untuk construct image URL
const getImageUrl = (imagePath) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${imagePath}`;
};

const ClientsSection = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.getClients();
      setClients(response.data);
    } catch (error) {
      console.error("Gagal mengambil data clients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Duplicate logos for infinite scroll effect
  const duplicatedClients = [...clients, ...clients];

  return (
    <section
      id="Clients"
      className="relative w-full bg-surface pt-40 pb-40 overflow-hidden"
    >
      {/* ===== AMBIENT GLOW (TENGAH SECTION) ===== */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[900px] h-[260px] bg-primary/15 blur-[160px]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* TITLE */}
        <h2
          className="text-5xl font-extrabold tracking-tight text-text-primary text-center max-md:text-3xl"
          data-aos="fade-up"
        >
          Our <span className="text-primary">Clients</span>
        </h2>

        <p
          className="mt-6 max-w-3xl mx-auto text-center text-text-secondary text-lg max-md:text-base"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Kami bangga telah dipercaya oleh berbagai klien dari beragam industri
          untuk membantu mereka bertumbuh di dunia digital.
        </p>

        {loading ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-text-secondary">Memuat data clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-text-secondary">Belum ada client yang ditambahkan.</p>
          </div>
        ) : (
          <div
            className="relative mt-16 w-full overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex w-max animate-scroll-left">
              {duplicatedClients.map((client, index) => (
                <div
                  key={`${client._id}-${index}`}
                  className="
                    flex-shrink-0 mx-4
                    w-48 h-24 max-md:w-36 max-md:h-20
                    rounded-2xl border border-border
                    bg-background/30 backdrop-blur-md
                    flex items-center justify-center
                    transition-transform duration-300 hover:scale-105
                  "
                >
                  <div
                    className="
                      w-full h-full
                      flex items-center justify-center
                      rounded-xl
                      bg-white/90
                      px-6 py-4
                    "
                  >
                    <img
                      src={getImageUrl(client.logo)}
                      alt={client.name}
                      className="
                        max-h-full w-auto object-contain
                        transition-transform duration-300
                        hover:scale-105
                      "
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsSection;
