import { useState, useEffect } from "react";
import API from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");

  const [students, setStudents] = useState([]);

  // 🔍 search + filter + pagination
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // ✏️ edit
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    class: "",
    section: "",
  });

  // ✅ FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const { data } = await API.get(
        `/students?search=${search}&class=${filterClass}&page=${page}&limit=5`
      );

      setStudents(data.data);
      setPages(data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, filterClass, page]);

  // ✅ CREATE
  const createStudent = async (e) => {
    e.preventDefault();

    if (!name || !email || !studentClass) {
      return alert("All fields are required");
    }

    try {
      await API.post("/students", {
        name,
        email,
        class: studentClass,
        section,
      });

      alert("Student created");

      setName("");
      setEmail("");
      setStudentClass("");
      setSection("");

      fetchStudents(); // refresh list
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // ✏️ EDIT
  const handleEdit = (s) => {
    setEditingId(s._id);
    setEditForm({
      name: s.user?.name,
      email: s.user?.email,
      class: s.class,
      section: s.section || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await API.put(`/students/${id}`, editForm);

      setStudents((prev) =>
        prev.map((s) => (s._id === id ? data : s))
      );

      setEditingId(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;

    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Admin Dashboard</h1>

        <hr />

        {/* CREATE */}
        <h2>Create Student</h2>

        <form onSubmit={createStudent}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />

          <select
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          >
            <option value="">Class</option>
            {[1,2,3,4,5,6,7,8,9,10].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>

          <br /><br />

          <input
            placeholder="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />

          <br /><br />

          <button>Create</button>
        </form>

        <hr />

        {/* 🔍 SEARCH + FILTER */}
        <h2>Students</h2>

        <input
          placeholder="Search name/email"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={filterClass}
          onChange={(e) => {
            setPage(1);
            setFilterClass(e.target.value);
          }}
        >
          <option value="">All Classes</option>
          {[1,2,3,4,5,6,7,8,9,10].map(c => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>

        <br /><br />

        {/* TABLE */}
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>
                  {editingId === s._id ? (
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  ) : s.user?.name}
                </td>

                <td>
                  {editingId === s._id ? (
                    <input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  ) : s.user?.email}
                </td>

                <td>
                  {editingId === s._id ? (
                    <select
                      value={editForm.class}
                      onChange={(e) =>
                        setEditForm({ ...editForm, class: e.target.value })
                      }
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : s.class}
                </td>

                <td>
                  {editingId === s._id ? (
                    <input
                      value={editForm.section}
                      onChange={(e) =>
                        setEditForm({ ...editForm, section: e.target.value })
                      }
                    />
                  ) : (s.section || "-")}
                </td>

                <td>
                  {editingId === s._id ? (
                    <>
                      <button onClick={() => handleUpdate(s._id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(s)}>Edit</button>
                      <button onClick={() => handleDelete(s._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 📄 PAGINATION */}
        <div style={{ marginTop: "20px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span> Page {page} of {pages} </span>

          <button disabled={page === pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;