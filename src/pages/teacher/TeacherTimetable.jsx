import React, { useState } from "react";
import { PageHeader, Card, Badge } from "../../components/common";

const DAYS    = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = ["8:00–9:00", "9:00–10:00", "10:00–11:00", "11:15–12:15", "12:15–1:15", "2:00–3:00", "3:00–4:00"];

// Teacher's personal timetable — subject only when they're teaching
const MY_GRID = {
  Monday:    ["9-A Maths",  null,          "8-A Maths",  "Break", null,          "9-B Maths",  null],
  Tuesday:   [null,          "10-B Maths", null,          "Break", "8-A Maths",  null,          null],
  Wednesday: ["9-B Maths",  null,          "9-A Maths",  "Break", null,          "10-B Maths", null],
  Thursday:  [null,          "9-A Maths",  null,          "Break", "10-B Maths", null,          "8-A Maths"],
  Friday:    ["10-B Maths", null,          null,          "Break", "9-B Maths",  "9-A Maths",  null],
  Saturday:  ["9-A Maths",  "8-A Maths",  null,          "Break", null,          null,          null],
};

const CLASS_COLORS = {
  "9-A Maths":  "bg-cobalt-light text-cobalt border-cobalt/20",
  "10-B Maths": "bg-sage-light text-sage border-sage/20",
  "8-A Maths":  "bg-amber-light text-amber border-amber/20",
  "9-B Maths":  "bg-rose-light text-rose border-rose/20",
};

const CLASS_ROOMS = {
  "9-A Maths":  "R-101",
  "10-B Maths": "R-205",
  "8-A Maths":  "R-101",
  "9-B Maths":  "R-103",
};

const TODAY_IDX = Math.min(new Date().getDay() - 1, 5); // 0=Mon … 5=Sat
const SHORT = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };

export default function TeacherTimetable() {
  const [view, setView]       = useState("grid");
  const [activeDay, setActiveDay] = useState(DAYS[Math.max(0, TODAY_IDX)]);

  // Total classes per week
  const totalClasses = Object.values(MY_GRID).flat().filter(Boolean).filter((v) => v !== "Break").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Timetable"
        subtitle="Mr. Suresh Kapoor · Mathematics · Weekly schedule"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Classes / week", value: totalClasses,   color: "bg-cobalt-light text-cobalt" },
          { label: "Students total", value: "159",          color: "bg-sage-light text-sage" },
          { label: "Free periods",   value: Object.values(MY_GRID).flat().filter((v) => v === null).length, color: "bg-amber-light text-amber" },
          { label: "Working days",   value: "6",            color: "bg-rose-light text-rose" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-white border border-ink/8 rounded-xl p-1 w-fit">
        {["grid", "day"].map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${view === v ? "bg-cobalt text-white shadow-sm" : "text-ink/50 hover:text-ink"}`}>
            {v === "grid" ? "Week grid" : "Day view"}
          </button>
        ))}
      </div>

      {view === "grid" ? (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-ink/40 px-4 py-3 border-b border-ink/5 w-28">Period</th>
                  {DAYS.map((d, i) => (
                    <th key={d} className={`text-center text-xs font-semibold px-3 py-3 border-b border-ink/5 ${i === TODAY_IDX ? "text-cobalt bg-cobalt-light/20" : "text-ink/40"}`}>
                      <button className="hover:text-cobalt transition-colors" onClick={() => { setActiveDay(d); setView("day"); }}>
                        {SHORT[d]}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period, pi) => (
                  <tr key={period} className="hover:bg-parchment/20 transition-colors">
                    <td className="px-4 py-2 text-xs text-ink/40 border-b border-ink/5 font-mono whitespace-nowrap">{period}</td>
                    {DAYS.map((day, di) => {
                      const cell = MY_GRID[day][pi];
                      const isBreak = cell === "Break";
                      const hasClass = cell && !isBreak;
                      return (
                        <td key={day} className={`px-2 py-1.5 border-b border-ink/5 ${di === TODAY_IDX ? "bg-cobalt-light/10" : ""}`}>
                          {isBreak ? (
                            <div className="text-center text-[10px] text-ink/20 py-1">break</div>
                          ) : hasClass ? (
                            <div className={`rounded-lg border px-2 py-2 text-[11px] font-semibold ${CLASS_COLORS[cell] || "bg-parchment text-ink"}`}>
                              <div>{cell}</div>
                              <div className="opacity-50 font-normal">{CLASS_ROOMS[cell]}</div>
                            </div>
                          ) : (
                            <div className="text-center text-[10px] text-ink/15 py-1">free</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 px-4 py-3 border-t border-ink/5">
            {Object.entries(CLASS_COLORS).map(([cls, color]) => (
              <div key={cls} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded border ${color}`} />
                <span className="text-xs text-ink/50">{cls}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DAYS.map((d, i) => (
              <button key={d} onClick={() => setActiveDay(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeDay === d ? "bg-cobalt text-white shadow-sm shadow-cobalt/20" : "bg-white border border-ink/8 text-ink/60 hover:border-cobalt/30"}`}>
                {d}
              </button>
            ))}
          </div>

          <Card>
            <div className="space-y-3">
              {PERIODS.map((period, pi) => {
                const cell = MY_GRID[activeDay][pi];
                const isBreak = cell === "Break";
                const hasClass = cell && !isBreak;
                return (
                  <div key={period} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${hasClass ? CLASS_COLORS[cell] : "border-ink/5 bg-parchment/30"}`}>
                    <div className="min-w-[90px]">
                      <div className="text-xs font-mono text-ink/40">{period}</div>
                      <div className="text-[10px] text-ink/25 mt-0.5">Period {pi + 1}</div>
                    </div>
                    {isBreak ? (
                      <div className="text-sm text-ink/30 italic">Lunch / Break</div>
                    ) : hasClass ? (
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{cell}</div>
                        <div className="text-[11px] opacity-60 mt-0.5">📍 {CLASS_ROOMS[cell]}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-ink/25 italic">Free period</div>
                    )}
                    {hasClass && <Badge variant="info">{CLASS_ROOMS[cell]}</Badge>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}