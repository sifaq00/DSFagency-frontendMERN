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

  getClients: () => instance.get("/client"),
  addClient: (data) => {
    const token = localStorage.getItem("token");
    return instance.post("/client", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateClient: (id, data) => {
    const token = localStorage.getItem("token");
    return instance.put(`/client/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteClient: (id) =>
    instance.delete(`/client/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),

  getAnalytics: (days = 14) => instance.get(`/analytics?days=${days}`),
  trackVisit: (path = "/") => {
    // Generate or get visitor ID from localStorage
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("visitorId", visitorId);
    }
    return instance.post("/analytics/track", { path, visitorId });
  },

  // Contact Messages
  getContacts: () =>
    instance.get("/contact", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  getUnreadCount: () =>
    instance.get("/contact/unread", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  submitContact: (data) => instance.post("/contact", data),
  markContactAsRead: (id) =>
    instance.put(`/contact/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  replyContact: (id, replyMessage) =>
    instance.put(`/contact/${id}/reply`, { replyMessage }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  deleteContact: (id) =>
    instance.delete(`/contact/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),

  // Hero Section
  getHero: () => instance.get("/hero"),
  updateHero: (data) => {
    const token = localStorage.getItem("token");
    // Don't set Content-Type manually for FormData - browser will set it with proper boundary
    return instance.put("/hero", data, {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Site Settings
  getSettings: () => instance.get("/settings"),
  updateSettings: (data) => {
    const token = localStorage.getItem("token");
    return instance.put("/settings", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default api;