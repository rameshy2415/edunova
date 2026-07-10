import React, { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, CardHeader, Badge, Button, Spinner } from "../../components/common";
import { formatDayAndTime, formatDateTimeDay } from "../../utils/index"
// import { studentsApi } from "../../api/studentsApi";

/* ------------------------------------------------------------------------
   SectionAttendanceStatus
   ------------------------------------------------------------------------
   A "which sections have already marked attendance today" dashboard.

   Drop-in usage once wired to your API:

     <SectionAttendanceStatus
       sections={section}                 // same shape as AttendancePage's `section` state: [{id, name}]
       fetchStatus={studentsApi.getSectionAttendanceStatus}   // (date) => Promise<StatusRow[]>
     />

   `fetchStatus(date)` is expected to resolve to an array shaped like:
     [{
       sectionId, sectionName,
       marked: boolean,
       markedAt: "10:12 AM" | null,
       markedBy: "Priya Nair" | null,
       total, present, absent, late,
       records: [{ id, roll, name, status: "PRESENT"|"ABSENT"|"LATE" }]
     }]

   Until that endpoint exists, this component falls back to seeded demo data
   (same deterministic pattern used elsewhere in the attendance module) so it
   renders and behaves correctly out of the box.
------------------------------------------------------------------------- */

const DEMO_SECTIONS = [
  { id: "6-A", name: "6-A" }, { id: "6-B", name: "6-B" }, { id: "6-C", name: "6-C" },
  { id: "7-A", name: "7-A" }, { id: "7-B", name: "7-B" },
  { id: "8-A", name: "8-A" }, { id: "8-B", name: "8-B" },
  { id: "9-A", name: "9-A" }, { id: "9-B", name: "9-B" },
  { id: "10-A", name: "10-A" }, { id: "10-B", name: "10-B" },
];

const DEMO_NAMES = [
  "Aryan Mehta", "Bhavna Singh", "Chirag Patel", "Deepika Rao", "Eshan Kumar",
  "Farida Shaikh", "Gaurav Nair", "Harsha Iyer", "Isha Kapoor", "Jatin Rawal",
];

function seededPct(seed) {
  return Math.abs(Math.sin(seed) * 10000) % 1;
}
function classSeed(cls) {
  return cls.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

// Demo fallback: deterministically decides, per section/date, whether
// attendance has been marked yet and generates a plausible records if so.
function demoFetchStatus(date) {
  const dateSeed = new Date(date).getDate();
  return DEMO_SECTIONS.map((sec) => {
    const base = classSeed(sec.id) + dateSeed * 11;
    const marked = seededPct(base * 0.9) > 0.2; // most sections marked, a few pending
    if (!marked) {
      return { sectionId: sec.id, sectionName: sec.name, marked: false, markedAt: null, markedBy: null, total: 0, present: 0, absent: 0, late: 0, records: [] };
    }
    const total = 8;
    const records = Array.from({ length: total }, (_, i) => {
      const r = seededPct(base * 0.6 + i * 7.3);
      const status = r > 0.93 ? "ABSENT" : r > 0.85 ? "LATE" : "PRESENT";
      return { id: `${sec.id}-${i}`, roll: i + 1, name: DEMO_NAMES[i], status };
    });
    return {
      sectionId: sec.id,
      sectionName: sec.name,
      marked: true,
      markedAt: `${8 + (dateSeed % 2)}:${(base % 6) * 10 || "00"} AM`,
      markedBy: ["Priya Nair", "Ramesh Iyer", "Anjali Verma"][dateSeed % 3],
      total,
      present: records.filter((r) => r.status === "PRESENT").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      late: records.filter((r) => r.status === "LATE").length,
      records,
    };
  });
}

const TONE = {
  sage:  { text: "text-sage",  bg: "bg-sage-light",  avatar: "bg-sage-light text-sage" },
  rose:  { text: "text-rose",  bg: "bg-rose-light",  avatar: "bg-rose-light text-rose" },
  amber: { text: "text-amber", bg: "bg-amber-light", avatar: "bg-amber-light text-amber" },
};

function SectionRosterModal({ row, onClose }) {
  if (!row) return null;
  const groups = [
    { key: "PRESENT", title: "Present", tone: "sage" },
    { key: "ABSENT", title: "Absent", tone: "rose" },
    { key: "LATE", title: "Late", tone: "amber" },
  ];
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-ink/8">
          <div>
            <p className="text-xs text-ink/40 mb-0.5">Marked by {row.markedBy} · {formatDateTimeDay(row.markedAt)}</p>
            <h3 className="font-serif text-lg font-semibold text-ink">Section {row.sectionName}</h3>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink w-8 h-8 rounded-lg hover:bg-parchment flex items-center justify-center">✕</button>
        </div>
        <div className="p-5 space-y-5">
          {groups.map(({ key, title, tone }) => {
            const list = row.records.filter((r) => r.status === key);
            if (list.length === 0) return null;
            const t = TONE[tone];
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-semibold ${t.text}`}>{title}</h4>
                  <Badge variant={tone}>{list.length}</Badge>
                </div>
                <div className="space-y-1.5">
                  {list.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-parchment/50">
                      <span className="text-xs text-ink/40 font-mono w-6">{String(s.roll).padStart(2, "0")}</span>
                      <span className="text-sm text-ink">{s.name}</span>
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

function SectionCard({ row, onView, handleTabChange }) {
  if (!row.marked) {
    return (
      <div className="rounded-xl border border-dashed border-amber/30 bg-amber-light/30 p-4 flex flex-col justify-between min-h-[120px]">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-ink">{row.sectionName}</span>
            <Badge variant="amber">Pending</Badge>
          </div>
          <p className="text-xs text-ink/50">Attendance not marked yet</p>
        </div>
        <Button size="sm" variant="ghost" className="mt-3 self-start" onClick={() => handleTabChange("daily", row.sectionId)}>Mark now</Button>
      </div>
    );
  }

  const pct = Math.round((row.present / row.total) * 100);
  return (
    <button onClick={() => onView(row)} className="text-left rounded-xl border border-ink/8 bg-white p-4 hover:border-cobalt/30 hover:shadow-sm transition-all min-h-[120px]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-ink">{row.sectionName}</span>
        <Badge variant="sage">Marked</Badge>
      </div>
      <p className="text-xs text-ink/40 mb-2.5">{formatDayAndTime(row.markedAt)} · {row.markedBy}</p>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-sage font-medium">{row.present} present</span>
        {row.absent > 0 && <span className="text-rose font-medium">{row.absent} absent</span>}
        {row.late > 0 && <span className="text-amber font-medium">{row.late} late</span>}
      </div>
      <div className="h-1.5 bg-parchment rounded-full overflow-hidden mt-2">
        <div className="h-full bg-sage rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </button>
  );
}

export default function SectionAttendanceStatus({ sections = DEMO_SECTIONS, fetchStatus, tabChange }) {
  console.log("SectionAttendanceStatus render",  sections); 
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    getAllAttendance();
  }, [date]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
       const data = fetchStatus
          ? await fetchStatus(date)
          : demoFetchStatus(date);
      console.log("Data that need to render", data);
      setRows(data);
    } catch (err) {
      setError(err.message || "Failed to load attendance status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const getAllAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          date: date,
        };
        const { data } = await fetchStatus(params);
        console.log("Data that need to render", data?.content);
        setRows(data?.content);
      } catch (err) {
        setError(
          err.message || "Failed to load attendance status. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

  const markedCount = rows.filter((r) => r.marked).length;
  const totalPresent = rows.reduce((a, r) => a + (r.present || 0), 0);
  const totalAbsent = rows.reduce((a, r) => a + (r.absent || 0), 0);

  const shiftDate = (delta) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Attendance status"
        subtitle="Which sections have marked attendance"
        actions={
          <div className="flex items-center gap-1 rounded-lg border border-ink/10 bg-white px-1 py-1">
            <button onClick={() => shiftDate(-1)} className="p-1.5 rounded-md hover:bg-parchment text-ink/50">‹</button>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm px-2 py-1 outline-none bg-transparent"
            />
            <button onClick={() => shiftDate(1)} disabled={date >= new Date().toISOString().slice(0, 10)} className="p-1.5 rounded-md hover:bg-parchment text-ink/50 disabled:opacity-30">›</button>
          </div>
        }
      />

      {error && (
        <div className="flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Sections marked</p>
          <p className="font-serif text-xl font-semibold text-ink">{markedCount} <span className="text-sm text-ink/40 font-sans">/ {rows.length}</span></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Pending</p>
          <p className="font-serif text-xl font-semibold text-amber">{rows.length - markedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Present (marked so far)</p>
          <p className="font-serif text-xl font-semibold text-sage">{totalPresent}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Absent (marked so far)</p>
          <p className="font-serif text-xl font-semibold text-rose">{totalAbsent}</p>
        </Card>
      </div>

      {/* Section grid */}
      <Card>
        <CardHeader title="Sections" />
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Spinner />
            <p className="font-serif text-lg text-ink/40 mt-2">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {rows.map((row) => (
              <SectionCard key={row.sectionId} row={row} onView={setSelectedRow} handleTabChange={tabChange} />
            ))}
          </div>
        )}
      </Card>

      <SectionRosterModal row={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  );
}