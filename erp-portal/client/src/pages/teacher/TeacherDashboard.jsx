import { useEffect, useState } from "react";
import API from "../../api/axios";
import TeacherLayout from "../../components/TeacherLayout";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchTeacher();
    fetchStudents();
  }, []);

  const fetchTeacher = async () => {
    try {
      const { data } = await API.get("/teachers/me");
      setTeacher(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await API.get(
        "/teachers/students"
      );

      setStudents(data);
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
          Assigned Class:
          {" "}
          {teacher?.assignedClass}
        </p>

        <p>
          Assigned Section:
          {" "}
          {teacher?.assignedSection}
        </p>
      </div>

      <div className="card">
        <h2>My Students</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Section</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  {student.user?.name}
                </td>

                <td>
                  {student.user?.email}
                </td>

                <td>
                  {student.class}
                </td>

                <td>
                  {student.section}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;