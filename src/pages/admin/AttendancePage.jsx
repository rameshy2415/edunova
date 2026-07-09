import React, { useMemo, useState, useEffect } from "react";
import {
  PageHeader,
  Card,
  CardHeader,
  Badge,
  Button,
  Spinner
} from "../../components/common";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { studentsApi } from "../../api/studentsApi";

//const CLASSES = ["6-A", "6-B", "6-C", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B", "11-A", "11-B"];

const STUDENTS = {
  "9-A": [
    { id: 1, roll: 1, name: "Aryan Mehta", avatar: "AR" },
    { id: 2, roll: 2, name: "Bhavna Singh", avatar: "BS" },
    { id: 3, roll: 3, name: "Chirag Patel", avatar: "CP" },
    { id: 4, roll: 4, name: "Deepika Rao", avatar: "DR" },
    { id: 5, roll: 5, name: "Eshan Kumar", avatar: "EK" },
    { id: 6, roll: 6, name: "Farida Shaikh", avatar: "FS" },
    { id: 7, roll: 7, name: "Gaurav Nair", avatar: "GN" },
    { id: 8, roll: 8, name: "Harsha Iyer", avatar: "HI" },
  ],
};

const ATT_SUMMARY = [
  { cls: "9-A", pct: 96, present: 38, absent: 2 },
  { cls: "10-A", pct: 91, present: 35, absent: 3 },
  { cls: "8-B", pct: 88, present: 33, absent: 4 },
  { cls: "11-B", pct: 94, present: 36, absent: 2 },
  { cls: "7-A", pct: 79, present: 28, absent: 7 },
  { cls: "6-C", pct: 97, present: 40, absent: 1 },
];

const VIEWS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const YEAR_MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

// Chart colors approximate the ink/cobalt/sage/rose/amber tailwind tokens already
// used across the page. Swap for the exact hex values from your tailwind.config
// if these don't match 1:1.
const CHART = {
  cobalt: "#3457D5",
  sage: "#6B8F71",
  rose: "#E1495F",
  amber: "#F2A93B",
  grid: "#EFE9DD",
};

// Deterministic pseudo-random status generator, seeded per class/student/day
// so the same class always renders the same demo pattern. Replace with real
// data from GET /attendance/{classId}?range=weekly|monthly|yearly.
function seededPct(seed) {
  return Math.abs(Math.sin(seed) * 10000) % 1;
}

const statusMap = {
    P: "PRESENT",
    A: "ABSENT",
    L: "LATE",
    H: "HOLIDAY",
    LV: "LEAVE",
};

function seededStatus(seed) {
  const r = seededPct(seed);
  if (r > 0.93) return "A";
  if (r > 0.85) return "L";
  return "P";
}

function classSeed(cls) {
  return cls.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function buildWeekMatrix(cls, students) {
  const base = classSeed(cls);
  return students.map((s, si) => ({
    student: s,
    days: WEEK_DAYS.map((_, di) =>
      seededStatus(base * 0.7 + si * 13 + di * 3.1),
    ),
  }));
}

function buildMonthTrend(cls, students) {
  const base = classSeed(cls);
  return Array.from({ length: 28 }, (_, i) => {
    const dayNum = i + 1;
    let present = 0;
    students.forEach((s, si) => {
      if (seededStatus(base * 0.5 + si * 7 + dayNum * 1.7) === "P") present++;
    });
    return { day: dayNum, pct: Math.round((present / students.length) * 100) };
  });
}

function buildYearTrend(cls, students) {
  const base = classSeed(cls);
  return YEAR_MONTHS.map((m, i) => {
    let present = 0;
    students.forEach((s, si) => {
      if (seededStatus(base * 0.3 + si * 5 + i * 2.3) === "P") present++;
    });
    const dip = i % 4 === 0 ? 3 : 0;
    return {
      month: m,
      pct: Math.max(
        70,
        Math.min(99, Math.round((present / students.length) * 100) - dip),
      ),
    };
  });
}

function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date;
}

function addDays(d, n) {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function fmtDate(d) {
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Builds the per-student roster for one specific date, reusing the same seed
// formula as buildWeekMatrix / buildMonthTrend so the detail view always
// matches what the matrix/heatmap already imply. Replace with a real call to
// GET /attendance/{classId}/{date} once the backend endpoint exists.
function dayRoster(cls, students, seedFn) {
  return students.map((s, si) => ({
    student: s,
    status: seededStatus(seedFn(si)),
  }));
}

function SearchIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function downloadCsv(cls, students, attendance) {
  const rows = [
    ["Roll", "Name", "Status"],
    ...students.map((s) => [s.roll, s.name, attendance[s.id] || "Unmarked"]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance-${cls}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const TONE_CLASSES = {
  sage: { text: "text-sage", avatar: "bg-sage-light text-sage" },
  rose: { text: "text-rose", avatar: "bg-rose-light text-rose" },
  amber: { text: "text-amber", avatar: "bg-amber-light text-amber" },
};

function DayDetailModal({ detail, onClose }) {
  if (!detail) return null;
  const { label, cls, roster } = detail;
  const groups = [
    { key: "P", title: "Present", tone: "sage" },
    { key: "A", title: "Absent", tone: "rose" },
    { key: "L", title: "Late / Leave", tone: "amber" },
  ];

  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-ink/8">
          <div>
            <p className="text-xs text-ink/40 mb-0.5">{cls}</p>
            <h3 className="font-serif text-lg font-semibold text-ink">
              {label}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink w-8 h-8 rounded-lg hover:bg-parchment flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {groups.map(({ key, title, tone }) => {
            const list = roster.filter((r) => r.status === key);
            if (list.length === 0) return null;
            const cls2 = TONE_CLASSES[tone];
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-semibold ${cls2.text}`}>
                    {title}
                  </h4>
                  <Badge variant={tone}>{list.length}</Badge>
                </div>
                <div className="space-y-1.5">
                  {list.map(({ student }) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-parchment/50"
                    >
                      <span className="text-xs text-ink/40 font-mono w-6">
                        {String(student.roll).padStart(2, "0")}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold ${cls2.avatar}`}
                      >
                        {student.avatar}
                      </div>
                      <span className="text-sm text-ink">{student.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [section, setSection] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("daily");

  const [dayDetail, setDayDetail] = useState(null);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    setLoading(true);
    try {
      const { data } = await studentsApi.getSectionStudent();
      const defaultClass = data?.content?.section?.[0]?.id || "";
      const defaultStudents =
        data?.content?.students?.filter((g) => g.sectionId === defaultClass) ||
        [];
      setSection(data?.content?.section || []);
      setStudents(data?.content?.students || []);
      setFilteredStudents(defaultStudents);
      setSelectedClass(defaultClass);
    } catch (err) {
      console.log(err);
      setError(
          err.message || "Failed while fetching students. Please try again.",
        );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    let result = students;

    // Section Filter
    if (selectedClass) {
      result = result.filter(
        (student) => student.sectionId === selectedClass,
      );
    }

    // Search Filter
    if (query.trim()) {
      const keyword = query.toLowerCase();

      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(keyword) ||
          student.roll.toLowerCase().includes(keyword),
      );
    }

    setFilteredStudents(result);
  }, [selectedClass, query, students]);

  const toggle = (id, val) => {
    setAttendance((p) => ({ ...p, [id]: val }));
    setSaved(false);
  };
  const markAll = (val) => {
    const o = {};
    filteredStudents.forEach((s) => (o[s.id] = val));
    setAttendance(o);
    setSaved(false);
  };
  const presentCount = filteredStudents.filter((s) => attendance[s.id] === "P").length;
  const absentCount = filteredStudents.filter((s) => attendance[s.id] === "A").length;
  const unmarked = filteredStudents.filter((s) => !attendance[s.id]).length;

/*   const handleSave = () => {
    console.log(attendance);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }; */

  const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  };

  const validate = () => {
    if (!attendance || Object.keys(attendance).length === 0) {
        alert("Please mark attendance before saving.");
        return;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    validate();
    try {
      setLoading(true);
      setError("");

      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status: statusMap[status],
        remarks: "",
      }));
      const payload = {
        sectionId: selectedClass,
        date: new Date().toISOString().split("T")[0],
        records,
      };
      console.log("Form data to submit:", payload);
      await studentsApi.markBulkAttendance(payload);
      setSaved(true);
      setTimeout(
        () => setSaved(false),
        800,
      ); 
    } catch (err) {
      console.log(err);
      setError(
        err.message || "Failed to save attendance. Please try again.",
      );
      setSaved(false);
    } finally {
      setLoading(false);
    }
  };

  const changeClass = (cls) => {
    setSelectedClass(cls);
    setAttendance({});
    setSaved(false);
    setQuery("");
    setDayDetail(null);
  };

  const openWeekDay = (dayIndex) => {
    const base = classSeed(selectedClass);
    const roster = dayRoster(
      selectedClass,
      students,
      (si) => base * 0.7 + si * 13 + dayIndex * 3.1,
    );
    const date = addDays(startOfWeek(new Date()), dayIndex);
    setDayDetail({ label: fmtDate(date), cls: selectedClass, roster });
  };

  const openMonthDay = (dayNum) => {
    const base = classSeed(selectedClass);
    const roster = dayRoster(
      selectedClass,
      students,
      (si) => base * 0.5 + si * 7 + dayNum * 1.7,
    );
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), dayNum);
    setDayDetail({ label: fmtDate(date), cls: selectedClass, roster });
  };

  const weekMatrix = useMemo(
    () => buildWeekMatrix(selectedClass, students),
    [selectedClass],
  );

  const monthTrend = useMemo(
    () => buildMonthTrend(selectedClass, students),
    [selectedClass],
  );

  const yearTrend = useMemo(
    () => buildYearTrend(selectedClass, students),
    [selectedClass],
  );

  const dateLabel =
    view === "daily"
      ? today
      : view === "weekly"
        ? "This week"
        : view === "monthly"
          ? "This month"
          : "Academic year 2025–26";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Attendance"
        subtitle={dateLabel}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadCsv(selectedClass, students, attendance)}
            >
              Export CSV
            </Button>
            {view === "daily" && (
              <Button size="sm" onClick={handleSave}>
                {saved ? "✓ Saved!" : "Save attendance"}
              </Button>
            )}
          </div>
        }
      />

      {/* Class summary cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {ATT_SUMMARY.map((a) => (
          <button
            key={a.cls}
            onClick={() => changeClass(a.cls)}
            className={`rounded-xl p-3 text-left transition-all ${selectedClass === a.cls ? "bg-cobalt text-white shadow-lg shadow-cobalt/20" : "bg-white border border-ink/8 hover:border-cobalt/30"}`}
          >
            <div
              className={`text-xs font-semibold mb-1 ${selectedClass === a.cls ? "text-white/70" : "text-ink/50"}`}
            >
              {a.cls}
            </div>
            <div
              className={`font-serif text-lg font-semibold ${selectedClass === a.cls ? "text-white" : "text-ink"}`}
            >
              {a.pct}%
            </div>
            <div
              className={`text-[11px] ${selectedClass === a.cls ? "text-white/60" : "text-ink/40"}`}
            >
              {a.absent} absent
            </div>
          </button>
        ))}
      </div>

      {/* View switcher */}
      <div className="flex rounded-xl border border-ink/8 bg-white p-1 w-fit">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${view === v.key ? "bg-cobalt text-white" : "text-ink/50 hover:text-ink"}`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main panel — swaps per view */}
        <Card className="lg:col-span-2">
          {view === "daily" && (
            <>
              {/* ── Show API error ── */}
              {error && (
                <div className="mb-4 flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
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

              {/* Panel — to show success message */}
              {saved && (
                <div className="my-2 flex items-center gap-2 bg-sage-light text-sage px-4 py-3 rounded-xl text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M9 11l3 3L22 4" />
                  </svg>
                  Attendance saved successfully for class{" "}
                  {section.find((g) => g.id === selectedClass).name}!
                </div>
              )}

              {/* Panel — to select section */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <select
                    value={selectedClass}
                    onChange={(e) => changeClass(e.target.value)}
                    className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium text-ink outline-none cursor-pointer"
                  >
                    {section.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-ink/50">
                    {filteredStudents.length} students
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => markAll("P")}
                    className="text-xs px-3 py-1.5 rounded-lg bg-sage-light text-sage border border-sage/20 font-medium hover:bg-sage/10 transition-colors"
                  >
                    Mark all present
                  </button>
                  <button
                    onClick={() => markAll("A")}
                    className="text-xs px-3 py-1.5 rounded-lg bg-rose-light text-rose border border-rose/20 font-medium hover:bg-rose/10 transition-colors"
                  >
                    Mark all absent
                  </button>
                </div>
              </div>

              <div className="relative mb-4">
                <SearchIcon className="w-4 h-4 text-ink/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search student"
                  className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm rounded-xl border border-ink/10 bg-parchment/50 outline-none focus:border-cobalt/40"
                />
              </div>

              {/* Progress bar */}
              {Object.keys(attendance).length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-ink/50 mb-1.5">
                    <span>
                      Present:{" "}
                      <strong className="text-sage">{presentCount}</strong>
                    </span>
                    <span>
                      Absent:{" "}
                      <strong className="text-rose">{absentCount}</strong>
                    </span>
                    <span>
                      Unmarked:{" "}
                      <strong className="text-amber">{unmarked}</strong>
                    </span>
                  </div>
                  <div className="h-2 bg-parchment rounded-full overflow-hidden flex">
                    <div
                      className="bg-sage transition-all"
                      style={{
                        width: `${(presentCount / filteredStudents.length) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-rose transition-all"
                      style={{
                        width: `${(absentCount / students.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Student list */}
              <div className="space-y-2">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Spinner />
                    <p className="font-serif text-lg text-ink/40">Loading...</p>
                  </div>
                )}
                {!loading && filteredStudents.length === 0 && (
                  <p className="text-sm text-ink/40 text-center py-6">
                    No students match "{query}"
                  </p>
                )}
                {!loading &&filteredStudents.map((s) => {
                  const val = attendance[s.id];
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${val === "P" ? "border-sage/30 bg-sage-light/40" : val === "A" ? "border-rose/30 bg-rose-light/40" : "border-ink/5 bg-parchment/50"}`}
                    >
                      <span className="text-xs text-ink/40 min-w-[28px] font-mono">
                        {String(s.roll).padStart(2, "0")}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${val === "P" ? "bg-sage text-white" : val === "A" ? "bg-rose text-white" : "bg-cobalt-light text-cobalt"}`}
                      >
                        {/* {s.avatar} */}
                        {getInitials(s.name)}
                      </div>
                      <span className="flex-1 text-sm font-medium text-ink">
                        {s.name}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggle(s.id, "P")}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${val === "P" ? "bg-sage text-white shadow-sm" : "bg-sage-light text-sage hover:bg-sage/20"}`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => toggle(s.id, "A")}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${val === "A" ? "bg-rose text-white shadow-sm" : "bg-rose-light text-rose hover:bg-rose/20"}`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => toggle(s.id, "L")}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${val === "L" ? "bg-amber text-white shadow-sm" : "bg-amber-light text-amber hover:bg-amber/20"}`}
                        >
                          L
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === "weekly" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    Week overview — {selectedClass}
                  </h3>
                  <p className="text-xs text-ink/40 mt-0.5">
                    Click any day to see who was present or absent
                  </p>
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => changeClass(e.target.value)}
                  className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium text-ink outline-none cursor-pointer"
                >
                  {section.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-ink/40 border-b border-ink/8">
                      <th className="py-2 pr-3 font-medium">Student</th>
                      {WEEK_DAYS.map((d) => (
                        <th
                          key={d}
                          className="py-2 px-2 font-medium text-center"
                        >
                          {d}
                        </th>
                      ))}
                      <th className="py-2 pl-3 font-medium text-right">
                        Week %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekMatrix.map(({ student, days }) => {
                      const pct = Math.round(
                        (days.filter((d) => d === "P").length / days.length) *
                          100,
                      );
                      return (
                        <tr
                          key={student.id}
                          className="border-b border-ink/5 last:border-0"
                        >
                          <td className="py-2.5 pr-3 font-medium text-ink whitespace-nowrap">
                            {student.name}
                          </td>
                          {days.map((d, i) => (
                            <td key={i} className="py-2.5 px-2 text-center">
                              <button
                                onClick={() => openWeekDay(i)}
                                title="View this day"
                                className={`inline-flex w-6 h-6 items-center justify-center rounded-md text-[11px] font-bold transition-transform hover:scale-110 cursor-pointer ${
                                  d === "P"
                                    ? "bg-sage-light text-sage"
                                    : d === "A"
                                      ? "bg-rose-light text-rose"
                                      : "bg-amber-light text-amber"
                                }`}
                              >
                                {d}
                              </button>
                            </td>
                          ))}
                          <td className="py-2.5 pl-3 text-right font-medium text-ink/70 tabular-nums">
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {view === "monthly" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    Daily attendance % — {selectedClass}
                  </h3>
                  <p className="text-xs text-ink/40 mt-0.5">
                    Click any day on the heat map to see who was present or
                    absent
                  </p>
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => changeClass(e.target.value)}
                  className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium text-ink outline-none cursor-pointer"
                >
                  {section.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={monthTrend}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#9C9587" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[60, 100]}
                    tick={{ fontSize: 11, fill: "#9C9587" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 10,
                      border: "1px solid #EFE9DD",
                    }}
                    formatter={(v) => [`${v}%`, "Present"]}
                    labelFormatter={(l) => `Day ${l}`}
                  />
                  <ReferenceLine
                    y={75}
                    stroke={CHART.amber}
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="pct"
                    stroke={CHART.cobalt}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <h4 className="text-sm font-medium text-ink mt-6 mb-3">
                Calendar heat map
              </h4>
              <div className="grid grid-cols-7 gap-1.5">
                {monthTrend.map((d) => {
                  const tone =
                    d.pct >= 95
                      ? "bg-sage"
                      : d.pct >= 85
                        ? "bg-sage-light text-sage"
                        : d.pct >= 75
                          ? "bg-amber-light text-amber"
                          : "bg-rose-light text-rose";
                  const white = d.pct >= 95 ? "text-white" : "";
                  return (
                    <button
                      key={d.day}
                      onClick={() => openMonthDay(d.day)}
                      title={`Day ${d.day}: ${d.pct}% — click to view`}
                      className={`h-9 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-transform hover:scale-105 cursor-pointer ${tone} ${white}`}
                    >
                      {d.day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === "yearly" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Month-wise attendance % — {selectedClass}
                </h3>
                <select
                  value={selectedClass}
                  onChange={(e) => changeClass(e.target.value)}
                  className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium text-ink outline-none cursor-pointer"
                >
                  {section.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={yearTrend}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9C9587" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[60, 100]}
                    tick={{ fontSize: 11, fill: "#9C9587" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 10,
                      border: "1px solid #EFE9DD",
                    }}
                    formatter={(v) => [`${v}%`, "Present"]}
                  />
                  <ReferenceLine
                    y={75}
                    stroke={CHART.amber}
                    strokeDasharray="4 4"
                  />
                  <Bar
                    dataKey="pct"
                    radius={[4, 4, 0, 0]}
                    fill={CHART.cobalt}
                  />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </Card>

        {/* Right sidebar */}
        <div className="space-y-5">
          {(view === "daily" || view === "weekly") && (
            <Card>
              <CardHeader title="Legend" />
              <div className="space-y-2">
                {[
                  ["P", "bg-sage text-white", "Present"],
                  ["A", "bg-rose text-white", "Absent"],
                  ["L", "bg-amber text-white", "Late / Leave"],
                ].map(([code, cls, label]) => (
                  <div key={code} className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${cls}`}
                    >
                      {code}
                    </span>
                    <span className="text-sm text-ink">{label}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {view !== "yearly" && (
            <Card>
              <CardHeader title="This month" />
              <div className="space-y-3">
                {ATT_SUMMARY.map((a) => (
                  <div key={a.cls}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-ink">
                        {a.cls}
                      </span>
                      <span className="text-xs font-semibold text-ink">
                        {a.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-parchment rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cobalt rounded-full"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {view === "yearly" && (
            <Card>
              <CardHeader title="Year snapshot" />
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-ink/50">Yearly average</span>
                  <span className="font-serif text-xl font-semibold text-ink">
                    {Math.round(
                      yearTrend.reduce((a, b) => a + b.pct, 0) /
                        yearTrend.length,
                    )}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-ink/50">Best month</span>
                  <Badge variant="sage">
                    {yearTrend.reduce((a, b) => (b.pct > a.pct ? b : a)).month}
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-ink/50">Lowest month</span>
                  <Badge variant="rose">
                    {yearTrend.reduce((a, b) => (b.pct < a.pct ? b : a)).month}
                  </Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <DayDetailModal detail={dayDetail} onClose={() => setDayDetail(null)} />
    </div>
  );
}
