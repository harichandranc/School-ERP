// utils/auth.js

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (!user) return null;

    return JSON.parse(user);

  } catch (error) {
    console.log("Invalid user data");

    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  window.location.href = "/login";
};