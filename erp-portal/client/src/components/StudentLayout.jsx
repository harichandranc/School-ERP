import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import "../App.css";

const StudentLayout = ({ children }) => {
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Student Portal</h2>

        <hr />

        <Link to="/student" className="menu-link">
          Dashboard
        </Link>

        <Link to="/student/profile" className="menu-link">
          My Profile
        </Link>

        <Link to="/student/attendance" className="menu-link">
          Attendance
        </Link>

        <Link to="/student/subjects" className="menu-link">
          Subjects
        </Link>

        <Link to="/student/assignments" className="menu-link">
          Assignments
        </Link>

        <Link to="/student/results" className="menu-link">
          Results
        </Link>

        <button onClick={logout} className="logout">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;