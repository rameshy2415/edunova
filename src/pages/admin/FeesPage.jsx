import React, { useState, useEffect } from "react";
import {
  PageHeader,
  Card,
  CardHeader,
  Badge,
  Table,
  Th,
  Td,
  Button,
  EmptyState,
} from "../../components/common";
import { getCurrentAcademicYear } from "../../utils/index";
import { studentsApi } from "../../api/studentsApi";
import FeeCollection from "./Feecollection"

const MOCK_FEES = [
  {
    id: 1,
    initials: "AR",
    name: "Aryan Mehta",
    class: "9-A",
    total: 42000,
    paid: 42000,
    balance: 0,
    status: "Paid",
    method: "Online",
    date: "12 Apr",
  },
  {
    id: 2,
    initials: "PS",
    name: "Priya Sharma",
    class: "11-B",
    total: 48000,
    paid: 24000,
    balance: 24000,
    status: "Partial",
    method: "UPI",
    date: "10 Apr",
  },
  {
    id: 3,
    initials: "RK",
    name: "Rohan Kulkarni",
    class: "6-C",
    total: 36000,
    paid: 0,
    balance: 36000,
    status: "Overdue",
    method: "—",
    date: "—",
  },
  {
    id: 4,
    initials: "SN",
    name: "Sneha Nair",
    class: "10-A",
    total: 42000,
    paid: 42000,
    balance: 0,
    status: "Paid",
    method: "Cash",
    date: "8 Apr",
  },
  {
    id: 5,
    initials: "VJ",
    name: "Vikram Joshi",
    class: "8-B",
    total: 38000,
    paid: 28500,
    balance: 9500,
    status: "Partial",
    method: "UPI",
    date: "15 Apr",
  },
  {
    id: 6,
    initials: "NK",
    name: "Neha Kulkarni",
    class: "7-A",
    total: 36000,
    paid: 0,
    balance: 36000,
    status: "Concession",
    method: "—",
    date: "—",
  },
];

const UPCOMING = [
  { label: "Q2 tuition fee", date: "30 Apr", count: 428, amount: "₹8.2L" },
  { label: "Transport fee", date: "5 May", count: 186, amount: "₹2.8L" },
  { label: "Exam fee", date: "15 May", count: 312, amount: "₹1.6L" },
];

const TRANSACTIONS = [
  {
    name: "Priya Sharma — tuition",
    meta: "Today, 10:32 am · Online",
    amount: "+₹24,000",
    type: "in",
  },
  {
    name: "Aryan Mehta — full fees",
    meta: "Yesterday · Cash",
    amount: "+₹42,000",
    type: "in",
  },
  {
    name: "Lab equipment purchase",
    meta: "22 Apr · Cheque",
    amount: "−₹18,500",
    type: "out",
  },
  {
    name: "Vikram Joshi — instalment",
    meta: "21 Apr · UPI",
    amount: "+₹9,500",
    type: "in",
  },
  {
    name: "Staff salary",
    meta: "20 Apr · Bank transfer",
    amount: "−₹3.2L",
    type: "out",
  },
];

const STATUS_VARIANT = {
  Paid: "success",
  Partial: "warning",
  Overdue: "danger",
  Concession: "info",
};


function fmt(n) {
  if (n === 0) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

export default function FeesPage() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("status");
  const [section, setSection] = useState([]);

  useEffect(() => {
    studentsApi
      .getSectionStudent()
      .then(({ data }) => setSection(data?.content?.section || []))
      .catch((err) => console.log(err));
  }, []);

  const filtered = MOCK_FEES.filter((f) => {
    const ms = f.name.toLowerCase().includes(search.toLowerCase());
    const mst = statusF === "All" || f.status === statusF;
    return ms && mst;
  });

  const handleTabChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Fees & Finance"
        subtitle={"Academic Year " + getCurrentAcademicYear()}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Export
            </Button>
            <Button size="sm" onClick={() => setShowModal(true)}>
              + Record payment
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total collected",
            value: "₹18.4L",
            change: "+12% vs last month",
            up: true,
            color: "bg-cobalt-light text-cobalt",
          },
          {
            label: "Outstanding dues",
            value: "₹4.2L",
            change: "38 students pending",
            up: false,
            color: "bg-rose-light text-rose",
          },
          {
            label: "Collection rate",
            value: "81.4%",
            change: "+3.2% this term",
            up: true,
            color: "bg-sage-light text-sage",
          },
          {
            label: "Concessions given",
            value: "₹1.1L",
            change: "14 students",
            up: null,
            color: "bg-amber-light text-amber",
          },
        ].map((m) => (
          <div key={m.label} className={`${m.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-2">{m.label}</div>
            <div className="font-serif text-2xl font-semibold mb-1">
              {m.value}
            </div>
            <div className="text-xs opacity-70">
              {m.up === true ? "↑" : m.up === false ? "↑" : ""} {m.change}
            </div>
          </div>
        ))}
      </div>


      <div className="flex rounded-xl border border-ink/8 bg-white p-1 w-fit">
        {[
          { key: "status", label: "Fee status" },
          { key: "collect", label: "Collect fee" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              view === t.key ? "bg-cobalt text-white" : "text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fee register */}
        <Card className="lg:col-span-2" padding={false}>
          {/* Fee Status */}
          {view === "status" && (
            <>
              <div className="flex flex-wrap gap-3 p-4 border-b border-ink/5">
                <div className="flex-1 min-w-44 flex items-center gap-2 bg-parchment border border-ink/10 rounded-xl px-3 py-2">
                  <svg
                    className="w-3.5 h-3.5 text-ink/35 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <circle cx="6.5" cy="6.5" r="5" />
                    <path d="M10 10l3.5 3.5" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search student…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
                  />
                </div>
                <select
                  value={statusF}
                  onChange={(e) => setStatusF(e.target.value)}
                  className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
                >
                  {["All", "Paid", "Partial", "Overdue", "Concession"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </div>

              {filtered.length === 0 ? (
                <EmptyState title="No records" message="Adjust filters." />
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>Student</Th>
                      <Th>Class</Th>
                      <Th>Total fee</Th>
                      <Th>Paid</Th>
                      <Th>Balance</Th>
                      <Th>Status</Th>
                      <Th></Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => (
                      <tr
                        key={f.id}
                        className="hover:bg-parchment/40 transition-colors"
                      >
                        <Td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                              {f.initials}
                            </div>
                            <span className="font-medium">{f.name}</span>
                          </div>
                        </Td>
                        <Td>{f.class}</Td>
                        <Td>{fmt(f.total)}</Td>
                        <Td
                          className={
                            f.paid > 0 ? "text-sage font-medium" : "text-ink/30"
                          }
                        >
                          {fmt(f.paid)}
                        </Td>
                        <Td
                          className={
                            f.balance > 0
                              ? "text-rose font-medium"
                              : "text-ink/30"
                          }
                        >
                          {fmt(f.balance)}
                        </Td>
                        <Td>
                          <Badge variant={STATUS_VARIANT[f.status]}>
                            {f.status}
                          </Badge>
                        </Td>
                        <Td>
                          {f.status === "Overdue" && (
                            <button className="text-xs px-2.5 py-1 rounded-lg bg-rose-light text-rose border border-rose/20 hover:bg-rose/10 transition-colors">
                              Remind
                            </button>
                          )}
                          {f.status === "Partial" && (
                            <button
                              className="text-xs px-2.5 py-1 rounded-lg border border-ink/12 hover:bg-parchment transition-colors"
                              onClick={() => setShowModal(true)}
                            >
                              Collect
                            </button>
                          )}
                          {f.status === "Paid" && (
                            <button className="text-xs px-2.5 py-1 rounded-lg border border-ink/12 hover:bg-parchment transition-colors">
                              Receipt
                            </button>
                          )}
                          {f.status === "Concession" && (
                            <button className="text-xs px-2.5 py-1 rounded-lg border border-ink/12 hover:bg-parchment transition-colors">
                              Review
                            </button>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}

          {/* Fee Collection */}
          {view === "collect" && (
            <div className="p-4">
              <FeeCollection
                embedded
                sections={section}
                fetchStudents={studentsApi.getSectionFeeStatus}
                collectPayment={studentsApi.collectFeePayment}
                addAdhocFee={studentsApi.addAdhocFee}
              />
            </div>
          )}
        </Card>

        {/* Right column */}
        <div className="space-y-5">
          {/* Collection breakdown */}
          <Card>
            <CardHeader title="Collection breakdown" />
            <div className="flex justify-center mb-4">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r="48"
                  fill="none"
                  stroke="#F8F5EF"
                  strokeWidth="18"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="48"
                  fill="none"
                  stroke="#1B3F8B"
                  strokeWidth="18"
                  strokeDasharray="245 56"
                  strokeDashoffset="75"
                  strokeLinecap="round"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="48"
                  fill="none"
                  stroke="#EF9F27"
                  strokeWidth="18"
                  strokeDasharray="56 245"
                  strokeDashoffset="-170"
                  strokeLinecap="round"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="48"
                  fill="none"
                  stroke="#E24B4A"
                  strokeWidth="18"
                  strokeDasharray="30 271"
                  strokeDashoffset="-226"
                  strokeLinecap="round"
                />
                <text
                  x="65"
                  y="60"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="500"
                  fill="#0D0F12"
                >
                  81%
                </text>
                <text
                  x="65"
                  y="75"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#0D0F12"
                  opacity="0.5"
                >
                  collected
                </text>
              </svg>
            </div>
            <div className="space-y-2">
              {[
                ["#1B3F8B", "Paid in full", "₹14.9L"],
                ["#EF9F27", "Partial payment", "₹3.5L"],
                ["#E24B4A", "Overdue", "₹4.2L"],
                ["#e2ddd5", "Concessions", "₹1.1L"],
              ].map(([color, label, val]) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="text-xs text-ink/60">{label}</span>
                  </div>
                  <span className="text-xs font-semibold text-ink">{val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming dues */}
          <Card>
            <CardHeader title="Upcoming dues" action="All →" />
            <div className="space-y-0">
              {UPCOMING.map((u) => (
                <div
                  key={u.label}
                  className="flex items-center gap-3 py-2.5 border-b border-ink/5 last:border-0"
                >
                  <span className="text-xs text-ink/40 min-w-[50px]">
                    {u.date}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">
                      {u.label}
                    </div>
                    <div className="text-xs text-ink/40">
                      {u.count} students
                    </div>
                  </div>
                  <Badge variant="info">{u.amount}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent transactions */}
          <Card>
            <CardHeader title="Recent transactions" action="All →" />
            <div className="space-y-0">
              {TRANSACTIONS.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b border-ink/5 last:border-0"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${t.type === "in" ? "bg-sage-light" : "bg-rose-light"}`}
                  >
                    {t.type === "in" ? (
                      <svg
                        className="w-3 h-3 text-sage"
                        fill="none"
                        viewBox="0 0 12 12"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M6 10V2M3 5l3-3 3 3" />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 text-rose"
                        fill="none"
                        viewBox="0 0 12 12"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M6 2v8M3 7l3 3 3-3" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-ink truncate">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-ink/40">{t.meta}</div>
                  </div>
                  <span
                    className={`text-xs font-semibold ${t.type === "in" ? "text-sage" : "text-rose"}`}
                  >
                    {t.amount}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-ink">Record Payment</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink/30 hover:text-ink"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {[
                ["Student name", "text", "Search student…"],
                ["Amount (₹)", "number", "0.00"],
                ["Payment method", "select", ""],
                ["Date", "date", ""],
              ].map(([label, type, placeholder]) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-ink/50 uppercase tracking-wide block mb-1.5">
                    {label}
                  </label>
                  {type === "select" ? (
                    <select className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-sm text-ink outline-none">
                      <option>Online / UPI</option>
                      <option>Cash</option>
                      <option>Cheque</option>
                      <option>Bank Transfer</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/10"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setShowModal(false)}>
                  Save payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}