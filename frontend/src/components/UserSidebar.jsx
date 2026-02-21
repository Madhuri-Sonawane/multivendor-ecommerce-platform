import { NavLink } from "react-router-dom";

export default function UserSidebar() {
  return (
    <div className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">My Account</h2>

      <nav className="space-y-3">
        <NavLink
          to="/user/profile"
          className="block px-3 py-2 rounded hover:bg-indigo-100"
        >
          Profile
        </NavLink>

        <NavLink
          to="/user/orders"
          className="block px-3 py-2 rounded hover:bg-indigo-100"
        >
          My Orders
        </NavLink>
      </nav>
    </div>
  );
}