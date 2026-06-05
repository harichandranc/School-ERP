import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import "../App.css";

const TeacherLayout = ({ children }) => {
  return (
    <div className="app">

      <aside className="sidebar">
        <h2>ERP Teacher</h2>

        <hr />

        <Link
          to="/teacher"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <p>Dashboard</p>
        </Link>

        <Link
          to="/teacher/profile"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <p>Profile</p>
        </Link>

        <Link
          to="/teacher/students"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <p>Students</p>
        </Link>

        <Link
          to="/teacher/attendance"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <p>Attendance</p>
        </Link>

        <Link
          to="/teacher/subjects"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <p>Subjects</p>
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

export default TeacherLayout;