import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-lg">Welcome, {user?.name}</p>
        <p className="text-gray-800">Role: {user?.role}</p>
      </div>
    </Layout>
  );
}
