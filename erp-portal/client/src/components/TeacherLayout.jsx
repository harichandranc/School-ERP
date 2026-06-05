import { logout } from "../utils/auth";
import "../App.css";

const TeacherLayout = ({ children }) => {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>ERP Teacher</h2>

        <hr />

        <p>Dashboard</p>
        <p>Students</p>
        <p>Attendance</p>
        <p>Subjects</p>
        <p>Assignments</p>
        <p>Results</p>

        <button onClick={logout} className="logout">
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