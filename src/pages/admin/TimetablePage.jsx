import React, { useState } from "react";
import { PageHeader, Card, Button } from "../../components/common";

const DAYS    = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = ["8:00–9:00", "9:00–10:00", "10:00–11:00", "11:15–12:15", "12:15–1:15", "2:00–3:00", "3:00–4:00"];

const GRID = {
  Monday:    ["Mathematics", "English", "Science", "Break", "Hindi", "Computer Sci.", "Phys. Ed."],
  Tuesday:   ["Science", "Social Std.", "Mathematics", "Break", "English", "Hindi", "Art"],
  Wednesday: ["English", "Mathematics", "Hindi", "Break", "Science", "Phys. Ed.", "Computer Sci."],
  Thursday:  ["Hindi", "Computer Sci.", "English", "Break", "Mathematics", "Science", "Social Std."],
  Friday:    ["Social Std.", "Science", "Phys. Ed.", "Break", "Computer Sci.", "Mathematics", "English"],
  Saturday:  ["Mathematics", "Hindi", "English", "Break", "—", "—", "—"],
};

const TEACHERS = {
  "Mathematics":    { teacher: "Mr. Kapoor",  room: "R-101", color: "bg-cobalt-light text-cobalt border-cobalt/20" },
  "English":        { teacher: "Ms. D'Souza", room: "R-204", color: "bg-sage-light text-sage border-sage/20" },
  "Science":        { teacher: "Dr. Rao",     room: "Lab-2", color: "bg-rose-light text-rose border-rose/20" },
  "Hindi":          { teacher: "Mr. Menon",   room: "R-102", color: "bg-amber-light text-amber border-amber/20" },
  "Social Std.":    { teacher: "Ms. Iyer",    room: "R-302", color: "bg-cobalt-light text-cobalt border-cobalt/20" },
  "Computer Sci.":  { teacher: "Ms. Pillai",  room: "Lab-1", color: "bg-sage-light text-sage border-sage/20" },
  "Phys. Ed.":      { teacher: "Mr. Sharma",  room: "Ground", color: "bg-amber-light text-amber border-amber/20" },
  "Art":            { teacher: "Ms. Verma",   room: "Art-Rm", color: "bg-rose-light text-rose border-rose/20" },
  "Break":          { teacher: "",            room: "", color: "bg-parchment text-ink/30 border-ink/8" },
  "—":              { teacher: "Free period", room: "", color: "bg-parchment text-ink/20 border-ink/5" },
};

const SHORT_DAYS = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };

export default function TimetablePage() {
  const [view, setView]     = useState("grid"); // "grid" | "day"
  const [activeDay, setActiveDay] = useState("Monday");
  const [classSelected, setClassSelected] = useState("9-A");

  const classes = ["6-A", "7-A", "8-B", "9-A", "10-A", "11-B"];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Timetable"
        subtitle={`Class ${classSelected} — Weekly schedule`}
        actions={
          <div className="flex items-center gap-2">
            <select value={classSelected} onChange={(e) => setClassSelected(e.target.value)}
              className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {classes.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Button variant="secondary" size="sm">Export PDF</Button>
            <Button size="sm">Edit timetable</Button>
          </div>
        }
      />

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
        /* ── GRID VIEW ── */
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-ink/40 px-4 py-3 border-b border-ink/5 w-28">Period</th>
                  {DAYS.map((d) => (
                    <th key={d} className={`text-center text-xs font-semibold px-3 py-3 border-b border-ink/5 ${activeDay === d ? "text-cobalt" : "text-ink/40"}`}>
                      <button onClick={() => { setActiveDay(d); setView("day"); }} className="hover:text-cobalt transition-colors">
                        {SHORT_DAYS[d]}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period, pi) => (
                  <tr key={period} className="hover:bg-parchment/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-ink/40 border-b border-ink/5 font-mono whitespace-nowrap">{period}</td>
                    {DAYS.map((day) => {
                      const subj  = GRID[day][pi];
                      const info  = TEACHERS[subj] || TEACHERS["—"];
                      const isBreak = subj === "Break";
                      return (
                        <td key={day} className="px-2 py-2 border-b border-ink/5">
                          {isBreak ? (
                            <div className="text-center text-[11px] text-ink/20 py-1">— break —</div>
                          ) : (
                            <div className={`rounded-lg border px-2 py-2 ${info.color}`}>
                              <div className="text-[11px] font-semibold truncate">{subj}</div>
                              {info.teacher && <div className="text-[10px] opacity-60 truncate">{info.teacher}</div>}
                              {info.room && <div className="text-[10px] opacity-50">{info.room}</div>}
                            </div>
                          )}
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
        /* ── DAY VIEW ── */
        <div className="space-y-4">
          {/* Day selector */}
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
                const subj  = GRID[activeDay][pi];
                const info  = TEACHERS[subj] || TEACHERS["—"];
                const isBreak = subj === "Break";
                return (
                  <div key={period} className={`flex items-center gap-4 p-4 rounded-xl border ${isBreak ? "border-ink/5 bg-parchment/50" : info.color}`}>
                    <div className="min-w-[90px]">
                      <div className="text-xs font-mono text-ink/40">{period}</div>
                      <div className="text-[11px] text-ink/30 mt-0.5">Period {pi + 1}</div>
                    </div>
                    {isBreak ? (
                      <div className="text-sm text-ink/30 italic">Lunch / Break</div>
                    ) : (
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-ink">{subj}</div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {info.teacher && <span className="text-xs text-ink/50">👨‍🏫 {info.teacher}</span>}
                          {info.room && <span className="text-xs text-ink/50">📍 {info.room}</span>}
                        </div>
                      </div>
                    )}
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
