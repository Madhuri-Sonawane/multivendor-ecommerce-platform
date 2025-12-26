import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import Loader from "../components/Loader";



export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [sellers, setSellers] = useState([]);
  const approveSeller = async (id) => {
  await api.put(`/sellers/approve/${id}`);
  const res = await api.get("/sellers");
  setSellers(res.data);
};

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
    api.get("/sellers").then((res) => setSellers(res.data));
  }, []);

  if (!stats) return <Loader text="Loading admin dashboard..." />;

  return (
    <Layout>
  <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

  {/* STATS */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">Total Orders</p>
      <p className="text-2xl font-semibold">{stats.totalOrders}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">Revenue</p>
      <p className="text-2xl font-semibold">₹{stats.totalRevenue}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">Approved Sellers</p>
      <p className="text-2xl font-semibold">{stats.totalSellers}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">Refund Requests</p>
      <p className="text-2xl font-semibold">{stats.totalRefunds}</p>
    </div>
  </div>

  {/* SELLER TABLE */}
  <div className="bg-white rounded shadow">
    <h2 className="text-lg font-semibold p-4 border-b">
      Seller Applications
    </h2>

    <table className="w-full text-left">
      <thead className="bg-gray-100 text-sm">
        <tr>
          <th className="p-3">Store</th>
          <th className="p-3">Status</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {sellers.length === 0 && (
          <tr>
            <td colSpan="3" className="p-4 text-center text-gray-500">
              No sellers found
            </td>
          </tr>
        )}

        {sellers.map((s) => (
          <tr key={s._id} className="border-t">
            <td className="p-3">{s.storeName}</td>
            <td className="p-3">
              {s.isApproved ? (
                <span className="text-green-600 font-medium">Approved</span>
              ) : (
                <span className="text-yellow-600 font-medium">Pending</span>
              )}
            </td>
            <td className="p-3">
              {!s.isApproved && (
                <button
                  onClick={() => approveSeller(s._id)}
                  className="px-3 py-1 bg-black text-white rounded text-sm"
                >
                  Approve
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Layout>

  );
}
