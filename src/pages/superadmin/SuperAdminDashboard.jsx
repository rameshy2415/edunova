import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, Badge, Button } from "../../components/common";

const STATS = [
  { label: "Total schools",    value: "48",     change: "+3 this month",    up: true  },
  { label: "Active schools",   value: "44",     change: "4 on trial",       up: true  },
  { label: "Total students",   value: "61,284", change: "+1,240 this term", up: true  },
  { label: "MRR",              value: "₹8.4L",  change: "+12% vs last month", up: true },
];

const RECENT_SCHOOLS = [
  { id: "1", name: "Delhi Public School",     city: "New Delhi",  plan: "Enterprise", students: 2840, status: "Active",  admin: "Rajesh Kumar",  joined: "12 Apr 2026" },
  { id: "2", name: "Sunrise Academy",          city: "Mumbai",     plan: "Pro",        students: 1284, status: "Active",  admin: "Priya Sharma",  joined: "8 Apr 2026"  },
  { id: "3", name: "Bhavans Group — Pune",    city: "Pune",       plan: "Enterprise", students: 3200, status: "Active",  admin: "Sunita Patel",  joined: "1 Apr 2026"  },
  { id: "4", name: "St. Xavier's High School",city: "Chennai",    plan: "Pro",        students: 980,  status: "Trial",   admin: "Fr. Anthony",   joined: "25 Mar 2026" },
  { id: "5", name: "Greenfield Academy",       city: "Bangalore",  plan: "Basic",      students: 620,  status: "Active",  admin: "Meena Nair",    joined: "20 Mar 2026" },
  { id: "6", name: "Rainbow Public School",   city: "Hyderabad",  plan: "Pro",        students: 1100, status: "Expired", admin: "Venkat Rao",    joined: "10 Jan 2026" },
];

const PLAN_V  = { Enterprise: "info", Pro: "success", Basic: "neutral" };
const STATUS_V = { Active: "success", Trial: "warning", Expired: "danger", Suspended: "neutral" };

const PLAN_COLOR = {
  Enterprise: "bg-purple-100 text-purple-700",
  Pro:        "bg-blue-100 text-blue-700",
  Basic:      "bg-gray-100 text-gray-600",
};

const REVENUE_MONTHS = [
  { m: "Nov", v: 620 }, { m: "Dec", v: 590 }, { m: "Jan", v: 710 },
  { m: "Feb", v: 740 }, { m: "Mar", v: 780 }, { m: "Apr", v: 840 },
];
const maxRev = Math.max(...REVENUE_MONTHS.map((r) => r.v));

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl" style={{ color: "#1e0a3c" }}>Super Admin Dashboard</h1>
          <p className="text-sm text-purple-400 mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · EduNova Platform
          </p>
        </div>
        <Button
          onClick={() => navigate("/superadmin/schools/new")}
          className="bg-purple-700 hover:bg-purple-800 text-white border-purple-700"
        >
          + Onboard new school
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border rounded-2xl p-4" style={{ borderColor: "#e8e4f5" }}>
            <div className="text-xs text-purple-400 mb-2">{s.label}</div>
            <div className="font-serif text-2xl font-semibold text-purple-900">{s.value}</div>
            <div className={`text-xs mt-1 font-medium ${s.up ? "text-green-500" : "text-red-400"}`}>
              {s.up ? "↑" : "↓"} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* School list */}
        <div className="lg:col-span-2 bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#e8e4f5" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#f0eef9" }}>
            <h3 className="font-serif text-base text-purple-900">Recent schools</h3>
            <Link to="/superadmin/schools" className="text-xs font-medium text-purple-500 hover:text-purple-700">
              View all →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#f8f7fd" }}>
            {RECENT_SCHOOLS.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-purple-50/40 transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-purple-600">
                  {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-purple-900 truncate">{s.name}</div>
                  <div className="text-xs text-purple-300 mt-0.5">{s.city} · {s.admin} · {s.students.toLocaleString("en-IN")} students</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_COLOR[s.plan]}`}>{s.plan}</span>
                <Badge variant={STATUS_V[s.status]}>{s.status}</Badge>
                <Link
                  to={`/superadmin/schools/${s.id}`}
                  className="text-xs text-purple-400 hover:text-purple-700 font-medium ml-1"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Revenue chart */}
          <div className="bg-white border rounded-2xl p-5" style={{ borderColor: "#e8e4f5" }}>
            <h3 className="font-serif text-base text-purple-900 mb-4">Monthly revenue</h3>
            <div className="flex items-end gap-2 h-28 mb-2">
              {REVENUE_MONTHS.map((r, i) => (
                <div key={r.m} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(r.v / maxRev) * 100}%`,
                      background: i === REVENUE_MONTHS.length - 1 ? "#7C3AED" : "#DDD6FE",
                    }}
                  />
                  <span className="text-[9px] text-purple-300">{r.m}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "#f0eef9" }}>
              <span className="text-xs text-purple-400">This month</span>
              <span className="text-sm font-bold text-purple-700">₹8,40,000</span>
            </div>
          </div>

          {/* Plan breakdown */}
          <div className="bg-white border rounded-2xl p-5" style={{ borderColor: "#e8e4f5" }}>
            <h3 className="font-serif text-base text-purple-900 mb-4">Plan distribution</h3>
            <div className="space-y-3">
              {[
                ["Enterprise", 12, "#7C3AED"],
                ["Pro",        26, "#6D28D9"],
                ["Basic",      10, "#DDD6FE"],
              ].map(([plan, count, color]) => (
                <div key={plan}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-purple-700">{plan}</span>
                    <span className="text-xs text-purple-400">{count} schools</span>
                  </div>
                  <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / 48) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-purple-700 rounded-2xl p-5">
            <h3 className="font-serif text-base text-white mb-3">Quick actions</h3>
            <div className="flex flex-col gap-2">
              {[
                ["+ Onboard school",    "/superadmin/schools/new"],
                ["Manage subscriptions","/superadmin/subscriptions"],
                ["View all admins",     "/superadmin/admins"],
                ["Analytics",          "/superadmin/analytics"],
              ].map(([label, path]) => (
                <Link
                  key={label}
                  to={path}
                  className="text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-colors border border-white/10 block"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}