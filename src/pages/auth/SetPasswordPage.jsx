import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";

/* ─── Password strength checker ──────────────────────────────── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: "Weak",   color: "#EF4444", width: "20%"  };
  if (score <= 2) return { level: "Fair",   color: "#F59E0B", width: "45%"  };
  if (score <= 3) return { level: "Good",   color: "#3B82F6", width: "65%"  };
  if (score <= 4) return { level: "Strong", color: "#10B981", width: "85%"  };
  return               { level: "Very strong", color: "#059669", width: "100%" };
}

/* ─── Countdown timer component ──────────────────────────────── */
function TokenCountdown({ expiresAt }) {
  const [remaining, setRemaining] = useState("");
  const [isUrgent,  setIsUrgent]  = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt) - Date.now();
      if (diff <= 0) { setRemaining("Expired"); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}m ${String(s).padStart(2, "0")}s`);
      setIsUrgent(diff < 5 * 60 * 1000); // under 5 min → red
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div
      className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border ${
        isUrgent
          ? "bg-red-50 text-red-600 border-red-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      Link expires in: <strong>{remaining}</strong>
    </div>
  );
}

/* ─── Eye toggle ───────────────────────────────────────────────── */
function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const token = searchParams.get("token") || "";

  // Token validation state
  const [tokenInfo,    setTokenInfo]    = useState(null);   // { email, schoolName, isFirstTime, expiresAt }
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError,   setTokenError]   = useState("");

  // Form state
  const [newPassword,  setNewPassword]  = useState("");
  const [confirmPwd,   setConfirmPwd]   = useState("");
  const [showNew,      setShowNew]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  // Submit state
  const [submitting,   setSubmitting]   = useState(false);
  const [formError,    setFormError]    = useState("");
  const [success,      setSuccess]      = useState(false);

  const strength = getStrength(newPassword);

  // ── Validate token on mount ──────────────────────────────────
  const validateToken = useCallback(async () => {
    if (!token) {
      setTokenError("No token found in this link. Please use the link from your email.");
      setTokenLoading(false);
      return;
    }
    try {
      const { data } = await authApi.validateToken(token);
      console.log('Validate Response', data)
      setTokenInfo(data.user);
    } catch (err) {
      const code    = err?.response?.data?.code;
      const message = err?.response?.data?.message;
      if (code === "TOKEN_EXPIRED") {
        setTokenError(
          "This link has expired (2-hour limit). "
          + "Please ask your administrator to resend the welcome email."
        );
      } else {
        setTokenError(
          message ||
          "This link is invalid or has already been used. "
          + "Please request a new one."
        );
      }
    } finally {
      setTokenLoading(false);
    }
  }, [token]);

  useEffect(() => { validateToken(); }, [validateToken]);

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPwd) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await authApi.setPassword({
        token,
        newPassword,
        confirmPassword: confirmPwd,
      });

      // Backend auto-logs in — store tokens via AuthContext
      // AuthContext.login() expects { token, user } but our setPassword returns
      // the same AuthResponse shape. We call a manual store here:
      localStorage.setItem("edunova_token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("edunova_user", JSON.stringify(data.user));

      setSuccess(true);

      // Redirect to appropriate dashboard after 2 seconds
      const dashMap = {
        SUPER_ADMIN: "/superadmin/dashboard",
        SCHOOL_ADMIN: "/admin/dashboard",
        TEACHER:    "/teacher/dashboard",
        STUDENT:    "/student/dashboard",
        PARENT:     "/parent/dashboard",
      };
      setTimeout(() => {
        navigate(dashMap[data.user.role] || "/dashboard", { replace: true });
      }, 2000);

    } catch (err) {
      const code    = err?.response?.data?.code;
      const message = err?.response?.data?.message;
      if (code === "TOKEN_EXPIRED") {
        setTokenError(
          "This link expired while you were filling in the form. "
          + "Please request a new link."
        );
      } else {
        setFormError(message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  RENDER: loading
  // ─────────────────────────────────────────────────────────────
  if (tokenLoading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 text-cobalt animate-spin mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-sm text-ink/50 font-sans">Verifying your link…</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  //  RENDER: token error
  // ─────────────────────────────────────────────────────────────
  if (tokenError) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-ink mb-3">Link invalid or expired</h1>
          <p className="text-sm text-ink/55 leading-relaxed mb-6">{tokenError}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="text-sm font-medium px-6 py-3 rounded-xl border border-ink/12 text-ink hover:bg-ink/5 transition-colors"
            >
              Back to login
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium px-6 py-3 rounded-xl bg-cobalt text-white hover:bg-cobalt/90 transition-colors"
            >
              Contact administrator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  //  RENDER: success
  // ─────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-ink mb-2">Password set!</h1>
          <p className="text-sm text-ink/55 mb-3">
            {tokenInfo?.isFirstTime
              ? "Your account is ready. Redirecting to your dashboard…"
              : "Password updated successfully. Redirecting…"}
          </p>
          <div className="flex justify-center">
            <svg className="w-5 h-5 text-cobalt animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  //  RENDER: set password form
  // ─────────────────────────────────────────────────────────────
  const isFirstTime = tokenInfo?.isFirstTime ?? true;
  const inputCls    = (err) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-cobalt/10 transition-all pr-11 ${
      err ? "border-red-400" : "border-ink/12 focus:border-cobalt"
    }`;

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-cobalt rounded-xl flex items-center justify-center">
            <span className="text-white font-serif text-base font-bold">E</span>
          </div>
          <span className="font-serif text-2xl text-ink">EduNova</span>
        </Link>

        {/* Header */}
        <div className="mb-7">
          <h1 className="font-serif text-3xl text-ink mb-1">
            {isFirstTime ? "Set up your account" : "Reset your password"}
          </h1>
          <p className="text-sm text-ink/50">
            {isFirstTime
              ? `Welcome to EduNova${tokenInfo?.schoolName ? " — " + tokenInfo.schoolName : ""}. Choose a strong password to get started.`
              : "Enter and confirm your new password below."}
          </p>
        </div>

        {/* Token expiry countdown */}
        {tokenInfo?.expiresAt && (
          <div className="mb-5">
            <TokenCountdown expiresAt={tokenInfo.expiresAt} />
          </div>
        )}

        {/* Account info card (first-time only) */}
        {isFirstTime && tokenInfo?.email && (
          <div className="mb-5 p-4 rounded-xl bg-cobalt-light border border-cobalt/15">
            <p className="text-xs font-semibold text-cobalt uppercase tracking-wide mb-2">
              Your account
            </p>
            <div className="flex items-center gap-2 text-sm text-cobalt">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span className="font-medium">{tokenInfo.email}</span>
            </div>
            {tokenInfo.schoolName && (
              <div className="flex items-center gap-2 text-sm text-cobalt mt-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M3 21V9l9-6 9 6v12"/><path d="M9 21V12h6v9"/>
                </svg>
                <span>{tokenInfo.schoolName}</span>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* New password */}
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wide block mb-1.5">
              {isFirstTime ? "Create password" : "New password"}
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setFormError(""); }}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className={inputCls(false)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
              >
                <EyeIcon open={showNew} />
              </button>
            </div>

            {/* Strength meter */}
            {newPassword.length > 0 && (
              <div className="mt-2">
                <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-ink/40">
                    Use uppercase, numbers &amp; symbols
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: strength.color }}>
                    {strength.level}
                  </span>
                </div>
              </div>
            )}

            {/* Requirements */}
            {newPassword.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {[
                  ["At least 8 characters",      newPassword.length >= 8],
                  ["One uppercase letter (A-Z)",  /[A-Z]/.test(newPassword)],
                  ["One number (0-9)",             /[0-9]/.test(newPassword)],
                  ["One special character",        /[^A-Za-z0-9]/.test(newPassword)],
                ].map(([label, met]) => (
                  <li key={label} className={`flex items-center gap-1.5 text-[11px] ${met ? "text-green-600" : "text-ink/35"}`}>
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={met ? 2 : 1.5}>
                      {met
                        ? <path d="M2 6l3 3 5-5"/>
                        : <circle cx="6" cy="6" r="4"/>}
                    </svg>
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wide block mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => { setConfirmPwd(e.target.value); setFormError(""); }}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={inputCls(formError === "Passwords do not match.")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>

            {/* Match indicator */}
            {confirmPwd.length > 0 && (
              <p className={`text-[11px] mt-1 flex items-center gap-1 ${
                newPassword === confirmPwd ? "text-green-600" : "text-red-400"
              }`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                  {newPassword === confirmPwd
                    ? <path d="M2 6l3 3 5-5"/>
                    : <><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></>}
                </svg>
                {newPassword === confirmPwd ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Form error */}
          {formError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-4 py-3 rounded-xl border border-red-200">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {formError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || newPassword.length < 8 || newPassword !== confirmPwd}
            className="w-full bg-cobalt text-white font-medium py-3.5 rounded-xl hover:bg-cobalt/90 transition-all shadow-lg shadow-cobalt/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Setting password…
              </>
            ) : (
              isFirstTime
                ? "Set password & go to dashboard →"
                : "Reset password & login →"
            )}
          </button>

        </form>

        {/* Back to login */}
        <p className="text-center text-xs text-ink/35 mt-6">
          Already have your password?{" "}
          <Link to="/login" className="text-cobalt hover:underline font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}