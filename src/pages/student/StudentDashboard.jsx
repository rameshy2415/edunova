import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageHeader, Card, CardHeader, Badge } from "../../components/common";

const MY_GRADES = [
  { subject: "Mathematics",    marks: 78, max: 100, grade: "B+", teacher: "Mr. Kapoor" },
  { subject: "English",        marks: 88, max: 100, grade: "A",  teacher: "Ms. D'Souza" },
  { subject: "Science",        marks: 72, max: 100, grade: "B+", teacher: "Dr. Rao" },
  { subject: "Social Studies", marks: 81, max: 100, grade: "A",  teacher: "Ms. Iyer" },
  { subject: "Hindi",          marks: 91, max: 100, grade: "A+", teacher: "Mr. Menon" },
];

const GRADE_COLOR = { "A+": "text-sage", "A": "text-cobalt", "B+": "text-amber", "B": "text-amber", "C": "text-rose", "F": "text-rose" };

const TIMETABLE_TODAY = [
  { time: "8:00 am",  subject: "Mathematics",   teacher: "Mr. Kapoor",  room: "R-101" },
  { time: "9:30 am",  subject: "English",        teacher: "Ms. D'Souza", room: "R-204" },
  { time: "11:00 am", subject: "Science Lab",    teacher: "Dr. Rao",     room: "Lab-2" },
  { time: "2:00 pm",  subject: "Social Studies", teacher: "Ms. Iyer",    room: "R-302" },
];

const NOTICES = [
  { title: "Unit Test 3 scheduled",  date: "28 Apr", type: "exam" },
  { title: "Sports day registration", date: "25 Apr", type: "event" },
  { title: "Fee due reminder",        date: "30 Apr", type: "fee" },
];

const NOTICE_BADGE = { exam: "danger", event: "info", fee: "warning" };

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const avgMarks = Math.round(MY_GRADES.reduce((s, g) => s + g.marks, 0) / MY_GRADES.length);

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] || "Student"} 🎓`}
        subtitle={`${today} · Class 9-A · Roll No. 21`}
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Attendance",    value: "96%",  sub: "This month",     color: "bg-sage-light text-sage" },
          { label: "Average marks", value: avgMarks + "%", sub: "Unit Test 2", color: "bg-cobalt-light text-cobalt" },
          { label: "Rank in class", value: "#7",   sub: "Out of 40",      color: "bg-amber-light text-amber" },
          { label: "Fee status",    value: "Paid", sub: "All clear ✓",    color: "bg-rose-light text-rose" },
        ].map((m) => (
          <div key={m.label} className={`${m.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-2">{m.label}</div>
            <div className="font-serif text-2xl font-semibold mb-1">{m.value}</div>
            <div className="text-xs opacity-60">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grades */}
        <Card className="lg:col-span-2">
          <CardHeader title="My grades — Unit Test 2" action="View all →" />
          <div className="space-y-3">
            {MY_GRADES.map((g) => (
              <div key={g.subject} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-ink">{g.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${GRADE_COLOR[g.grade] || "text-ink"}`}>{g.grade}</span>
                      <span className="text-xs text-ink/50">{g.marks}/{g.max}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${g.marks}%`, background: g.marks >= 80 ? "#3A6B4F" : g.marks >= 65 ? "#B85C1A" : "#A0334A" }}/>
                  </div>
                  <div className="text-[11px] text-ink/35 mt-0.5">{g.teacher}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          {/* Today's timetable */}
          <Card>
            <CardHeader title="Today's classes" action="Full →" />
            <div className="space-y-2.5">
              {TIMETABLE_TODAY.map((t, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-[11px] text-ink/35 min-w-[52px]">{t.time}</span>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ["#1B3F8B","#3A6B4F","#A0334A","#B85C1A"][i] }}/>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-ink">{t.subject}</div>
                    <div className="text-[10px] text-ink/40">{t.teacher} · {t.room}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notices */}
          <Card>
            <CardHeader title="Notices" />
            <div className="space-y-0">
              {NOTICES.map((n) => (
                <div key={n.title} className="flex items-center gap-3 py-2.5 border-b border-ink/5 last:border-0">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-ink">{n.title}</div>
                    <div className="text-[11px] text-ink/40 mt-0.5">{n.date}</div>
                  </div>
                  <Badge variant={NOTICE_BADGE[n.type]}>{n.type}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[["📝", "My grades", "/student/grades"],["✅","Attendance","/student/attendance"],["💳","My fees","/student/fees"],["🗓️","Timetable","/student/timetable"]].map(([icon, label, path]) => (
          <button key={label} onClick={() => navigate(path)}
            className="bg-white border border-ink/8 rounded-2xl p-4 text-center hover:border-cobalt/30 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-sm font-medium text-ink">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}