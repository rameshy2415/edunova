/**
 * src/components/common/index.jsx
 * ─────────────────────────────────────────────────────────────
 * Barrel of shared UI primitives used across all role dashboards.
 * Import: import { Button, Card, Badge, Spinner, PageHeader } from "../components/common";
 */
import React from "react";

/* ── Button ─────────────────────────────────────────────── */
const VARIANTS = {
  primary:   "bg-cobalt text-white hover:bg-cobalt/90 shadow-sm shadow-cobalt/20",
  secondary: "bg-parchment border border-ink/12 text-ink hover:bg-ink/5",
  danger:    "bg-rose text-white hover:bg-rose/90",
  ghost:     "text-ink/60 hover:bg-ink/5 hover:text-ink",
};

export function Button({ children, variant = "primary", size = "md", className = "", loading = false, icon, ...props }) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base" };
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      )}
      {!loading && icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

/* ── Card ────────────────────────────────────────────────── */
export function Card({ children, className = "", padding = true }) {
  return (
    <div className={`bg-white border border-ink/8 rounded-2xl ${padding ? "p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-serif text-base text-ink">{title}</h3>
      {action && <span className="text-xs text-cobalt cursor-pointer hover:underline font-medium">{action}</span>}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────── */
const BADGE_VARIANTS = {
  success: "bg-sage-light text-sage",
  warning: "bg-amber-light text-amber",
  danger:  "bg-rose-light text-rose",
  info:    "bg-cobalt-light text-cobalt",
  neutral: "bg-ink/8 text-ink/60",
};

export function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full ${BADGE_VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}

/* ── Spinner ─────────────────────────────────────────────── */
export function Spinner({ size = "md", className = "" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <svg className={`animate-spin text-cobalt ${sizes[size]} ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <Spinner size="lg" />
    </div>
  );
}

/* ── PageHeader ──────────────────────────────────────────── */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="font-serif text-2xl text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-ink/45 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── StatCard ────────────────────────────────────────────── */
export function StatCard({ label, value, change, up, colorClass }) {
  return (
    <div className={`rounded-2xl p-4 ${colorClass}`}>
      <div className="text-xs opacity-60 mb-2">{label}</div>
      <div className="font-serif text-2xl font-semibold mb-1">{value}</div>
      {change && (
        <div className="text-xs font-medium opacity-70">
          {up ? "↑" : "↓"} {change}
        </div>
      )}
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
export function EmptyState({ title = "No data", message = "Nothing here yet.", icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-ink/20 mb-3">{icon}</div>}
      <p className="font-serif text-lg text-ink/40">{title}</p>
      <p className="text-sm text-ink/30 mt-1">{message}</p>
    </div>
  );
}

/* ── Table helpers ───────────────────────────────────────── */
export function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }) {
  return (
    <th className={`text-left text-xs font-semibold text-ink/40 uppercase tracking-wide px-4 py-3 border-b border-ink/8 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return (
    <td className={`px-4 py-3 text-ink border-b border-ink/5 ${className}`}>
      {children}
    </td>
  );
}

/* ── Alert ───────────────────────────────────────────────── */
export function Alert({ children, variant = "info", className = "" }) {
  const styles = {
    info:    "bg-cobalt-light text-cobalt border-cobalt/20",
    success: "bg-sage-light text-sage border-sage/20",
    warning: "bg-amber-light text-amber border-amber/20",
    danger:  "bg-rose-light text-rose border-rose/20",
  };
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}
