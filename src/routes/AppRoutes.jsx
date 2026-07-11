import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

// ── Layouts ────────────────────────────────────────────────────────────────
import PublicLayout      from "../components/layout/PublicLayout";
import DashboardLayout   from "../components/layout/DashboardLayout";
import SuperAdminLayout  from "../components/layout/SuperAdminLayout";

// ── Public pages ───────────────────────────────────────────────────────────
import HomePage         from "../pages/auth/HomePage";
import LoginPage        from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import SetPasswordPage from "../pages/auth/SetPasswordPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";

// ── Super Admin pages ──────────────────────────────────────────────────────
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import SchoolsList         from "../pages/superadmin/SchoolsList";
import SchoolDetail        from "../pages/superadmin/SchoolDetail";
import SchoolForm   from "../pages/superadmin/SchoolForm";
import {
  SubscriptionsPage,
  AnalyticsPage,
  SASettingsPage,
  AuditLogsPage,
} from "../pages/superadmin/SAPages";
import AdminsPage from "../pages/superadmin/AdminsPage";
import AdminForm from "../pages/superadmin/AdminForm";
import AdminDetail from "../pages/superadmin/AdminDetail"

// ── Admin pages ────────────────────────────────────────────────────────────
import AdminDashboard    from "../pages/admin/AdminDashboard";
import StudentsPage      from "../pages/admin/StudentsPage";
import TeachersPage      from "../pages/admin/TeachersPage";
import ExamsGradesPage   from "../pages/admin/ExamsGradesPage";
import FeesPage          from "../pages/admin/FeesPage";
import ReportsPage       from "../pages/admin/ReportsPage";
import TimetablePage     from "../pages/admin/TimetablePage";
import AttendancePage    from "../pages/admin/AttendancePage";
import SettingsPage      from "../pages/admin/SettingsPage";

// ── Student sub-pages (routed CRUD) ───────────────────────────────────────
import StudentList   from "../pages/admin/students/StudentList";
import StudentDetail from "../pages/admin/students/StudentDetail";
import StudentForm   from "../pages/admin/students/StudentForm";

// ── Teacher sub-pages (routed CRUD) ───────────────────────────────────────
import TeacherList   from "../pages/admin/teachers/TeacherList";

// ── Teacher pages ──────────────────────────────────────────────────────────
import TeacherDashboard  from "../pages/teacher/TeacherDashboard";
import TeacherClasses    from "../pages/teacher/TeacherClasses";
import TeacherAttendance from "../pages/teacher/TeacherAttendance";
import TeacherGrades     from "../pages/teacher/TeacherGrades";
import TeacherTimetable  from "../pages/teacher/TeacherTimetable";

// ── Student pages ──────────────────────────────────────────────────────────
import StudentDashboard  from "../pages/student/StudentDashboard";
import StudentGrades     from "../pages/student/StudentGrades";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentFees       from "../pages/student/StudentFees";
import StudentTimetable  from "../pages/student/StudentTimetable";

// ── Parent pages ───────────────────────────────────────────────────────────
import ParentDashboard  from "../pages/parent/ParentDashboard";
import ParentChildInfo  from "../pages/parent/ParentChildInfo";
import ParentFees       from "../pages/parent/ParentFees";
import ParentAttendance from "../pages/parent/ParentAttendance";


// ══════════════════════════════════════════════════════════════════════════
//  Guards
// ══════════════════════════════════════════════════════════════════════════

/**
 * ProtectedRoute
 * - Redirects to /login if not authenticated.
 * - Redirects to /unauthorized if role not in allowed list.
 */
function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
}

/** After login, send each role to their home dashboard */
function RoleRedirect() {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const map = {
    SUPER_ADMIN: "/superadmin/dashboard",
    SCHOOL_ADMIN: "/admin/dashboard",
    teacher:    "/teacher/dashboard",
    student:    "/student/dashboard",
    parent:     "/parent/dashboard",
  };
  return <Navigate to={map[role] || "/login"} replace />;
}

// ══════════════════════════════════════════════════════════════════════════
//  Route tree
// ══════════════════════════════════════════════════════════════════════════
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<SetPasswordPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/dashboard" element={<RoleRedirect />} />
      </Route>

      {/* ══════════════════════════════════════════════════════════════════
          SUPER ADMIN  —  /superadmin/*
          Purple sidebar, platform-wide scope, no schoolId required.
      ══════════════════════════════════════════════════════════════════ */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />

        {/* Schools management */}
        <Route path="schools" element={<SchoolsList />} />
        <Route path="schools/new" element={<SchoolForm />} />
        <Route path="schools/:id" element={<SchoolDetail />} />
        <Route path="schools/:id/edit" element={<SchoolDetail />} />

        {/* Other SA modules */}
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="admins/new" element={<AdminForm />} />
        <Route path="admins/:id" element={<AdminDetail />} />
        <Route path="admins/:id/edit" element={<AdminForm />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SASettingsPage />} />
        <Route path="audit" element={<AuditLogsPage />} />
      </Route>

      {/* ══════════════════════════════════════════════════════════════════
          ADMIN  —  /admin/*
          Blue sidebar, school-scoped.
      ══════════════════════════════════════════════════════════════════ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["SCHOOL_ADMIN", "SUPER_ADMIN"]}>
            {/* superadmin can shadow-view any school's admin panel */}
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Students — routed CRUD (list → detail → new/edit form) */}
        <Route path="students" element={<StudentList />} />
        <Route path="students/new" element={<StudentForm />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="students/:id/edit" element={<StudentForm />} />

        {/* Legacy CRUD modal page (kept for backwards compat) */}
        {/* <Route path="students/manage"   element={<StudentsPage />} /> */}

        {/* Teachers — routed CRUD */}
        {/* <Route path="teachers"          element={<TeacherList />} /> */}
        <Route path="teachers" element={<TeachersPage />} />
        {/* <Route path="teachers/manage"   element={<TeachersPage />} /> */}

        {/* Other admin modules */}
        <Route path="exams-grades" element={<ExamsGradesPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* ══════════════════════════════════════════════════════════════════
          TEACHER  —  /teacher/*
      ══════════════════════════════════════════════════════════════════ */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute roles="teacher">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="timetable" element={<TeacherTimetable />} />
      </Route>

      {/* ══════════════════════════════════════════════════════════════════
          STUDENT  —  /student/*
      ══════════════════════════════════════════════════════════════════ */}
      <Route
        path="/student"
        element={
          <ProtectedRoute roles="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="timetable" element={<StudentTimetable />} />
      </Route>

      {/* ══════════════════════════════════════════════════════════════════
          PARENT  —  /parent/*
      ══════════════════════════════════════════════════════════════════ */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute roles="parent">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="child" element={<ParentChildInfo />} />
        <Route path="fees" element={<ParentFees />} />
        <Route path="attendance" element={<ParentAttendance />} />
      </Route>

      {/* ── 404 fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}