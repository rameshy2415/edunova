# EduNova — School Management System

React 18 + React Router v6 + Tailwind CSS + Axios frontend for a multi-role school management platform.

---

## Folder Structure

```
edunova/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                        # Root — BrowserRouter + AuthProvider
│   ├── index.js                       # ReactDOM.createRoot
│   ├── index.css                      # Tailwind directives + Google Fonts
│   │
│   ├── api/                           # All Axios API calls
│   │   ├── axiosInstance.js           # Base URL, auth header, 401/403 interceptors
│   │   ├── authApi.js                 # login, logout, forgotPassword, me
│   │   ├── studentsApi.js             # CRUD + attendance + grades + fees
│   │   ├── teachersApi.js             # CRUD + schedule + classes
│   │   ├── feesApi.js                 # payments, summary, reminders, receipts
│   │   ├── reportsApi.js              # attendance, performance, finance, export
│   │   └── index.js                   # Barrel re-export
│   │
│   ├── context/
│   │   └── AuthContext.jsx            # useAuth() — user, role, token, login, logout
│   │
│   ├── hooks/
│   │   └── useApi.js                  # useApi(fn) + useMutation(fn)
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx              # All routes + ProtectedRoute + RoleRedirect
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── PublicLayout.jsx       # Navbar + Footer wrapper for public pages
│   │   │   └── DashboardLayout.jsx    # Role-aware sidebar + topbar shell
│   │   └── common/
│   │       └── index.jsx              # Button, Card, Badge, Spinner, Table, Alert …
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── HomePage.jsx           # Public landing page
│   │   │   ├── LoginPage.jsx          # Role selector + email/password form
│   │   │   └── UnauthorizedPage.jsx   # 403 screen
│   │   │
│   │   ├── admin/                     # Role: "admin"
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── TeachersPage.jsx
│   │   │   ├── FeesPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── TimetablePage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   ├── teacher/                   # Role: "teacher"
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── TeacherClasses.jsx
│   │   │   ├── TeacherAttendance.jsx
│   │   │   ├── TeacherGrades.jsx
│   │   │   └── TeacherTimetable.jsx
│   │   │
│   │   ├── student/                   # Role: "student"
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentGrades.jsx
│   │   │   ├── StudentAttendance.jsx
│   │   │   ├── StudentFees.jsx
│   │   │   └── StudentTimetable.jsx
│   │   │
│   │   └── parent/                    # Role: "parent"
│   │       ├── ParentDashboard.jsx
│   │       ├── ParentChildInfo.jsx
│   │       ├── ParentFees.jsx
│   │       └── ParentAttendance.jsx
│   │
│   └── utils/
│       └── index.js                   # formatDate, formatINR, initials, gradeFromMarks …
│
├── .env.example                       # Copy to .env and set REACT_APP_API_URL
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Quick Start

```bash
# 1. Clone and enter the directory
git clone <your-repo>
cd edunova

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env → set REACT_APP_API_URL=http://localhost:5000/api

# 4. Start dev server
npm start
```

---

## Routes

| Path                    | Role      | Component           |
|-------------------------|-----------|---------------------|
| `/`                     | Public    | HomePage            |
| `/login`                | Public    | LoginPage           |
| `/unauthorized`         | Public    | UnauthorizedPage    |
| `/admin/dashboard`      | admin     | AdminDashboard      |
| `/admin/students`       | admin     | StudentsPage        |
| `/admin/teachers`       | admin     | TeachersPage        |
| `/admin/fees`           | admin     | FeesPage            |
| `/admin/reports`        | admin     | ReportsPage         |
| `/admin/timetable`      | admin     | TimetablePage       |
| `/admin/attendance`     | admin     | AttendancePage      |
| `/admin/settings`       | admin     | SettingsPage        |
| `/teacher/dashboard`    | teacher   | TeacherDashboard    |
| `/teacher/classes`      | teacher   | TeacherClasses      |
| `/teacher/attendance`   | teacher   | TeacherAttendance   |
| `/teacher/grades`       | teacher   | TeacherGrades       |
| `/teacher/timetable`    | teacher   | TeacherTimetable    |
| `/student/dashboard`    | student   | StudentDashboard    |
| `/student/grades`       | student   | StudentGrades       |
| `/student/attendance`   | student   | StudentAttendance   |
| `/student/fees`         | student   | StudentFees         |
| `/student/timetable`    | student   | StudentTimetable    |
| `/parent/dashboard`     | parent    | ParentDashboard     |
| `/parent/child`         | parent    | ParentChildInfo     |
| `/parent/fees`          | parent    | ParentFees          |
| `/parent/attendance`    | parent    | ParentAttendance    |

---

## Authentication Flow

1. User picks role on `/login` (Admin / Teacher / Student / Parent)
2. `LoginPage` calls `login({ email, password, role })` from `useAuth()`
3. `AuthContext` → `authApi.login()` → backend returns `{ token, user: { id, name, email, role } }`
4. Token stored in `localStorage`, set as `Authorization: Bearer <token>` on every Axios request
5. `AppRoutes` → `ProtectedRoute` checks `isAuthenticated` + `role` before rendering any dashboard route
6. 401 from backend → `axiosInstance` interceptor clears storage and redirects to `/login`
7. 403 from backend → redirects to `/unauthorized`

---

## Adding a New API Call

```jsx
// src/pages/admin/StudentsPage.jsx
import { studentsApi } from "../../api";
import { useApi } from "../../hooks/useApi";

export default function StudentsPage() {
  const { data, loading, error, execute } = useApi(studentsApi.getAll, []);

  useEffect(() => {
    execute({ page: 1, limit: 20 });
  }, []);

  if (loading) return <FullPageSpinner />;
  if (error)   return <Alert variant="danger">{error}</Alert>;

  return (
    // render data.items ...
  );
}
```

## Mutation example (create / update / delete)

```jsx
import { useMutation } from "../../hooks/useApi";
import { studentsApi } from "../../api";

const { mutate, loading } = useMutation(studentsApi.create);

const handleSubmit = async (formData) => {
  const newStudent = await mutate(formData);
  // newStudent = response.data from backend
};
```

---

## Backend Contract (expected shape)

### POST /auth/login
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "u_123",
    "name": "Admin Principal",
    "email": "admin@edunova.app",
    "role": "admin",
    "avatar": null
  }
}
```

### GET /students
```json
{
  "items": [...],
  "total": 1284,
  "page": 1,
  "limit": 20
}
```
---

## GIT Command

```bash
# 1. create a new repository on the command line
echo "# edunova" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/rameshy2415/edunova.git
git push -u origin main

# 2. push an existing repository from the command line
git remote add origin https://github.com/rameshy2415/edunova.git
git branch -M main
git push -u origin main
```

---
