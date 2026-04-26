import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Button, Badge } from "../../components/common";

const MY_CLASSES = ["9-A", "10-B", "8-A", "9-B"];

const ROSTER = [
  { id: 1, roll: "01", name: "Aryan Mehta",   avatar: "AM" },
  { id: 2, roll: "02", name: "Bhavna Singh",  avatar: "BS" },
  { id: 3, roll: "03", name: "Chirag Patel",  avatar: "CP" },
  { id: 4, roll: "04", name: "Deepika Rao",   avatar: "DR" },
  { id: 5, roll: "05", name: "Eshan Kumar",   avatar: "EK" },
  { id: 6, roll: "06", name: "Farida Shaikh", avatar: "FS" },
  { id: 7, roll: "07", name: "Gaurav Nair",   avatar: "GN" },
  { id: 8, roll: "08", name: "Harsha Iyer",   avatar: "HI" },
];

const STATUS_BTN = {
  P: { active: "bg-sage text-white", idle: "bg-sage-light text-sage hover:bg-sage/20", label: "P" },
  A: { active: "bg-rose text-white", idle: "bg-rose-light text-rose hover:bg-rose/20", label: "A" },
  L: { active: "bg-amber text-white", idle: "bg-amber-light text-amber hover:bg-amber/20", label: "L" },
};

const STATUS_ROW_BG = { P: "border-sage/20 bg-sage-light/30", A: "border-rose/20 bg-rose-light/30", L: "border-amber/20 bg-amber-light/30", "": "border-ink/5 bg-white" };

export default function TeacherAttendance() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const [selectedClass, setSelectedClass] = useState("9-A");
  const [attendance, setAttendance]       = useState({});
  const [saved, setSaved]                 = useState(false);
  const [submitting, setSubmitting]       = useState(false);

  const students = ROSTER;
  const mark = (id, val) => { setAttendance((p) => ({ ...p, [id]: val })); setSaved(false); };
  const markAll = (val) => {
    const o = {};
    students.forEach((s) => (o[s.id] = val));
    setAttendance(o);
    setSaved(false);
  };

  const presentCount = students.filter((s) => attendance[s.id] === "P").length;
  const absentCount  = students.filter((s) => attendance[s.id] === "A").length;
  const lateCount    = students.filter((s) => attendance[s.id] === "L").length;
  const unmarked     = students.filter((s) => !attendance[s.id]).length;

  const handleSubmit = () => {
    setSubmitting(true);
    // → Real call: await studentsApi.markBulkAttendance({ classId: selectedClass, date: todayISO(), records: attendance })
    setTimeout(() => {
      setSubmitting(false);
      setSaved(true);
    }, 900);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mark Attendance"
        subtitle={today}
        actions={
          <Button onClick={handleSubmit} loading={submitting} size="sm">
            {saved ? "✓ Submitted!" : "Submit attendance"}
          </Button>
        }
      />

      {saved && (
        <div className="flex items-center gap-3 bg-sage-light text-sage px-4 py-3 rounded-xl text-sm font-medium border border-sage/20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 11l3 3L22 4"/></svg>
          Attendance for class {selectedClass} submitted successfully for {today}.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Class selector */}
        <Card>
          <CardHeader title="Select class" />
          <div className="space-y-2">
            {MY_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => { setSelectedClass(cls); setAttendance({}); setSaved(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedClass === cls
                    ? "bg-cobalt text-white border-cobalt shadow-sm"
                    : "border-ink/8 text-ink/70 hover:border-cobalt/30 hover:text-ink"
                }`}
              >
                <span>Class {cls}</span>
                {selectedClass === cls && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 11l3 3L22 4"/>
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-5 pt-4 border-t border-ink/5">
            <div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-3">Today's summary</div>
            <div className="space-y-2">
              {[
                ["Present", presentCount, "text-sage"],
                ["Absent",  absentCount,  "text-rose"],
                ["Late",    lateCount,    "text-amber"],
                ["Unmarked",unmarked,     "text-ink/40"],
              ].map(([label, count, color]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-ink/50">{label}</span>
                  <span className={`text-sm font-bold ${color}`}>{count}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            {Object.keys(attendance).length > 0 && (
              <div className="mt-3 h-2 bg-parchment rounded-full overflow-hidden flex">
                <div className="bg-sage transition-all" style={{ width: `${(presentCount / students.length) * 100}%` }} />
                <div className="bg-rose transition-all"  style={{ width: `${(absentCount  / students.length) * 100}%` }} />
                <div className="bg-amber transition-all" style={{ width: `${(lateCount    / students.length) * 100}%` }} />
              </div>
            )}
          </div>
        </Card>

        {/* Attendance grid */}
        <Card className="lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-serif text-base text-ink">Class {selectedClass}</h3>
              <p className="text-xs text-ink/40 mt-0.5">{students.length} students</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markAll("P")}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sage-light text-sage border border-sage/20 hover:bg-sage/10 transition-colors"
              >
                All present
              </button>
              <button
                onClick={() => markAll("A")}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-light text-rose border border-rose/20 hover:bg-rose/10 transition-colors"
              >
                All absent
              </button>
              <button
                onClick={() => setAttendance({})}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-ink/12 text-ink/50 hover:bg-parchment transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4">
            {[["P", "Present", "bg-sage text-white"], ["A", "Absent", "bg-rose text-white"], ["L", "Late / Leave", "bg-amber text-white"]].map(([code, label, cls]) => (
              <div key={code} className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${cls}`}>{code}</span>
                <span className="text-xs text-ink/50">{label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {students.map((s) => {
              const val = attendance[s.id] || "";
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${STATUS_ROW_BG[val]}`}
                >
                  <span className="font-mono text-xs text-ink/35 min-w-[24px]">{s.roll}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                      val === "P" ? "bg-sage text-white" : val === "A" ? "bg-rose text-white" : val === "L" ? "bg-amber text-white" : "bg-cobalt-light text-cobalt"
                    }`}
                  >
                    {s.avatar}
                  </div>
                  <span className="flex-1 text-sm font-medium text-ink">{s.name}</span>

                  <div className="flex gap-1.5">
                    {["P", "A", "L"].map((code) => (
                      <button
                        key={code}
                        onClick={() => mark(s.id, code)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          val === code ? STATUS_BTN[code].active : STATUS_BTN[code].idle
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}