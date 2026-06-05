import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const ProtectedRoute = ({
  children,
  role,
}) => {

  const user = getUser();

  console.log("ProtectedRoute User:", user);

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ wrong role
  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  // ✅ access granted
  return children;
};

export default ProtectedRoute;