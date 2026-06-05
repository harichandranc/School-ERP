import { useState } from "react";
import API from "../../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      console.log("LOGIN SUCCESS:", data);

      // ✅ Store user
      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      // ✅ Redirect
      if (data.role === "admin") {
        window.location.href = "/admin";
      }

      else if (data.role === "student") {
        window.location.href = "/student";
      }

      else {
        alert("Unknown role");
      }

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={submitHandler}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br /><br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
};

export default Login;