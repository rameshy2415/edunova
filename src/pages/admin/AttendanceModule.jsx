import React, { useState, useMemo } from "react";
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
import {
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  CalendarDays,
  Download,
  ChevronDown,
} from "lucide-react";

/* ---------------------------------------------------------
   Sample data — swap for real API data from your Spring Boot
   attendance service. Shapes are documented inline.
--------------------------------------------------------- */

const SECTIONS = ["Grade 6 - A", "Grade 6 - B", "Grade 7 - A", "Grade 7 - B"];

const STUDENTS = [
  { id: "S001", name: "Aarav Mehta", roll: 1 },
  { id: "S002", name: "Diya Sharma", roll: 2 },
  { id: "S003", name: "Kabir Singh", roll: 3 },
  { id: "S004", name: "Ishaan Rao", roll: 4 },
  { id: "S005", name: "Meera Iyer", roll: 5 },
  { id: "S006", name: "Vivaan Nair", roll: 6 },
  { id: "S007", name: "Ananya Gupta", roll: 7 },
  { id: "S008", name: "Reyansh Joshi", roll: 8 },
  { id: "S009", name: "Sara Khan", roll: 9 },
  { id: "S010", name: "Arjun Verma", roll: 10 },
];

const STATUS = {
  PRESENT: {
    label: "Present",
    short: "P",
    icon: Check,
    ring: "ring-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  ABSENT: {
    label: "Absent",
    short: "A",
    icon: X,
    ring: "ring-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  LATE: {
    label: "Late",
    short: "L",
    icon: Clock,
    ring: "ring-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  HALF: {
    label: "Half day",
    short: "H",
    icon: Clock,
    ring: "ring-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
  },
};

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Deterministic pseudo-random attendance generator so charts have believable shape
function seededStatus(seed) {
  const r = Math.abs(Math.sin(seed) * 10000) % 1;
  if (r > 0.93) return "ABSENT";
  if (r > 0.86) return "LATE";
  if (r > 0.82) return "HALF";
  return "PRESENT";
}

function buildWeekMatrix(sectionIdx) {
  return STUDENTS.map((s, si) => ({
    student: s,
    days: DAYS_OF_WEEK.map((_, di) =>
      seededStatus(sectionIdx * 97 + si * 13 + di * 3.1),
    ),
  }));
}

function buildMonthTrend(sectionIdx) {
  const days = 28;
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    let present = 0;
    STUDENTS.forEach((s, si) => {
      if (seededStatus(sectionIdx * 51 + si * 7 + dayNum * 1.7) === "PRESENT")
        present++;
    });
    return {
      day: dayNum,
      pct: Math.round((present / STUDENTS.length) * 100),
    };
  });
}

function buildYearTrend(sectionIdx) {
  const months = [
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
  return months.map((m, i) => {
    let present = 0;
    STUDENTS.forEach((s, si) => {
      if (seededStatus(sectionIdx * 31 + si * 5 + i * 2.3) === "PRESENT")
        present++;
    });
    const pct =
      Math.round((present / STUDENTS.length) * 100) - (i % 4 === 0 ? 3 : 0);
    return { month: m, pct: Math.max(70, Math.min(99, pct)) };
  });
}

const VIEW_TABS = [
  { key: "daily", label: "Daily capture" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

/* ---------------------------------------------------------
   Small shared pieces
--------------------------------------------------------- */

function SectionPicker({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 cursor-pointer"
      >
        {SECTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

function DateNav({ label, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1 py-1">
      <button
        onClick={onPrev}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium text-slate-700 px-2 min-w-[160px] text-center flex items-center justify-center gap-1.5">
        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
        {label}
      </span>
      <button
        onClick={onNext}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function StatCard({ label, value, tone, sub }) {
  const toneMap = {
    emerald: "text-emerald-700 bg-emerald-50",
    rose: "text-rose-700 bg-rose-50",
    amber: "text-amber-700 bg-amber-50",
    sky: "text-sky-700 bg-sky-50",
    slate: "text-slate-700 bg-slate-100",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex-1 min-w-[120px]">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-800 tabular-nums">
          {value}
        </span>
        {sub && (
          <span
            className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${toneMap[tone]}`}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Daily capture view
--------------------------------------------------------- */

function DailyCapture({ sectionIdx }) {
  const initial = useMemo(
    () =>
      Object.fromEntries(
        STUDENTS.map((s, i) => [s.id, seededStatus(sectionIdx * 41 + i * 6.2)]),
      ),
    [sectionIdx],
  );
  const [marks, setMarks] = useState(initial);
  const [query, setQuery] = useState("");

  const filtered = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  const counts = Object.values(marks).reduce(
    (acc, st) => ({ ...acc, [st]: (acc[st] || 0) + 1 }),
    {},
  );
  const total = STUDENTS.length;
  const pct = Math.round(((counts.PRESENT || 0) / total) * 100);

  const setAll = (status) => {
    setMarks(Object.fromEntries(STUDENTS.map((s) => [s.id, status])));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <StatCard
          label="Present"
          value={counts.PRESENT || 0}
          tone="emerald"
          sub={`${pct}%`}
        />
        <StatCard label="Absent" value={counts.ABSENT || 0} tone="rose" />
        <StatCard label="Late" value={counts.LATE || 0} tone="amber" />
        <StatCard label="Half day" value={counts.HALF || 0} tone="sky" />
        <StatCard label="Total students" value={total} tone="slate" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search student"
              className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 w-56"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 mr-1">Mark all:</span>
            <button
              onClick={() => setAll("PRESENT")}
              className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100"
            >
              Present
            </button>
            <button
              onClick={() => setAll("ABSENT")}
              className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-medium hover:bg-rose-100"
            >
              Absent
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="px-4 py-2 font-medium w-14">Roll</th>
              <th className="px-4 py-2 font-medium">Student</th>
              <th className="px-4 py-2 font-medium text-right">
                Mark attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-2.5 text-slate-500 tabular-nums">
                  {s.roll}
                </td>
                <td className="px-4 py-2.5 font-medium text-slate-700">
                  {s.name}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-1.5">
                    {Object.entries(STATUS).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      const active = marks[s.id] === key;
                      return (
                        <button
                          key={key}
                          onClick={() =>
                            setMarks((m) => ({ ...m, [s.id]: key }))
                          }
                          title={cfg.label}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${
                            active
                              ? `${cfg.bg} ${cfg.text} border-transparent ring-2 ${cfg.ring}`
                              : "border-slate-200 text-slate-300 hover:text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50/60">
          <button className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-white">
            Reset
          </button>
          <button className="px-4 py-1.5 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">
            Save attendance
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Weekly view
--------------------------------------------------------- */

function WeeklyView({ sectionIdx }) {
  const matrix = useMemo(() => buildWeekMatrix(sectionIdx), [sectionIdx]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
            <th className="px-4 py-2.5 font-medium">Student</th>
            {DAYS_OF_WEEK.map((d) => (
              <th key={d} className="px-3 py-2.5 font-medium text-center">
                {d}
              </th>
            ))}
            <th className="px-4 py-2.5 font-medium text-right">Week %</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map(({ student, days }) => {
            const presentCount = days.filter((d) => d === "PRESENT").length;
            const weekPct = Math.round((presentCount / days.length) * 100);
            return (
              <tr
                key={student.id}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-2.5 font-medium text-slate-700 whitespace-nowrap">
                  {student.name}
                </td>
                {days.map((d, i) => {
                  const cfg = STATUS[d];
                  return (
                    <td key={i} className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-flex w-6 h-6 items-center justify-center rounded-md text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
                      >
                        {cfg.short}
                      </span>
                    </td>
                  );
                })}
                <td className="px-4 py-2.5 text-right font-medium text-slate-600 tabular-nums">
                  {weekPct}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center gap-4 px-4 py-3 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-500">
        {Object.entries(STATUS).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />{" "}
            {cfg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Monthly view
--------------------------------------------------------- */

function MonthlyView({ sectionIdx }) {
  const trend = useMemo(() => buildMonthTrend(sectionIdx), [sectionIdx]);
  const avg = Math.round(trend.reduce((a, b) => a + b.pct, 0) / trend.length);
  const best = trend.reduce((a, b) => (b.pct > a.pct ? b : a));
  const worst = trend.reduce((a, b) => (b.pct < a.pct ? b : a));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <StatCard label="Monthly average" value={`${avg}%`} tone="emerald" />
        <StatCard
          label="Best day"
          value={`Day ${best.day}`}
          tone="sky"
          sub={`${best.pct}%`}
        />
        <StatCard
          label="Lowest day"
          value={`Day ${worst.day}`}
          tone="rose"
          sub={`${worst.pct}%`}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Daily attendance % — this month
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={trend}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
              formatter={(v) => [`${v}%`, "Present"]}
              labelFormatter={(l) => `Day ${l}`}
            />
            <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="pct"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Calendar heat map
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {trend.map((d) => {
            const intensity =
              d.pct >= 95
                ? "bg-emerald-500"
                : d.pct >= 85
                  ? "bg-emerald-300"
                  : d.pct >= 75
                    ? "bg-amber-300"
                    : "bg-rose-400";
            return (
              <div
                key={d.day}
                title={`Day ${d.day}: ${d.pct}%`}
                className={`h-9 rounded-md flex items-center justify-center text-[11px] font-medium text-white ${intensity}`}
              >
                {d.day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Yearly view
--------------------------------------------------------- */

function YearlyView({ sectionIdx }) {
  const trend = useMemo(() => buildYearTrend(sectionIdx), [sectionIdx]);
  const avg = Math.round(trend.reduce((a, b) => a + b.pct, 0) / trend.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <StatCard label="Yearly average" value={`${avg}%`} tone="emerald" />
        <StatCard label="Academic year" value="2025–26" tone="slate" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Month-wise attendance %
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={trend}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
              formatter={(v) => [`${v}%`, "Present"]}
            />
            <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]} fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Root module
--------------------------------------------------------- */

export default function AttendanceModule() {
  const [view, setView] = useState("daily");
  const [section, setSection] = useState(SECTIONS[0]);
  const sectionIdx = SECTIONS.indexOf(section);

  const dateLabel =
    view === "daily"
      ? "Mon, 7 Jul 2026"
      : view === "weekly"
        ? "30 Jun – 5 Jul 2026"
        : view === "monthly"
          ? "July 2026"
          : "AY 2025–26";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Attendance
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Capture and review student attendance by section
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SectionPicker value={section} onChange={setSection} />
          <DateNav label={dateLabel} onPrev={() => {}} onNext={() => {}} />
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          {VIEW_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setView(t.key)}
              className={`px-3.5 py-1.5 text-sm rounded-md font-medium transition ${
                view === t.key
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* View content */}
      {view === "daily" && <DailyCapture sectionIdx={sectionIdx} />}
      {view === "weekly" && <WeeklyView sectionIdx={sectionIdx} />}
      {view === "monthly" && <MonthlyView sectionIdx={sectionIdx} />}
      {view === "yearly" && <YearlyView sectionIdx={sectionIdx} />}
    </div>
  );
}
