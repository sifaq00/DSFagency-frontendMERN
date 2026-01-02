import { useState, useEffect } from "react";
import clsx from "classnames";
import PropTypes from "prop-types";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../api/axios";

const ServiceCard = ({
  image,
  title,
  description,
  className = "",
  aosType = "fade-up",
  index,
}) => {
  const accentBorders = [
    "border-orange-400/60",
    "border-cyan-400/60",
    "border-violet-400/60",
  ];

  return (
    <article
      data-aos={aosType}
      className={clsx(
        `
        flex flex-col items-center p-6 text-center
        rounded-2xl h-full
        bg-background/40 backdrop-blur-xl
        border ${accentBorders[index % accentBorders.length]}
        shadow-soft
        transition-transform duration-300
        hover:scale-105
      `,
        className
      )}
    >
      {/* IMAGE */}
      <div className="w-full h-40 md:h-48 flex justify-center items-center mb-4">
        <div className="w-full h-full rounded-xl p-4 flex items-center justify-center">
          <img
            src={`http://localhost:5000${image}`}
            alt={title}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <h3 className="mt-2 text-xl md:text-2xl font-bold text-orange-500">
        {title}
      </h3>

      <p className="mt-2 text-sm md:text-base text-text-secondary flex-1">
        {description}
      </p>
    </article>
  );
};

ServiceCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
  aosType: PropTypes.string,
  index: PropTypes.number.isRequired,
};

const ServiceDetail = ({
  title,
  description,
  image,
  buttonPosition = "left",
  aosType = "fade-up",
  index,
}) => {
  const accentText = [
    "text-orange-400",
    "text-cyan-400",
    "text-violet-400",
  ];

  return (
    <div
      data-aos={aosType}
      className={clsx(
        "flex gap-10 items-center flex-col md:flex-row",
        {
          "md:flex-row-reverse": buttonPosition === "right",
        }
      )}
    >
      <div className="w-full md:w-6/12">
        <h3
          className={clsx(
            "text-2xl md:text-4xl font-bold",
            accentText[index % accentText.length]
          )}
        >
          {title}
        </h3>

        <p className="mt-4 text-base md:text-lg text-text-secondary">
          {description}
        </p>

        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block mt-6
            px-6 py-3
            rounded-full
            bg-primary text-white font-semibold
            shadow-glow
            hover:bg-primary-dark
            transition
          "
        >
          Explore Now
        </a>
      </div>

      <div className="w-full md:w-6/12">
        <div className="rounded-3xl  backdrop-blur-xl p-6">
          <img
            src={`http://localhost:5000${image}`}
            alt={title}
            loading="lazy"
            className="w-full h-52 md:h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

ServiceDetail.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  buttonPosition: PropTypes.string,
  aosType: PropTypes.string,
  index: PropTypes.number.isRequired,
};

const ServicesSection = () => {
  const [serviceCards, setServiceCards] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsResponse, detailsResponse] = await Promise.all([
          api.getServiceCards(),
          api.getServiceDetails(),
        ]);
        setServiceCards(cardsResponse.data);
        setServiceDetails(detailsResponse.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="Services" className="w-full bg-surface pt-40 pb-40">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary">
            Services
          </h2>
          <p className="mt-6 text-lg text-text-secondary">Memuat data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="Services" className="w-full bg-surface pt-40 pb-40">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2
          data-aos="fade-down"
          className="text-3xl md:text-5xl font-bold text-center text-text-primary"
        >
          Services
        </h2>

        {/* SERVICE CARDS */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {serviceCards.map((serviceCard, index) => (
            <div
              key={serviceCard._id}
              className="w-full md:w-[48%] lg:w-[31%] flex"
            >
              <ServiceCard
                image={serviceCard.image}
                title={serviceCard.title}
                description={serviceCard.description}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* SERVICE DETAILS */}
        <div className="mt-20 space-y-20">
          {serviceDetails.map((serviceDetail, index) => (
            <ServiceDetail
              key={serviceDetail._id}
              title={serviceDetail.title}
              description={serviceDetail.description}
              image={serviceDetail.image}
              buttonPosition={index % 2 === 0 ? "left" : "right"}
              aosType={index % 2 === 0 ? "fade-left" : "fade-right"}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
