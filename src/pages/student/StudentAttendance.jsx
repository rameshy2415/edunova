import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Badge } from "../../components/common";

// Simple calendar data — S=Sunday, P=Present, A=Absent, L=Late, H=Holiday
const APRIL_2026 = {
  month: "April 2026",
  startDay: 3, // 0=Sun, 3=Wed → Apr 1 is Wednesday
  days: 30,
  records: {
    1:"P",2:"P",3:"A",4:"H",5:"H",6:"P",7:"P",8:"P",9:"P",10:"P",
    11:"H",12:"H",13:"P",14:"P",15:"P",16:"P",17:"L",18:"H",19:"H",
    20:"P",21:"P",22:"P",23:"P",24:"P",25:"H",26:"H",27:"P",28:"P",
    29:"P",30:"P",
  },
};

const MONTHS = [
  { month: "January 2026",  present: 20, absent: 1, late: 0, holidays: 5, working: 21 },
  { month: "February 2026", present: 18, absent: 2, late: 1, holidays: 3, working: 21 },
  { month: "March 2026",    present: 21, absent: 0, late: 1, holidays: 5, working: 22 },
  { month: "April 2026",    present: 18, absent: 1, late: 1, holidays: 8, working: 20 },
];

const STATUS_COLORS = {
  P: "bg-sage text-white",
  A: "bg-rose text-white",
  L: "bg-amber text-white",
  H: "bg-parchment text-ink/30 text-xs",
};
const STATUS_LABEL = { P: "Present", A: "Absent", L: "Late", H: "Holiday" };

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StudentAttendance() {
  const [activeMonth, setActiveMonth] = useState("April 2026");
  const cal = APRIL_2026;

  const workingDays = Object.values(cal.records).filter((v) => v !== "H").length;
  const presentDays = Object.values(cal.records).filter((v) => v === "P").length;
  const absentDays  = Object.values(cal.records).filter((v) => v === "A").length;
  const lateDays    = Object.values(cal.records).filter((v) => v === "L").length;
  const attPct      = Math.round((presentDays / workingDays) * 100);

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < cal.startDay; i++) cells.push(null); // padding
  for (let d = 1; d <= cal.days; d++) cells.push(d);

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Attendance"
        subtitle="Class 9-A · Academic Year 2025–26"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Overall %",    value: attPct + "%",     color: attPct >= 85 ? "bg-sage-light text-sage" : "bg-rose-light text-rose" },
          { label: "Present",      value: presentDays,      color: "bg-sage-light text-sage" },
          { label: "Absent",       value: absentDays,       color: "bg-rose-light text-rose" },
          { label: "Late / Leave", value: lateDays,         color: "bg-amber-light text-amber" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {attPct < 75 && (
        <div className="flex items-center gap-3 bg-rose-light text-rose px-4 py-3 rounded-xl text-sm border border-rose/20">
          ⚠️ Your attendance is below 75%. Please contact your class teacher.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base text-ink">{cal.month}</h3>
            <div className="flex gap-3">
              {[["P", "bg-sage text-white", "Present"], ["A", "bg-rose text-white", "Absent"], ["L", "bg-amber text-white", "Late"], ["H", "bg-parchment text-ink/30 border border-ink/10", "Holiday"]].map(([code, cls, label]) => (
                <div key={code} className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${cls}`}>{code}</span>
                  <span className="text-[11px] text-ink/40 hidden sm:inline">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-ink/35 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} />;
              const status = cal.records[day];
              return (
                <div key={day} className="aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-medium transition-all">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs ${STATUS_COLORS[status] || "text-ink/20"}`}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-4 pt-4 border-t border-ink/5">
            <div className="flex justify-between text-xs text-ink/50 mb-1.5">
              <span>This month: <strong className="text-sage">{presentDays} present</strong> out of <strong>{workingDays} working days</strong></span>
              <span className={`font-semibold ${attPct >= 85 ? "text-sage" : "text-rose"}`}>{attPct}%</span>
            </div>
            <div className="h-2 bg-parchment rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${attPct}%` }} />
            </div>
          </div>
        </Card>

        {/* Monthly summary */}
        <Card>
          <CardHeader title="Monthly summary" />
          <div className="space-y-3">
            {MONTHS.map((m) => {
              const pct = Math.round((m.present / m.working) * 100);
              return (
                <div key={m.month} className={`p-3 rounded-xl border transition-all cursor-pointer ${m.month === activeMonth ? "border-cobalt bg-cobalt-light/30" : "border-ink/5 hover:border-ink/15"}`}
                  onClick={() => setActiveMonth(m.month)}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-ink">{m.month}</span>
                    <Badge variant={pct >= 90 ? "success" : pct >= 75 ? "warning" : "danger"}>{pct}%</Badge>
                  </div>
                  <div className="h-1.5 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full bg-cobalt rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-ink/40">
                    <span>✅ {m.present}</span>
                    <span>❌ {m.absent}</span>
                    {m.late > 0 && <span>⏰ {m.late}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-ink/5">
            <div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-2">Year-to-date</div>
            {[["Total working days", "84"], ["Days present", "77"], ["Days absent", "4"], ["Late / Leave", "3"], ["Overall %", "91.7%"]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 border-b border-ink/5 last:border-0">
                <span className="text-xs text-ink/50">{l}</span>
                <span className="text-xs font-semibold text-ink">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}