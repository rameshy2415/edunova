import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

/**
 * App.jsx — Root component.
 * Wraps everything in:
 *  - BrowserRouter   (React Router v6 navigation)
 *  - AuthProvider    (global auth state & role management)
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
