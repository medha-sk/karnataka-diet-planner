import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("kdp_user");
    if (!stored) { setLoading(false); return; }
    let u;
    try { u = JSON.parse(stored); } catch { localStorage.removeItem("kdp_user"); setLoading(false); return; }
    axios.defaults.headers.common["Authorization"] = `Bearer ${u.token}`;
    // refresh from the server so stale/old-format data never shows up
    axios.get("/api/auth/profile")
      .then(r => { const fresh = { ...r.data, token: u.token }; setUser(fresh); localStorage.setItem("kdp_user", JSON.stringify(fresh)); })
      .catch(() => { localStorage.removeItem("kdp_user"); delete axios.defaults.headers.common["Authorization"]; })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("kdp_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("kdp_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
