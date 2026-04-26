import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Badge } from "../../components/common";

const EXAMS = ["Unit Test 1", "Unit Test 2", "Mid-Term"];

const RESULTS = {
  "Unit Test 1": [
    { subject: "Mathematics",    marks: 72, max: 100 },
    { subject: "English",        marks: 80, max: 100 },
    { subject: "Science",        marks: 65, max: 100 },
    { subject: "Social Studies", marks: 78, max: 100 },
    { subject: "Hindi",          marks: 88, max: 100 },
  ],
  "Unit Test 2": [
    { subject: "Mathematics",    marks: 78, max: 100 },
    { subject: "English",        marks: 88, max: 100 },
    { subject: "Science",        marks: 72, max: 100 },
    { subject: "Social Studies", marks: 81, max: 100 },
    { subject: "Hindi",          marks: 91, max: 100 },
  ],
  "Mid-Term": [
    { subject: "Mathematics",    marks: 74, max: 100 },
    { subject: "English",        marks: 85, max: 100 },
    { subject: "Science",        marks: 69, max: 100 },
    { subject: "Social Studies", marks: 83, max: 100 },
    { subject: "Hindi",          marks: 93, max: 100 },
  ],
};

function letterGrade(marks, max) {
  const p = (marks / max) * 100;
  if (p >= 90) return { grade: "A+", variant: "success" };
  if (p >= 80) return { grade: "A",  variant: "success" };
  if (p >= 70) return { grade: "B+", variant: "info" };
  if (p >= 60) return { grade: "B",  variant: "info" };
  if (p >= 50) return { grade: "C",  variant: "warning" };
  if (p >= 35) return { grade: "D",  variant: "warning" };
  return { grade: "F", variant: "danger" };
}

const BAR_COLOR = (p) => p >= 80 ? "#3A6B4F" : p >= 60 ? "#B85C1A" : "#A0334A";

export default function StudentGrades() {
  const [activeExam, setActiveExam] = useState("Unit Test 2");

  const results = RESULTS[activeExam];
  const total   = results.reduce((s, r) => s + r.marks, 0);
  const maxTotal = results.reduce((s, r) => s + r.max, 0);
  const avg     = Math.round((total / maxTotal) * 100);

  // Trend data for sparkline-style comparison
  const trendBySubject = results.map((r) => ({
    subject: r.subject,
    scores: EXAMS.map((e) => {
      const found = RESULTS[e]?.find((x) => x.subject === r.subject);
      return found ? Math.round((found.marks / found.max) * 100) : 0;
    }),
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Grades"
        subtitle="Class 9-A · Roll No. 21 · Mathematics Department"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Current avg",   value: avg + "%",              color: "bg-cobalt-light text-cobalt" },
          { label: "Class rank",    value: "#7 / 40",              color: "bg-sage-light text-sage" },
          { label: "Best subject",  value: "Hindi",                color: "bg-amber-light text-amber" },
          { label: "Needs focus",   value: "Science",              color: "bg-rose-light text-rose" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Exam tabs */}
      <div className="flex gap-1 bg-white border border-ink/8 rounded-xl p-1 w-fit">
        {EXAMS.map((e) => (
          <button key={e} onClick={() => setActiveExam(e)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeExam === e ? "bg-cobalt text-white shadow-sm" : "text-ink/50 hover:text-ink"}`}>
            {e}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grades table */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif text-base text-ink">{activeExam}</h3>
              <p className="text-xs text-ink/40 mt-0.5">Total: {total}/{maxTotal} · Average: {avg}%</p>
            </div>
            <Badge variant={avg >= 80 ? "success" : avg >= 60 ? "warning" : "danger"}>
              {avg >= 80 ? "Excellent" : avg >= 60 ? "Good" : "Needs improvement"}
            </Badge>
          </div>

          <div className="space-y-4">
            {results.map((r) => {
              const pct = Math.round((r.marks / r.max) * 100);
              const { grade, variant } = letterGrade(r.marks, r.max);
              return (
                <div key={r.subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink">{r.subject}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-ink/50">{r.marks} / {r.max}</span>
                      <Badge variant={variant}>{grade}</Badge>
                    </div>
                  </div>
                  <div className="h-2.5 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: BAR_COLOR(pct) }} />
                  </div>
                  <div className="text-[11px] text-ink/35 mt-0.5">{pct}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Trend comparison */}
        <Card>
          <CardHeader title="Progress trend" />
          <div className="space-y-4">
            {trendBySubject.map((t) => (
              <div key={t.subject}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-ink">{t.subject}</span>
                  <div className="flex gap-1">
                    {t.scores.map((score, i) => (
                      <span key={i} className="text-[10px] text-ink/40">{score}{i < t.scores.length - 1 ? "→" : ""}</span>
                    ))}
                  </div>
                </div>
                {/* Mini bar comparison */}
                <div className="flex items-end gap-1 h-8">
                  {t.scores.map((score, i) => (
                    <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${(score / 100) * 100}%`, background: i === EXAMS.indexOf(activeExam) ? "#1B3F8B" : "#e2ddd5" }} />
                  ))}
                </div>
                <div className="flex gap-1 mt-0.5">
                  {EXAMS.map((e, i) => (
                    <span key={e} className={`flex-1 text-center text-[9px] ${activeExam === e ? "text-cobalt font-semibold" : "text-ink/25"}`}>
                      {e.split(" ").map((w) => w[0]).join("")}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}