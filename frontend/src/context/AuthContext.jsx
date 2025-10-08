

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [designs, setDesigns] = useState(() => {
    const saved = sessionStorage.getItem("user-designs");
    return saved ? JSON.parse(saved) : [];
  });

  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("chat-user");
    if (storedUser) {
      try {
        setAuthUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse chat-user from sessionStorage", e);
      }
    }
    setLoading(false);
  }, []);

  // Save designs to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("user-designs", JSON.stringify(designs));
    } catch (e) {
      console.error("Failed to save designs", e);
    }
  }, [designs]);

  // Save user to sessionStorage
  useEffect(() => {
    if (authUser) {
      sessionStorage.setItem("chat-user", JSON.stringify(authUser));
    } else {
      sessionStorage.removeItem("chat-user");
    }
  }, [authUser]);

  // Fetch designs when logged in
  useEffect(() => {
    const fetchDesigns = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch("http://localhost:5000/api/designs", {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const serverDesigns = Array.isArray(data) ? data : data.designs || data;
        setDesigns(serverDesigns || []);
      } catch (err) {
        console.error("Error fetching designs:", err);
      }
    };
    fetchDesigns();
  }, [authUser]);

  // ✅ Sync user with backend MongoDB
  useEffect(() => {
    const syncUser = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch("http://localhost:5000/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
        });
        if (!res.ok) {
          console.warn("Failed to sync user");
          return;
        }
        const data = await res.json();
        // Update authUser with MongoDB user info
        setAuthUser((prev) => ({ ...prev, user: data.user }));
      } catch (err) {
        console.error("Error syncing user:", err);
      }
    };
    syncUser();
  }, [authUser?.token]);

  // Helpers
  const addDesign = (newDesign) => setDesigns((prev) => [newDesign, ...prev]);
  const updateDesign = (id, updatedDesignData) =>
    setDesigns((prev) =>
      prev.map((d) => (d._id === id ? { ...d, ...updatedDesignData } : d))
    );
  const deleteDesign = (id) =>
    setDesigns((prev) => prev.filter((d) => d._id !== id));
  const getDesignById = (id) => designs.find((d) => d._id === id);

  const value = {
    authUser,
    setAuthUser,
    loading,
    designs,
    addDesign,
    updateDesign,
    deleteDesign,
    getDesignById,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
