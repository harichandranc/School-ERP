import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    console.log("TOKEN:", user?.token);

    if (user?.token) {
      config.headers.Authorization =
        `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;