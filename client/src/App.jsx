import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import PublicLayout from "./components/PublicLayout";
import Layout from "./components/Layout";
import Home from "./pages/public/Home";
import Foods from "./pages/public/Foods";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DietPlan from "./pages/DietPlan";
import Tracker from "./pages/Tracker";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminTrackers from "./pages/admin/AdminTrackers";
import AdminMeals from "./pages/admin/AdminMeals";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminDatabase from "./pages/admin/AdminDatabase";
import AdminSettings from "./pages/admin/AdminSettings";

const Splash = () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div className="spinner" /></div>;

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/login" replace />;
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;   // user session token for app pages
  return children;
};
const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("kdp_admin_token");
  if (!token) return <Navigate to="/admin/login" replace />;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;       // set BEFORE children fetch (fixes 401 on refresh)
  return children;
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ style: { background: "#fff", color: "#2c2416", border: "1px solid #e8e0d5", borderRadius: 12 } }} />
          <Routes>
            {/* Public website — the first thing visitors see */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/foods" element={<Foods />} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

            {/* Logged-in app */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/diet-plan" element={<DietPlan />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin portal */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<AdminUserDetail />} />
              <Route path="trackers" element={<AdminTrackers />} />
              <Route path="meals" element={<AdminMeals />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="database" element={<AdminDatabase />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
