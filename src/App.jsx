"use client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import api from "./api/axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Values from "./components/Values";
import ClientsSection from "./components/ClientsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Initialize theme from localStorage
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // Default to dark
    document.documentElement.classList.add("dark");
    if (!savedTheme) localStorage.setItem("theme", "dark");
  }
};

// Run immediately
initializeTheme();

const MainLayout = ({ children }) => {
  useEffect(() => {
    // Track kunjungan homepage
    api.trackVisit("/").catch(() => {});
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-text-primary transition-colors duration-300">
      {/* HEADER FULL WIDTH */}
      <Header />

      {/* CONTENT */}
      <main className="relative flex-1 z-10">
        {children}
      </main>

      {/* FOOTER FULL WIDTH */}
      <Footer />

      <ScrollToTopButton />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <div className="overflow-x-hidden bg-background">
      <Router>
        <Routes>
          {/* Halaman Utama */}
          <Route
            path="/"
            element={
              <MainLayout>
                {/* FULL WIDTH */}
                <Hero />
                <AboutUs />
                <Values />
                <ClientsSection />
                <TestimonialsSection />
                <ServicesSection />
                <ContactSection />

                {/* BOXED SECTIONS */}
                <section>
                  <div className="max-w-[1200px] mx-auto px-6">
                    
                    
                    
                    
                    
                    
                  </div>
                </section>
              </MainLayout>
            }
          />

          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />

          {/* Proteksi Dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Redirect jika path tidak ditemukan */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
