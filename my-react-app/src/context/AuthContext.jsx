import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    api("/api/auth/me").then(({ user: current }) => setUser(current)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (data) => {
    const response = await api("/api/auth/login", { method: "POST", body: data });
    setUser(response.user);
    return response.user;
  }, []);
  const signup = useCallback(async (data) => {
    const response = await api("/api/auth/signup", { method: "POST", body: data });
    setUser(response.user);
    return response.user;
  }, []);
  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
    setSavedIds([]);
  }, []);
  const isJobSaved = useCallback((id) => savedIds.includes(id), [savedIds]);
  const toggleLocalSaved = useCallback((id) => {
    setSavedIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]);
  }, []);

  const value = useMemo(() => ({
    user, loading, login, signup, logout,
    isStudent: user?.role === "candidate",
    isRecruiter: user?.role === "recruiter",
    isAdmin: user?.role === "admin",
    isJobSaved, toggleLocalSaved, setSavedIdsList: setSavedIds,
    // Account roles are assigned by the API and cannot be changed from the client.
    switchRole: () => {},
  }), [user, loading, login, signup, logout, isJobSaved, toggleLocalSaved]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
