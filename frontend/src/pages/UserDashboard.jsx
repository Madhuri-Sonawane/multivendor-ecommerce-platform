import { Outlet, NavLink } from "react-router-dom";
import Layout from "../components/Layout";

export default function UserDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">My Account</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white shadow-sm rounded-xl p-5 space-y-4">
              <NavItem to="profile" label="Profile" />
              <NavItem to="orders" label="My Orders" />
              <NavItem to="wishlist" label="Wishlist" />
              <NavItem to="addresses" label="Saved Addresses" />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white shadow-sm rounded-xl p-6 min-h-[400px]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium transition ${
          isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}