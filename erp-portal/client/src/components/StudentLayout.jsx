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

        <Link to="/student">Dashboard</Link>

        <Link to="/student/profile">
          My Profile
        </Link>

        <Link to="/student/attendance">
          Attendance
        </Link>

        <Link to="/student/subjects">
          Subjects
        </Link>

        <Link to="/student/assignments">
          Assignments
        </Link>

        <Link to="/student/results">
          Results
        </Link>

        <button onClick={logout} className="logout">
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;