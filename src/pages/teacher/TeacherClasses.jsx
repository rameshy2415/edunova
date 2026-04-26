import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Card, CardHeader, Badge, Table, Th, Td } from "../../components/common";

const MY_CLASSES = [
  { id: "9-A",  label: "Class 9-A",  students: 40, subject: "Mathematics", room: "R-101", avgAttendance: 96, avgGrade: 74, schedule: "Mon, Wed, Fri – 8:00 am" },
  { id: "10-B", label: "Class 10-B", students: 38, subject: "Mathematics", room: "R-205", avgAttendance: 89, avgGrade: 68, schedule: "Mon, Thu – 9:30 am" },
  { id: "8-A",  label: "Class 8-A",  students: 42, subject: "Mathematics", room: "R-101", avgAttendance: 92, avgGrade: 81, schedule: "Tue, Fri – 11:00 am" },
  { id: "9-B",  label: "Class 9-B",  students: 39, subject: "Mathematics", room: "R-103", avgAttendance: 88, avgGrade: 71, schedule: "Wed, Sat – 2:00 pm" },
];

const STUDENTS_9A = [
  { roll: 1,  name: "Aryan Mehta",    attendance: 96, lastGrade: 78, status: "Active" },
  { roll: 2,  name: "Bhavna Singh",   attendance: 100, lastGrade: 91, status: "Active" },
  { roll: 3,  name: "Chirag Patel",   attendance: 88, lastGrade: 62, status: "Active" },
  { roll: 4,  name: "Deepika Rao",    attendance: 72, lastGrade: 45, status: "Low attendance" },
  { roll: 5,  name: "Eshan Kumar",    attendance: 94, lastGrade: 83, status: "Active" },
  { roll: 6,  name: "Farida Shaikh",  attendance: 98, lastGrade: 96, status: "Active" },
  { roll: 7,  name: "Gaurav Nair",    attendance: 90, lastGrade: 71, status: "Active" },
  { roll: 8,  name: "Harsha Iyer",    attendance: 100, lastGrade: 88, status: "Active" },
];

const CARD_COLORS = [
  "border-cobalt/20 bg-cobalt-light/30",
  "border-sage/20 bg-sage-light/30",
  "border-amber/20 bg-amber-light/30",
  "border-rose/20 bg-rose-light/30",
];
const DOT_COLORS = ["#1B3F8B", "#3A6B4F", "#B85C1A", "#A0334A"];

const STATUS_VARIANT = { "Active": "success", "Low attendance": "warning" };

export default function TeacherClasses() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("9-A");

  const cls = MY_CLASSES.find((c) => c.id === selected);
  const students = selected === "9-A" ? STUDENTS_9A : STUDENTS_9A.map((s) => ({
    ...s,
    attendance: Math.max(70, s.attendance + Math.floor(Math.random() * 10 - 5)),
    lastGrade: Math.max(35, s.lastGrade + Math.floor(Math.random() * 15 - 7)),
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Classes"
        subtitle="4 classes assigned · Mathematics Department"
      />

      {/* Class cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MY_CLASSES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`text-left p-4 rounded-2xl border-2 transition-all ${
              selected === c.id
                ? "border-cobalt bg-cobalt text-white shadow-lg shadow-cobalt/20"
                : `${CARD_COLORS[i]} hover:border-cobalt/40`
            }`}
          >
            <div className={`text-xs font-semibold mb-1 ${selected === c.id ? "text-white/60" : "text-ink/50"}`}>
              {c.subject}
            </div>
            <div className={`font-serif text-xl font-semibold mb-1 ${selected === c.id ? "text-white" : "text-ink"}`}>
              {c.label}
            </div>
            <div className={`text-xs ${selected === c.id ? "text-white/60" : "text-ink/40"}`}>
              {c.students} students · {c.room}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div>
                <div className={`text-sm font-bold ${selected === c.id ? "text-white" : "text-cobalt"}`}>{c.avgAttendance}%</div>
                <div className={`text-[10px] ${selected === c.id ? "text-white/50" : "text-ink/35"}`}>Attendance</div>
              </div>
              <div>
                <div className={`text-sm font-bold ${selected === c.id ? "text-white" : "text-sage"}`}>{c.avgGrade}</div>
                <div className={`text-[10px] ${selected === c.id ? "text-white/50" : "text-ink/35"}`}>Avg grade</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected class detail */}
      {cls && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Student roster */}
          <Card className="lg:col-span-2" padding={false}>
            <div className="flex items-center justify-between p-4 border-b border-ink/5">
              <div>
                <h3 className="font-serif text-base text-ink">{cls.label} — Student roster</h3>
                <p className="text-xs text-ink/40 mt-0.5">{cls.students} students · {cls.schedule}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/teacher/attendance")}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sage text-white hover:bg-sage/90 transition-colors"
                >
                  Mark attendance
                </button>
                <button
                  onClick={() => navigate("/teacher/grades")}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-ink/12 hover:bg-parchment transition-colors"
                >
                  Enter grades
                </button>
              </div>
            </div>
            <Table>
              <thead>
                <tr>
                  <Th>Roll</Th>
                  <Th>Student</Th>
                  <Th>Attendance</Th>
                  <Th>Last grade</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.roll} className="hover:bg-parchment/40 transition-colors">
                    <Td>
                      <span className="font-mono text-xs text-ink/40">{String(s.roll).padStart(2, "0")}</span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-ink">{s.name}</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-parchment rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.attendance}%`,
                              background: s.attendance >= 90 ? "#3A6B4F" : s.attendance >= 75 ? "#B85C1A" : "#A0334A",
                            }}
                          />
                        </div>
                        <span className="text-xs text-ink/60">{s.attendance}%</span>
                      </div>
                    </Td>
                    <Td>
                      <span
                        className={`text-sm font-semibold ${
                          s.lastGrade >= 80 ? "text-sage" : s.lastGrade >= 60 ? "text-amber" : "text-rose"
                        }`}
                      >
                        {s.lastGrade}/100
                      </span>
                    </Td>
                    <Td>
                      <Badge variant={STATUS_VARIANT[s.status] || "neutral"}>{s.status}</Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* Class stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader title="Class overview" />
              <div className="space-y-3">
                {[
                  ["Room",          cls.room],
                  ["Schedule",      cls.schedule],
                  ["Students",      cls.students],
                  ["Avg attendance",cls.avgAttendance + "%"],
                  ["Avg grade",     cls.avgGrade + " / 100"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-ink/5 last:border-0">
                    <span className="text-xs text-ink/45">{label}</span>
                    <span className="text-sm font-medium text-ink">{val}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Grade distribution" />
              {[
                ["A+ / A (80–100)", students.filter((s) => s.lastGrade >= 80).length, "bg-sage"],
                ["B  (60–79)",      students.filter((s) => s.lastGrade >= 60 && s.lastGrade < 80).length, "bg-cobalt"],
                ["C  (35–59)",      students.filter((s) => s.lastGrade >= 35 && s.lastGrade < 60).length, "bg-amber"],
                ["F  (< 35)",       students.filter((s) => s.lastGrade < 35).length, "bg-rose"],
              ].map(([label, count, color]) => (
                <div key={label} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <span className="text-xs text-ink/50 min-w-[100px]">{label}</span>
                  <div className="flex-1 h-2 bg-parchment rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / students.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-ink w-5 text-right">{count}</span>
                </div>
              ))}
            </Card>

            <Card>
              <CardHeader title="Quick actions" />
              <div className="space-y-2">
                {[
                  ["✅ Mark attendance", "/teacher/attendance"],
                  ["📝 Enter grades",    "/teacher/grades"],
                  ["🗓️ View timetable",  "/teacher/timetable"],
                ].map(([label, path]) => (
                  <button
                    key={label}
                    onClick={() => navigate(path)}
                    className="w-full text-left text-sm font-medium text-ink/70 hover:text-ink px-3 py-2 rounded-xl hover:bg-parchment transition-colors border border-ink/5"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}