import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   EduNova — "Watch Demo" animated feature tour
   Aesthetic: dark editorial · ink + gold
   One orchestrated sequence per feature slide
───────────────────────────────────────────────*/

const FEATURES = [
  {
    id: "dashboard",
    label: "01 — Dashboard",
    title: "Everything at a glance",
    description:
      "Attendance, fees, exam results and teacher assignments unified into one command centre — updated in real time.",
    color: "#C9952A",
    bg: "#0D0F12",
    accent: "rgba(201,149,42,0.12)",
    ui: "dashboard",
  },
  {
    id: "students",
    label: "02 — Students",
    title: "Full student lifecycle",
    description:
      "Admissions, enrolment, grade promotion, health records and guardian contacts — all in one searchable profile.",
    color: "#5B9CF6",
    bg: "#0A0F1E",
    accent: "rgba(91,156,246,0.10)",
    ui: "students",
  },
  {
    id: "exams",
    label: "03 — Exams & Grades",
    title: "Results in seconds",
    description:
      "Schedule exams, enter marks class-by-class, auto-calculate letter grades, and publish report cards with one click.",
    color: "#4ECBA9",
    bg: "#091510",
    accent: "rgba(78,203,169,0.10)",
    ui: "exams",
  },
  {
    id: "fees",
    label: "04 — Fees & Finance",
    title: "Zero missed payments",
    description:
      "Collect online, track dues, auto-generate receipts, and send overdue reminders — all with an audit trail.",
    color: "#E96B8A",
    bg: "#160810",
    accent: "rgba(233,107,138,0.10)",
    ui: "fees",
  },
  {
    id: "attendance",
    label: "05 — Attendance",
    title: "One-tap daily marking",
    description:
      "Teachers mark P/A/L for every student in under 30 seconds. Monthly summaries and low-attendance alerts fire automatically.",
    color: "#A78BFA",
    bg: "#0D0A18",
    accent: "rgba(167,139,250,0.10)",
    ui: "attendance",
  },
];

/* ── Mini UI illustrations ─────────────────── */
function UIDemo({ type, color }) {
  if (type === "dashboard") return (
    <div className="ui-shell">
      <div className="ui-topbar">
        <div className="ui-dots"><span /><span /><span /></div>
        <div className="ui-bar" style={{ width: 90 }} />
        <div className="ui-bar" style={{ width: 40, marginLeft: "auto" }} />
      </div>
      <div className="ui-body">
        <div className="ui-sidebar">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="ui-nav-item" style={{ opacity: i === 1 ? 1 : 0.4, background: i === 1 ? color + "30" : "transparent", borderLeft: i === 1 ? `2px solid ${color}` : "2px solid transparent" }}>
              <div className="ui-nav-dot" style={{ background: i === 1 ? color : "#333" }} />
              <div className="ui-bar" style={{ width: 40 + i * 8 }} />
            </div>
          ))}
        </div>
        <div className="ui-main">
          <div className="ui-stat-row">
            {[["1,284","Students"], ["91.4%","Attendance"], ["68","Teachers"], ["₹18.4L","Fees"]].map(([v, l]) => (
              <div key={l} className="ui-stat" style={{ borderColor: color + "40" }}>
                <div className="ui-stat-val" style={{ color }}>{v}</div>
                <div className="ui-stat-label">{l}</div>
              </div>
            ))}
          </div>
          <div className="ui-row">
            <div className="ui-card" style={{ flex: 2 }}>
              <div className="ui-card-title" />
              {[96, 72, 88, 64, 91].map((w, i) => (
                <div key={i} className="ui-list-row">
                  <div className="ui-avatar" style={{ background: color + "30" }} />
                  <div className="ui-bar" style={{ width: 60 + i * 10 }} />
                  <div className="ui-prog-track">
                    <div className="ui-prog-fill" style={{ width: w + "%", background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="ui-card" style={{ flex: 1 }}>
              <div className="ui-card-title" />
              {[0,1,2,3].map(i => (
                <div key={i} className="ui-sched-row">
                  <div className="ui-sched-dot" style={{ background: color }} />
                  <div>
                    <div className="ui-bar" style={{ width: 50 }} />
                    <div className="ui-bar" style={{ width: 35, opacity: 0.4, marginTop: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (type === "students") return (
    <div className="ui-shell">
      <div className="ui-topbar">
        <div className="ui-dots"><span /><span /><span /></div>
        <div className="ui-bar" style={{ width: 60 }} />
        <div className="ui-btn" style={{ background: color }}>+ Add</div>
      </div>
      <div className="ui-body" style={{ padding: "10px 14px", flexDirection: "column", gap: 6 }}>
        <div className="ui-search" style={{ borderColor: color + "50" }}>
          <div className="ui-bar" style={{ width: 100 }} />
        </div>
        <div className="ui-table-head" style={{ borderBottomColor: color + "40" }}>
          {["Name","Class","Roll","Att%","Status"].map(h => (
            <div key={h} className="ui-th">{h}</div>
          ))}
        </div>
        {[
          ["Aryan M.", "9-A", "21", "96%", color, "Active"],
          ["Priya S.", "11-B", "07", "88%", "#EF9F27", "Partial"],
          ["Rohan K.", "6-C", "14", "72%", "#E96B8A", "Overdue"],
          ["Sneha N.", "10-A", "02", "91%", color, "Active"],
          ["Vikram J.", "8-B", "31", "85%", "#EF9F27", "Partial"],
        ].map(([name, cls, roll, att, bc, status]) => (
          <div key={name} className="ui-table-row">
            <div className="ui-td-name">
              <div className="ui-avatar sm" style={{ background: bc + "30" }} />
              <div className="ui-bar" style={{ width: 52 }} />
            </div>
            <div className="ui-td">{cls}</div>
            <div className="ui-td">{roll}</div>
            <div className="ui-td">{att}</div>
            <div className="ui-badge" style={{ background: bc + "25", color: bc }}>{status}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (type === "exams") return (
    <div className="ui-shell">
      <div className="ui-topbar">
        <div className="ui-dots"><span /><span /><span /></div>
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {["Schedule","Results","Report cards"].map((t, i) => (
            <div key={t} className="ui-tab" style={{ background: i === 1 ? color : "transparent", color: i === 1 ? "#000" : "#666", borderColor: i === 1 ? color : "#333" }}>{t}</div>
          ))}
        </div>
      </div>
      <div className="ui-body" style={{ flexDirection: "column", padding: "8px 14px", gap: 5 }}>
        <div className="ui-result-header" style={{ borderBottomColor: color + "40" }}>
          <span style={{ color, fontSize: 10 }}>Class 9-A — Unit Test 2</span>
          <span style={{ fontSize: 10, opacity: 0.4 }}>Avg: 74 · Pass: 88%</span>
        </div>
        {[
          ["Aryan M.", 78, 88, 72, 81, 91],
          ["Bhavna S.", 91, 85, 88, 79, 94],
          ["Chirag P.", 62, 74, 55, 68, 72],
          ["Deepika R.", 45, 60, 38, 52, 58],
          ["Farida S.", 96, 92, 94, 91, 97],
        ].map(([name, ...scores]) => {
          const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          const grade = avg >= 90 ? "A+" : avg >= 80 ? "A" : avg >= 70 ? "B+" : avg >= 60 ? "B" : "C";
          return (
            <div key={name} className="ui-result-row">
              <div className="ui-avatar sm" style={{ background: color + "30" }} />
              <div className="ui-bar" style={{ width: 44 }} />
              {scores.map((s, i) => (
                <div key={i} className="ui-score" style={{ color: s >= 80 ? color : s >= 60 ? "#EF9F27" : "#E96B8A" }}>{s}</div>
              ))}
              <div className="ui-grade" style={{ color }}>{grade}</div>
            </div>
          );
        })}
        <div className="ui-publish-bar" style={{ borderColor: color + "40", background: color + "15" }}>
          <div className="ui-bar" style={{ width: 80 }} />
          <div className="ui-btn sm" style={{ background: color }}>Publish</div>
        </div>
      </div>
    </div>
  );

  if (type === "fees") return (
    <div className="ui-shell">
      <div className="ui-topbar">
        <div className="ui-dots"><span /><span /><span /></div>
        <div className="ui-bar" style={{ width: 80 }} />
        <div className="ui-btn sm" style={{ background: color, marginLeft: "auto" }}>+ Record</div>
      </div>
      <div className="ui-body" style={{ padding: "8px 12px", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["₹18.4L","Collected"], ["₹4.2L","Overdue"], ["81.4%","Rate"]].map(([v, l]) => (
            <div key={l} className="ui-mini-stat" style={{ borderColor: color + "40", flex: 1 }}>
              <div style={{ color, fontSize: 13, fontWeight: 600 }}>{v}</div>
              <div style={{ fontSize: 9, opacity: 0.5 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flex: 1 }}>
          <div className="ui-card" style={{ flex: 2 }}>
            {[
              ["Aryan M.", "Paid", color],
              ["Priya S.", "Partial", "#EF9F27"],
              ["Rohan K.", "Overdue", "#E96B8A"],
              ["Sneha N.", "Paid", color],
              ["Vikram J.", "Partial", "#EF9F27"],
            ].map(([name, status, bc]) => (
              <div key={name} className="ui-fee-row">
                <div className="ui-avatar sm" style={{ background: bc + "25" }} />
                <div className="ui-bar" style={{ width: 44 }} />
                <div className="ui-badge xs" style={{ background: bc + "20", color: bc, marginLeft: "auto" }}>{status}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="ui-donut-wrap">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="20" fill="none" stroke="#1a1a1a" strokeWidth="10" />
                <circle cx="28" cy="28" r="20" fill="none" stroke={color} strokeWidth="10"
                  strokeDasharray="100 26" strokeDashoffset="25" strokeLinecap="round" />
                <text x="28" y="32" textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">81%</text>
              </svg>
            </div>
            {[[color,"Paid"], ["#EF9F27","Partial"], ["#E96B8A","Overdue"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 }} />
                <div className="ui-bar" style={{ width: 30 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (type === "attendance") return (
    <div className="ui-shell">
      <div className="ui-topbar">
        <div className="ui-dots"><span /><span /><span /></div>
        <div className="ui-bar" style={{ width: 70 }} />
        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          <div className="ui-btn sm" style={{ background: "#1a2a1a", color: color, border: `1px solid ${color}40` }}>All present</div>
        </div>
      </div>
      <div className="ui-body" style={{ flexDirection: "column", padding: "8px 12px", gap: 5 }}>
        {[
          ["AM","Aryan Mehta","P"],
          ["BS","Bhavna Singh","P"],
          ["CP","Chirag Patel","A"],
          ["DR","Deepika Rao","L"],
          ["EK","Eshan Kumar","P"],
          ["FS","Farida Shaikh","P"],
        ].map(([init, name, status]) => {
          const sc = status === "P" ? color : status === "A" ? "#E96B8A" : "#EF9F27";
          return (
            <div key={init} className="ui-att-row" style={{ borderColor: sc + "20", background: sc + "08" }}>
              <div className="ui-avatar sm" style={{ background: sc + "30", color: sc, fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{init}</div>
              <div className="ui-bar" style={{ width: 60 }} />
              <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
                {["P","A","L"].map(code => {
                  const cc = code === "P" ? color : code === "A" ? "#E96B8A" : "#EF9F27";
                  return (
                    <div key={code} className="ui-code-btn" style={{ background: status === code ? cc : cc + "15", color: status === code ? "#000" : cc, fontWeight: 700 }}>
                      {code}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="ui-save-bar" style={{ background: color + "20", borderColor: color + "40" }}>
          <div className="ui-bar" style={{ width: 60 }} />
          <div className="ui-btn sm" style={{ background: color, marginLeft: "auto" }}>Submit</div>
        </div>
      </div>
    </div>
  );

  return null;
}

/* ── Progress dots ─────────────────────────── */
function Dots({ total, current, color, onDotClick }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i === current ? color : "#333",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ────────────────────────── */
export default function WatchDemoButton() {
  const [open, setOpen]           = useState(false);
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [entering, setEntering]   = useState(false);
  const [btnPulsed, setBtnPulsed] = useState(false);
  const timerRef                  = useRef(null);
  const autoRef                   = useRef(null);

  const feature = FEATURES[current];

  /* open demo */
  const handleOpen = () => {
    setBtnPulsed(true);
    setTimeout(() => setBtnPulsed(false), 600);
    setTimeout(() => {
      setOpen(true);
      setCurrent(0);
      triggerEnter();
    }, 200);
  };

  /* close demo */
  const handleClose = () => {
    clearTimeout(autoRef.current);
    setOpen(false);
    setCurrent(0);
  };

  /* slide enter animation */
  const triggerEnter = () => {
    setEntering(true);
    setTimeout(() => setEntering(false), 600);
  };

  /* go to slide */
  const goTo = (idx) => {
    if (animating || idx === current) return;
    clearTimeout(autoRef.current);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
      triggerEnter();
    }, 280);
  };

  const next = () => goTo((current + 1) % FEATURES.length);
  const prev = () => goTo((current - 1 + FEATURES.length) % FEATURES.length);

  /* auto-advance */
  useEffect(() => {
    if (!open) return;
    autoRef.current = setTimeout(() => next(), 4200);
    return () => clearTimeout(autoRef.current);
  }, [open, current, animating]);

  /* keyboard nav */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "Escape")     handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, current, animating]);

  return (
    <>
      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600;700&display=swap');

        .demo-root {
          font-family: 'Syne', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 260px;
          background: #0D0F12;
          padding: 40px 24px;
        }

        /* ─ Watch Demo button ─ */
        .watch-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: transparent;
          border: 1.5px solid #C9952A;
          border-radius: 3px;
          color: #C9952A;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          overflow: hidden;
        }
        .watch-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #C9952A;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }
        .watch-btn:hover::before { transform: translateX(0); }
        .watch-btn:hover { color: #0D0F12; }
        .watch-btn span, .watch-btn svg { position: relative; z-index: 1; }
        .watch-btn.pulsed { animation: btnPulse 0.6s ease; }
        @keyframes btnPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(201,149,42,0.6); }
          50% { transform: scale(0.97); box-shadow: 0 0 0 12px rgba(201,149,42,0); }
          100% { transform: scale(1); }
        }

        /* ─ Play icon ─ */
        .play-ring {
          width: 28px; height: 28px;
          border: 1.5px solid currentColor;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s ease;
        }

        /* ─ Overlay ─ */
        .demo-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeOverlay 0.3s ease;
        }
        @keyframes fadeOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ─ Demo modal ─ */
        .demo-modal {
          position: relative;
          width: 100%;
          max-width: 860px;
          border: 1px solid #1e1e1e;
          border-radius: 6px;
          overflow: hidden;
          animation: modalIn 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ─ Slide ─ */
        .demo-slide {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          min-height: 480px;
          transition: background 0.6s ease, opacity 0.28s ease;
        }
        .demo-slide.out { opacity: 0; transform: translateX(-12px); }

        /* ─ Left panel ─ */
        .demo-left {
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #1a1a1a;
        }
        .demo-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 18px;
          transition: color 0.4s ease;
        }
        .demo-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          line-height: 1.15;
          color: #f5f2ec;
          margin-bottom: 16px;
          transition: opacity 0.4s ease;
        }
        .demo-title.entering {
          animation: titleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes titleIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .demo-desc {
          font-size: 14px;
          line-height: 1.7;
          color: #888;
          margin-bottom: 32px;
          transition: opacity 0.4s ease 0.08s;
        }
        .demo-desc.entering {
          animation: descIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s both;
        }
        @keyframes descIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─ Nav controls ─ */
        .demo-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-arrow {
          width: 36px; height: 36px;
          border: 1px solid #2a2a2a;
          border-radius: 50%;
          background: transparent;
          color: #666;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .nav-arrow:hover { border-color: #555; color: #ddd; background: #1a1a1a; }

        /* ─ Right panel ─ */
        .demo-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 24px;
        }
        .demo-right::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.12;
          transition: background 0.6s ease;
        }
        .demo-ui-wrap {
          width: 100%;
          max-width: 380px;
          transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .demo-ui-wrap.entering {
          animation: uiIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }
        @keyframes uiIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ─ Progress bar ─ */
        .demo-progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          transition: width 0s, background 0.4s;
          animation: progressFill 4.2s linear;
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* ─ Close button ─ */
        .demo-close {
          position: absolute;
          top: 14px; right: 14px;
          width: 30px; height: 30px;
          border: 1px solid #2a2a2a;
          border-radius: 50%;
          background: transparent;
          color: #555;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
          font-size: 16px;
          line-height: 1;
        }
        .demo-close:hover { border-color: #555; color: #ddd; background: #1a1a1a; }

        /* ─ Feature counter ─ */
        .demo-counter {
          font-size: 11px;
          color: #444;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        /* ─ Mini UI styles ─ */
        .ui-shell {
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
        }
        .ui-topbar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid #1e1e1e;
          background: #0d0d0d;
        }
        .ui-dots { display: flex; gap: 4px; }
        .ui-dots span {
          width: 7px; height: 7px; border-radius: 50%;
          background: #2a2a2a;
        }
        .ui-bar {
          height: 8px;
          background: #222;
          border-radius: 4px;
        }
        .ui-btn {
          font-size: 9px;
          padding: 3px 8px;
          border-radius: 3px;
          font-weight: 700;
          color: #000;
          letter-spacing: 0.06em;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }
        .ui-btn.sm { font-size: 8px; padding: 2px 6px; }
        .ui-body {
          display: flex;
          flex: 1;
        }
        .ui-sidebar {
          width: 80px;
          background: #0a0a0a;
          border-right: 1px solid #1a1a1a;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ui-nav-item {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 6px;
          border-radius: 4px;
          border-left: 2px solid transparent;
        }
        .ui-nav-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .ui-main { flex: 1; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
        .ui-stat-row { display: flex; gap: 6px; }
        .ui-stat {
          flex: 1;
          background: #0d0d0d;
          border: 1px solid transparent;
          border-radius: 4px;
          padding: 6px 7px;
        }
        .ui-stat-val { font-size: 11px; font-weight: 700; }
        .ui-stat-label { font-size: 7px; color: #444; margin-top: 1px; }
        .ui-row { display: flex; gap: 7px; flex: 1; }
        .ui-card {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .ui-card-title {
          height: 7px;
          width: 50px;
          background: #222;
          border-radius: 3px;
          margin-bottom: 4px;
        }
        .ui-list-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ui-avatar {
          width: 16px; height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ui-avatar.sm { width: 14px; height: 14px; }
        .ui-prog-track {
          flex: 1;
          height: 3px;
          background: #1a1a1a;
          border-radius: 2px;
          overflow: hidden;
        }
        .ui-prog-fill { height: 100%; border-radius: 2px; }
        .ui-sched-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 0;
        }
        .ui-sched-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* students table */
        .ui-search {
          border: 1px solid;
          border-radius: 4px;
          padding: 4px 8px;
          background: #0d0d0d;
        }
        .ui-table-head {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid;
          padding-bottom: 5px;
          margin-bottom: 2px;
        }
        .ui-th { font-size: 8px; color: #444; flex: 1; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
        .ui-table-row { display: flex; align-items: center; gap: 6px; padding: 3px 0; border-bottom: 1px solid #151515; }
        .ui-td-name { display: flex; align-items: center; gap: 4px; flex: 1.5; }
        .ui-td { flex: 1; font-size: 9px; color: #555; }
        .ui-badge {
          font-size: 7px; font-weight: 700;
          padding: 2px 5px;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .ui-badge.xs { font-size: 7px; padding: 1px 4px; }

        /* exams */
        .ui-tab {
          font-size: 8px;
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
        }
        .ui-result-header { display: flex; justify-content: space-between; border-bottom: 1px solid; padding-bottom: 4px; margin-bottom: 4px; }
        .ui-result-row { display: flex; align-items: center; gap: 4px; border-bottom: 1px solid #151515; padding: 3px 0; }
        .ui-score { font-size: 9px; font-weight: 600; width: 22px; text-align: center; }
        .ui-grade { font-size: 10px; font-weight: 800; width: 20px; text-align: center; }
        .ui-publish-bar { display: flex; align-items: center; border: 1px solid; border-radius: 4px; padding: 5px 8px; margin-top: 4px; }

        /* fees */
        .ui-mini-stat { background: #0d0d0d; border: 1px solid; border-radius: 4px; padding: 6px 7px; }
        .ui-fee-row { display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #151515; padding: 4px 0; }
        .ui-donut-wrap { display: flex; justify-content: center; }

        /* attendance */
        .ui-att-row { display: flex; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 4px; border: 1px solid; margin-bottom: 3px; }
        .ui-code-btn { width: 20px; height: 18px; border-radius: 3px; font-size: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .ui-save-bar { display: flex; align-items: center; border: 1px solid; border-radius: 4px; padding: 5px 8px; margin-top: 2px; }
      `}</style>

      {/* ── Trigger area ── */}
      <div className="demo-root">
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#555", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            See it in action
          </p>
          <button
            className={`watch-btn${btnPulsed ? " pulsed" : ""}`}
            onClick={handleOpen}
          >
            <span className="play-ring">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <path d="M0 0l10 6-10 6V0z" />
              </svg>
            </span>
            <span>Watch Demo</span>
          </button>
          <p style={{ color: "#2a2a2a", fontSize: 11, marginTop: 14, fontFamily: "Syne, sans-serif" }}>
            5 features · 30 seconds
          </p>
        </div>
      </div>

      {/* ── Demo overlay ── */}
      {open && (
        <div className="demo-overlay" onClick={handleClose}>
          <div
            className="demo-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button className="demo-close" onClick={handleClose}>✕</button>

            {/* Slide */}
            <div
              className={`demo-slide${animating ? " out" : ""}`}
              style={{ background: feature.bg }}
            >
              {/* ── Left ── */}
              <div className="demo-left" style={{ background: feature.bg }}>
                <div>
                  <div className="demo-label" style={{ color: feature.color }}>
                    {feature.label}
                  </div>
                  <h2 className={`demo-title${entering ? " entering" : ""}`}>
                    {feature.title}
                  </h2>
                  <p className={`demo-desc${entering ? " entering" : ""}`}>
                    {feature.description}
                  </p>
                </div>

                <div className="demo-controls">
                  <button className="nav-arrow" onClick={prev}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <Dots
                    total={FEATURES.length}
                    current={current}
                    color={feature.color}
                    onDotClick={goTo}
                  />
                  <button className="nav-arrow" onClick={next}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <span className="demo-counter" style={{ marginLeft: "auto" }}>
                    {String(current + 1).padStart(2, "0")} / {FEATURES.length}
                  </span>
                </div>
              </div>

              {/* ── Right ── */}
              <div className="demo-right" style={{ background: feature.bg }}>
                {/* glow behind UI */}
                <div style={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: feature.color,
                  opacity: 0.06,
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }} />

                <div className={`demo-ui-wrap${entering ? " entering" : ""}`}>
                  <UIDemo type={feature.ui} color={feature.color} />
                </div>
              </div>
            </div>

            {/* Auto-progress bar */}
            <div
              key={`${current}-${open}`}
              className="demo-progress"
              style={{ background: feature.color }}
            />
          </div>
        </div>
      )}
    </>
  );
}