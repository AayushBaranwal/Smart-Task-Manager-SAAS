import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // 👈 add this

function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Protected Route */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;