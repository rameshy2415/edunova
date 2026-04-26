import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Badge, Button } from "../../components/common";

const CLASSES = ["6-A", "6-B", "6-C", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B", "11-A", "11-B"];

const STUDENTS = {
  "9-A": [
    { id: 1, roll: 1,  name: "Aryan Mehta",     avatar: "AR" },
    { id: 2, roll: 2,  name: "Bhavna Singh",    avatar: "BS" },
    { id: 3, roll: 3,  name: "Chirag Patel",    avatar: "CP" },
    { id: 4, roll: 4,  name: "Deepika Rao",     avatar: "DR" },
    { id: 5, roll: 5,  name: "Eshan Kumar",     avatar: "EK" },
    { id: 6, roll: 6,  name: "Farida Shaikh",   avatar: "FS" },
    { id: 7, roll: 7,  name: "Gaurav Nair",     avatar: "GN" },
    { id: 8, roll: 8,  name: "Harsha Iyer",     avatar: "HI" },
  ],
};

const ATT_SUMMARY = [
  { cls: "9-A",  pct: 96, present: 38, absent: 2 },
  { cls: "10-A", pct: 91, present: 35, absent: 3 },
  { cls: "8-B",  pct: 88, present: 33, absent: 4 },
  { cls: "11-B", pct: 94, present: 36, absent: 2 },
  { cls: "7-A",  pct: 79, present: 28, absent: 7 },
  { cls: "6-C",  pct: 97, present: 40, absent: 1 },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("9-A");
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const students = STUDENTS[selectedClass] || Array.from({ length: 5 }, (_, i) => ({ id: i + 1, roll: i + 1, name: `Student ${i + 1}`, avatar: "S" + (i + 1) }));

  const toggle = (id, val) => { setAttendance((p) => ({ ...p, [id]: val })); setSaved(false); };
  const markAll = (val) => { const o = {}; students.forEach((s) => (o[s.id] = val)); setAttendance(o); setSaved(false); };
  const presentCount = students.filter((s) => attendance[s.id] === "P").length;
  const absentCount  = students.filter((s) => attendance[s.id] === "A").length;
  const unmarked     = students.filter((s) => !attendance[s.id]).length;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance" subtitle={today}
        actions={<Button size="sm" onClick={handleSave}>{saved ? "✓ Saved!" : "Save attendance"}</Button>}
      />

      {/* Class summary cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {ATT_SUMMARY.map((a) => (
          <button key={a.cls} onClick={() => { setSelectedClass(a.cls); setAttendance({}); setSaved(false); }}
            className={`rounded-xl p-3 text-left transition-all ${selectedClass === a.cls ? "bg-cobalt text-white shadow-lg shadow-cobalt/20" : "bg-white border border-ink/8 hover:border-cobalt/30"}`}>
            <div className={`text-xs font-semibold mb-1 ${selectedClass === a.cls ? "text-white/70" : "text-ink/50"}`}>{a.cls}</div>
            <div className={`font-serif text-lg font-semibold ${selectedClass === a.cls ? "text-white" : "text-ink"}`}>{a.pct}%</div>
            <div className={`text-[11px] ${selectedClass === a.cls ? "text-white/60" : "text-ink/40"}`}>{a.absent} absent</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Mark attendance */}
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setAttendance({}); }}
                className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium text-ink outline-none cursor-pointer">
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <span className="text-sm text-ink/50">{students.length} students</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => markAll("P")} className="text-xs px-3 py-1.5 rounded-lg bg-sage-light text-sage border border-sage/20 font-medium hover:bg-sage/10 transition-colors">Mark all present</button>
              <button onClick={() => markAll("A")} className="text-xs px-3 py-1.5 rounded-lg bg-rose-light text-rose border border-rose/20 font-medium hover:bg-rose/10 transition-colors">Mark all absent</button>
            </div>
          </div>

          {/* Progress bar */}
          {Object.keys(attendance).length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-ink/50 mb-1.5">
                <span>Present: <strong className="text-sage">{presentCount}</strong></span>
                <span>Absent: <strong className="text-rose">{absentCount}</strong></span>
                <span>Unmarked: <strong className="text-amber">{unmarked}</strong></span>
              </div>
              <div className="h-2 bg-parchment rounded-full overflow-hidden flex">
                <div className="bg-sage transition-all" style={{ width: `${(presentCount / students.length) * 100}%` }}/>
                <div className="bg-rose transition-all" style={{ width: `${(absentCount / students.length) * 100}%` }}/>
              </div>
            </div>
          )}

          {/* Student list */}
          <div className="space-y-2">
            {students.map((s) => {
              const val = attendance[s.id];
              return (
                <div key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${val === "P" ? "border-sage/30 bg-sage-light/40" : val === "A" ? "border-rose/30 bg-rose-light/40" : "border-ink/5 bg-parchment/50"}`}>
                  <span className="text-xs text-ink/40 min-w-[28px] font-mono">{String(s.roll).padStart(2, "0")}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${val === "P" ? "bg-sage text-white" : val === "A" ? "bg-rose text-white" : "bg-cobalt-light text-cobalt"}`}>{s.avatar}</div>
                  <span className="flex-1 text-sm font-medium text-ink">{s.name}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => toggle(s.id, "P")}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${val === "P" ? "bg-sage text-white shadow-sm" : "bg-sage-light text-sage hover:bg-sage/20"}`}>P</button>
                    <button onClick={() => toggle(s.id, "A")}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${val === "A" ? "bg-rose text-white shadow-sm" : "bg-rose-light text-rose hover:bg-rose/20"}`}>A</button>
                    <button onClick={() => toggle(s.id, "L")}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${val === "L" ? "bg-amber text-white shadow-sm" : "bg-amber-light text-amber hover:bg-amber/20"}`}>L</button>
                  </div>
                </div>
              );
            })}
          </div>

          {saved && (
            <div className="mt-4 flex items-center gap-2 bg-sage-light text-sage px-4 py-3 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 11l3 3L22 4"/></svg>
              Attendance saved successfully for class {selectedClass}!
            </div>
          )}
        </Card>

        {/* Right: Legend + Monthly summary */}
        <div className="space-y-5">
          <Card>
            <CardHeader title="Legend" />
            <div className="space-y-2">
              {[["P", "bg-sage text-white", "Present"], ["A", "bg-rose text-white", "Absent"], ["L", "bg-amber text-white", "Late / Leave"]].map(([code, cls, label]) => (
                <div key={code} className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${cls}`}>{code}</span>
                  <span className="text-sm text-ink">{label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="This month" />
            <div className="space-y-3">
              {ATT_SUMMARY.map((a) => (
                <div key={a.cls}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-ink">{a.cls}</span>
                    <span className="text-xs font-semibold text-ink">{a.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full bg-cobalt rounded-full" style={{ width: `${a.pct}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
