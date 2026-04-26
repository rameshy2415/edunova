import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Button, Table, Th, Td, Badge } from "../../components/common";

const TABS = ["Attendance", "Performance", "Finance"];

const ATT_DATA = [
  { class: "9-A",  total: 40, avg: 96, perfect: 22, low: 2 },
  { class: "10-A", total: 38, avg: 91, perfect: 18, low: 3 },
  { class: "8-B",  total: 42, avg: 88, perfect: 14, low: 5 },
  { class: "11-B", total: 36, avg: 94, perfect: 21, low: 1 },
  { class: "7-A",  total: 35, avg: 79, perfect: 8,  low: 7 },
  { class: "6-C",  total: 41, avg: 97, perfect: 30, low: 0 },
];

const PERF_DATA = [
  { subject: "Mathematics",    avg: 74, highest: 98, lowest: 32, pass: 88 },
  { subject: "English",        avg: 81, highest: 95, lowest: 45, pass: 94 },
  { subject: "Science",        avg: 69, highest: 97, lowest: 28, pass: 82 },
  { subject: "Social Studies", avg: 77, highest: 92, lowest: 38, pass: 91 },
  { subject: "Hindi",          avg: 83, highest: 96, lowest: 50, pass: 97 },
  { subject: "Computer Sci.",  avg: 88, highest: 99, lowest: 60, pass: 98 },
];

const FINANCE_MONTHS = [
  { month: "Nov 2025", collected: 420000, expenses: 310000, net: 110000 },
  { month: "Dec 2025", collected: 390000, expenses: 285000, net: 105000 },
  { month: "Jan 2026", collected: 510000, expenses: 320000, net: 190000 },
  { month: "Feb 2026", collected: 465000, expenses: 298000, net: 167000 },
  { month: "Mar 2026", collected: 540000, expenses: 340000, net: 200000 },
  { month: "Apr 2026", collected: 480000, expenses: 305000, net: 175000 },
];

function BarChart({ data, maxVal, color }) {
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all" style={{ height: `${(d.value / maxVal) * 88}px`, background: color }} />
          <span className="text-[10px] text-ink/40 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function fmtINR(n) { return "₹" + (n / 100000).toFixed(1) + "L"; }

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Attendance");
  const [dateRange, setDateRange] = useState("This term");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        subtitle="Academic Year 2025–26"
        actions={
          <div className="flex gap-2">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
              className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {["This term", "Last term", "Full year"].map((r) => <option key={r}>{r}</option>)}
            </select>
            <Button variant="secondary" size="sm">Export PDF</Button>
            <Button variant="secondary" size="sm">Export CSV</Button>
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

      {/* ── ATTENDANCE TAB ── */}
      {activeTab === "Attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader title="Class-wise attendance summary" />
            <Table>
              <thead><tr><Th>Class</Th><Th>Total students</Th><Th>Avg. attendance</Th><Th>100% present</Th><Th>Below 75%</Th><Th>Status</Th></tr></thead>
              <tbody>
                {ATT_DATA.map((a) => (
                  <tr key={a.class} className="hover:bg-parchment/40 transition-colors">
                    <Td><span className="font-semibold">{a.class}</span></Td>
                    <Td>{a.total}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-parchment rounded-full overflow-hidden">
                          <div className="h-full bg-cobalt rounded-full" style={{ width: `${a.avg}%` }}/>
                        </div>
                        <span className="text-xs font-semibold text-ink">{a.avg}%</span>
                      </div>
                    </Td>
                    <Td><span className="text-sage font-medium">{a.perfect}</span></Td>
                    <Td><span className={a.low > 5 ? "text-rose font-medium" : "text-ink"}>{a.low}</span></Td>
                    <Td><Badge variant={a.avg >= 90 ? "success" : a.avg >= 80 ? "warning" : "danger"}>{a.avg >= 90 ? "Good" : a.avg >= 80 ? "Average" : "Needs attention"}</Badge></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <div className="space-y-5">
            <Card>
              <CardHeader title="Attendance trend" />
              <BarChart
                data={["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"].map((m, i) => ({ label: m, value: [88, 91, 93, 89, 85, 94][i] }))}
                maxVal={100} color="#1B3F8B"
              />
            </Card>
            <Card>
              <CardHeader title="Summary" />
              {[["School average", "91.4%"], ["Days this term", "82"], ["Best class", "6-C · 97%"], ["Needs review", "7-A · 79%"]].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 border-b border-ink/5 last:border-0">
                  <span className="text-xs text-ink/50">{label}</span>
                  <span className="text-xs font-semibold text-ink">{val}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── PERFORMANCE TAB ── */}
      {activeTab === "Performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader title="Subject-wise performance" />
            <Table>
              <thead><tr><Th>Subject</Th><Th>Class avg.</Th><Th>Highest</Th><Th>Lowest</Th><Th>Pass %</Th></tr></thead>
              <tbody>
                {PERF_DATA.map((p) => (
                  <tr key={p.subject} className="hover:bg-parchment/40 transition-colors">
                    <Td><span className="font-medium">{p.subject}</span></Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-parchment rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.avg}%`, background: p.avg >= 80 ? "#3A6B4F" : p.avg >= 65 ? "#B85C1A" : "#A0334A" }}/>
                        </div>
                        <span className="text-xs font-semibold">{p.avg}</span>
                      </div>
                    </Td>
                    <Td><span className="text-sage font-medium">{p.highest}</span></Td>
                    <Td><span className={p.lowest < 35 ? "text-rose font-medium" : "text-ink"}>{p.lowest}</span></Td>
                    <Td><Badge variant={p.pass >= 90 ? "success" : p.pass >= 80 ? "warning" : "danger"}>{p.pass}%</Badge></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <div className="space-y-5">
            <Card>
              <CardHeader title="Avg. score by subject" />
              <BarChart
                data={PERF_DATA.map((p) => ({ label: p.subject.split(" ")[0], value: p.avg }))}
                maxVal={100} color="#3A6B4F"
              />
            </Card>
            <Card>
              <CardHeader title="Grade distribution" />
              {[["A+ (90–100)", 18, "bg-sage"], ["A  (80–89)", 24, "bg-cobalt"], ["B  (60–79)", 31, "bg-amber"], ["C  (35–59)", 19, "bg-rose"], ["F  (< 35)", 8, "bg-ink/20"]].map(([g, n, c]) => (
                <div key={g} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-ink/50 min-w-[80px]">{g}</span>
                  <div className="flex-1 h-2 bg-parchment rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c}`} style={{ width: `${n * 3.2}%` }}/>
                  </div>
                  <span className="text-xs font-semibold text-ink w-5 text-right">{n}%</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── FINANCE TAB ── */}
      {activeTab === "Finance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader title="Monthly financial summary" />
            <Table>
              <thead><tr><Th>Month</Th><Th>Collected</Th><Th>Expenses</Th><Th>Net surplus</Th><Th>Status</Th></tr></thead>
              <tbody>
                {FINANCE_MONTHS.map((f) => (
                  <tr key={f.month} className="hover:bg-parchment/40 transition-colors">
                    <Td><span className="font-medium">{f.month}</span></Td>
                    <Td><span className="text-sage font-medium">{fmtINR(f.collected)}</span></Td>
                    <Td><span className="text-rose font-medium">{fmtINR(f.expenses)}</span></Td>
                    <Td><span className="text-cobalt font-semibold">{fmtINR(f.net)}</span></Td>
                    <Td><Badge variant={f.net > 150000 ? "success" : "warning"}>{f.net > 150000 ? "Strong" : "Moderate"}</Badge></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <div className="space-y-5">
            <Card>
              <CardHeader title="Revenue vs expenses" />
              <div className="flex items-end gap-2 h-24 mb-2">
                {FINANCE_MONTHS.map((f) => (
                  <div key={f.month} className="flex-1 flex gap-0.5 items-end">
                    <div className="flex-1 rounded-t bg-cobalt" style={{ height: `${(f.collected / 600000) * 88}px` }}/>
                    <div className="flex-1 rounded-t bg-rose/40" style={{ height: `${(f.expenses / 600000) * 88}px` }}/>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cobalt"/><span className="text-xs text-ink/50">Collected</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose/40"/><span className="text-xs text-ink/50">Expenses</span></div>
              </div>
            </Card>
            <Card>
              <CardHeader title="YTD summary" />
              {[["Total collected", "₹28.05L"], ["Total expenses", "₹18.58L"], ["Net surplus", "₹9.47L"], ["Collection rate", "81.4%"], ["Pending dues", "₹4.2L"]].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-ink/5 last:border-0">
                  <span className="text-xs text-ink/50">{label}</span>
                  <span className="text-xs font-semibold text-ink">{val}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
