import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, Badge, Button, Table, Th, Td, EmptyState, PageHeader } from "../../components/common";

/* ═══════════════════════════════════════════════════════════
   SUBSCRIPTIONS PAGE
   ═══════════════════════════════════════════════════════════ */
const SUB_DATA = [
  { id:"1", school:"Delhi Public School",    plan:"Enterprise", billing:"Annual",    amount:"Custom",   status:"Active",  nextBilling:"11 Apr 2027", students:2840 },
  { id:"2", school:"Sunrise Academy",         plan:"Pro",        billing:"Annual",    amount:"₹9,999",   status:"Active",  nextBilling:"7 Apr 2027",  students:1284 },
  { id:"3", school:"Bhavans Group — Pune",   plan:"Enterprise", billing:"Annual",    amount:"Custom",   status:"Active",  nextBilling:"31 Mar 2027", students:3200 },
  { id:"4", school:"St. Xavier's High School",plan:"Pro",       billing:"Monthly",   amount:"₹9,999",   status:"Trial",   nextBilling:"24 Apr 2026", students:980  },
  { id:"5", school:"Greenfield Academy",      plan:"Basic",      billing:"Annual",    amount:"₹4,999",   status:"Active",  nextBilling:"19 Mar 2027", students:620  },
  { id:"6", school:"Rainbow Public School",  plan:"Pro",        billing:"Annual",    amount:"₹9,999",   status:"Expired", nextBilling:"9 Jan 2026",  students:1100 },
  { id:"7", school:"Holy Cross Convent",      plan:"Basic",      billing:"Monthly",   amount:"₹4,999",   status:"Active",  nextBilling:"4 Feb 2027",  students:540  },
  { id:"8", school:"Modern High School",      plan:"Pro",        billing:"Quarterly", amount:"₹9,999",   status:"Active",  nextBilling:"13 May 2026", students:1450 },
];

const PLAN_COLOR   = { Enterprise:"bg-purple-100 text-purple-700", Pro:"bg-blue-100 text-blue-700", Basic:"bg-gray-100 text-gray-600" };
const STATUS_V     = { Active:"success", Trial:"warning", Expired:"danger", Suspended:"neutral" };

export function SubscriptionsPage() {
  const [planF,   setPlanF]   = useState("All");
  const [statusF, setStatusF] = useState("All");

  const filtered = SUB_DATA.filter(
    (s) => (planF === "All" || s.plan === planF) && (statusF === "All" || s.status === statusF)
  );

  const mrr = SUB_DATA.filter((s) => s.status === "Active").reduce((acc, s) => {
    const amt = s.plan === "Enterprise" ? 50000 : s.plan === "Pro" ? 9999 : 4999;
    return acc + (s.billing === "Annual" ? Math.round(amt / 12) : amt);
  }, 0);

  return (
    <div className="space-y-5">
      <PageHeader title="Subscriptions" subtitle="Manage all school plans and billing" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total active",  value: SUB_DATA.filter((s) => s.status === "Active").length,  bg: "bg-purple-50",  text: "text-purple-700" },
          { label: "On trial",      value: SUB_DATA.filter((s) => s.status === "Trial").length,   bg: "bg-yellow-50",  text: "text-yellow-700" },
          { label: "Expired",       value: SUB_DATA.filter((s) => s.status === "Expired").length, bg: "bg-red-50",     text: "text-red-700"    },
          { label: "Est. MRR",      value: "₹" + Math.round(mrr / 1000) + "K",                   bg: "bg-green-50",   text: "text-green-700"  },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-white rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className={`font-serif text-2xl font-semibold ${s.text}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#e8e4f5" }}>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b" style={{ borderColor: "#f0eef9" }}>
          <h3 className="font-serif text-base mr-auto" style={{ color: "#1e0a3c" }}>All subscriptions</h3>
          {[["All","Enterprise","Pro","Basic"], ["All","Active","Trial","Expired","Suspended"]].map((opts, i) => (
            <select key={i} value={i === 0 ? planF : statusF} onChange={(e) => i === 0 ? setPlanF(e.target.value) : setStatusF(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none cursor-pointer border"
              style={{ background: "#F7F5FD", borderColor: "#e8e4f5", color: "#4C1D95" }}>
              {opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>

        <Table>
          <thead><tr><Th>School</Th><Th>Plan</Th><Th>Billing</Th><Th>Amount</Th><Th>Students</Th><Th>Next billing</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-purple-50/20 transition-colors">
                <Td><Link to={`/superadmin/schools/${s.id}`} className="font-medium text-sm hover:text-purple-700 transition-colors" style={{ color: "#1e0a3c" }}>{s.school}</Link></Td>
                <Td><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_COLOR[s.plan]}`}>{s.plan}</span></Td>
                <Td>{s.billing}</Td>
                <Td className="font-medium" style={{ color: "#1e0a3c" }}>{s.amount}</Td>
                <Td>{s.students.toLocaleString("en-IN")}</Td>
                <Td className={s.status === "Expired" ? "text-red-500 font-medium" : "text-gray-500"}>{s.nextBilling}</Td>
                <Td><Badge variant={STATUS_V[s.status]}>{s.status}</Badge></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors">Edit</button>
                    {s.status === "Expired" && <button className="text-xs px-2.5 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">Renew</button>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMINS PAGE
   ═══════════════════════════════════════════════════════════ */
const ADMINS = [
  { id:"1", name:"Rajesh Kumar",  email:"rajesh@dps.edu",    school:"Delhi Public School",      lastLogin:"Today 9:14 am",       status:"Active" },
  { id:"2", name:"Priya Sharma",  email:"priya@sunrise.edu", school:"Sunrise Academy",           lastLogin:"Yesterday 4:30 pm",   status:"Active" },
  { id:"3", name:"Sunita Patel",  email:"sunita@bhavans.edu",school:"Bhavans Group — Pune",     lastLogin:"2 days ago",          status:"Active" },
  { id:"4", name:"Fr. Anthony",   email:"admin@sxhs.edu",    school:"St. Xavier's High School", lastLogin:"4 days ago",          status:"Active" },
  { id:"5", name:"Meena Nair",    email:"meena@greenfield.edu",school:"Greenfield Academy",     lastLogin:"1 week ago",          status:"Active" },
  { id:"6", name:"Venkat Rao",    email:"venkat@rainbow.edu",school:"Rainbow Public School",    lastLogin:"3 months ago",        status:"Inactive" },
];

export function AdminsPage() {
  const [search, setSearch] = useState("");
  const filtered = ADMINS.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader title="School Admins" subtitle="All admin accounts across every onboarded school" />

      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#e8e4f5" }}>
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "#f0eef9" }}>
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 border" style={{ background: "#F7F5FD", borderColor: "#e8e4f5" }}>
            <svg className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}><circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/></svg>
            <input type="text" placeholder="Search admin or school…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-purple-200" style={{ color: "#4C1D95" }} />
          </div>
        </div>

        {filtered.length === 0 ? <EmptyState title="No admins found" /> : (
          <Table>
            <thead><tr><Th>Admin</Th><Th>School</Th><Th>Last login</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-purple-50/20 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {a.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "#1e0a3c" }}>{a.name}</div>
                        <div className="text-xs text-purple-300">{a.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><Link to={`/superadmin/schools/${a.id}`} className="text-sm hover:text-purple-700 transition-colors" style={{ color: "#4C1D95" }}>{a.school}</Link></Td>
                  <Td className="text-gray-500">{a.lastLogin}</Td>
                  <Td><Badge variant={a.status === "Active" ? "success" : "neutral"}>{a.status}</Badge></Td>
                  <Td>
                    <div className="flex gap-1.5">
                      <button className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors">Reset pwd</button>
                      <button className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors">Disable</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANALYTICS PAGE
   ═══════════════════════════════════════════════════════════ */
const MONTHS = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr"];
const SCHOOL_GROWTH = [38,40,41,43,44,46,48];
const STUDENT_K    = [54,56,57,59,60,61,61.3];
const REV_L        = [6.2,6.5,6.8,7.1,7.4,7.9,8.4];
const maxVal = (arr) => Math.max(...arr);

function MiniBarChart({ data, months, color, suffix = "" }) {
  const mx = maxVal(data);
  return (
    <div className="flex items-end gap-1.5 h-24 mt-2">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all" style={{ height: `${(v / mx) * 88}px`, background: i === data.length - 1 ? color : color + "55" }} />
          <span style={{ fontSize: 9, color: "#a78bfa" }}>{months[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Analytics" subtitle="Platform-wide growth and revenue metrics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total schools",   value: "48",     sub: "+3 this month",    color: "text-purple-700", bg: "bg-purple-50" },
          { label: "Total students",  value: "61.3K",  sub: "+1,240 this term", color: "text-blue-700",   bg: "bg-blue-50"   },
          { label: "Total teachers",  value: "2,890",  sub: "+140 this term",   color: "text-green-700",  bg: "bg-green-50"  },
          { label: "Platform MRR",    value: "₹8.4L",  sub: "+12% vs last mo.", color: "text-orange-700", bg: "bg-orange-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-white rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className={`font-serif text-2xl font-semibold ${s.color}`}>{s.value}</div>
            <div className="text-xs opacity-60 mt-1">↑ {s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { title: "Schools growth",   data: SCHOOL_GROWTH, color: "#7C3AED", suffix: "" },
          { title: "Students (000s)",  data: STUDENT_K,     color: "#2563EB", suffix: "K" },
          { title: "Revenue (lakhs)",  data: REV_L,         color: "#16A34A", suffix: "L" },
        ].map(({ title, data, color, suffix }) => (
          <div key={title} className="bg-white border rounded-2xl p-5" style={{ borderColor: "#e8e4f5" }}>
            <h3 className="font-serif text-base mb-1" style={{ color: "#1e0a3c" }}>{title}</h3>
            <div className="font-serif text-2xl font-semibold" style={{ color }}>
              {data[data.length - 1]}{suffix}
            </div>
            <MiniBarChart data={data} months={MONTHS} color={color} suffix={suffix} />
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-5" style={{ borderColor: "#e8e4f5" }}>
        <h3 className="font-serif text-base mb-4" style={{ color: "#1e0a3c" }}>Top schools by students</h3>
        <div className="space-y-3">
          {[
            ["Bhavans Group — Pune",    3200, "#7C3AED"],
            ["Delhi Public School",     2840, "#6D28D9"],
            ["Modern High School",      1450, "#5B21B6"],
            ["Sunrise Academy",         1284, "#4C1D95"],
            ["Rainbow Public School",   1100, "#3B0764"],
          ].map(([name, count, color]) => (
            <div key={name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: "#1e0a3c" }}>{name}</span>
                <span className="text-xs font-semibold text-purple-500">{count.toLocaleString("en-IN")}</span>
              </div>
              <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(count / 3200) * 100}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUPER ADMIN SETTINGS PAGE
   ═══════════════════════════════════════════════════════════ */
export function SASettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Super admin account and platform configuration" />

      {saved && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm border border-green-100">
          ✓ Settings saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="bg-white border rounded-2xl p-4" style={{ borderColor: "#e8e4f5" }}>
          <nav className="space-y-1">
            {["Profile", "Security", "Platform", "Notifications"].map((s) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s ? "text-white" : "text-purple-400 hover:bg-purple-50 hover:text-purple-700"}`}
                style={{ background: activeSection === s ? "#4C1D95" : "transparent" }}>
                {s}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 bg-white border rounded-2xl p-6" style={{ borderColor: "#e8e4f5" }}>
          {activeSection === "Profile" && (
            <div className="space-y-4">
              <h3 className="font-serif text-base mb-4" style={{ color: "#1e0a3c" }}>Super admin profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["Full name","Super Admin"],["Email","superadmin@edunova.app"],["Phone","+91 98000 00001"],["Role","Super Administrator"]].map(([label, val]) => (
                  <div key={label}>
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">{label}</label>
                    <input type="text" defaultValue={val} className={inputCls} disabled={label === "Role"} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === "Security" && (
            <div className="space-y-4">
              <h3 className="font-serif text-base mb-4" style={{ color: "#1e0a3c" }}>Security settings</h3>
              <div className="max-w-sm space-y-4">
                {[["Current password",""], ["New password",""], ["Confirm new password",""]].map(([label]) => (
                  <div key={label}>
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">{label}</label>
                    <input type="password" placeholder="••••••••" className={inputCls} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === "Platform" && (
            <div className="space-y-4">
              <h3 className="font-serif text-base mb-4" style={{ color: "#1e0a3c" }}>Platform configuration</h3>
              {[
                ["Default trial period (days)", "30"],
                ["Max students — Basic plan",   "500"],
                ["Max students — Pro plan",     "2000"],
                ["Support email",               "support@edunova.app"],
              ].map(([label, val]) => (
                <div key={label}>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input type="text" defaultValue={val} className={inputCls} />
                </div>
              ))}
            </div>
          )}
          {activeSection === "Notifications" && (
            <div>
              <h3 className="font-serif text-base mb-4" style={{ color: "#1e0a3c" }}>Notification preferences</h3>
              <div className="space-y-4">
                {[
                  ["New school onboarded",    "Notify when a new school is onboarded"],
                  ["Subscription expiry",     "Alert 7 days before a subscription expires"],
                  ["Payment received",        "Notify on every subscription payment"],
                  ["School suspended",        "Alert when a school account is suspended"],
                ].map(([label, desc]) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "#f0eef9" }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#1e0a3c" }}>{label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                    </div>
                    <button className="w-11 h-6 rounded-full bg-purple-600 relative flex-shrink-0">
                      <span className="absolute top-0.5 left-[calc(100%-1.375rem)] w-5 h-5 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="text-sm font-medium px-5 py-2.5 rounded-xl text-white transition-colors" style={{ background: "#4C1D95" }}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AUDIT LOGS PAGE
   ═══════════════════════════════════════════════════════════ */
const AUDIT = [
  { time:"Today 9:14 am",    actor:"Rajesh Kumar (Admin)",   action:"Login",                 school:"Delhi Public School",     type:"auth"   },
  { time:"Today 9:00 am",    actor:"Super Admin",            action:"School onboarded",       school:"Holy Cross Convent",       type:"system" },
  { time:"Yesterday 4:30 pm",actor:"Priya Sharma (Admin)",  action:"12 students added",      school:"Sunrise Academy",          type:"data"   },
  { time:"Yesterday 2:00 pm",actor:"Super Admin",            action:"Plan changed: Basic→Pro",school:"Greenfield Academy",       type:"billing"},
  { time:"2 days ago",       actor:"Super Admin",            action:"Admin password reset",   school:"Bhavans Group — Pune",    type:"system" },
  { time:"3 days ago",       actor:"Venkat Rao (Admin)",    action:"Login attempt failed",   school:"Rainbow Public School",   type:"auth"   },
  { time:"4 days ago",       actor:"Super Admin",            action:"Subscription renewed",   school:"Modern High School",       type:"billing"},
  { time:"1 week ago",       actor:"Fr. Anthony (Admin)",   action:"Login",                  school:"St. Xavier's High School", type:"auth"   },
];

const TYPE_COLOR_AUDIT = {
  auth:    "bg-blue-100 text-blue-600",
  data:    "bg-green-100 text-green-600",
  billing: "bg-purple-100 text-purple-700",
  system:  "bg-orange-100 text-orange-600",
};

export function AuditLogsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Audit Logs" subtitle="Platform-wide activity and change history" />
      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#e8e4f5" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#f0eef9" }}>
          <h3 className="font-serif text-base" style={{ color: "#1e0a3c" }}>Recent activity</h3>
          <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors">Export CSV</button>
        </div>
        <div className="divide-y" style={{ borderColor: "#f8f7fd" }}>
          {AUDIT.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-purple-50/20 transition-colors">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLOR_AUDIT[a.type]}`}>{a.type}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "#1e0a3c" }}>{a.action}</div>
                <div className="text-xs text-purple-300 mt-0.5">{a.actor} · {a.school}</div>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}