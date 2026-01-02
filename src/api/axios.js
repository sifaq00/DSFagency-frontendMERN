import instance from "./axiosInstance";

const api = {
  getAboutUs: () => instance.get("/about"),
  updateAboutUs: (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject(new Error("Token tidak ditemukan"));
    }
    return instance.put("/about", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getValues: () => instance.get("/values"),
  updateValues: (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject(new Error("Token tidak ditemukan"));
    }
    return instance.put("/values", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getTestimonials: () => instance.get("/testimonial"),
  addTestimonial: (data) => {
    const token = localStorage.getItem("token");
    return instance.post("/testimonial", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Tambahkan header untuk FormData
      },
    });
  },
  updateTestimonial: (id, data) => {
    const token = localStorage.getItem("token");
    return instance.put(`/testimonial/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Tambahkan header untuk FormData
      },
    });
  },
  deleteTestimonial: (id) =>
    instance.delete(`/testimonial/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),

  getServiceCards: () => instance.get("/service-card"),
  addServiceCard: (data) => {
    const token = localStorage.getItem("token");
    return instance.post("/service-card", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Tambahkan header untuk FormData
      },
    });
  },
  updateServiceCard: (id, data) => {
    const token = localStorage.getItem("token");
    return instance.put(`/service-card/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Tambahkan header untuk FormData
      },
    });
  },
  deleteServiceCard: (id) =>
    instance.delete(`/service-card/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),

    getServiceDetails: () => instance.get("/service-detail"),
    addServiceDetail: (data) => {
      const token = localStorage.getItem("token");
      return instance.post("/service-detail", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Pastikan header ini ada
        },
      });
    },
    updateServiceDetail: (id, data) => {
      const token = localStorage.getItem("token");
      return instance.put(`/service-detail/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Pastikan header ini ada
        },
      });
    },
    deleteServiceDetail: (id) =>
      instance.delete(`/service-detail/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
};

export default api;