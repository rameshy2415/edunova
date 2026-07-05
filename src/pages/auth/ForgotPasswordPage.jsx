import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/authApi";


export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("superadmin@edunova.app");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess]      = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please fill email field.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authApi.forgotPassword(email);
      console.log('Response', response)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Invalid email. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-lg">
        {/* Success render */}
        {success && (
          <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl mb-5 text-sm text-purple-700">
            <div className="w-full max-w-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl text-ink mb-2">
                Password reset email sent!
              </h1>
              <p className="text-sm text-ink/55 mb-3">
                 Please check email box: <span className="text-sm text-cobalt mb-3">{email}</span>
              </p>
              <div className="flex justify-center">
                <svg
                  className="w-5 h-5 text-cobalt animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Super admin notice */}
        <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl mb-5 text-sm text-purple-700">
          <span className="text-lg">🔐</span>
          <span>
            Please enter your register email id
          </span>
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
              placeholder="you@edunova.app"
              autoComplete="email"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-medium py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 text-sm bg-cobalt text-white hover:bg-cobalt/90 shadow-cobalt/20 `}
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Signing in…
              </>
            ) : (
              `Send Reset Link →`
            )}
          </button>
        </form>

        <p className="text-xs text-ink/35 text-center mt-5">
          <div className="mt-6 text-sm text-center text-gray-500">
            Remember your password?
            <Link
              to="/login"
              className="text-xs ml-1 font-semibold text-cobalt hover:underline"
            >
              Sign in
            </Link>
          </div>
        </p>
      </div>
    </div>
  );
}
