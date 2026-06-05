import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import "../App.css";

const StudentLayout = ({ children }) => {
  return (
    <div className="app">

      <aside className="sidebar">
        <h2>Student Portal</h2>

        <hr />

        <Link
          to="/student"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <p>Dashboard</p>
        </Link>

        <Link
          to="/student/profile"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <p>My Profile</p>
        </Link>

        <button
          onClick={logout}
          className="logout"
        >
          Logout
        </button>
      </aside>

      <main className="content">
        {children}
      </main>

    </div>
  );
};

export default StudentLayout;