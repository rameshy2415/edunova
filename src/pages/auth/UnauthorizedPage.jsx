import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DASHBOARD_MAP = {
  admin:   "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent:  "/parent/dashboard",
};

export default function UnauthorizedPage() {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="font-serif text-4xl text-ink mb-3">Access Denied</h1>
        <p className="text-ink/55 mb-8 leading-relaxed">
          You don't have permission to view this page. This area is restricted to a different role.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <Link
              to={DASHBOARD_MAP[role] || "/dashboard"}
              className="bg-cobalt text-white font-medium px-6 py-3 rounded-xl hover:bg-cobalt/90 transition-all text-sm"
            >
              Go to my dashboard →
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-cobalt text-white font-medium px-6 py-3 rounded-xl hover:bg-cobalt/90 transition-all text-sm"
            >
              Sign in →
            </Link>
          )}
          <Link
            to="/"
            className="border border-ink/12 text-ink font-medium px-6 py-3 rounded-xl hover:bg-ink/5 transition-all text-sm"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
