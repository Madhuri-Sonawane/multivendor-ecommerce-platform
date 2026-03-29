import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        navigate("/login");
        return;
      }

      if (storedUser.role === "seller" && !storedUser.isApproved) {
        navigate("/seller-pending");
      } else if (storedUser.role === "seller") {
        navigate("/seller");
      } else if (storedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}