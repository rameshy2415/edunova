import React from "react";
import { PageHeader, Card, CardHeader, Badge, Table, Th, Td } from "../../components/common";

const FEE_STRUCTURE = [
  { type: "Tuition Fee",      q1: 10500, q2: 10500, q3: 10500, q4: 10500, annual: 42000 },
  { type: "Transport Fee",    q1: 3000,  q2: 3000,  q3: 3000,  q4: 3000,  annual: 12000 },
  { type: "Sports & Activity",q1: 500,   q2: 500,   q3: 500,   q4: 500,   annual: 2000  },
  { type: "Lab & Library",    q1: 500,   q2: 500,   q3: 500,   q4: 500,   annual: 2000  },
];

const PAYMENTS = [
  { id: "RCP-2026-041", date: "12 Apr 2026", desc: "Q1 Tuition + Transport",  amount: 13500, method: "UPI",   status: "Paid" },
  { id: "RCP-2026-028", date: "5 Jan 2026",  desc: "Q3 Full instalment",      amount: 14500, method: "Online",status: "Paid" },
  { id: "RCP-2025-117", date: "1 Oct 2025",  desc: "Q2 Full instalment",      amount: 14500, method: "Cash",  status: "Paid" },
  { id: "RCP-2025-061", date: "3 Jul 2025",  desc: "Q1 Full instalment + Reg",amount: 16000, method: "NEFT",  status: "Paid" },
];

const UPCOMING = [
  { due: "30 Apr 2026", desc: "Q2 Tuition Fee",  amount: 10500, status: "Due" },
  { due: "30 Apr 2026", desc: "Q2 Transport Fee", amount: 3000,  status: "Due" },
];

function fmt(n) { return "₹" + n.toLocaleString("en-IN"); }

export default function StudentFees() {
  const totalAnnual  = FEE_STRUCTURE.reduce((s, f) => s + f.annual, 0);
  const totalPaid    = PAYMENTS.reduce((s, p) => s + p.amount, 0);
  const totalPending = UPCOMING.reduce((s, u) => s + u.amount, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Fees"
        subtitle="Class 9-A · Academic Year 2025–26"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Annual fee",  value: fmt(totalAnnual), color: "bg-cobalt-light text-cobalt" },
          { label: "Paid so far", value: fmt(totalPaid),   color: "bg-sage-light text-sage" },
          { label: "Due now",     value: fmt(totalPending),color: totalPending > 0 ? "bg-rose-light text-rose" : "bg-sage-light text-sage" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Due alert */}
      {totalPending > 0 && (
        <div className="flex items-start gap-3 bg-amber-light text-amber px-4 py-3 rounded-xl text-sm border border-amber/20">
          <span className="text-lg">⚠️</span>
          <div>
            <strong>Payment due by 30 Apr 2026</strong> — {fmt(totalPending)} outstanding.
            Please pay through the school portal or contact the accounts office.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fee structure */}
        <Card className="lg:col-span-2">
          <CardHeader title="Fee structure 2025–26" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <Th>Fee type</Th>
                  <Th>Q1</Th>
                  <Th>Q2</Th>
                  <Th>Q3</Th>
                  <Th>Q4</Th>
                  <Th>Annual</Th>
                </tr>
              </thead>
              <tbody>
                {FEE_STRUCTURE.map((f) => (
                  <tr key={f.type} className="hover:bg-parchment/40 transition-colors">
                    <Td><span className="font-medium">{f.type}</span></Td>
                    <Td>{fmt(f.q1)}</Td>
                    <Td>{fmt(f.q2)}</Td>
                    <Td>{fmt(f.q3)}</Td>
                    <Td>{fmt(f.q4)}</Td>
                    <Td><span className="font-semibold">{fmt(f.annual)}</span></Td>
                  </tr>
                ))}
                <tr className="bg-cobalt-light/30">
                  <Td><span className="font-bold text-cobalt">Total</span></Td>
                  {["q1","q2","q3","q4"].map((q) => (
                    <Td key={q}><span className="font-semibold text-cobalt">{fmt(FEE_STRUCTURE.reduce((s,f) => s + f[q], 0))}</span></Td>
                  ))}
                  <Td><span className="font-bold text-cobalt">{fmt(totalAnnual)}</span></Td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Upcoming dues */}
          {UPCOMING.length > 0 && (
            <div className="mt-5 pt-4 border-t border-ink/5">
              <div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-3">Upcoming dues</div>
              <div className="space-y-2">
                {UPCOMING.map((u) => (
                  <div key={u.desc} className="flex items-center gap-3 p-3 rounded-xl bg-amber-light/50 border border-amber/20">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink">{u.desc}</div>
                      <div className="text-xs text-ink/40 mt-0.5">Due: {u.due}</div>
                    </div>
                    <span className="text-sm font-bold text-amber">{fmt(u.amount)}</span>
                    <Badge variant="warning">Due</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Payment history */}
        <Card>
          <CardHeader title="Payment history" />
          <div className="space-y-0">
            {PAYMENTS.map((p) => (
              <div key={p.id} className="py-3 border-b border-ink/5 last:border-0">
                <div className="flex items-start justify-between mb-0.5">
                  <span className="text-sm font-medium text-ink">{p.desc}</span>
                  <span className="text-sm font-bold text-sage">{fmt(p.amount)}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-ink/40">{p.date}</span>
                  <span className="text-[11px] text-ink/40">·</span>
                  <span className="text-[11px] text-ink/40">{p.method}</span>
                  <Badge variant="success" className="ml-auto">Paid</Badge>
                </div>
                <button className="text-[11px] text-cobalt mt-1 hover:underline">Download receipt →</button>
              </div>
            ))}
          </div>

          {/* Paid progress */}
          <div className="mt-4 pt-4 border-t border-ink/5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-ink/50">Paid this year</span>
              <span className="font-semibold text-ink">{Math.round((totalPaid / totalAnnual) * 100)}%</span>
            </div>
            <div className="h-2 bg-parchment rounded-full overflow-hidden">
              <div className="h-full bg-sage rounded-full" style={{ width: `${Math.round((totalPaid / totalAnnual) * 100)}%` }} />
            </div>
            <div className="text-[11px] text-ink/35 mt-1">{fmt(totalPaid)} of {fmt(totalAnnual)}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}