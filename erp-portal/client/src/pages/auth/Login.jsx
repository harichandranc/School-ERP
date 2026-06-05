import { useState } from "react";
import API from "../../api/axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      if (data.role === "admin") {
        window.location.href = "/admin";
      } else if (data.role === "student") {
        window.location.href = "/student";
      } else if (data.role === "teacher") {
        window.location.href = "/teacher";
      } else {
        alert("Unknown role");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <img
            src="/school.jpg"
            alt="School Logo"
            className="logo"
          />

          <h1>School ERP</h1>


          <p className="portal-text">
            Student • Teacher • Admin Portal
          </p>
        </div>

        <form onSubmit={submitHandler}>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="button"
              className="show-btn"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        <div className="footer-text">
          © 2026 School ERP System
        </div>

      </div>
    </div>
  );
};

export default Login;