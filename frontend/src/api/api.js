import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.toast) {
      window.dispatchEvent(new CustomEvent("api-toast", { detail: response.data.toast }));
    }
    return response;
  },
  (error) => {
    const toast = error.response?.data?.toast;
    if (toast) window.dispatchEvent(new CustomEvent("api-toast", { detail: toast }));
    return Promise.reject(error);
  }
);

export default api;
