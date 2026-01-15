import './App.css';
import { Routes, Route } from "react-router-dom";
import EcoTracker from "./pages/EcoTracker";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import CompanyAdminDashboard from "./pages/CompanyAdminDashboard";
// import DepartmentDashboard from "./pages/DepartmentDashboard"; // Uncomment if exists

// ...existing code...

// ...existing code...
function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    window.location.href = "/";
    return null;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<EcoTracker />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute allowedRoles={["company_admin"]}>
            <CompanyAdminDashboard />
          </PrivateRoute>
        }
      />
      {/*
      <Route
        path="/department-dashboard"
        element={
          <PrivateRoute allowedRoles={["department_admin"]}>
            <DepartmentDashboard />
          </PrivateRoute>
        }
      />
      */}
    </Routes>
  );
}

export default App;
