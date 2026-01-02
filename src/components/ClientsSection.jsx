import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ClientsSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  const clientLogos = [
    "d872e1db678445d025220be5754db03b3fbb3093adc1d3899de3389f61ae140f",
    "5a86930f72b51ad1070d8001b11a22a844100c1bab427237d7fbd98a41b02e39",
    "2c62d2828417927167bd3b6ac6a04f8c5290f0d79305d8229e614816984b7021",
    "c6b0b74464a557b26f1a6f9b25b5c763a1ca9ed3a5167c83bba0ed160300d177",
    "4c2ea5385e828a8c2fa04e801da8e2b1f4e239f82738d185ae13ea6e38dd16c7",
    "b621194c6a693befa08c33c9a30f407022c457cd18f2f775ac2dcabb37a5b8be",
    "008c272b11c263ec1e59692b9dd6e69c2ee7ca1553ea5070f25e19207dea9045",
  ];

  const duplicatedLogos = [...clientLogos, ...clientLogos];

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

        {/* LOGO MARQUEE */}
        <div
          className="relative mt-16 w-full overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="flex w-max animate-scroll-left">
            {duplicatedLogos.map((img, index) => (
              <div
                key={index}
                className="
                  flex-shrink-0 mx-4
                  w-48 h-24 max-md:w-36 max-md:h-20
                  rounded-2xl border border-border
                  bg-background/30 backdrop-blur-md
                  flex items-center justify-center
                  transition-transform duration-300 hover:scale-105
                "
              >
                {/* LOGO PLATE (NETRAL) */}
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
                    src={`https://cdn.builder.io/api/v1/image/assets/a4bcc66c8e6243ab9c4aea4abeb04592/${img}?placeholderIfAbsent=true`}
                    alt="Client logo"
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
      </div>
    </section>
  );
};

export default ClientsSection;
