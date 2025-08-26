import './App.css';
import { Routes, Route } from "react-router-dom";
import EcoTracker from "./pages/EcoTracker";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
function App() {
  return (
    <Routes>
      <Route path="/" element={<EcoTracker />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
