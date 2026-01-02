import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import PropTypes from "prop-types";
import api from "../api/axios";

const TestimonialCard = ({ image, testimonial, author, index }) => {
  const accentBorders = [
    "border-orange-400/60",
    "border-cyan-400/60",
    "border-violet-400/60",
  ];

  return (
    <div
      className={`
        flex flex-col items-center text-center
        p-8 rounded-3xl h-[480px]
        bg-background/40 backdrop-blur-xl
        border-2 ${accentBorders[index % accentBorders.length]}
        shadow-soft
      `}
      data-aos="fade-up"
    >
      {/* IMAGE PLATE */}
      <div className="mb-4 rounded-xl bg-white/90 px-6 py-4">
        <img
          src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${image}`}
          alt={author}
          className="w-auto h-44 object-contain"
        />
      </div>

      {/* TESTIMONIAL */}
      <p className="text-text-secondary text-lg leading-relaxed flex-1 overflow-hidden h-32">
        {testimonial}
      </p>

      {/* AUTHOR */}
      <h4 className="mt-4 text-xl font-bold text-text-primary">
        {author}
      </h4>
    </div>
  );
};

TestimonialCard.propTypes = {
  image: PropTypes.string.isRequired,
  testimonial: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.getTestimonials();
        setTestimonials(response.data);
      } catch (error) {
        console.error("Gagal mengambil data testimonial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section
        id="Testimonials"
        className="relative w-full bg-surface pt-40 pb-40"
      >
        <div className="relative max-w-[1200px] mx-auto px-6 text-center">
          <h2
            className="text-5xl mb-10 font-bold tracking-wider text-text-primary max-md:text-3xl"
            data-aos="fade-up"
          >
            Testimonials
          </h2>
          <p className="text-lg text-text-secondary">Memuat data...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="Testimonials"
      className="relative w-full bg-surface pt-40 pb-40"
    >
      {/* CONTAINER SAMA DENGAN CLIENTS */}
      <div className="relative max-w-[1200px] mx-auto px-6">
        <h2
          className="text-5xl mb-10 font-bold tracking-wider text-center text-text-primary max-md:text-3xl"
          data-aos="fade-up"
        >
          Testimonials
        </h2>

        <div
          className="flex flex-wrap justify-center gap-8 w-full"
          data-aos="fade-up"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id}
              className={`${
                testimonials.length === 2
                  ? "w-full lg:w-[48%]"
                  : "w-full md:w-[48%] lg:w-[31%]"
              }`}
            >
              <TestimonialCard
                image={testimonial.image}
                testimonial={testimonial.content}
                author={testimonial.author}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
