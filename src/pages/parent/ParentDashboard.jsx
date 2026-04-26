import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageHeader, Card, CardHeader, Badge } from "../../components/common";

const CHILD = {
  name: "Aryan Mehta",
  class: "9-A",
  roll: 21,
  dob: "14 Aug 2010",
  bloodGroup: "B+",
  attendance: 96,
  avgGrade: 78,
  feeStatus: "Paid",
};

const ATTENDANCE_LAST_WEEK = [
  { day: "Mon", status: "P" }, { day: "Tue", status: "P" }, { day: "Wed", status: "A" },
  { day: "Thu", status: "P" }, { day: "Fri", status: "P" },
];

const RECENT_GRADES = [
  { subject: "Mathematics", test: "Unit Test 2", marks: 78, max: 100 },
  { subject: "English",     test: "Unit Test 2", marks: 88, max: 100 },
  { subject: "Science",     test: "Unit Test 2", marks: 72, max: 100 },
];

const UPCOMING = [
  { label: "Unit Test 3",       date: "28 Apr", type: "exam" },
  { label: "Q2 Tuition fee due", date: "30 Apr", type: "fee" },
  { label: "PTM scheduled",      date: "3 May",  type: "event" },
];

const STATUS_COLORS = { P: "bg-sage text-white", A: "bg-rose text-white" };

export default function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] || "Parent"} 👨‍👩‍👧`}
        subtitle={`${today} · Tracking ${CHILD.name}`}
      />

      {/* Child summary card */}
      <div className="bg-cobalt rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute right-4 top-4 w-32 h-32 bg-white/5 rounded-full"/>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-white font-serif text-xl font-semibold">
            {CHILD.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="font-serif text-xl text-white">{CHILD.name}</div>
            <div className="text-cobalt-light text-sm mt-0.5">Class {CHILD.class} · Roll #{CHILD.roll}</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-white/60">DOB: {CHILD.dob}</span>
              <span className="text-xs text-white/60">Blood: {CHILD.bloodGroup}</span>
            </div>
          </div>
          <div className="ml-auto hidden sm:flex gap-4">
            {[["Attendance", CHILD.attendance + "%"], ["Avg. Grade", CHILD.avgGrade + "%"], ["Fee", CHILD.feeStatus]].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="font-serif text-xl text-white">{val}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile stats */}
      <div className="grid grid-cols-3 gap-3 sm:hidden">
        {[["Attendance", CHILD.attendance + "%", "bg-sage-light text-sage"], ["Avg. grade", CHILD.avgGrade + "%", "bg-cobalt-light text-cobalt"], ["Fee status", CHILD.feeStatus, "bg-amber-light text-amber"]].map(([l, v, c]) => (
          <div key={l} className={`${c} rounded-xl p-3 text-center`}>
            <div className="font-serif text-lg font-semibold">{v}</div>
            <div className="text-[11px] opacity-60 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance + Grades */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Last week's attendance" />
            <div className="flex gap-2">
              {ATTENDANCE_LAST_WEEK.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${STATUS_COLORS[d.status]}`}>{d.status}</span>
                  <span className="text-[11px] text-ink/40">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-ink/60">
                Overall attendance: <span className="font-semibold text-sage">{CHILD.attendance}%</span>
              </div>
              <button onClick={() => navigate("/parent/attendance")} className="text-xs text-cobalt hover:underline">Full report →</button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent test scores" action="All grades →" />
            <div className="space-y-3">
              {RECENT_GRADES.map((g) => (
                <div key={g.subject}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-ink">{g.subject}</span>
                      <span className="text-xs text-ink/40 ml-2">{g.test}</span>
                    </div>
                    <span className="text-sm font-semibold text-ink">{g.marks}/{g.max}</span>
                  </div>
                  <div className="h-2 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${g.marks}%`, background: g.marks >= 80 ? "#3A6B4F" : g.marks >= 60 ? "#B85C1A" : "#A0334A" }}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card>
            <CardHeader title="Upcoming" />
            <div className="space-y-0">
              {UPCOMING.map((u) => (
                <div key={u.label} className="flex items-center gap-3 py-3 border-b border-ink/5 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{u.label}</div>
                    <div className="text-xs text-ink/40 mt-0.5">{u.date}</div>
                  </div>
                  <Badge variant={{ exam: "danger", fee: "warning", event: "info" }[u.type]}>{u.type}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Quick links" />
            <div className="grid grid-cols-2 gap-2">
              {[["📋", "Child info", "/parent/child"], ["✅", "Attendance", "/parent/attendance"], ["💳", "Pay fees", "/parent/fees"], ["📬", "Messages", "/parent/dashboard"]].map(([icon, label, path]) => (
                <button key={label} onClick={() => navigate(path)}
                  className="bg-parchment border border-ink/8 rounded-xl p-3 text-center hover:border-cobalt/30 transition-all">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-xs font-medium text-ink/70">{label}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}