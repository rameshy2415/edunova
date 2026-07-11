import React, { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, CardHeader, Badge, Button, Spinner } from "../../components/common";
// import { feesApi } from "../../api/feesApi";

/* ------------------------------------------------------------------------
   FeeCollection
   ------------------------------------------------------------------------
   Admin-facing fee collection screen supporting:
     - Monthly tuition fee ledger (Apr–Mar), paid/pending/overdue per month
     - Ad-hoc fees (Transport, Sports & Activity, Book Fee, Lab Fee, ...)
     - Multi-select collection (pick any combination of pending months/adhoc
       items), payment mode, and a receipt on completion

   Drop-in usage once wired to your API:

     <FeeCollection
       sections={section}                          // [{id, name}] — same shape used elsewhere
       fetchStudents={feesApi.getSectionFeeStatus}  // (sectionId) => Promise<StudentFeeRow[]>
       collectPayment={feesApi.collectPayment}      // (payload) => Promise<Receipt>
       addAdhocFee={feesApi.addAdhocFee}             // (studentId, feeInput) => Promise<AdhocFee>
     />

   Expected shape from fetchStudents(sectionId):
     [{
       id, roll, name,
       tuitionPerMonth,
       monthlyLedger: { Apr: "PAID" | "PENDING", May: "...", ... },  // 12 keys, Apr–Mar
       adhocFees: [{ id, type, label, amount, status: "PAID"|"PENDING", dueDate }]
     }]

   collectPayment(payload) receives:
     { studentId, sectionId, items: [{ kind: "MONTHLY", month, amount } | { kind: "ADHOC", feeId, amount }], paymentMode, total }
   and should resolve to a receipt: { receiptNo, date, items, total, paymentMode }

   Until those endpoints exist, this component falls back to seeded demo data
   so it renders and behaves correctly out of the box.
------------------------------------------------------------------------- */

const DEMO_SECTIONS = [
  { id: "6-A", name: "6-A" }, { id: "7-A", name: "7-A" }, { id: "8-A", name: "8-A" },
  { id: "9-A", name: "9-A" }, { id: "9-B", name: "9-B" }, { id: "10-A", name: "10-A" },
];

const DEMO_STUDENT_NAMES = [
  "Aryan Mehta", "Bhavna Singh", "Chirag Patel", "Deepika Rao", "Eshan Kumar",
  "Farida Shaikh", "Gaurav Nair", "Harsha Iyer",
];

const YEAR_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const ADHOC_TYPES = [
  { key: "TRANSPORT", label: "Transport", defaultAmount: 1500 },
  { key: "ACTIVITY", label: "Sports & Activity", defaultAmount: 800 },
  { key: "BOOKS", label: "Book Fee", defaultAmount: 1200 },
  { key: "LAB", label: "Lab Fee", defaultAmount: 500 },
];

const PAYMENT_MODES = ["Cash", "UPI", "Card", "Cheque"];

function seededPct(seed) {
  return Math.abs(Math.sin(seed) * 10000) % 1;
}
function classSeed(cls) {
  return cls.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

// Apr=0 ... Mar=11, regardless of calendar year
function currentAcademicIndex() {
  const m = new Date().getMonth(); // 0=Jan
  return m >= 3 ? m - 3 : m + 9;
}

function demoFetchStudents(sectionId) {
  const base = classSeed(sectionId || "6-A");
  const tuitionPerMonth = 2200 + (base % 5) * 100;
  const curIdx = currentAcademicIndex();

  return DEMO_STUDENT_NAMES.map((name, si) => {
    const monthlyLedger = {};
    YEAR_MONTHS.forEach((m, mi) => {
      const paid = mi < curIdx ? seededPct(base + si * 13 + mi * 3.1) > 0.12 : mi === curIdx ? seededPct(base + si * 13 + mi * 3.1) > 0.55 : false;
      monthlyLedger[m] = paid ? "PAID" : "PENDING";
    });

    const adhocFees = ADHOC_TYPES.filter((t) => seededPct(base * 0.4 + si * 5 + t.key.length) > 0.35).map((t, ti) => ({
      id: `${sectionId}-${si}-${t.key}`,
      type: t.key,
      label: t.label,
      amount: t.defaultAmount,
      status: seededPct(base * 0.2 + si * 7 + ti) > 0.4 ? "PAID" : "PENDING",
      dueDate: "15 Jul 2026",
    }));

    return {
      id: `${sectionId}-${si}`,
      roll: si + 1,
      name,
      tuitionPerMonth,
      monthlyLedger,
      adhocFees,
    };
  });
}

function demoCollectPayment(payload) {
  return Promise.resolve({
    receiptNo: `RCPT-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    items: payload.items,
    total: payload.total,
    paymentMode: payload.paymentMode,
  });
}

function studentDue(student) {
  const pendingMonths = YEAR_MONTHS.filter((m) => student.monthlyLedger[m] === "PENDING");
  const overdueMonths = pendingMonths.filter((m) => YEAR_MONTHS.indexOf(m) < currentAcademicIndex());
  const pendingAdhoc = student.adhocFees.filter((f) => f.status === "PENDING");
  const total = pendingMonths.length * student.tuitionPerMonth + pendingAdhoc.reduce((a, f) => a + f.amount, 0);
  const status = total === 0 ? "PAID_UP" : overdueMonths.length > 0 ? "OVERDUE" : "DUE";
  return { total, status, pendingMonths, overdueMonths, pendingAdhoc };
}

function StatusBadge({ status }) {
  if (status === "PAID_UP") return <Badge variant="sage">Paid up</Badge>;
  if (status === "OVERDUE") return <Badge variant="rose">Overdue</Badge>;
  return <Badge variant="amber">Due</Badge>;
}

function money(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/* ---------------------------------------------------------
   Collection modal: ledger + ad-hoc selection + payment + receipt
--------------------------------------------------------- */

function FeeCollectionModal({ student, sectionId, onClose, onCollected, collectPayment, addAdhocFee }) {
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedAdhoc, setSelectedAdhoc] = useState([]);
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showAddAdhoc, setShowAddAdhoc] = useState(false);
  const [newAdhoc, setNewAdhoc] = useState({ type: ADHOC_TYPES[0].key, amount: ADHOC_TYPES[0].defaultAmount, dueDate: "" });
  const [localAdhocFees, setLocalAdhocFees] = useState(student.adhocFees);

  if (!student) return null;
  const curIdx = currentAcademicIndex();

  const toggleMonth = (m) => {
    if (student.monthlyLedger[m] !== "PENDING") return;
    setSelectedMonths((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };
  const toggleAdhoc = (fee) => {
    if (fee.status !== "PENDING") return;
    setSelectedAdhoc((prev) => (prev.some((f) => f.id === fee.id) ? prev.filter((f) => f.id !== fee.id) : [...prev, fee]));
  };

  const total = selectedMonths.length * student.tuitionPerMonth + selectedAdhoc.reduce((a, f) => a + f.amount, 0);

  const handleAddAdhoc = async () => {
    const typeInfo = ADHOC_TYPES.find((t) => t.key === newAdhoc.type);
    const feeInput = { type: newAdhoc.type, label: typeInfo.label, amount: Number(newAdhoc.amount), status: "PENDING", dueDate: newAdhoc.dueDate || "—" };
    try {
      const created = addAdhocFee ? await addAdhocFee(student.id, feeInput) : { id: `${student.id}-${newAdhoc.type}-${Date.now()}`, ...feeInput };
      setLocalAdhocFees((prev) => [...prev, created]);
      setShowAddAdhoc(false);
    } catch (err) {
      alert(err.message || "Failed to add fee. Please try again.");
    }
  };

  const handleCollect = async () => {
    if (selectedMonths.length === 0 && selectedAdhoc.length === 0) {
      alert("Select at least one month or fee item to collect.");
      return;
    }
    setSubmitting(true);
    try {
      const items = [
        ...selectedMonths.map((m) => ({ kind: "MONTHLY", month: m, amount: student.tuitionPerMonth })),
        ...selectedAdhoc.map((f) => ({ kind: "ADHOC", feeId: f.id, label: f.label, amount: f.amount })),
      ];
      const payload = { studentId: student.id, sectionId, items, paymentMode, total };
      const result = collectPayment ? await collectPayment(payload) : await demoCollectPayment(payload);
      setReceipt(result);
      onCollected?.(student.id, selectedMonths, selectedAdhoc.map((f) => f.id));
    } catch (err) {
      alert(err.message || "Payment collection failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {!receipt ? (
          <>
            <div className="flex items-start justify-between p-5 border-b border-ink/8">
              <div>
                <p className="text-xs text-ink/40 mb-0.5">Roll {String(student.roll).padStart(2, "0")} · {money(student.tuitionPerMonth)}/mo</p>
                <h3 className="font-serif text-lg font-semibold text-ink">{student.name}</h3>
              </div>
              <button onClick={onClose} className="text-ink/40 hover:text-ink w-8 h-8 rounded-lg hover:bg-parchment flex items-center justify-center">✕</button>
            </div>

            <div className="p-5 space-y-6">
              {/* Monthly ledger */}
              <div>
                <h4 className="text-sm font-semibold text-ink mb-2.5">Monthly tuition — Academic year 2025–26</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {YEAR_MONTHS.map((m, mi) => {
                    const st = student.monthlyLedger[m];
                    const overdue = st === "PENDING" && mi < curIdx;
                    const selected = selectedMonths.includes(m);
                    const tone =
                      st === "PAID" ? "bg-sage-light text-sage cursor-default" :
                      overdue ? "bg-rose-light text-rose" :
                      "bg-amber-light text-amber";
                    return (
                      <button
                        key={m}
                        onClick={() => toggleMonth(m)}
                        disabled={st === "PAID"}
                        className={`h-11 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${tone} ${
                          selected ? "ring-2 ring-cobalt ring-offset-1" : ""
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-ink/40">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-sage inline-block" /> Paid</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber inline-block" /> Pending</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose inline-block" /> Overdue</span>
                </div>
              </div>

              {/* Ad-hoc fees */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-sm font-semibold text-ink">Ad-hoc fees</h4>
                  <button onClick={() => setShowAddAdhoc((v) => !v)} className="text-xs font-medium text-cobalt hover:underline">
                    {showAddAdhoc ? "Cancel" : "+ Add fee"}
                  </button>
                </div>

                {showAddAdhoc && (
                  <div className="flex flex-wrap items-end gap-2 mb-3 p-3 rounded-xl bg-parchment/50 border border-ink/8">
                    <div>
                      <label className="text-[11px] text-ink/50 block mb-1">Type</label>
                      <select
                        value={newAdhoc.type}
                        onChange={(e) => {
                          const t = ADHOC_TYPES.find((x) => x.key === e.target.value);
                          setNewAdhoc((p) => ({ ...p, type: t.key, amount: t.defaultAmount }));
                        }}
                        className="text-sm rounded-lg border border-ink/10 px-2 py-1.5 outline-none"
                      >
                        {ADHOC_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-ink/50 block mb-1">Amount</label>
                      <input
                        type="number"
                        value={newAdhoc.amount}
                        onChange={(e) => setNewAdhoc((p) => ({ ...p, amount: e.target.value }))}
                        className="text-sm rounded-lg border border-ink/10 px-2 py-1.5 outline-none w-24"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ink/50 block mb-1">Due date</label>
                      <input
                        type="text"
                        placeholder="15 Jul 2026"
                        value={newAdhoc.dueDate}
                        onChange={(e) => setNewAdhoc((p) => ({ ...p, dueDate: e.target.value }))}
                        className="text-sm rounded-lg border border-ink/10 px-2 py-1.5 outline-none w-32"
                      />
                    </div>
                    <Button size="sm" onClick={handleAddAdhoc}>Add</Button>
                  </div>
                )}

                {localAdhocFees.length === 0 ? (
                  <p className="text-sm text-ink/40">No ad-hoc fees for this student.</p>
                ) : (
                  <div className="space-y-1.5">
                    {localAdhocFees.map((f) => {
                      const selected = selectedAdhoc.some((x) => x.id === f.id);
                      const paid = f.status === "PAID";
                      return (
                        <button
                          key={f.id}
                          onClick={() => toggleAdhoc(f)}
                          disabled={paid}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                            paid ? "border-sage/20 bg-sage-light/40 cursor-default" :
                            selected ? "border-cobalt bg-cobalt-light/40" : "border-ink/8 bg-parchment/40 hover:border-cobalt/30"
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-medium text-ink">{f.label}</p>
                            <p className="text-[11px] text-ink/40">Due {f.dueDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-ink">{money(f.amount)}</span>
                            {paid ? <Badge variant="sage">Paid</Badge> : selected ? <Badge variant="cobalt">Selected</Badge> : <Badge variant="amber">Pending</Badge>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment mode + total */}
              <div className="border-t border-ink/8 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-ink/60">Payment mode</span>
                  <div className="flex gap-1.5">
                    {PAYMENT_MODES.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPaymentMode(mode)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium border ${
                          paymentMode === mode ? "bg-cobalt text-white border-cobalt" : "border-ink/10 text-ink/60 hover:border-cobalt/30"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-ink">Total to collect</span>
                  <span className="font-serif text-xl font-semibold text-ink">{money(total)}</span>
                </div>
                <Button className="w-full" onClick={handleCollect} disabled={submitting || total === 0}>
                  {submitting ? "Processing..." : `Collect ${money(total)}`}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-sage-light text-sage flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 11l3 3L22 4" /></svg>
            </div>
            <h3 className="font-serif text-lg font-semibold text-ink mb-1">Payment collected</h3>
            <p className="text-sm text-ink/50 mb-5">Receipt {receipt.receiptNo} · {receipt.date}</p>

            <div className="text-left rounded-xl border border-ink/8 p-4 space-y-1.5 mb-5">
              {receipt.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-ink/70">{it.kind === "MONTHLY" ? `Tuition — ${it.month}` : it.label}</span>
                  <span className="text-ink font-medium">{money(it.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-1.5 border-t border-ink/8 font-semibold">
                <span className="text-ink">Total ({receipt.paymentMode})</span>
                <span className="text-ink">{money(receipt.total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1">Print receipt</Button>
              <Button className="flex-1" onClick={onClose}>Done</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Root module
--------------------------------------------------------- */

export default function FeeCollection({
  sections = DEMO_SECTIONS,
  initialSectionId,
  fetchStudents,
  collectPayment,
  addAdhocFee,
  embedded = false,
}) {
  const [sectionId, setSectionId] = useState(initialSectionId || sections[0]?.id || "");
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (!sectionId && sections.length > 0) {
      setSectionId(initialSectionId || sections[0].id);
    }
  }, [sections]);

  useEffect(() => {
    load();
  }, [sectionId]);

  const load = async () => {
    if (!sectionId) return;
    setLoading(true);
    setError("");
    try {
      const data = fetchStudents ? await fetchStudents(sectionId) : demoFetchStudents(sectionId);
      setStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load fee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || String(s.roll).includes(query.trim())
  );

  const summary = useMemo(() => {
    const dues = students.map(studentDue);
    return {
      totalDue: dues.reduce((a, d) => a + d.total, 0),
      overdueCount: dues.filter((d) => d.status === "OVERDUE").length,
      dueCount: dues.filter((d) => d.status === "DUE").length,
      paidUpCount: dues.filter((d) => d.status === "PAID_UP").length,
    };
  }, [students]);

  const handleCollected = () => {
    // Optimistically refresh the section after a successful collection.
    // Swap for a targeted local state update if you want to avoid a refetch.
    load();
  };

  return (
    <div className="space-y-5">
      {embedded ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardHeader title="Collect fee" />
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium text-ink outline-none cursor-pointer"
          >
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      ) : (
        <PageHeader
          title="Fee collection"
          subtitle="Monthly tuition and ad-hoc fees"
          actions={
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium text-ink outline-none cursor-pointer"
            >
              {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          }
        />
      )}

      {error && <div className="flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">{error}</div>}

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Total outstanding</p>
          <p className="font-serif text-xl font-semibold text-ink">{money(summary.totalDue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Overdue students</p>
          <p className="font-serif text-xl font-semibold text-rose">{summary.overdueCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Due (not yet overdue)</p>
          <p className="font-serif text-xl font-semibold text-amber">{summary.dueCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Paid up</p>
          <p className="font-serif text-xl font-semibold text-sage">{summary.paidUpCount}</p>
        </Card>
      </div>

      {(() => {
        const Wrapper = embedded ? "div" : Card;
        const wrapperProps = embedded ? { className: "border-t border-ink/8 pt-5" } : {};
        return (
          <Wrapper {...wrapperProps}>
            <div className="flex items-center justify-between mb-4">
              <CardHeader title="Students" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll no."
                className="text-sm px-3 py-1.5 rounded-lg border border-ink/10 bg-parchment/50 outline-none focus:border-cobalt/40 w-56"
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Spinner />
                <p className="font-serif text-lg text-ink/40 mt-2">Loading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.length === 0 && <p className="text-sm text-ink/40 text-center py-6">No students match "{query}"</p>}
                {filtered.map((s) => {
                  const due = studentDue(s);
                  return (
                    <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border border-ink/8 hover:border-cobalt/20 transition-all">
                      <span className="text-xs text-ink/40 min-w-[28px] font-mono">{String(s.roll).padStart(2, "0")}</span>
                      <span className="flex-1 text-sm font-medium text-ink">{s.name}</span>
                      <div className="text-right mr-2">
                        <p className="text-sm font-semibold text-ink">{due.total === 0 ? "—" : money(due.total)}</p>
                        <StatusBadge status={due.status} />
                      </div>
                      <Button size="sm" variant={due.total === 0 ? "ghost" : "primary"} onClick={() => setSelectedStudent(s)}>
                        {due.total === 0 ? "View" : "Collect"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Wrapper>
        );
      })()}

      {selectedStudent && (
        <FeeCollectionModal
          student={selectedStudent}
          sectionId={sectionId}
          onClose={() => { setSelectedStudent(null); }}
          onCollected={handleCollected}
          collectPayment={collectPayment}
          addAdhocFee={addAdhocFee}
        />
      )}
    </div>
  );
}