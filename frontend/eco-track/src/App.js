import './App.css';
import { Routes, Route } from "react-router-dom";
import EcoTracker from "./pages/EcoTracker";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import DepartmentDashboard from './pages/DepartmentDashboard';
import AnalyticsPage from "./pages/companalytics";

import CompanyAdminDashboard from "./pages/CompanyAdminDashboard";
import BillManagement from './pages/BillManagement';

// ...inside your <Routes> component:
<Route path="/bills" element={<BillManagement />} />
function App() {
  return (
    <Routes>
      <Route path="/" element={<EcoTracker />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-dashboard" element={<CompanyAdminDashboard />} />
      <Route path="/bills" element={<BillManagement />} />  
      <Route path="/department-dashboard" element={<DepartmentDashboard />} />
       <Route path="/companalytics" element={<AnalyticsPage />} />
    </Routes>
  );
}

export default App;
