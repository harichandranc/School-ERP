import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/students/me", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setStudent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Student Dashboard</h1>

      <hr />

      <h2>
        Welcome {student?.user?.name}
      </h2>

      <p>
        <strong>Email:</strong>{" "}
        {student?.user?.email}
      </p>

      <p>
        <strong>Class:</strong>{" "}
        {student?.class}
      </p>

      <p>
        <strong>Section:</strong>{" "}
        {student?.section || "-"}
      </p>

      <p>
        <strong>Roll Number:</strong>{" "}
        {student?.rollNumber || "-"}
      </p>

      <hr />

      <h3>Modules</h3>

      <ul>
        <li>My Profile</li>
        <li>Attendance</li>
        <li>Subjects</li>
        <li>Assignments</li>
        <li>Results</li>
      </ul>

      <button onClick={logoutHandler}>
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;