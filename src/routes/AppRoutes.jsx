import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Layouts ────────────────────────────────────────────────────────────────
import PublicLayout  from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

// ── Public pages ───────────────────────────────────────────────────────────
import HomePage        from "../pages/auth/HomePage";
import LoginPage       from "../pages/auth/LoginPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";

// ── Admin pages ────────────────────────────────────────────────────────────
import AdminDashboard  from "../pages/admin/AdminDashboard";
import StudentsPage    from "../pages/admin/StudentsPage";
import TeachersPage    from "../pages/admin/TeachersPage";
import FeesPage        from "../pages/admin/FeesPage";
import ReportsPage     from "../pages/admin/ReportsPage";
import TimetablePage   from "../pages/admin/TimetablePage";
import AttendancePage  from "../pages/admin/AttendancePage";
import SettingsPage    from "../pages/admin/SettingsPage";

// ── Teacher pages ──────────────────────────────────────────────────────────
import TeacherDashboard   from "../pages/teacher/TeacherDashboard";
import TeacherClasses     from "../pages/teacher/TeacherClasses";
import TeacherAttendance  from "../pages/teacher/TeacherAttendance";
import TeacherGrades      from "../pages/teacher/TeacherGrades";
import TeacherTimetable   from "../pages/teacher/TeacherTimetable";

// ── Student pages ──────────────────────────────────────────────────────────
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentGrades    from "../pages/student/StudentGrades";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentFees      from "../pages/student/StudentFees";
import StudentTimetable from "../pages/student/StudentTimetable";

// ── Parent pages ───────────────────────────────────────────────────────────
import ParentDashboard  from "../pages/parent/ParentDashboard";
import ParentChildInfo  from "../pages/parent/ParentChildInfo";
import ParentFees       from "../pages/parent/ParentFees";
import ParentAttendance from "../pages/parent/ParentAttendance";

// ── Role-based guard ───────────────────────────────────────────────────────
/**
 * ProtectedRoute
 * Redirects to /login if not authenticated.
 * Redirects to /unauthorized if authenticated but wrong role.
 *
 * @param {string|string[]} roles — allowed role(s) for this route
 */
function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

/**
 * RoleRedirect — after login, bounce to the right dashboard
 */
function RoleRedirect() {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const map = {
    admin:   "/admin/dashboard",
    teacher: "/teacher/dashboard",
    student: "/student/dashboard",
    parent:  "/parent/dashboard",
  };
  return <Navigate to={map[role] || "/login"} replace />;
}

// ── Route tree ─────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<PublicLayout />}>
        <Route path="/"            element={<HomePage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/dashboard"   element={<RoleRedirect />} />
      </Route>

      {/* ── Admin ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"  element={<AdminDashboard />} />
        <Route path="students"   element={<StudentsPage />} />
        <Route path="teachers"   element={<TeachersPage />} />
        <Route path="fees"       element={<FeesPage />} />
        <Route path="reports"    element={<ReportsPage />} />
        <Route path="timetable"  element={<TimetablePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="settings"   element={<SettingsPage />} />
      </Route>

      {/* ── Teacher ── */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute roles="teacher">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"  element={<TeacherDashboard />} />
        <Route path="classes"    element={<TeacherClasses />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="grades"     element={<TeacherGrades />} />
        <Route path="timetable"  element={<TeacherTimetable />} />
      </Route>

      {/* ── Student ── */}
      <Route
        path="/student"
        element={
          <ProtectedRoute roles="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"  element={<StudentDashboard />} />
        <Route path="grades"     element={<StudentGrades />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="fees"       element={<StudentFees />} />
        <Route path="timetable"  element={<StudentTimetable />} />
      </Route>

      {/* ── Parent ── */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute roles="parent">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"  element={<ParentDashboard />} />
        <Route path="child"      element={<ParentChildInfo />} />
        <Route path="fees"       element={<ParentFees />} />
        <Route path="attendance" element={<ParentAttendance />} />
      </Route>

      {/* ── 404 fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
