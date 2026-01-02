import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        form.current,
        "YOUR_PUBLIC_KEY"
      )
      .then(
        () => {
          setMessage("Pesan berhasil dikirim!");
          setIsSending(false);
          form.current.reset();
        },
        () => {
          setMessage("Gagal mengirim pesan. Coba lagi.");
          setIsSending(false);
        }
      );
  };

  return (
    <section
      id="Contacts"
      className="relative w-full bg-surface pt-40 pb-40 overflow-hidden"
    >
      {/* AMBIENT GLOW */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[900px] h-[300px] bg-violet-400/10 blur-[160px]" />
      </div>

      {/* CONTAINER (SAMA DENGAN SECTION LAIN) */}
      <div className="relative max-w-[1200px] mx-auto px-6">
        <h2
          data-aos="fade-down"
          className="text-3xl md:text-5xl font-bold text-center text-text-primary mb-14"
        >
          Contact <span className="text-primary">Us</span>
        </h2>

        <div
          className="
            w-full
            bg-background/40 backdrop-blur-xl
            border border-border
            rounded-3xl overflow-hidden
            flex flex-col md:flex-row
            shadow-soft
          "
          data-aos="zoom-in"
        >
          {/* ===== KIRI ===== */}
          <div className="w-full md:w-2/5 p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/37c13b0d202554a1c732fe4b3d2c12981498078c"
              alt="Contact"
              className="w-56 max-w-full mb-8 mx-auto md:mx-0 opacity-90"
            />

            <div className="space-y-5 text-text-secondary text-lg font-medium">
              <a
                href="https://wa.me/6285643610817"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 hover:text-cyan-400 transition"
              >
                <FaPhoneAlt className="text-cyan-400 text-2xl" />
                <span>0856-4361-0817</span>
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dsfproject025@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 hover:text-violet-400 transition"
              >
                <FaEnvelope className="text-violet-400 text-2xl" />
                <span>dsfproject025@gmail.com</span>
              </a>

              <div className="flex items-center space-x-4 text-text-secondary">
                <FaMapMarkerAlt className="text-orange-400 text-2xl" />
                <span>Bantul, Yogyakarta</span>
              </div>
            </div>
          </div>

          {/* ===== KANAN ===== */}
          <div className="w-full md:w-3/5 p-12 flex flex-col justify-between">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-text-primary mb-2">
                Get in Touch
              </h3>
              <p className="text-text-secondary">
                Any question or remarks? Let us know!
              </p>
            </div>

            <form
              ref={form}
              onSubmit={sendEmail}
              className="flex flex-col space-y-6"
            >
              <input
                type="text"
                name="user_name"
                placeholder="Enter your name"
                required
                className="
                  w-full p-3 rounded-lg
                  bg-background/60 border border-border
                  text-text-primary
                  focus:outline-none focus:ring-2 focus:ring-cyan-400
                "
              />

              <input
                type="email"
                name="user_email"
                placeholder="Enter your email"
                required
                className="
                  w-full p-3 rounded-lg
                  bg-background/60 border border-border
                  text-text-primary
                  focus:outline-none focus:ring-2 focus:ring-violet-400
                "
              />

              <textarea
                name="message"
                placeholder="Type your message here"
                required
                className="
                  w-full p-3 h-32 rounded-lg
                  bg-background/60 border border-border
                  text-text-primary
                  focus:outline-none focus:ring-2 focus:ring-orange-400
                "
              ></textarea>

              <div className="flex justify-start pt-4">
                <button
                  type="submit"
                  disabled={isSending}
                  className="
                    px-8 py-3 rounded-full
                    bg-primary text-white font-semibold
                    shadow-glow
                    hover:bg-primary-dark
                    transition transform hover:scale-105
                  "
                >
                  {isSending ? "Sending..." : "Submit"}
                </button>
              </div>

              {message && (
                <p className="text-text-secondary mt-3">{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
