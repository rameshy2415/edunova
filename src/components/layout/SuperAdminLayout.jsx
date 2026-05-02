import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard",     path: "/superadmin/dashboard",      icon: "grid" },
      { label: "Schools",       path: "/superadmin/schools",         icon: "school", badge: null },
      { label: "Onboard School",path: "/superadmin/schools/new",    icon: "plus" },
    ],
  },
  {
    section: "Management",
    items: [
      { label: "Subscriptions", path: "/superadmin/subscriptions",  icon: "card" },
      { label: "Admins",        path: "/superadmin/admins",          icon: "users" },
      { label: "Analytics",     path: "/superadmin/analytics",       icon: "chart" },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Settings",      path: "/superadmin/settings",        icon: "settings" },
      { label: "Audit Logs",    path: "/superadmin/audit",           icon: "log" },
    ],
  },
];

function Icon({ name }) {
  const cls = "w-4 h-4 flex-shrink-0";
  const map = {
    grid:     <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
    school:   <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21V12h6v9"/></svg>,
    plus:     <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    card:     <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    users:    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>,
    chart:    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-6"/></svg>,
    settings: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
    log:      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    logout:   <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  };
  return map[name] || null;
}

export default function SuperAdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = (user?.name || "SA").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center gap-2.5 border-b border-white/10 flex-shrink-0">
        <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
          <span className="text-white font-serif text-xs font-bold">E</span>
        </div>
        <div>
          <div className="text-white font-serif text-base leading-tight">EduNova</div>
          <div className="text-white/40 text-[9px] font-semibold uppercase tracking-widest leading-tight">Super Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV.map((sec) => (
          <div key={sec.section} className="mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-3 py-2 mt-1">
              {sec.section}
            </p>
            {sec.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path.endsWith("dashboard")}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/50 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                <Icon name={item.icon} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/8 mb-1">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name || "Super Admin"}</div>
            <div className="text-[11px] text-white/40 truncate">{user?.email || ""}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Icon name="logout" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "#F0EEFB" }}>
      {/* Top bar */}
      <header
        className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30 border-b"
        style={{ background: "white", borderColor: "#e8e4f5" }}
      >
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1.5 text-purple-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="hidden md:inline-flex text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
            Super Admin Portal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 cursor-text border" style={{ background: "#F0EEFB", borderColor: "#e0dbf5" }}>
            <svg className="w-3.5 h-3.5 text-purple-300" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/>
            </svg>
            <span className="text-xs text-purple-300 select-none">Search schools…</span>
          </div>
          <button className="relative p-2 text-purple-400 hover:text-purple-700 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold bg-purple-600">
            {initials}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-col w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden"
          style={{ background: "#4C1D95" }}
        >
          <SidebarContent />
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <aside
              className="absolute left-0 top-0 bottom-0 w-64 shadow-2xl z-50"
              style={{ background: "#4C1D95" }}
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}