import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import {
  saveUserToken,
  getUserToken,
  removeUserToken,
  saveAdminToken,
  getAdminToken,
  removeAdminToken,
} from "@/lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============ تحميل الجلسات عند الإقلاع ============
  useEffect(() => {
    const load = async () => {
      const tasks = [];

      if (getUserToken()) {
        tasks.push(
          api
            .get("/users/me")
            .then((r) => setUser(r.data.data))
            .catch(() => removeUserToken()),
        );
      }

      if (getAdminToken()) {
        tasks.push(
          api
            .get("/admin/me")
            .then((r) => setAdmin(r.data.data))
            .catch(() => removeAdminToken()),
        );
      }

      await Promise.all(tasks);
      setLoading(false);
    };
    load();
  }, []);

  // ============ Login موحّد ============
  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    const { role, token } = res.data.data;

    if (role === "admin") {
      saveAdminToken(token);
      setAdmin(res.data.data.admin);
    } else {
      saveUserToken(token);
      setUser(res.data.data.user);
    }

    return { role };
  };

  // ============ Register ============
  const register = async ({ name, email, password }) => {
    const res = await api.post("/users/register", { name, email, password });
    saveUserToken(res.data.data.token);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  // ============ تحديث الملف الشخصي ============
  const updateProfile = async (payload) => {
    const res = await api.put("/users/me", payload);
    saveUserToken(res.data.data.token); // ← توكن جديد
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  // ============ حذف الحساب ============
  const deleteAccount = async (password) => {
    await api.delete("/users/me", { data: { password } });
    removeUserToken();
    setUser(null);
  };

  // ============ Logout ============
  const logoutUser = () => {
    removeUserToken();
    setUser(null);
  };

  const logoutAdmin = () => {
    removeAdminToken();
    setAdmin(null);
  };

  const logout = () => {
    removeUserToken();
    removeAdminToken();
    setUser(null);
    setAdmin(null);
  };

  const isUserAuthenticated = !!user;
  const isAdmin = !!admin;
  const isAuthenticated = isUserAuthenticated || isAdmin;
  const displayName = admin ? admin.username : user?.name;

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        isAuthenticated,
        isUserAuthenticated,
        isAdmin,
        displayName,
        register,
        login,
        logout,
        logoutUser,
        logoutAdmin,
        updateProfile, // ← جديد
        deleteAccount, // ← جديد
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
