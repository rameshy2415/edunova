import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Badge, Table, Th, Td, Button } from "../../components/common";

const PAYMENTS = [
  { id: "RCP-2026-041", date: "12 Apr 2026", desc: "Q1 Tuition + Transport",  amount: 13500, method: "UPI",   status: "Paid" },
  { id: "RCP-2026-028", date: "5 Jan 2026",  desc: "Q3 Full instalment",      amount: 14500, method: "Online",status: "Paid" },
  { id: "RCP-2025-117", date: "1 Oct 2025",  desc: "Q2 Full instalment",      amount: 14500, method: "Cash",  status: "Paid" },
  { id: "RCP-2025-061", date: "3 Jul 2025",  desc: "Q1 Full instalment + Reg",amount: 16000, method: "NEFT",  status: "Paid" },
];

const UPCOMING = [
  { due: "30 Apr 2026", desc: "Q2 Tuition Fee",   amount: 10500 },
  { due: "30 Apr 2026", desc: "Q2 Transport Fee",  amount: 3000 },
];

const FEE_STRUCTURE = [
  { type: "Tuition Fee",       annual: 42000, paid: 28000 },
  { type: "Transport Fee",     annual: 12000, paid: 9000 },
  { type: "Sports & Activity", annual: 2000,  paid: 2000 },
  { type: "Lab & Library",     annual: 2000,  paid: 2000 },
];

function fmt(n) { return "₹" + n.toLocaleString("en-IN"); }

export default function ParentFees() {
  const [showModal, setShowModal] = useState(false);
  const [payItem, setPayItem]     = useState(null);

  const totalAnnual  = FEE_STRUCTURE.reduce((s, f) => s + f.annual, 0);
  const totalPaid    = FEE_STRUCTURE.reduce((s, f) => s + f.paid,   0);
  const totalDue     = UPCOMING.reduce((s, u) => s + u.amount, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Fee Payments"
        subtitle="Aryan Mehta · Class 9-A · Academic Year 2025–26"
        actions={<Button size="sm" onClick={() => { setPayItem(null); setShowModal(true); }}>Pay now</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Annual fee",   value: fmt(totalAnnual), color: "bg-cobalt-light text-cobalt" },
          { label: "Paid so far",  value: fmt(totalPaid),   color: "bg-sage-light text-sage" },
          { label: "Due now",      value: fmt(totalDue),    color: totalDue > 0 ? "bg-rose-light text-rose" : "bg-sage-light text-sage" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Due now banner */}
      {totalDue > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-amber-light border border-amber/20 px-4 py-4 rounded-xl">
          <div className="flex-1">
            <div className="font-semibold text-amber text-sm">Payment due by 30 April 2026</div>
            <div className="text-xs text-amber/80 mt-0.5">Q2 Tuition + Transport fee — {fmt(totalDue)} outstanding</div>
          </div>
          <Button size="sm" onClick={() => setShowModal(true)}>Pay {fmt(totalDue)}</Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fee breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader title="Fee head-wise status" />
          <div className="space-y-4">
            {FEE_STRUCTURE.map((f) => {
              const pct = Math.round((f.paid / f.annual) * 100);
              return (
                <div key={f.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink">{f.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-ink/50">{fmt(f.paid)} of {fmt(f.annual)}</span>
                      <Badge variant={pct === 100 ? "success" : pct >= 50 ? "warning" : "danger"}>
                        {pct === 100 ? "Paid" : `${pct}%`}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-cobalt transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upcoming dues */}
          <div className="mt-5 pt-4 border-t border-ink/5">
            <div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-3">Upcoming payments</div>
            <div className="space-y-2">
              {UPCOMING.map((u) => (
                <div key={u.desc} className="flex items-center gap-3 p-3 rounded-xl bg-amber-light/50 border border-amber/15">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{u.desc}</div>
                    <div className="text-xs text-ink/40 mt-0.5">Due: {u.due}</div>
                  </div>
                  <span className="text-sm font-bold text-amber">{fmt(u.amount)}</span>
                  <button
                    onClick={() => { setPayItem(u); setShowModal(true); }}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber text-white hover:bg-amber/90 transition-colors"
                  >
                    Pay
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment history */}
          <div className="mt-5 pt-4 border-t border-ink/5">
            <div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-3">Payment history</div>
            <Table>
              <thead><tr><Th>Receipt</Th><Th>Date</Th><Th>Description</Th><Th>Amount</Th><Th>Method</Th><Th></Th></tr></thead>
              <tbody>
                {PAYMENTS.map((p) => (
                  <tr key={p.id} className="hover:bg-parchment/40 transition-colors">
                    <Td><span className="font-mono text-xs text-ink/50">{p.id}</span></Td>
                    <Td>{p.date}</Td>
                    <Td>{p.desc}</Td>
                    <Td><span className="text-sage font-semibold">{fmt(p.amount)}</span></Td>
                    <Td>{p.method}</Td>
                    <Td><button className="text-xs text-cobalt hover:underline">Receipt</button></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Side panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Annual progress" />
            <div className="flex justify-center mb-3">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="44" fill="none" stroke="#F8F5EF" strokeWidth="14"/>
                <circle cx="60" cy="60" r="44" fill="none" stroke="#1B3F8B" strokeWidth="14"
                  strokeDasharray={`${(totalPaid / totalAnnual) * 276.5} 276.5`}
                  strokeDashoffset="69" strokeLinecap="round"/>
                <text x="60" y="56" textAnchor="middle" fontSize="16" fontWeight="500" fill="#0D0F12">
                  {Math.round((totalPaid / totalAnnual) * 100)}%
                </text>
                <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#0D0F12" opacity="0.4">paid</text>
              </svg>
            </div>
            {[["Paid", fmt(totalPaid), "text-sage"], ["Remaining", fmt(totalAnnual - totalPaid), "text-rose"], ["Total", fmt(totalAnnual), "text-cobalt"]].map(([l, v, c]) => (
              <div key={l} className="flex justify-between py-2 border-b border-ink/5 last:border-0">
                <span className="text-xs text-ink/45">{l}</span>
                <span className={`text-sm font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader title="Payment methods" />
            <div className="space-y-2">
              {[["🏦", "Net banking / NEFT"], ["📱", "UPI / QR code"], ["💳", "Debit / Credit card"], ["🏫", "At school counter"]].map(([icon, method]) => (
                <div key={method} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-parchment/50 text-sm text-ink/60">
                  <span>{icon}</span><span>{method}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Payment modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-ink">Make payment</h2>
              <button onClick={() => setShowModal(false)} className="text-ink/30 hover:text-ink">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="bg-cobalt-light/50 rounded-xl p-4 mb-5">
              <div className="text-xs text-cobalt/70 mb-1">Paying for</div>
              <div className="text-sm font-semibold text-ink">{payItem?.desc || "Select fee items below"}</div>
              {payItem && <div className="font-serif text-2xl text-cobalt font-semibold mt-1">{fmt(payItem.amount)}</div>}
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wide block mb-1.5">Payment method</label>
                <select className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-sm text-ink outline-none">
                  <option>UPI / QR Code</option>
                  <option>Net Banking</option>
                  <option>Debit / Credit Card</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wide block mb-1.5">UPI ID</label>
                <input type="text" placeholder="yourname@upi" className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/10"/>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={() => setShowModal(false)}>Confirm payment</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}