import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/dashboard/Login";
import Signup from "./components/dashboard/Signup";
import Dashboard from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;