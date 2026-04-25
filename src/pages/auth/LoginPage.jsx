import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  { id: "admin",   label: "Admin",   icon: "🏫", desc: "School administration" },
  { id: "teacher", label: "Teacher", icon: "📚", desc: "Class & grade management" },
  { id: "student", label: "Student", icon: "🎓", desc: "My grades, attendance & fees" },
  { id: "parent",  label: "Parent",  icon: "👨‍👩‍👧", desc: "Track your child's progress" },
];

const ROLE_ACCENT = {
  admin:   "border-cobalt bg-cobalt-light",
  teacher: "border-sage bg-sage-light",
  student: "border-amber bg-amber-light",
  parent:  "border-rose bg-rose-light",
};

const DASHBOARD_MAP = {
  admin:   "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent:  "/parent/dashboard",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail]         = useState("admin@edunova.app");
  const [password, setPassword]   = useState("password");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Pre-fill demo credentials when role changes
  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setEmail(`${roleId}@edunova.app`);
    setPassword("password");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }

    setLoading(true);
    setError("");
    try {
      const user = await login({ email, password, role: selectedRole });
      navigate(DASHBOARD_MAP[user.role] || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-cobalt rounded-xl flex items-center justify-center">
            <span className="text-white font-serif text-base font-bold">E</span>
          </div>
          <span className="font-serif text-2xl text-ink">EduNova</span>
        </Link>

        <h1 className="font-serif text-3xl text-ink mb-1">Welcome back</h1>
        <p className="text-sm text-ink/50 mb-7">Select your role and sign in to continue.</p>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRoleSelect(r.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                selectedRole === r.id
                  ? `${ROLE_ACCENT[r.id]} border-opacity-100`
                  : "border-ink/8 bg-white hover:border-ink/20"
              }`}
            >
              <span className="text-xl leading-none">{r.icon}</span>
              <div>
                <div className="text-sm font-semibold text-ink">{r.label}</div>
                <div className="text-[11px] text-ink/45 leading-tight">{r.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wide block mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-sm text-ink focus:border-cobalt focus:ring-2 focus:ring-cobalt/10 transition-all outline-none"
              placeholder="you@school.edu"
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wide">
                Password
              </label>
              <a href="#" className="text-xs text-cobalt hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-sm text-ink focus:border-cobalt focus:ring-2 focus:ring-cobalt/10 transition-all outline-none pr-11"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cobalt text-white font-medium py-3.5 rounded-xl hover:bg-cobalt/90 transition-all shadow-lg shadow-cobalt/20 flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Signing in…
              </>
            ) : (
              `Sign in as ${ROLES.find((r) => r.id === selectedRole)?.label} →`
            )}
          </button>
        </form>

        <p className="text-xs text-ink/35 text-center mt-5">
          Pre-filled demo credentials per role. Click Sign in to proceed.
        </p>
      </div>
    </div>
  );
}
