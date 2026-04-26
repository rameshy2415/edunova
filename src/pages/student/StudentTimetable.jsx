import React, { useState } from "react";
import { PageHeader, Card, Badge } from "../../components/common";

const DAYS    = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = ["8:00–9:00", "9:00–10:00", "10:00–11:00", "11:15–12:15", "12:15–1:15", "2:00–3:00", "3:00–4:00"];

const GRID = {
  Monday:    ["Mathematics", "English",        "Science",        "Break", "Hindi",          "Computer Sci.", "Phys. Ed."],
  Tuesday:   ["Science",     "Social Studies", "Mathematics",    "Break", "English",        "Hindi",         "Art"],
  Wednesday: ["English",     "Mathematics",    "Hindi",          "Break", "Science",        "Phys. Ed.",     "Computer Sci."],
  Thursday:  ["Hindi",       "Computer Sci.",  "English",        "Break", "Mathematics",    "Science",       "Social Studies"],
  Friday:    ["Social Std.", "Science",        "Phys. Ed.",      "Break", "Computer Sci.",  "Mathematics",   "English"],
  Saturday:  ["Mathematics", "Hindi",          "English",        "Break", "—",              "—",             "—"],
};

const SUBJECT_INFO = {
  "Mathematics":    { teacher: "Mr. Kapoor",  room: "R-101", color: "bg-cobalt-light text-cobalt border-cobalt/20" },
  "English":        { teacher: "Ms. D'Souza", room: "R-204", color: "bg-sage-light text-sage border-sage/20" },
  "Science":        { teacher: "Dr. Rao",     room: "Lab-2", color: "bg-rose-light text-rose border-rose/20" },
  "Hindi":          { teacher: "Mr. Menon",   room: "R-102", color: "bg-amber-light text-amber border-amber/20" },
  "Social Studies": { teacher: "Ms. Iyer",    room: "R-302", color: "bg-cobalt-light text-cobalt border-cobalt/20" },
  "Social Std.":    { teacher: "Ms. Iyer",    room: "R-302", color: "bg-cobalt-light text-cobalt border-cobalt/20" },
  "Computer Sci.":  { teacher: "Ms. Pillai",  room: "Lab-1", color: "bg-sage-light text-sage border-sage/20" },
  "Phys. Ed.":      { teacher: "Mr. Sharma",  room: "Ground",color: "bg-amber-light text-amber border-amber/20" },
  "Art":            { teacher: "Ms. Verma",   room: "Art-Rm",color: "bg-rose-light text-rose border-rose/20" },
};

const SHORT = { Monday:"Mon", Tuesday:"Tue", Wednesday:"Wed", Thursday:"Thu", Friday:"Fri", Saturday:"Sat" };
const TODAY_DAY = DAYS[Math.min(new Date().getDay() - 1, 5)] || "Monday";

export default function StudentTimetable() {
  const [view, setView]         = useState("grid");
  const [activeDay, setActiveDay] = useState(TODAY_DAY);

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Timetable"
        subtitle="Class 9-A · Academic Year 2025–26"
      />

      {/* Today highlight */}
      <div className="bg-cobalt rounded-2xl p-4 flex flex-wrap items-center gap-4 relative overflow-hidden">
        <div className="absolute right-4 top-0 bottom-0 w-24 bg-white/5 rounded-full pointer-events-none" />
        <div>
          <div className="text-cobalt-light text-xs font-semibold uppercase tracking-wide">Today — {activeDay}</div>
          <div className="text-white font-serif text-lg mt-0.5">
            {GRID[activeDay].filter((s) => s !== "Break" && s !== "—").length} classes scheduled
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {GRID[activeDay].filter((s) => s !== "Break" && s !== "—").map((subj) => (
            <span key={subj} className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-lg border border-white/10">{subj}</span>
          ))}
        </div>
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
                  {DAYS.map((d) => (
                    <th key={d} className={`text-center text-xs font-semibold px-2 py-3 border-b border-ink/5 ${d === activeDay ? "text-cobalt bg-cobalt-light/20" : "text-ink/40"}`}>
                      <button className="hover:text-cobalt transition-colors" onClick={() => { setActiveDay(d); setView("day"); }}>{SHORT[d]}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period, pi) => (
                  <tr key={period}>
                    <td className="px-4 py-2 text-xs text-ink/40 border-b border-ink/5 font-mono whitespace-nowrap">{period}</td>
                    {DAYS.map((day) => {
                      const subj   = GRID[day][pi];
                      const info   = SUBJECT_INFO[subj];
                      const isBreak = subj === "Break";
                      const isFree  = subj === "—";
                      return (
                        <td key={day} className={`px-1.5 py-1.5 border-b border-ink/5 ${day === activeDay ? "bg-cobalt-light/10" : ""}`}>
                          {isBreak ? (
                            <div className="text-center text-[10px] text-ink/20 py-1">break</div>
                          ) : isFree ? (
                            <div className="text-center text-[10px] text-ink/15 py-1">—</div>
                          ) : info ? (
                            <div className={`rounded-lg border px-1.5 py-1.5 ${info.color}`}>
                              <div className="text-[11px] font-semibold leading-tight">{subj}</div>
                              <div className="text-[10px] opacity-50">{info.room}</div>
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DAYS.map((d) => (
              <button key={d} onClick={() => setActiveDay(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeDay === d ? "bg-cobalt text-white shadow-sm shadow-cobalt/20" : "bg-white border border-ink/8 text-ink/60 hover:border-cobalt/30"}`}>
                {d}
              </button>
            ))}
          </div>

          <Card>
            <div className="space-y-3">
              {PERIODS.map((period, pi) => {
                const subj   = GRID[activeDay][pi];
                const info   = SUBJECT_INFO[subj];
                const isBreak = subj === "Break";
                const isFree  = subj === "—";
                return (
                  <div key={period} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${info ? info.color : "border-ink/5 bg-parchment/30"}`}>
                    <div className="min-w-[90px]">
                      <div className="text-xs font-mono text-ink/40">{period}</div>
                      <div className="text-[10px] text-ink/25 mt-0.5">Period {pi + 1}</div>
                    </div>
                    {isBreak ? (
                      <div className="text-sm text-ink/30 italic">Lunch / Break</div>
                    ) : isFree ? (
                      <div className="text-sm text-ink/25 italic">Free period</div>
                    ) : info ? (
                      <>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{subj}</div>
                          <div className="text-[11px] opacity-60 mt-0.5">👨‍🏫 {info.teacher} · 📍 {info.room}</div>
                        </div>
                        <Badge variant="info">{info.room}</Badge>
                      </>
                    ) : null}
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