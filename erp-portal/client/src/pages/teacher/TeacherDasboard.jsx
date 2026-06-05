import { useEffect, useState } from "react";
import API from "../../api/axios";
import TeacherLayout from "../../components/TeacherLayout";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const { data } = await API.get("/teachers/me");
      setTeacher(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TeacherLayout>
      <div className="card">
        <h1>
          Welcome {teacher?.user?.name}
        </h1>

        <p>
          <strong>Assigned Class:</strong>{" "}
          {teacher?.assignedClass}
        </p>

        <p>
          <strong>Assigned Section:</strong>{" "}
          {teacher?.assignedSection}
        </p>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;