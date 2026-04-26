import React, { useState } from "react";
import {
  PageHeader, Card, CardHeader, Badge,
  Button, Table, Th, Td, EmptyState, Alert,
} from "../../components/common";

/* ─── Mock data ──────────────────────────────────────────── */
const CLASSES   = ["All classes", "6-A", "7-A", "8-B", "9-A", "10-A", "11-B"];
const SUBJECTS  = ["All subjects","Mathematics","English","Science","Social Studies","Hindi","Computer Sci."];
const EXAM_TYPES = ["Unit Test", "Mid-Term", "Final Exam", "Practical"];

const EXAMS = [
  { id: 1, name: "Unit Test 2",  subject: "Mathematics",    class: "9-A",  date: "18 Apr 2026", maxMarks: 100, status: "Completed", published: true,  avgScore: 74, passRate: 88 },
  { id: 2, name: "Unit Test 2",  subject: "English",        class: "9-A",  date: "18 Apr 2026", maxMarks: 100, status: "Completed", published: true,  avgScore: 81, passRate: 94 },
  { id: 3, name: "Unit Test 2",  subject: "Science",        class: "9-A",  date: "20 Apr 2026", maxMarks: 100, status: "Completed", published: false, avgScore: 69, passRate: 82 },
  { id: 4, name: "Unit Test 3",  subject: "Mathematics",    class: "9-A",  date: "28 Apr 2026", maxMarks: 100, status: "Upcoming",  published: false, avgScore: null, passRate: null },
  { id: 5, name: "Mid-Term",     subject: "All subjects",   class: "10-A", date: "5 May 2026",  maxMarks: 100, status: "Upcoming",  published: false, avgScore: null, passRate: null },
  { id: 6, name: "Unit Test 2",  subject: "Hindi",          class: "8-B",  date: "15 Apr 2026", maxMarks: 100, status: "Completed", published: true,  avgScore: 83, passRate: 96 },
  { id: 7, name: "Unit Test 2",  subject: "Computer Sci.",  class: "11-B", date: "16 Apr 2026", maxMarks: 100, status: "Completed", published: true,  avgScore: 88, passRate: 98 },
  { id: 8, name: "Final Exam",   subject: "All subjects",   class: "11-B", date: "20 Jun 2026", maxMarks: 100, status: "Scheduled", published: false, avgScore: null, passRate: null },
];

const STUDENTS_9A = [
  { id: 1, roll: "01", name: "Aryan Mehta",   math: 78, eng: 88, sci: 72, sst: 81, hindi: 91 },
  { id: 2, roll: "02", name: "Bhavna Singh",  math: 91, eng: 85, sci: 88, sst: 79, hindi: 94 },
  { id: 3, roll: "03", name: "Chirag Patel",  math: 62, eng: 74, sci: 55, sst: 68, hindi: 72 },
  { id: 4, roll: "04", name: "Deepika Rao",   math: 45, eng: 60, sci: 38, sst: 52, hindi: 58 },
  { id: 5, roll: "05", name: "Eshan Kumar",   math: 83, eng: 79, sci: 76, sst: 84, hindi: 88 },
  { id: 6, roll: "06", name: "Farida Shaikh", math: 96, eng: 92, sci: 94, sst: 91, hindi: 97 },
];

const SUBJECT_KEYS  = ["math", "eng", "sci", "sst", "hindi"];
const SUBJECT_NAMES = ["Maths", "English", "Science", "SST", "Hindi"];

const TABS = ["Exam schedule", "Results & grades", "Report cards"];

const STATUS_VARIANT = { Completed: "success", Upcoming: "info", Scheduled: "neutral", Draft: "warning" };
const PUB_VARIANT    = { true: "success", false: "neutral" };

function letterGrade(m) {
  if (m >= 90) return { g: "A+", c: "text-sage font-bold" };
  if (m >= 80) return { g: "A",  c: "text-sage font-semibold" };
  if (m >= 70) return { g: "B+", c: "text-cobalt font-semibold" };
  if (m >= 60) return { g: "B",  c: "text-cobalt" };
  if (m >= 50) return { g: "C",  c: "text-amber" };
  if (m >= 35) return { g: "D",  c: "text-amber" };
  return { g: "F", c: "text-rose font-bold" };
}

function avg(arr) { return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length); }

/* ─── Subcomponents ──────────────────────────────────────── */
function ExamScheduleTab() {
  const [classF, setClassF]   = useState("All classes");
  const [subjectF, setSubjectF] = useState("All subjects");
  const [statusF, setStatusF]   = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: "", type: "Unit Test", subject: "Mathematics", class: "9-A", date: "", maxMarks: 100 });
  const [exams, setExams]       = useState(EXAMS);
  const [saved, setSaved]       = useState(false);

  const filtered = exams.filter((e) =>
    (classF   === "All classes"   || e.class   === classF) &&
    (subjectF === "All subjects"  || e.subject === subjectF) &&
    (statusF  === "All"           || e.status  === statusF)
  );

  const handleAdd = () => {
    if (!form.name || !form.date) return;
    setExams((p) => [...p, { ...form, id: Date.now(), status: "Scheduled", published: false, avgScore: null, passRate: null }]);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ name: "", type: "Unit Test", subject: "Mathematics", class: "9-A", date: "", maxMarks: 100 });
  };

  return (
    <div className="space-y-4">
      {saved && (
        <Alert variant="success">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 11l3 3L22 4"/></svg>
          Exam scheduled successfully!
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total exams",   value: exams.length,                                           color: "bg-cobalt-light text-cobalt" },
          { label: "Completed",     value: exams.filter((e) => e.status === "Completed").length,   color: "bg-sage-light text-sage" },
          { label: "Upcoming",      value: exams.filter((e) => e.status === "Upcoming").length,    color: "bg-amber-light text-amber" },
          { label: "Unpublished",   value: exams.filter((e) => !e.published).length,               color: "bg-rose-light text-rose" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <Card padding={false}>
        {/* Filters + Add button */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-ink/5">
          <select value={classF} onChange={(e) => setClassF(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={subjectF} onChange={(e) => setSubjectF(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
            {["All", "Completed", "Upcoming", "Scheduled", "Draft"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="flex-1" />
          <Button size="sm" onClick={() => setShowForm(true)}>+ Schedule exam</Button>
        </div>

        {/* Add exam inline form */}
        {showForm && (
          <div className="p-4 bg-cobalt-light/20 border-b border-cobalt/15">
            <h4 className="font-serif text-sm text-ink mb-3">Schedule new exam</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                ["Exam name", "name", "text", null, "e.g. Unit Test 3"],
                ["Type", "type", "select", EXAM_TYPES, ""],
                ["Subject", "subject", "select", SUBJECTS.slice(1), ""],
                ["Class", "class", "select", CLASSES.slice(1), ""],
                ["Date", "date", "date", null, ""],
                ["Max marks", "maxMarks", "number", null, "100"],
              ].map(([label, field, type, opts, placeholder]) => (
                <div key={field}>
                  <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1">{label}</label>
                  {type === "select" ? (
                    <select value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full bg-white border border-ink/12 rounded-lg px-2 py-2 text-sm text-ink outline-none focus:border-cobalt transition-all">
                      {opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type} value={form[field]} placeholder={placeholder}
                      onChange={(e) => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) : e.target.value })}
                      className="w-full bg-white border border-ink/12 rounded-lg px-2 py-2 text-sm text-ink outline-none focus:border-cobalt transition-all" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleAdd}>Save exam</Button>
              <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? <EmptyState title="No exams found" message="Adjust filters or schedule a new exam." /> : (
          <Table>
            <thead>
              <tr>
                <Th>Exam name</Th><Th>Subject</Th><Th>Class</Th><Th>Date</Th>
                <Th>Max marks</Th><Th>Avg score</Th><Th>Pass rate</Th>
                <Th>Status</Th><Th>Published</Th><Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-parchment/40 transition-colors">
                  <Td><span className="font-medium">{e.name}</span></Td>
                  <Td>{e.subject}</Td>
                  <Td><span className="text-xs bg-cobalt-light text-cobalt px-2 py-0.5 rounded-full">{e.class}</span></Td>
                  <Td>{e.date}</Td>
                  <Td>{e.maxMarks}</Td>
                  <Td>{e.avgScore != null ? <span className={letterGrade(e.avgScore).c}>{e.avgScore}</span> : <span className="text-ink/25">—</span>}</Td>
                  <Td>{e.passRate != null ? <span className={e.passRate >= 85 ? "text-sage font-medium" : "text-amber font-medium"}>{e.passRate}%</span> : <span className="text-ink/25">—</span>}</Td>
                  <Td><Badge variant={STATUS_VARIANT[e.status]}>{e.status}</Badge></Td>
                  <Td><Badge variant={e.published ? "success" : "neutral"}>{e.published ? "Published" : "Draft"}</Badge></Td>
                  <Td>
                    <div className="flex gap-1.5">
                      {!e.published && e.status === "Completed" && (
                        <button className="text-xs px-2.5 py-1 rounded-lg bg-sage text-white hover:bg-sage/90 transition-colors">Publish</button>
                      )}
                      <button className="text-xs px-2.5 py-1 rounded-lg border border-ink/12 hover:bg-parchment transition-colors">Edit</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function ResultsTab() {
  const [selectedClass,   setSelectedClass]   = useState("9-A");
  const [selectedSubject, setSelectedSubject] = useState("All subjects");
  const [selectedExam,    setSelectedExam]    = useState("Unit Test 2");
  const [sortBy, setSortBy] = useState("roll");

  const students = [...STUDENTS_9A].sort((a, b) =>
    sortBy === "roll"  ? a.roll.localeCompare(b.roll) :
    sortBy === "name"  ? a.name.localeCompare(b.name) :
    sortBy === "total" ? (avg(SUBJECT_KEYS.map((k) => b[k])) - avg(SUBJECT_KEYS.map((k) => a[k]))) : 0
  );

  const classAvg  = avg(students.flatMap((s) => SUBJECT_KEYS.map((k) => s[k])));
  const highScore = Math.max(...students.map((s) => avg(SUBJECT_KEYS.map((k) => s[k]))));
  const lowScore  = Math.min(...students.map((s) => avg(SUBJECT_KEYS.map((k) => s[k]))));
  const passCount = students.filter((s) => avg(SUBJECT_KEYS.map((k) => s[k])) >= 35).length;

  const SortBtn = ({ field, label }) => (
    <button onClick={() => setSortBy(field)}
      className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${sortBy === field ? "bg-cobalt text-white" : "border border-ink/12 hover:bg-parchment"}`}>
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          {[
            ["Class", selectedClass, setSelectedClass, CLASSES.slice(1)],
            ["Exam", selectedExam, setSelectedExam, ["Unit Test 1", "Unit Test 2", "Mid-Term"]],
          ].map(([label, val, setter, opts]) => (
            <div key={label}>
              <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1">{label}</label>
              <select value={val} onChange={(e) => setter(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-ink/40">Sort:</span>
            <SortBtn field="roll"  label="Roll no." />
            <SortBtn field="name"  label="Name" />
            <SortBtn field="total" label="Total ↓" />
          </div>
          <Button variant="secondary" size="sm">Export CSV</Button>
        </div>

        {/* Summary row */}
        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-ink/5">
          {[["Class avg", classAvg, "text-cobalt"], ["Highest", highScore, "text-sage"], ["Lowest", lowScore, "text-rose"], [`Pass (≥35)`, `${passCount}/${students.length}`, "text-amber"]].map(([l, v, c]) => (
            <div key={l}>
              <div className="text-xs text-ink/40">{l}</div>
              <div className={`font-serif text-xl font-semibold ${c}`}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Results grid */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <Th>Roll</Th><Th>Student</Th>
                {SUBJECT_NAMES.map((s) => <Th key={s}>{s}</Th>)}
                <Th>Total</Th><Th>%</Th><Th>Grade</Th><Th>Rank</Th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const scores   = SUBJECT_KEYS.map((k) => s[k]);
                const total    = scores.reduce((a, b) => a + b, 0);
                const pct      = Math.round(total / (scores.length * 100) * 100);
                const { g, c } = letterGrade(pct);
                const rank     = [...students]
                  .sort((a, b) => {
                    const ta = SUBJECT_KEYS.map((k) => a[k]).reduce((x, y) => x + y, 0);
                    const tb = SUBJECT_KEYS.map((k) => b[k]).reduce((x, y) => x + y, 0);
                    return tb - ta;
                  })
                  .findIndex((st) => st.id === s.id) + 1;

                return (
                  <tr key={s.id} className="hover:bg-parchment/40 transition-colors">
                    <Td><span className="font-mono text-xs text-ink/40">{s.roll}</span></Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium whitespace-nowrap">{s.name}</span>
                      </div>
                    </Td>
                    {scores.map((score, i) => (
                      <Td key={i}>
                        <span className={score < 35 ? "text-rose font-semibold" : score >= 80 ? "text-sage font-semibold" : "text-ink"}>
                          {score}
                        </span>
                      </Td>
                    ))}
                    <Td><span className="font-semibold text-ink">{total}/{scores.length * 100}</span></Td>
                    <Td><span className="font-semibold text-ink">{pct}%</span></Td>
                    <Td><span className={c}>{g}</span></Td>
                    <Td>
                      <span className={`text-sm font-bold ${rank <= 3 ? "text-gold" : "text-ink/50"}`}>
                        #{rank}
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ReportCardsTab() {
  const [selectedClass, setSelectedClass] = useState("9-A");
  const [generating, setGenerating]       = useState(false);
  const [generated, setGenerated]         = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1200);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setGenerated(false); }}
              className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {CLASSES.slice(1).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1">Term</label>
            <select className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {["Term 1 (Apr–Sep 2025)", "Term 2 (Oct 2025–Mar 2026)"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <Button loading={generating} onClick={handleGenerate} size="sm">
              {generated ? "✓ Generated" : "Generate report cards"}
            </Button>
            {generated && <Button variant="secondary" size="sm">Download all PDFs</Button>}
          </div>
        </div>
      </Card>

      {generated && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STUDENTS_9A.map((s) => {
            const scores   = SUBJECT_KEYS.map((k) => s[k]);
            const total    = scores.reduce((a, b) => a + b, 0);
            const pct      = Math.round(total / (scores.length * 100) * 100);
            const { g, c } = letterGrade(pct);
            const rank = [...STUDENTS_9A]
              .sort((a, b) => SUBJECT_KEYS.map((k) => b[k]).reduce((x,y)=>x+y,0) - SUBJECT_KEYS.map((k) => a[k]).reduce((x,y)=>x+y,0))
              .findIndex((st) => st.id === s.id) + 1;

            return (
              <div key={s.id} className="bg-white border border-ink/8 rounded-2xl overflow-hidden">
                {/* Card header */}
                <div className="bg-cobalt px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-white font-serif text-sm font-semibold">{s.name}</div>
                    <div className="text-white/60 text-xs mt-0.5">Class {selectedClass} · Roll {s.roll}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-serif text-xl font-bold text-white`}>{g}</div>
                    <div className="text-white/60 text-[10px]">Grade</div>
                  </div>
                </div>

                {/* Scores */}
                <div className="p-4 space-y-2">
                  {SUBJECT_KEYS.map((key, i) => {
                    const score = s[key];
                    const p     = score;
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs text-ink/50">{SUBJECT_NAMES[i]}</span>
                          <span className={`text-xs font-semibold ${letterGrade(score).c}`}>{score}</span>
                        </div>
                        <div className="h-1.5 bg-parchment rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${p}%`, background: p >= 80 ? "#3A6B4F" : p >= 60 ? "#B85C1A" : "#A0334A" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-4 pb-4 flex items-center justify-between">
                  <div className="text-xs text-ink/40">
                    Total: <span className="font-semibold text-ink">{total}/{scores.length * 100}</span>
                    &nbsp;·&nbsp;Rank: <span className="font-semibold text-gold">#{rank}</span>
                  </div>
                  <button className="text-xs text-cobalt hover:underline font-medium">Download PDF</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!generated && (
        <Card>
          <EmptyState
            title="No report cards generated"
            message="Select a class and term, then click Generate."
          />
        </Card>
      )}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function ExamsGradesPage() {
  const [activeTab, setActiveTab] = useState("Exam schedule");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Exams & Grades"
        subtitle="Schedule exams, enter results, and generate report cards"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Export report</Button>
            <Button size="sm">+ Schedule exam</Button>
          </div>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-ink/8 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-cobalt text-white shadow-sm" : "text-ink/50 hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Exam schedule" && <ExamScheduleTab />}
      {activeTab === "Results & grades" && <ResultsTab />}
      {activeTab === "Report cards"    && <ReportCardsTab />}
    </div>
  );
}