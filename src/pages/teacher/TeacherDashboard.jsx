import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageHeader, Card, CardHeader, StatCard, Badge } from "../../components/common";

const TODAY_SCHEDULE = [
  { time: "8:00 am",  subject: "Mathematics", class: "9-A",  room: "R-101", students: 40 },
  { time: "9:30 am",  subject: "Mathematics", class: "10-B", room: "R-205", students: 38 },
  { time: "11:00 am", subject: "Mathematics", class: "8-A",  room: "R-101", students: 42 },
  { time: "2:00 pm",  subject: "Mathematics", class: "9-B",  room: "R-101", students: 39 },
];

const RECENT_RESULTS = [
  { class: "9-A",  exam: "Unit Test 2", avg: 74, high: 96, low: 42, date: "18 Apr" },
  { class: "10-B", exam: "Mid-term",    avg: 68, high: 91, low: 35, date: "10 Apr" },
  { class: "8-A",  exam: "Unit Test 2", avg: 81, high: 98, low: 55, date: "5 Apr"  },
];

const MY_CLASSES = [
  { class: "9-A",  students: 40, attendance: 96, avgGrade: 74 },
  { class: "10-B", students: 38, attendance: 89, avgGrade: 68 },
  { class: "8-A",  students: 42, attendance: 92, avgGrade: 81 },
  { class: "9-B",  students: 39, attendance: 88, avgGrade: 71 },
];

const DOT_COLORS = ["#1B3F8B", "#3A6B4F", "#A0334A", "#B85C1A"];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Good morning, ${user?.name?.split(" ")[0] || "Teacher"} 👋`}
        subtitle={`${today} · Mathematics Department`}
        actions={
          <button onClick={() => navigate("/teacher/attendance")}
            className="text-sm font-medium bg-sage text-white px-4 py-2 rounded-xl hover:bg-sage/90 transition-all shadow-sm shadow-sage/20">
            Mark attendance →
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "My classes",     value: "4",    change: "This term",          colorClass: "bg-cobalt-light text-cobalt" },
          { label: "Total students", value: "159",  change: "Across all sections", colorClass: "bg-sage-light text-sage" },
          { label: "Avg. attendance",value: "91%",  change: "Past 30 days",        colorClass: "bg-amber-light text-amber" },
          { label: "Avg. grade",     value: "73.5", change: "Unit Test 2",         colorClass: "bg-rose-light text-rose" },
        ].map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's schedule */}
        <Card>
          <CardHeader title="Today's classes" action="Full timetable →" />
          <div className="space-y-3">
            {TODAY_SCHEDULE.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-parchment/60">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: DOT_COLORS[i] }}/>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink">{s.subject} — {s.class}</span>
                    <Badge variant="info">{s.room}</Badge>
                  </div>
                  <div className="text-xs text-ink/45 mt-0.5">{s.time} · {s.students} students</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* My classes */}
        <Card>
          <CardHeader title="My classes" action="View all →" />
          <div className="space-y-3">
            {MY_CLASSES.map((c, i) => (
              <div key={c.class} className="flex items-center gap-3 cursor-pointer hover:bg-parchment/60 p-2 rounded-xl transition-colors" onClick={() => navigate("/teacher/classes")}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: DOT_COLORS[i] }}>
                  {c.class}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">Class {c.class}</span>
                    <span className="text-xs text-ink/40">{c.students} students</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-parchment rounded-full overflow-hidden">
                      <div className="h-full bg-sage rounded-full" style={{ width: `${c.attendance}%` }}/>
                    </div>
                    <span className="text-[11px] text-ink/40">{c.attendance}% att.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent exam results */}
        <Card>
          <CardHeader title="Recent results" action="View all →" />
          <div className="space-y-0">
            {RECENT_RESULTS.map((r) => (
              <div key={r.class + r.exam} className="py-3 border-b border-ink/5 last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-ink">{r.class} — {r.exam}</span>
                  <span className="text-xs text-ink/40">{r.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full bg-cobalt rounded-full" style={{ width: `${r.avg}%` }}/>
                  </div>
                  <span className="text-xs font-semibold text-ink">{r.avg} avg</span>
                </div>
                <div className="flex gap-3 mt-1 text-[11px] text-ink/40">
                  <span>High: <span className="text-sage font-medium">{r.high}</span></span>
                  <span>Low: <span className="text-rose font-medium">{r.low}</span></span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="bg-sage rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-full pointer-events-none opacity-10" style={{ background: "radial-gradient(circle at right, white, transparent)" }}/>
        <h2 className="font-serif text-lg text-white mb-1">Quick actions</h2>
        <p className="text-sm text-white/50 mb-4">Your most-used tasks</p>
        <div className="flex flex-wrap gap-2">
          {[["Mark attendance", "/teacher/attendance"], ["Enter grades", "/teacher/grades"], ["My classes", "/teacher/classes"], ["View timetable", "/teacher/timetable"]].map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              className="text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-colors border border-white/10">
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}