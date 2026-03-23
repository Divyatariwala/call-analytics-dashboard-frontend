import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sun, Moon } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("analyst");
  const [darkMode, setDarkMode] = useState(true);
  const [themeLoaded, setThemeLoaded] = useState(false); // prevent flicker

  const navigate = useNavigate();

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setDarkMode(false);
    setThemeLoaded(true);
  }, []);

  // Apply theme
  useEffect(() => {
    if (!themeLoaded) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode, themeLoaded]);

  const handleLogin = async () => {
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("https://call-analytics-dashboard-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const userRole = data.user?.role;
        if (userRole !== role) {
          setErrors({
            api: `Selected role "${role}" does not match your account role.`,
          });
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", userRole);
        navigate("/dashboard");
      } else {
        if (data.errors) {
          const fieldErrors = {};
          data.errors.forEach((err) => {
            fieldErrors[err.param] = err.msg;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ api: data.msg || "Login failed" });
        }
      }
    } catch {
      setErrors({ api: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  if (!themeLoaded) return null; // wait until theme is loaded

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] top-[-120px] left-[-100px] opacity-30 animate-pulse-slow"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-500 rounded-full blur-[150px] bottom-[-120px] right-[-100px] opacity-30 animate-pulse-slow"></div>

      {/* Glass Card */}
      <div
        className={`relative w-[90%] max-w-md p-10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-500 hover:scale-105 ${
          darkMode
            ? "backdrop-blur-2xl bg-black/40 border border-white/20"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Dark/Light toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full shadow hover:scale-110 transition ${
              darkMode ? "bg-white/20" : "bg-gray-200"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-extrabold mb-1 text-center tracking-wide">
          Welcome Back
        </h1>
        <p
          className={`text-center mb-6 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Login to access your dashboard 🚀
        </p>

        {/* Role Toggle */}
        <div
          className={`flex rounded-full p-1 mb-6 shadow-inner transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          {["analyst", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition
                ${
                  role === r
                    ? "bg-purple-500 text-white shadow-md"
                    : darkMode
                    ? "text-gray-400 hover:bg-purple-600/20"
                    : "text-black hover:bg-purple-600/20"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Email input */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full pl-12 p-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
              darkMode
                ? "bg-white/10 border border-white/20 text-white"
                : "bg-white border border-gray-300 text-gray-900"
            } ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password input */}
        <div className="mb-4 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full pl-12 pr-12 p-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
              darkMode
                ? "bg-white/10 border border-white/20 text-white"
                : "bg-white border border-gray-300 text-gray-900"
            } ${errors.password ? "border-red-500" : ""}`}
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* API error */}
        {errors.api && (
          <div className="mb-4 flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 animate-pulse">
            <span>⚠️</span>
            <div>
              <p className="text-sm font-semibold">Login Error</p>
              <p className="text-xs opacity-80">{errors.api}</p>
            </div>
          </div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white p-3 rounded-xl font-semibold transition transform hover:scale-105"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup link */}
        <p className={`text-sm text-center mt-5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}