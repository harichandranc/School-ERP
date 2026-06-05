import { useState } from "react";
import API from "../../api/axios";
import TeacherLayout from "../../components/TeacherLayout";

const Profile = () => {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const { data } = await API.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      alert(data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Password update failed"
      );
    }
  };

  return (
    <TeacherLayout>
      <div className="card">
        <h2>Change Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button type="submit">
            Update Password
          </button>
        </form>
      </div>
    </TeacherLayout>
  );
};

export default Profile;