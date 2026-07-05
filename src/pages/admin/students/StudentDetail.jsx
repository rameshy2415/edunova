import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  PageHeader,
  Card,
  CardHeader,
  Badge,
  Button,
  Spinner,
} from "../../../components/common";
import { STUDENTS, FEE_VARIANT, STATUS_VARIANT } from "./data";
import { studentsApi } from "../../../api/studentsApi";
import { formatDate } from "../../../utils/index";

const TABS = ["Overview", "Academic", "Attendance", "Fees", "Guardian"];

/* ── Attendance calendar (mock April 2026) ── */
const ATT_RECORDS = {
  1: "P",
  2: "P",
  3: "A",
  4: "H",
  5: "H",
  6: "P",
  7: "P",
  8: "P",
  9: "P",
  10: "P",
  11: "H",
  12: "H",
  13: "P",
  14: "P",
  15: "P",
  16: "P",
  17: "L",
  18: "H",
  19: "H",
  20: "P",
  21: "P",
  22: "P",
  23: "P",
  24: "P",
  25: "H",
  26: "H",
  27: "P",
  28: "P",
  29: "P",
  30: "P",
};
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CAL_START_DAY = 3; // Apr 1 2026 = Wednesday
const STATUS_COLORS = {
  P: "bg-sage text-white",
  A: "bg-rose text-white",
  L: "bg-amber text-white",
  H: "bg-parchment text-ink/25 text-[10px]",
};

/* ── Mock grades ── */
const GRADES = [
  { subject: "Mathematics", marks: 78, max: 100 },
  { subject: "English", marks: 88, max: 100 },
  { subject: "Science", marks: 72, max: 100 },
  { subject: "Social Studies", marks: 81, max: 100 },
  { subject: "Hindi", marks: 91, max: 100 },
];

/* ── Mock fee payments ── */
const PAYMENTS = [
  {
    date: "12 Apr 2026",
    desc: "Q1 Tuition + Transport",
    amount: 13500,
    method: "UPI",
    status: "Paid",
  },
  {
    date: "5 Jan 2026",
    desc: "Q3 Full instalment",
    amount: 14500,
    method: "Online",
    status: "Paid",
  },
  {
    date: "1 Oct 2025",
    desc: "Q2 Full instalment",
    amount: 14500,
    method: "Cash",
    status: "Paid",
  },
];

function fmt(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // React Router hook
  //const isEditMode = location.pathname.includes("/edit");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  // const [editData, setEditData] = useState(null);
  // const [isSaving, setIsSaving] = useState(false);
  // const [saveSuccess, setSaveSuccess] = useState(false);

  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    getStudentDetails();
  }, [id]);

  const getStudentDetails = async () => {
    setLoading(true);
    try {
      const { data } = await studentsApi.getById(id);
      console.log(data.content);
      setStudent(data?.content?.student);
      // if (isEditMode) {
      //   setEditData({ ...response.data });
      // }
    } catch (err) {
      console.log(err);
      setError(
        err.message ||
          "Failed while fetching student details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  //const student = STUDENTS.find((s) => s.id === id);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] overflow-hidden gap-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Spinner />
          <p className="font-serif text-lg text-ink/40">Loading...</p>
        </div>
      </div>
    );

  if (!student && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <p className="font-serif text-xl text-ink/40">Student not found</p>
        <Button onClick={() => navigate("/admin/students")}>
          ← Back to list
        </Button>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] overflow-hidden gap-4">
        <div className="flex items-center justify-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
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
        <Button onClick={() => navigate("/admin/students")}>
          ← Back to list
        </Button>
      </div>
    );

  const initials = student.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const attColor =
    student.attendance >= 85
      ? "#3A6B4F"
      : student.attendance >= 75
        ? "#B85C1A"
        : "#A0334A";
  const avgGrade = Math.round(
    GRADES.reduce((s, g) => s + g.marks, 0) / GRADES.length,
  );

  /* Build calendar cells */
  const calCells = [];
  for (let i = 0; i < CAL_START_DAY; i++) calCells.push(null);
  for (let d = 1; d <= 30; d++) calCells.push(d);

  const presentDays = Object.values(ATT_RECORDS).filter(
    (v) => v === "P",
  ).length;
  const workingDays = Object.values(ATT_RECORDS).filter(
    (v) => v !== "H",
  ).length;

  return (
    <div className="space-y-5">
      {/* ── Breadcrumb + actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/admin/students"
            className="text-ink/40 hover:text-cobalt transition-colors"
          >
            Students
          </Link>
          <span className="text-ink/20">/</span>
          <span className="text-ink font-medium">{student.name}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/admin/students")}
          >
            ← Back to list
          </Button>
          <Link to={`/admin/students/${student.id}/edit`}>
            <Button size="sm">Edit student</Button>
          </Link>
        </div>
      </div>

      {/* ── Profile banner ── */}
      <div className="bg-cobalt rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-serif text-2xl font-semibold text-white flex-shrink-0">
            {initials}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl text-white leading-tight">
              {student.name}
            </h1>
            <p className="text-cobalt-light text-sm mt-0.5">
              Class {student.class} &nbsp;·&nbsp; Roll {student.roll}{" "}
              &nbsp;·&nbsp; {student.gender}
            </p>
            <p className="text-white/40 text-xs mt-1 font-mono">
              {student.admissionNo}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-6 flex-shrink-0">
            {[
              ["Attendance", student.attendance + "%"],
              ["Avg grade", avgGrade + "%"],
              ["Blood", student.bloodGroup],
            ].map(([label, value]) => (
              <div key={label} className="text-center">
                <div className="font-serif text-xl text-white font-semibold">
                  {value}
                </div>
                <div className="text-white/45 text-[11px] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-shrink-0">
            <Badge variant={STATUS_VARIANT[student.status]}>
              {student.status}
            </Badge>
            <Badge variant={FEE_VARIANT[student.fees]}>{student.fees}</Badge>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 bg-white border border-ink/8 rounded-xl p-1 w-fit flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? "bg-cobalt text-white shadow-sm"
                : "text-ink/50 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════ */}
      {tab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Personal info */}
          <Card className="lg:col-span-2">
            <CardHeader title="Personal information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {[
                ["Admission no.", student.admissionNo],
                ["Date of birth", formatDate(student.dateOfBirth)],
                ["Gender", student.gender],
                ["Blood group", student.bloodGroup],
                ["Nationality", student.nationality],
                ["Religion", student.religion],
                ["Category", student.category],
                ["House", student.house],
                ["Class teacher", student.classTeacher],
                ["Admission date", formatDate(student.admissionDate)],
                ["Previous school", student.previousSchool],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2.5 border-b border-ink/5 last:border-0"
                >
                  <span className="text-xs text-ink/40">{label}</span>
                  <span className="text-sm font-medium text-ink text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Side column */}
          <div className="space-y-4">
            {/* Contact */}
            <Card>
              <CardHeader title="Contact" />
              {[
                ["Phone", student.phone],
                ["Alt. phone", student.altPhone || "—"],
                ["Email", student.email || "—"],
                ["Emergency", student.emergencyContact],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between py-2 border-b border-ink/5 last:border-0"
                >
                  <span className="text-xs text-ink/40">{l}</span>
                  <span className="text-xs font-medium text-ink text-right">
                    {v}
                  </span>
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-ink/5">
                <div className="text-xs text-ink/40 mb-1">Address</div>
                <div className="text-xs text-ink leading-relaxed">
                  {student.address}
                </div>
              </div>
            </Card>

            {/* Quick stats card */}
            <Card>
              <CardHeader title="Quick stats" />
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-ink/50">Attendance</span>
                    <span className="text-xs font-semibold text-ink">
                      {student.attendance}%
                    </span>
                  </div>
                  <div className="h-2 bg-parchment rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${student.attendance}%`,
                        background: attColor,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-ink/50">Avg grade</span>
                    <span className="text-xs font-semibold text-ink">
                      {avgGrade}%
                    </span>
                  </div>
                  <div className="h-2 bg-parchment rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cobalt"
                      style={{ width: `${avgGrade}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          ACADEMIC TAB
      ══════════════════════════════════════ */}
      {tab === "Academic" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader title="Unit Test 2 — Results" />
            <div className="space-y-4">
              {GRADES.map((g) => {
                const pct = Math.round((g.marks / g.max) * 100);
                const color =
                  pct >= 80 ? "#3A6B4F" : pct >= 60 ? "#B85C1A" : "#A0334A";
                const grade =
                  pct >= 90
                    ? "A+"
                    : pct >= 80
                      ? "A"
                      : pct >= 70
                        ? "B+"
                        : pct >= 60
                          ? "B"
                          : pct >= 50
                            ? "C"
                            : pct >= 35
                              ? "D"
                              : "F";
                return (
                  <div key={g.subject}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-ink">
                        {g.subject}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-ink/50">
                          {g.marks}/{g.max}
                        </span>
                        <span className="text-sm font-bold" style={{ color }}>
                          {grade}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-parchment rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Academic info" />
            {[
              ["Class", student.class],
              ["Roll no.", student.roll],
              ["Section", student.section],
              ["House", student.house],
              ["Class teacher", student.classTeacher],
              ["Avg grade", avgGrade + " / 100"],
              ["Class rank", "#7 / 40"],
            ].map(([l, v]) => (
              <div
                key={l}
                className="flex justify-between py-2.5 border-b border-ink/5 last:border-0"
              >
                <span className="text-xs text-ink/40">{l}</span>
                <span className="text-sm font-medium text-ink">{v}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════
          ATTENDANCE TAB
      ══════════════════════════════════════ */}
      {tab === "Attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base text-ink">April 2026</h3>
              <div className="flex gap-3">
                {[
                  ["P", "bg-sage text-white", "Present"],
                  ["A", "bg-rose text-white", "Absent"],
                  ["L", "bg-amber text-white", "Late"],
                  [
                    "H",
                    "bg-parchment text-ink/30 border border-ink/10",
                    "Holiday",
                  ],
                ].map(([code, cls, label]) => (
                  <div key={code} className="flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${cls}`}
                    >
                      {code}
                    </span>
                    <span className="text-[11px] text-ink/40 hidden sm:inline">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {WEEK_DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-semibold text-ink/30 py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calCells.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} />;
                const status = ATT_RECORDS[day];
                return (
                  <div
                    key={day}
                    className="aspect-square flex items-center justify-center"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${STATUS_COLORS[status] || "text-ink/20"}`}
                    >
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-ink/5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink/50">
                  <strong className="text-sage">{presentDays} present</strong>{" "}
                  out of <strong>{workingDays} working days</strong>
                </span>
                <span className="font-bold" style={{ color: attColor }}>
                  {Math.round((presentDays / workingDays) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-parchment rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((presentDays / workingDays) * 100)}%`,
                    background: attColor,
                  }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Attendance summary" />
            {[
              ["This month", student.attendance + "%"],
              ["Present days", presentDays],
              [
                "Absent days",
                Object.values(ATT_RECORDS).filter((v) => v === "A").length,
              ],
              [
                "Late/Leave",
                Object.values(ATT_RECORDS).filter((v) => v === "L").length,
              ],
              [
                "Holidays",
                Object.values(ATT_RECORDS).filter((v) => v === "H").length,
              ],
              ["YTD overall", "91.7%"],
            ].map(([l, v]) => (
              <div
                key={l}
                className="flex justify-between py-2.5 border-b border-ink/5 last:border-0"
              >
                <span className="text-xs text-ink/40">{l}</span>
                <span className="text-sm font-semibold text-ink">{v}</span>
              </div>
            ))}
            {student.attendance < 75 && (
              <div className="mt-3 p-3 bg-rose-light rounded-xl text-xs text-rose font-medium">
                ⚠ Below 75% — parent notification sent
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════
          FEES TAB
      ══════════════════════════════════════ */}
      {tab === "Fees" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader title="Payment history" />
            <div className="space-y-0">
              {PAYMENTS.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3.5 border-b border-ink/5 last:border-0"
                >
                  <div className="w-8 h-8 bg-sage-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-sage"
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M6 10V2M3 5l3-3 3 3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{p.desc}</div>
                    <div className="text-xs text-ink/40 mt-0.5">
                      {p.date} · {p.method}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-sage">
                    {fmt(p.amount)}
                  </span>
                  <Badge variant="success">{p.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Fee summary" />
            {[
              ["Annual fee", "₹58,000"],
              ["Paid so far", "₹42,500"],
              ["Outstanding", "₹15,500"],
              ["Due date", "30 Apr 2026"],
              [
                "Fee status",
                <Badge key="f" variant={FEE_VARIANT[student.fees]}>
                  {student.fees}
                </Badge>,
              ],
            ].map(([l, v]) => (
              <div
                key={l}
                className="flex justify-between items-center py-2.5 border-b border-ink/5 last:border-0"
              >
                <span className="text-xs text-ink/40">{l}</span>
                <span className="text-sm font-medium text-ink">{v}</span>
              </div>
            ))}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink/50">Paid</span>
                <span className="font-semibold text-ink">73%</span>
              </div>
              <div className="h-2 bg-parchment rounded-full overflow-hidden">
                <div
                  className="h-full bg-cobalt rounded-full"
                  style={{ width: "73%" }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════
          GUARDIAN TAB
      ══════════════════════════════════════ */}
      {tab === "Guardian" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Father / Primary guardian" />
            {[
              ["Name", student.father],
              ["Phone", student.phone],
              ["Email", student.email || "—"],
              ["Occupation", "Engineer"],
            ].map(([l, v]) => (
              <div
                key={l}
                className="flex justify-between py-2.5 border-b border-ink/5 last:border-0"
              >
                <span className="text-xs text-ink/40">{l}</span>
                <span className="text-sm font-medium text-ink">{v}</span>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader title="Mother / Secondary guardian" />
            {[
              ["Name", student.mother],
              ["Phone", student.altPhone || "—"],
              ["Email", "—"],
              ["Occupation", "Teacher"],
            ].map(([l, v]) => (
              <div
                key={l}
                className="flex justify-between py-2.5 border-b border-ink/5 last:border-0"
              >
                <span className="text-xs text-ink/40">{l}</span>
                <span className="text-sm font-medium text-ink">{v}</span>
              </div>
            ))}
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="Address & emergency contact" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {[
                ["Home address", student.address],
                ["Emergency contact", student.emergencyContact],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="py-2.5 border-b border-ink/5 last:border-0"
                >
                  <div className="text-xs text-ink/40 mb-1">{l}</div>
                  <div className="text-sm font-medium text-ink">{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
