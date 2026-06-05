import { logout } from "../utils/auth";
import "../App.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="app">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>ERP Admin</h2>

        <hr />

        <p>Dashboard</p>
        <p>Students</p>
        <p>Courses</p>

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

export default AdminLayout;