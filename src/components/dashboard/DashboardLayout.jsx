import React, { useState, useEffect } from "react";
import { FiPieChart, FiUsers, FiSettings, FiMenu, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setDarkMode(false);
  }, []);

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = [
    { icon: <FiPieChart />, label: "Dashboard", roles: ["admin", "analyst"] },
    { icon: <FiUsers />, label: "Users", roles: ["admin"] },
    { icon: <FiSettings />, label: "Settings", roles: ["admin"] },
  ];

  return (
    <div className={`flex min-h-screen relative overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* Background blobs (non-interactive) */}
  
      <div className="absolute w-[400px] h-[400px] bg-pink-500 rounded-full blur-[150px] bottom-[-120px] right-[-100px] opacity-30 animate-pulse-slow pointer-events-none -z-10"></div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static
          ${darkMode ? "bg-black/40 backdrop-blur-2xl border border-white/20 text-white" : "bg-white/40 backdrop-blur-2xl border border-gray-200 text-gray-900"}
          flex flex-col shadow-2xl rounded-r-3xl
        `}
      >
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Call Analytics</h1>
          <button className="lg:hidden text-xl" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="flex flex-col gap-2 mt-6 px-4">
          {navItems.filter(item => item.roles.includes(role)).map((item, idx) => (
            <a key={idx} href="#"
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition
                ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-200/50"}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center mt-4 justify-center w-[225px] mx-auto mb-6 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow hover:scale-105 transition text-sm"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>

        <div className="p-4 text-xs text-white/50 mt-auto">© 2026 Call Analytics</div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 min-h-screen min-w-0 p-6 md:p-8 space-y-6 relative z-10">
        
        {/* Header */}
        <header className={`
          flex items-center justify-between px-4 py-4 rounded-xl transition-colors duration-500
          ${darkMode ? "bg-black/40 backdrop-blur-2xl border border-white/20" : "bg-white/40 backdrop-blur-2xl border border-gray-200"}
        `}>
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <FiMenu className="w-6 h-6" />
            </button>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full shadow hover:scale-110 transition ${darkMode ? "bg-white/20" : "bg-gray-200"}`}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <span className="text-sm sm:text-base">{role === "admin" ? "Admin" : "Analyst"}</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {role?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`
          p-6 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.2)] transition-all duration-500
          ${darkMode ? "bg-black/40 border border-white/20 backdrop-blur-2xl" : "bg-white border border-gray-200 backdrop-blur-2xl"}
        `}>
          {children}
        </main>
      </div>
    </div>
  );
}