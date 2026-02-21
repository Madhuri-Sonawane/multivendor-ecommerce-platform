import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

export default function UserDashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "user") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <UserSidebar />

      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}