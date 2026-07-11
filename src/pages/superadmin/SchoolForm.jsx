import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Alert } from "../../components/common";

import { superAdminApi } from "../../api/Superadminapi";

/* ─── Step definitions ───────────────────────────────────── */
const STEPS = [
  { id: 1, label: "School info", desc: "Basic school details" },
  { id: 2, label: "Subscription", desc: "Plan & billing" },
  { id: 3, label: "Admin account", desc: "Create admin login" },
  { id: 4, label: "Review", desc: "Confirm & submit" },
];

const PLANS = [
  {
    id: "trial",
    name: "Trial",
    price: "₹0",
    period: "/month",
    color: "border-gray-300",
    highlight: "bg-gray-100",
    badge: "bg-gray-200 text-gray-700",
    features: [
      "Up to 50 students",
      "Up to 5 teachers",
      "Attendance & fees",
      "Basic reports"
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: "₹4,999",
    period: "/month",
    color: "border-gray-200",
    highlight: "bg-gray-50",
    badge: "bg-gray-100 text-gray-600",
    features: [
      "Up to 500 students",
      "Up to 25 teachers",
      "Attendance & fees",
      "Basic reports",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹9,999",
    period: "/month",
    color: "border-purple-400",
    highlight: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    popular: true,
    features: [
      "Up to 2,000 students",
      "Unlimited teachers",
      "All modules",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    color: "border-indigo-400",
    highlight: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    features: [
      "Unlimited students",
      "Unlimited teachers",
      "All Pro features",
      "Multi-campus support",
      "Dedicated manager",
      "SLA guarantee",
      "API access",
    ],
  },
];

const BOARDS = ["CBSE","JAC", "ICSE", "IB", "State Board", "Other"];

const STATES = [
  "Delhi",
  "Maharashtra",
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Gujarat",
  "Telangana",
  "West Bengal",
  "Rajasthan",
  "Uttar Pradesh",
  "Other",
];

const EMPTY_SCHOOL = {
  name: "",
  board: "CBSE",
  address: "",
  city: "",
  state: "Maharashtra",
  pincode: "",
  phone: "",
  email: "",
  website: "",
  principalName: "",
  establishedYear: "",
  affiliationNo: "",
};

const EMPTY_SUB = {
  plan: "pro",
  billingCycle: "Annual",
  trialDays: "0",
  discountPct: "0",
  notes: "",
};

const EMPTY_ADMIN = {
  name: "",
  email: "",
  phone: "",
  sendWelcomeEmail: true,
};

/* ─── Step components ────────────────────────────────────── */
function StepSchoolInfo({ data, onChange, errors }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const inputCls = (f) =>
    `w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-purple-100 transition-all ${errors[f] ? "border-red-400" : "border-gray-200 focus:border-purple-400"}`;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4 pb-2 border-b border-purple-100">
          School details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              School name *
            </label>
            <input
              type="text"
              value={data.name}
              placeholder="Delhi Public School"
              onChange={(e) => set("name", e.target.value)}
              className={inputCls("name")}
            />
            {errors.name && (
              <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Board *
            </label>
            <select
              value={data.board}
              onChange={(e) => set("board", e.target.value)}
              className={inputCls("board")}
            >
              {BOARDS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Affiliation no.
            </label>
            <input
              type="text"
              value={data.affiliationNo}
              placeholder="1234567"
              onChange={(e) => set("affiliationNo", e.target.value)}
              className={inputCls("affiliationNo")}
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              City *
            </label>
            <input
              type="text"
              value={data.city}
              placeholder="Mumbai"
              onChange={(e) => set("city", e.target.value)}
              className={inputCls("city")}
            />
            {errors.city && (
              <p className="text-[11px] text-red-400 mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              State *
            </label>
            <select
              value={data.state}
              onChange={(e) => set("state", e.target.value)}
              className={inputCls("state")}
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Pincode
            </label>
            <input
              type="text"
              value={data.pincode}
              placeholder="400001"
              onChange={(e) => set("pincode", e.target.value)}
              className={inputCls("pincode")}
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Phone *
            </label>
            <input
              type="tel"
              value={data.phone}
              placeholder="+91 22 6100 0000"
              onChange={(e) => set("phone", e.target.value)}
              className={inputCls("phone")}
            />
            {errors.phone && (
              <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Official email *
            </label>
            <input
              type="email"
              value={data.email}
              placeholder="info@school.edu"
              onChange={(e) => set("email", e.target.value)}
              className={inputCls("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Website
            </label>
            <input
              type="text"
              value={data.website}
              placeholder="https://school.edu"
              onChange={(e) => set("website", e.target.value)}
              className={inputCls("website")}
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Principal name
            </label>
            <input
              type="text"
              value={data.principalName}
              placeholder="Dr. Rajesh Kumar"
              onChange={(e) => set("principalName", e.target.value)}
              className={inputCls("principalName")}
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Established year
            </label>
            <input
              type="number"
              value={data.establishedYear}
              placeholder="1985"
              onChange={(e) => set("establishedYear", e.target.value)}
              className={inputCls("establishedYear")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Full address
            </label>
            <textarea
              value={data.address}
              placeholder="123 Knowledge Park, Andheri East"
              rows={2}
              onChange={(e) => set("address", e.target.value)}
              className={inputCls("address") + " resize-none"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSubscription({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4">
          Choose a plan *
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => set("plan", plan.id)}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                data.plan === plan.id
                  ? `${plan.color} ${plan.highlight}`
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-purple-600 text-white uppercase tracking-widest">
                  Most popular
                </span>
              )}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badge}`}
                >
                  {plan.name}
                </span>
                {data.plan === plan.id && (
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-5-5 1.41-1.41L10 13.17l7.59-7.59L19 7l-9 9z" />
                  </svg>
                )}
              </div>
              <div className="font-serif text-2xl font-semibold text-gray-800 mb-0.5">
                {plan.price}
              </div>
              <div className="text-xs text-gray-400 mb-4">
                {plan.period || "Contact sales"}
              </div>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <svg
                      className="w-3 h-3 text-purple-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M10 3L5 8.5 2 5.5 1 6.5l4 4 6-7z" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Billing cycle
          </label>
          <select
            value={data.billingCycle}
            onChange={(e) => set("billingCycle", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer"
          >
            {["Monthly", "Quarterly", "Annual"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Trial days
          </label>
          <input
            type="number"
            value={data.trialDays}
            min="0"
            max="90"
            onChange={(e) => set("trialDays", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            0 = no trial, paid immediately
          </p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Discount (%)
          </label>
          <input
            type="number"
            value={data.discountPct}
            min="0"
            max="100"
            onChange={(e) => set("discountPct", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Internal notes
          </label>
          <textarea
            value={data.notes}
            placeholder="e.g. referred by partner, special pricing agreed on call…"
            rows={2}
            onChange={(e) => set("notes", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function StepAdminAccount({ data, onChange, errors, schoolName }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const inputCls = (f) =>
    `w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-purple-100 transition-all ${errors[f] ? "border-red-400" : "border-gray-200 focus:border-purple-400"}`;

  const suggestEmail = () => {
    if (schoolName && !data.email) {
      const slug = schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 12);
      set("email", `admin@${slug}.edu`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
        <svg
          className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-sm text-purple-700">
          This will create an <strong>Admin</strong> login for{" "}
          <strong>{schoolName || "the school"}</strong>. The admin will receive
          a welcome email with their credentials and can manage all school
          operations.
        </p>
      </div>

      <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4 pb-2 border-b border-purple-100">
        Admin account details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Admin full name *
          </label>
          <input
            type="text"
            value={data.name}
            placeholder="Rajesh Kumar"
            onChange={(e) => set("name", e.target.value)}
            className={inputCls("name")}
          />
          {errors.name && (
            <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Admin email *
          </label>
          <input
            type="email"
            value={data.email}
            placeholder="admin@school.edu"
            onFocus={suggestEmail}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls("email")}
          />
          {errors.email && (
            <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Admin phone *
          </label>
          <input
            type="tel"
            value={data.phone}
            placeholder="+91 98765 43210"
            onChange={(e) => set("phone", e.target.value)}
            className={inputCls("phone")}
          />
          {errors.phone && (
            <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>
          )}
        </div>

{/*         <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Temporary password *
          </label>
          <input
            type="text"
            value={data.tempPassword}
            placeholder="min 8 characters"
            onChange={(e) => set("tempPassword", e.target.value)}
            className={inputCls("tempPassword")}
          />
          {errors.tempPassword && (
            <p className="text-[11px] text-red-400 mt-1">
              {errors.tempPassword}
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-1">
            Admin will be prompted to change on first login.
          </p>
        </div> */}

        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            Role
          </label>
          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed">
            Admin (school-level)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => set("sendWelcomeEmail", !data.sendWelcomeEmail)}
          className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${data.sendWelcomeEmail ? "bg-purple-600" : "bg-gray-200"}`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${data.sendWelcomeEmail ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`}
          />
        </button>
        <span className="text-sm text-gray-700">
          Send welcome email with login credentials to admin
        </span>
      </div>
    </div>
  );
}

function StepReview({ school, sub, admin }) {
  const plan = PLANS.find((p) => p.id === sub.plan);
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
        <svg
          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-green-700">
          Review all details below before onboarding. A school record,
          subscription, and admin account will all be created simultaneously.
        </p>
      </div>

      {[
        {
          title: "School information",
          rows: [
            ["School name", school.name],
            ["Board", school.board],
            ["Location", `${school.city}, ${school.state} ${school.pincode}`],
            ["Phone", school.phone],
            ["Email", school.email],
            ["Principal", school.principalName || "—"],
          ],
        },
        {
          title: "Subscription",
          rows: [
            ["Plan", plan?.name || sub.plan],
            ["Price", `${plan?.price || "Custom"}${plan?.period || ""}`],
            ["Billing cycle", sub.billingCycle],
            [
              "Trial days",
              sub.trialDays > 0
                ? `${sub.trialDays} days free trial`
                : "No trial — paid immediately",
            ],
            ["Discount", sub.discountPct > 0 ? `${sub.discountPct}%` : "None"],
          ],
        },
        {
          title: "Admin account",
          rows: [
            ["Name", admin.name],
            ["Email", admin.email],
            ["Phone", admin.phone],
            ["Role", "Admin (school-level)"],
            [
              "Welcome email",
              admin.sendWelcomeEmail ? "Will be sent ✓" : "Will not be sent",
            ],
          ],
        },
      ].map((section) => (
        <div
          key={section.title}
          className="bg-white border rounded-2xl overflow-hidden"
          style={{ borderColor: "#e8e4f5" }}
        >
          <div
            className="px-5 py-3 border-b font-serif text-sm text-purple-900"
            style={{ borderColor: "#f0eef9", background: "#faf9fe" }}
          >
            {section.title}
          </div>
          <div className="px-5 py-2">
            {section.rows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-2 border-b last:border-0"
                style={{ borderColor: "#f8f7fd" }}
              >
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-800">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function SchoolForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [school, setSchool] = useState(EMPTY_SCHOOL);
  const [sub, setSub] = useState(EMPTY_SUB);
  const [admin, setAdmin] = useState(EMPTY_ADMIN);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,setError]        = useState("");

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!school.name.trim()) e.name = "School name is required";
      if (!school.city.trim()) e.city = "City is required";
      if (!school.phone.trim()) e.phone = "Phone is required";
      if (!school.email.trim()) e.email = "Email is required";
    }
    if (step === 3) {
      if (!admin.name.trim()) e.name = "Admin name is required";
      if (!admin.email.trim()) e.email = "Admin email is required";
      if (!admin.phone.trim()) e.phone = "Admin phone is required";
     /*  if (admin.tempPassword.length < 8)
        e.tempPassword = "Password must be at least 8 characters"; */
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

/*   const handleSubmit = () => {
    setSaving(true);
    //Real call:
    setTimeout(() => { setSaving(false); setSuccess(true); }, 1200);
  }; */

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = await superAdminApi.onboardSchool({ school, subscription: sub, admin })
      setSuccess(true);
    } catch (err) {
      console.log(err)
      setError(err.message || "Failed while saving. Please try again.");
      setSuccess(false);
    } finally {
       setSaving(false);
    }
  };

  if (success)
    return (
      <div className="max-w-lg mx-auto pt-16 text-center space-y-5">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
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
        <h2 className="font-serif text-2xl" style={{ color: "#1e0a3c" }}>
          School onboarded!
        </h2>
        <p className="text-sm text-gray-500">
          <strong>{school.name}</strong> has been onboarded on the{" "}
          <strong>{PLANS.find((p) => p.id === sub.plan)?.name}</strong> plan. An
          admin account for <strong>{admin.name}</strong> has been created
          {admin.sendWelcomeEmail ? " and a welcome email has been sent." : "."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/superadmin/schools"
            className="text-sm font-medium px-5 py-2.5 rounded-xl border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
          >
            View all schools
          </Link>
          <button
            onClick={() => {
              setSuccess(false);
              setStep(1);
              setSchool(EMPTY_SCHOOL);
              setSub(EMPTY_SUB);
              setAdmin(EMPTY_ADMIN);
            }}
            className="text-sm font-medium px-5 py-2.5 rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-colors"
          >
            Onboard another
          </button>
        </div>
      </div>
    );

    // if(error)
    //   return(
     
    //         <div className="flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
    //           <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    //             <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    //           </svg>
    //           {error}
    //         </div>
         
    //   );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/superadmin/schools"
          className="text-purple-400 hover:text-purple-700 transition-colors"
        >
          Schools
        </Link>
        <span className="text-purple-200">/</span>
        <span className="font-medium" style={{ color: "#1e0a3c" }}>
          Onboard new school
        </span>
      </div>

      {error && (
            <div className="flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

      <div>
        <h1 className="font-serif text-2xl" style={{ color: "#1e0a3c" }}>
          Onboard new school
        </h1>
        <p className="text-sm text-purple-400 mt-0.5">
          Complete all 4 steps to set up the school, subscription, and admin
          account.
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <button
              onClick={() => step > s.id && setStep(s.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                step === s.id
                  ? "bg-purple-700 text-white"
                  : step > s.id
                    ? "text-purple-500 hover:bg-purple-50 cursor-pointer"
                    : "text-gray-300 cursor-default"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step > s.id
                    ? "bg-green-500 text-white"
                    : step === s.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s.id ? "✓" : s.id}
              </span>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-tight">
                  {s.label}
                </div>
                <div className="text-[10px] opacity-60">{s.desc}</div>
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-1"
                style={{ background: step > s.id ? "#8B5CF6" : "#e8e4f5" }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div
        className="bg-white border rounded-2xl p-6"
        style={{ borderColor: "#e8e4f5" }}
      >
        {step === 1 && (
          <StepSchoolInfo data={school} onChange={setSchool} errors={errors} />
        )}
        {step === 2 && <StepSubscription data={sub} onChange={setSub} />}
        {step === 3 && (
          <StepAdminAccount
            data={admin}
            onChange={setAdmin}
            errors={errors}
            schoolName={school.name}
          />
        )}
        {step === 4 && <StepReview school={school} sub={sub} admin={admin} />}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between pb-4">
        <Button
          variant="secondary"
          onClick={step === 1 ? () => navigate(-1) : handleBack}
        >
          {step === 1 ? "Cancel" : "← Back"}
        </Button>
        {step < 4 ? (
          <Button
            onClick={handleNext}
            className="bg-purple-700 hover:bg-purple-800 text-white border-purple-700"
          >
            Continue →
          </Button>
        ) : (
          <Button
            loading={saving}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
          >
            {saving ? "Onboarding…" : "✓ Confirm & onboard school"}
          </Button>
        )}
      </div>
    </div>
  );
}
