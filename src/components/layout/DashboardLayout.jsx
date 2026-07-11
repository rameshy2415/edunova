import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* ── Nav config per role ─────────────────────────────────── */
const NAV_CONFIG = {
  SCHOOL_ADMIN: [
    {
      section: "Main",
      items: [
        { label: "Dashboard",    path: "/admin/dashboard",  icon: "dashboard" },
   /*      { label: "Students",     path: "/admin/students",   icon: "students",  badge: 3 }, */
        { label: "Students",     path: "/admin/students",   icon: "students" },
        { label: "Timetable",    path: "/admin/timetable",  icon: "timetable" },
        { label: "Attendance",   path: "/admin/attendance", icon: "attendance" },
        { label: "Exams & Grades", path: "/admin/exams-grades",  icon: "exams" },
      ],
    },
    {
      section: "Admin",
      items: [
        { label: "Teachers",     path: "/admin/teachers",   icon: "teachers" },
        { label: "Fees & Finance", path: "/admin/fees",     icon: "fees" },
        { label: "Reports",      path: "/admin/reports",    icon: "reports" },
        { label: "Settings",     path: "/admin/settings",   icon: "settings" },
      ],
    },
  ],
  teacher: [
    {
      section: "My School",
      items: [
        { label: "Dashboard",   path: "/teacher/dashboard",  icon: "dashboard" },
        { label: "My Classes",  path: "/teacher/classes",    icon: "students" },
        { label: "Attendance",  path: "/teacher/attendance", icon: "attendance" },
        { label: "Grades",      path: "/teacher/grades",     icon: "exams" },
        { label: "Timetable",   path: "/teacher/timetable",  icon: "timetable" },
      ],
    },
  ],
  student: [
    {
      section: "My Portal",
      items: [
        { label: "Dashboard",   path: "/student/dashboard",  icon: "dashboard" },
        { label: "My Grades",   path: "/student/grades",     icon: "exams" },
        { label: "Attendance",  path: "/student/attendance", icon: "attendance" },
        { label: "Fees",        path: "/student/fees",       icon: "fees" },
        { label: "Timetable",   path: "/student/timetable",  icon: "timetable" },
      ],
    },
  ],
  parent: [
    {
      section: "My Child",
      items: [
        { label: "Dashboard",   path: "/parent/dashboard",   icon: "dashboard" },
        { label: "Child Info",  path: "/parent/child",       icon: "students" },
        { label: "Attendance",  path: "/parent/attendance",  icon: "attendance" },
        { label: "Fees",        path: "/parent/fees",        icon: "fees" },
      ],
    },
  ],
};

/* ── Inline SVG icons ────────────────────────────────────── */
function NavIcon({ name }) {
  const cls = "w-4 h-4 flex-shrink-0";
  const icons = {
    dashboard:  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
    students:   <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="8" cy="7" r="4"/><path d="M2 21c0-4 2.69-7 6-7s6 3 6 7"/><path d="M17 11l2 2 4-4"/></svg>,
    timetable:  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v3M16 2v3M3 10h18"/></svg>,
    attendance: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 11l3 3L22 4"/><path d="M20 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    exams:      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 6h18M3 12h18M3 18h11"/><path d="M17 14l2 2 4-4"/></svg>,
    teachers:   <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6"/></svg>,
    fees:       <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    reports:    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h11v4H3z"/></svg>,
    settings:   <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
  };
  return icons[name] || null;
}

const ROLE_COLORS = {
  SCHOOL_ADMIN:   "bg-cobalt text-white",
  teacher: "bg-sage text-white",
  student: "bg-amber text-white",
  parent:  "bg-rose text-white",
};

const ROLE_ACCENT = {
  SCHOOL_ADMIN:   "bg-cobalt",
  teacher: "bg-sage",
  student: "bg-amber",
  parent:  "bg-rose",
};

/* ── Component ───────────────────────────────────────────── */
export default function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = NAV_CONFIG[role] || [];
  const initials = user?.name? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(): "??";

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center gap-2 border-b border-ink/8 flex-shrink-0">
        <div className="w-8 h-8 bg-cobalt rounded-lg flex items-center justify-center">
          <span className="text-white font-serif text-sm font-bold">E</span>
        </div>
        <span className="font-serif text-lg text-ink">EduNova</span>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-ink/8">
        <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${ROLE_COLORS[role]}`}>
          {role}
        </span>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {sections.map((sec) => (
          <div key={sec.section} className="mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink/35 px-3 py-2 mt-1">
              {sec.section}
            </p>
            {sec.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all ${
                    isActive
                      ? `${ROLE_ACCENT[role]} text-white shadow-sm`
                      : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                  }`
                }
              >
                <NavIcon name={item.icon} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-rose-light text-rose">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-ink/8 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-parchment mb-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${ROLE_ACCENT[role]}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-ink truncate">{user?.name || "User"}</div>
            <div className="text-xs text-ink/40 truncate">{user?.email || ""}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink/50 hover:bg-rose-light hover:text-rose transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans">
      {/* ── Top bar ── */}
      <header className="bg-white border-b border-ink/8 h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1.5 text-ink/50 hover:text-ink"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className={`hidden md:inline-flex text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${ROLE_COLORS[role]}`}>
            {role} portal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-parchment border border-ink/10 rounded-xl px-3 py-1.5 cursor-text">
            <svg className="w-3.5 h-3.5 text-ink/35" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/>
            </svg>
            <span className="text-xs text-ink/35 select-none">Search…</span>
          </div>

          <button className="relative p-2 text-ink/50 hover:text-ink hover:bg-parchment rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose rounded-full"></span>
          </button>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer ${ROLE_ACCENT[role]}`}>
            {initials}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-ink/8 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />
            <aside
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Page content via Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
