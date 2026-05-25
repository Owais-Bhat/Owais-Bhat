import React, { createContext, useContext, useMemo, useState } from "react";
import { signInWithEmail, signOutUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isAuthenticated = Boolean(user);

  const login = async ({ email, password }) => {
    const sessionUser = await signInWithEmail({ email, password });
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
