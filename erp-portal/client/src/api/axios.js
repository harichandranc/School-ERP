import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Attach token safely
API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.log("Invalid localStorage user");
  }

  return req;
});

export default API;