import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Button, Badge } from "../../components/common";

const MY_CLASSES = ["9-A", "10-B", "8-A", "9-B"];

const EXAMS = ["Unit Test 1", "Unit Test 2", "Mid-Term", "Unit Test 3", "Final Exam"];

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

const SEED_GRADES = { 1: 78, 2: 91, 3: 62, 4: 45, 5: 83, 6: 96, 7: 71, 8: 88 };

function letterGrade(marks, max) {
  const p = (marks / max) * 100;
  if (p >= 90) return { grade: "A+", color: "text-sage" };
  if (p >= 80) return { grade: "A",  color: "text-sage" };
  if (p >= 70) return { grade: "B+", color: "text-cobalt" };
  if (p >= 60) return { grade: "B",  color: "text-cobalt" };
  if (p >= 50) return { grade: "C",  color: "text-amber" };
  if (p >= 35) return { grade: "D",  color: "text-amber" };
  return { grade: "F", color: "text-rose" };
}

export default function TeacherGrades() {
  const [selectedClass, setSelectedClass] = useState("9-A");
  const [selectedExam, setSelectedExam]   = useState("Unit Test 2");
  const [maxMarks, setMaxMarks]           = useState(100);
  const [grades, setGrades]               = useState({ ...SEED_GRADES });
  const [published, setPublished]         = useState(false);
  const [saving, setSaving]               = useState(false);

  const handleGradeChange = (id, val) => {
    const num = Math.min(maxMarks, Math.max(0, Number(val) || 0));
    setGrades((p) => ({ ...p, [id]: num }));
    setPublished(false);
  };

  const handlePublish = () => {
    setSaving(true);
    // → Real: await studentsApi.addGrade(id, { exam: selectedExam, marks: grades[id], max: maxMarks })
    setTimeout(() => { setSaving(false); setPublished(true); }, 900);
  };

  const entered   = Object.values(grades).filter((v) => v !== undefined).length;
  const average   = entered ? Math.round(Object.values(grades).reduce((s, v) => s + (v || 0), 0) / entered) : 0;
  const highest   = entered ? Math.max(...Object.values(grades)) : 0;
  const lowest    = entered ? Math.min(...Object.values(grades)) : 0;
  const passCount = Object.values(grades).filter((v) => v >= 35).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Enter Grades"
        subtitle="Enter exam results and publish to students"
        actions={
          <Button onClick={handlePublish} loading={saving} size="sm">
            {published ? "✓ Published!" : "Publish results"}
          </Button>
        }
      />

      {published && (
        <div className="flex items-center gap-3 bg-sage-light text-sage px-4 py-3 rounded-xl text-sm font-medium border border-sage/20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 11l3 3L22 4"/></svg>
          Results for {selectedExam} — {selectedClass} published! Students and parents have been notified.
        </div>
      )}

      {/* Controls */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs font-semibold text-ink/40 uppercase tracking-wide block mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setPublished(false); }}
              className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
            >
              {MY_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/40 uppercase tracking-wide block mb-1">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => { setSelectedExam(e.target.value); setPublished(false); }}
              className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
            >
              {EXAMS.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/40 uppercase tracking-wide block mb-1">Max marks</label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value) || 100)}
              className="w-24 bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none"
            />
          </div>

          {/* Live stats */}
          <div className="flex gap-4 ml-auto">
            {[["Average", average], ["Highest", highest], ["Lowest", lowest], [`Pass (≥35)`, `${passCount}/${entered}`]].map(([l, v]) => (
              <div key={l} className="text-center">
                <div className="font-serif text-lg font-semibold text-ink">{v}</div>
                <div className="text-[10px] text-ink/40">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grade entry table */}
        <Card className="lg:col-span-2">
          <CardHeader title={`${selectedClass} · ${selectedExam} · Max ${maxMarks}`} />
          <div className="space-y-2">
            {ROSTER.map((s) => {
              const val   = grades[s.id] ?? "";
              const { grade, color } = typeof val === "number" ? letterGrade(val, maxMarks) : { grade: "—", color: "text-ink/25" };
              const pct   = typeof val === "number" ? Math.round((val / maxMarks) * 100) : 0;

              return (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-parchment/50 hover:bg-parchment transition-colors">
                  <span className="font-mono text-xs text-ink/35 min-w-[24px]">{s.roll}</span>
                  <div className="w-8 h-8 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {s.avatar}
                  </div>
                  <span className="flex-1 text-sm font-medium text-ink">{s.name}</span>

                  {/* Progress bar */}
                  <div className="hidden sm:block w-24 h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 80 ? "#3A6B4F" : pct >= 60 ? "#B85C1A" : pct >= 35 ? "#B85C1A" : "#A0334A",
                      }}
                    />
                  </div>

                  <input
                    type="number"
                    min={0}
                    max={maxMarks}
                    value={val}
                    onChange={(e) => handleGradeChange(s.id, e.target.value)}
                    placeholder="—"
                    className="w-16 text-center bg-white border border-ink/12 rounded-lg px-2 py-1.5 text-sm text-ink outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt/20 transition-all"
                  />
                  <span className={`text-sm font-bold min-w-[28px] text-right ${color}`}>{grade}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Grade distribution preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Grade distribution" />
            {[
              ["A+ / A", (v) => v >= 80, "bg-sage"],
              ["B+  / B", (v) => v >= 60 && v < 80, "bg-cobalt"],
              ["C  / D",  (v) => v >= 35 && v < 60, "bg-amber"],
              ["F",       (v) => v < 35,  "bg-rose"],
            ].map(([label, fn, color]) => {
              const count = Object.values(grades).filter((v) => typeof v === "number" && fn((v / maxMarks) * 100)).length;
              return (
                <div key={label} className="flex items-center gap-2 mb-3 last:mb-0">
                  <span className="text-xs text-ink/50 w-16">{label}</span>
                  <div className="flex-1 h-2 bg-parchment rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / ROSTER.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-ink w-4 text-right">{count}</span>
                </div>
              );
            })}
          </Card>

          <Card>
            <CardHeader title="Past exams" />
            <div className="space-y-0">
              {EXAMS.filter((e) => e !== selectedExam).map((exam, i) => (
                <div key={exam} className="flex items-center justify-between py-2.5 border-b border-ink/5 last:border-0">
                  <span className="text-sm text-ink">{exam}</span>
                  <Badge variant={i < 2 ? "success" : "neutral"}>{i < 2 ? "Published" : "Draft"}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}