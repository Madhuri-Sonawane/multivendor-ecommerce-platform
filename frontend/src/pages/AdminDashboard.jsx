import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminDashboard() {
  /* ================= STATE ================= */
  const [overview, setOverview] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchAdminData = async () => {
    try {
      const [
        overviewRes,
        sellersRes,
        pendingRes,
        revenueRes,
      ] = await Promise.all([
        api.get("/admin/analytics/overview"),
        api.get("/admin/analytics/sellers"),
        api.get("/admin/sellers/pending"),
        api.get("/admin/analytics/monthly-revenue"),
      ]);

      setOverview(overviewRes.data);
      setSellers(sellersRes.data);
      setPendingSellers(pendingRes.data);
      setMonthlyRevenue(revenueRes.data);
    } catch (err) {
      console.error("Admin analytics fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  /* ================= LOADING ================= */
  if (loading || !overview) {
    return (
      <Layout>
        <p className="text-center mt-20">Loading admin analytics…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Platform-wide analytics & control
        </p>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Stat label="Users" value={overview.users.total} />
        <Stat label="Sellers" value={overview.users.sellers} />
        <Stat label="Approved Sellers" value={overview.users.approvedSellers} />
        <Stat label="Total Products" value={overview.products.total} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Stat label="Active Products" value={overview.products.active} />
        <Stat label="Disabled Products" value={overview.products.disabled} />
        <Stat label="Total Orders" value={overview.orders.total} />
        <Stat label="Pending Orders" value={overview.orders.pending} />
      </div>

      {/* ================= REVENUE ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-14">
        <Money label="Gross Revenue" value={overview.revenue} />
        <Money label="Seller Earnings" value={overview.revenue * 0.9} />
        <Money label="Platform Commission" value={overview.revenue * 0.1} />
        <Money label="Pending Payout" value={0} />
      </div>

      {/* ================= MONTHLY CHART ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-14">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>

        <LineChart width={700} height={300} data={monthlyRevenue}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" />
        </LineChart>
      </div>

      {/* ================= SELLER PERFORMANCE ================= */}
      <div className="bg-white rounded-xl shadow mb-14">
        <h2 className="text-xl font-semibold p-5 border-b">
          Seller Performance
        </h2>

        {sellers.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No sellers found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3">Products</th>
                <th className="p-3">Active</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.sellerId} className="border-t">
                  <td className="p-3">{s.storeName}</td>
                  <td className="p-3 text-center">{s.totalProducts}</td>
                  <td className="p-3 text-center">{s.activeProducts}</td>
                  <td className="p-3 text-center">{s.orders}</td>
                  <td className="p-3 text-center">₹{s.revenue}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={async () => {
                        await api.post("/admin/payout", {
                          sellerId: s.sellerId,
                        });
                        fetchAdminData();
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= PENDING SELLERS ================= */}
      <div className="bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold p-5 border-b">
          Pending Seller Approvals
        </h2>

        {pendingSellers.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No pending sellers
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Shop</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSellers.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.shopName}</td>
                  <td className="p-3 text-center">{s.user.name}</td>
                  <td className="p-3 text-center">{s.user.email}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={async () => {
                        await api.patch(
                          `/admin/sellers/${s._id}/approve`
                        );
                        fetchAdminData();
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={async () => {
                        await api.patch(
                          `/admin/sellers/${s._id}/reject`
                        );
                        fetchAdminData();
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

/* ================= UI ================= */

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Money = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">₹{Math.round(value)}</p>
  </div>
);
