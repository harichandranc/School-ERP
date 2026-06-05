import { useEffect, useState } from "react";
import API from "../../api/axios";
import StudentLayout from "../../components/StudentLayout";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await API.get("/students/me");
      setStudent(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <h2>Loading...</h2>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* Welcome Card */}
      <div className="card">
        <h1>Welcome, {student?.user?.name} 👋</h1>
        <p>
          Class {student?.class} | Section {student?.section || "-"}
        </p>
      </div>

      {/* Student Info */}
      <div className="card">
        <h2>Student Information</h2>

        <p>
          <strong>Name:</strong> {student?.user?.name}
        </p>

        <p>
          <strong>Email:</strong> {student?.user?.email}
        </p>

        <p>
          <strong>Class:</strong> {student?.class}
        </p>

        <p>
          <strong>Section:</strong> {student?.section || "-"}
        </p>

        <p>
          <strong>Roll Number:</strong>{" "}
          {student?.rollNumber || "-"}
        </p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Attendance</h3>
          <p>95%</p>
        </div>

        <div className="stat-card">
          <h3>Subjects</h3>
          <p>6</p>
        </div>

        <div className="stat-card">
          <h3>Assignments</h3>
          <p>2 Pending</p>
        </div>

        <div className="stat-card">
          <h3>Results</h3>
          <p>Available</p>
        </div>
      </div>

      {/* Modules */}
      <div className="card">
        <h2>Student Modules</h2>

        <div className="module-grid">
          <div className="module-card">My Profile</div>
          <div className="module-card">Attendance</div>
          <div className="module-card">Subjects</div>
          <div className="module-card">Assignments</div>
          <div className="module-card">Results</div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;