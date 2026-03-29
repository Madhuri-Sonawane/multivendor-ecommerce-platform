import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: role,
      });

      if (role === "seller") {
        navigate("/seller-pending");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-gray-500">Join our platform today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-800"
                />
              </div>
            </div>

            {/* ROLE SELECTION */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Account Type</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100/50 rounded-xl border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    role === "user"
                      ? "bg-white text-indigo-700 shadow-sm border border-gray-200/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Customer
                </button>

                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    role === "seller"
                      ? "bg-white text-indigo-700 shadow-sm border border-gray-200/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Seller
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
