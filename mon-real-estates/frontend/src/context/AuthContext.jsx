import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI, setAccessToken, clearAccessToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessTokenState] = useState(() => localStorage.getItem("accessToken") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth logout listener
    const handleAuthLogout = () => {
      setUser(null);
      setAccessTokenState(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!accessToken) {
        // Try to refresh token on app start
        try {
          const response = await authAPI.refresh();
          const { accessToken: newAccessToken } = response.data;
          setAccessToken(newAccessToken);
          setAccessTokenState(newAccessToken);
          
          // Fetch user profile
          const profileResponse = await authAPI.getProfile();
          setUser(profileResponse.data.user);
          localStorage.setItem("user", JSON.stringify(profileResponse.data.user));
        } catch (error) {
          console.log("No valid refresh token, user needs to login");
          clearAccessToken();
        }
      } else {
        // We have an access token, try to fetch profile
        try {
          setAccessToken(accessToken);
          const response = await authAPI.getProfile();
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (error) {
          console.error("Profile fetch failed:", error);
          // Try to refresh token
          try {
            const refreshResponse = await authAPI.refresh();
            const { accessToken: newAccessToken } = refreshResponse.data;
            setAccessToken(newAccessToken);
            setAccessTokenState(newAccessToken);
            
            // Retry profile fetch
            const profileResponse = await authAPI.getProfile();
            setUser(profileResponse.data.user);
            localStorage.setItem("user", JSON.stringify(profileResponse.data.user));
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const saveSession = ({ user, accessToken }) => {
    setUser(user);
    setAccessTokenState(accessToken);
    setAccessToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    saveSession(response.data);
    return response;
  };

  const register = async (registrationData) => {
    const response = await authAPI.register(registrationData);
    saveSession(response.data);
    return response;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser(null);
      setAccessTokenState(null);
      clearAccessToken();
      localStorage.removeItem("user");
    }
  };

  const logoutAll = async () => {
    try {
      await authAPI.logoutAll();
    } catch (error) {
      console.error("Logout all API call failed:", error);
    } finally {
      setUser(null);
      setAccessTokenState(null);
      clearAccessToken();
      localStorage.removeItem("user");
    }
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        logoutAll,
        updateUser,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
