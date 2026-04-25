import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicLayout() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = {
    admin:   "/admin/dashboard",
    teacher: "/teacher/dashboard",
    student: "/student/dashboard",
    parent:  "/parent/dashboard",
  };

  return (
    <div className="min-h-screen bg-parchment font-sans">
      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-parchment/95 backdrop-blur border-b border-gold/20 shadow-sm"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cobalt rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-sm font-bold">E</span>
            </div>
            <span className="font-serif text-xl text-ink">EduNova</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "About", "Contact"].map((n) => (
              <a
                key={n}
                href="#"
                className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
              >
                {n}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={dashboardPath[role] || "/dashboard"}
                className="text-sm font-medium bg-cobalt text-white px-5 py-2 rounded-lg hover:bg-cobalt/90 transition-all shadow-sm"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-ink/70 hover:text-ink px-4 py-2 rounded-lg hover:bg-ink/5 transition-all"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium bg-cobalt text-white px-5 py-2 rounded-lg hover:bg-cobalt/90 transition-all shadow-sm"
                >
                  Get started →
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-ink/60"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-parchment border-t border-gold/20 px-6 py-4 flex flex-col gap-4">
            {["Features", "Pricing", "About", "Contact"].map((n) => (
              <a key={n} href="#" className="text-sm font-medium text-ink/70">{n}</a>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium bg-cobalt text-white px-5 py-2.5 rounded-lg text-center"
            >
              Sign in →
            </Link>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <Outlet />

      {/* ── Footer ── */}
      <footer className="border-t border-ink/8 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-cobalt rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">E</span>
            </div>
            <span className="font-serif text-lg text-ink">EduNova</span>
          </div>
          <p className="text-xs text-ink/40">© 2026 EduNova Technologies Pvt Ltd · Made in India 🇮🇳</p>
          <div className="flex gap-5 text-xs text-ink/40">
            <a href="#" className="hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms</a>
            <a href="#" className="hover:text-ink transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
