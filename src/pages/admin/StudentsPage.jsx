import React, { useState } from "react";
import {
  PageHeader, Card, Badge, Table, Th, Td,
  Button, EmptyState, Alert,
} from "../../components/common";

/* ─── Seed data ──────────────────────────────────────────── */
const SEED = [
  { id: 1,  admNo: "EDN-2021-1284", name: "Aryan Mehta",    dob: "14 Aug 2010", gender: "Male",   class: "9-A",  roll: 21, father: "Rakesh Mehta",   phone: "+91 98765 43210", email: "r.mehta@example.com",  blood: "B+", status: "Active",   fees: "Paid",    attendance: 96 },
  { id: 2,  admNo: "EDN-2021-1285", name: "Priya Sharma",   dob: "22 Mar 2009", gender: "Female", class: "11-B", roll: 7,  father: "Suresh Sharma",  phone: "+91 98765 43211", email: "s.sharma@example.com", blood: "O+", status: "Active",   fees: "Partial", attendance: 88 },
  { id: 3,  admNo: "EDN-2022-1410", name: "Rohan Kulkarni", dob: "5 Jul 2012",  gender: "Male",   class: "6-C",  roll: 14, father: "Anil Kulkarni",  phone: "+91 98765 43212", email: "a.kulkarni@example.com",blood: "A+", status: "Active",   fees: "Overdue", attendance: 72 },
  { id: 4,  admNo: "EDN-2020-1100", name: "Sneha Nair",     dob: "18 Nov 2008", gender: "Female", class: "10-A", roll: 2,  father: "Vijay Nair",     phone: "+91 98765 43213", email: "v.nair@example.com",   blood: "B-", status: "Inactive", fees: "Paid",    attendance: 91 },
  { id: 5,  admNo: "EDN-2022-1411", name: "Vikram Joshi",   dob: "9 Sep 2011",  gender: "Male",   class: "8-B",  roll: 31, father: "Deepak Joshi",   phone: "+91 98765 43214", email: "d.joshi@example.com",  blood: "AB+",status: "Active",   fees: "Partial", attendance: 85 },
  { id: 6,  admNo: "EDN-2023-1560", name: "Neha Kulkarni",  dob: "1 Feb 2012",  gender: "Female", class: "7-A",  roll: 9,  father: "Ramesh Kulkarni",phone: "+91 98765 43215", email: "r.kulkarni@example.com",blood: "O-", status: "Active",   fees: "Paid",    attendance: 98 },
];

const CLASSES = ["6-A","6-B","6-C","7-A","7-B","8-A","8-B","9-A","9-B","10-A","10-B","11-A","11-B"];
const BLOOD   = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const FEE_V    = { Paid: "success", Partial: "warning", Overdue: "danger" };
const STATUS_V = { Active: "success", Inactive: "neutral" };

const EMPTY_FORM = { name:"", dob:"", gender:"Male", class:"9-A", roll:"", father:"", phone:"", email:"", blood:"B+", status:"Active", fees:"Paid", attendance:100 };

/* ─── Modal ──────────────────────────────────────────────── */
function StudentModal({ mode, initial, onSave, onClose }) {
  const [form, setForm]   = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = "Name is required";
    if (!form.dob.trim())    e.dob    = "Date of birth is required";
    if (!form.roll)          e.roll   = "Roll number is required";
    if (!form.father.trim()) e.father = "Father's name is required";
    if (!form.phone.trim())  e.phone  = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(form); };

  const Field = ({ label, field, type = "text", opts, placeholder, half }) => (
    <div className={half ? "" : "sm:col-span-2"}>
      <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">{label}</label>
      {type === "select" ? (
        <select value={form[field]} onChange={(e) => set(field, e.target.value)}
          className={`w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-cobalt/10 transition-all ${errors[field] ? "border-rose" : "border-ink/12 focus:border-cobalt"}`}>
          {opts.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[field]} placeholder={placeholder}
          onChange={(e) => set(field, e.target.value)}
          className={`w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-cobalt/10 transition-all ${errors[field] ? "border-rose" : "border-ink/12 focus:border-cobalt"}`} />
      )}
      {errors[field] && <p className="text-[11px] text-rose mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div className="bg-parchment rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
          <h2 className="font-serif text-xl text-ink">{mode === "add" ? "Add new student" : "Edit student"}</h2>
          <button onClick={onClose} className="text-ink/30 hover:text-ink transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Personal */}
          <div>
            <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Personal information</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">Full name *</label>
                <input type="text" value={form.name} placeholder="Aryan Mehta" onChange={(e) => set("name", e.target.value)} className={inputCls("name")} />
                {errors.name && <p className="text-[11px] text-rose mt-1">{errors.name}</p>}
              </div> */}
              <Field label="Full name"     field="name"   type="text"   placeholder="Aryan Mehta"  />
              <Field label="Date of birth" field="dob"    type="text"   placeholder="14 Aug 2010" half />
              <Field label="Gender"        field="gender" type="select" opts={["Male","Female","Other"]} half />
              <Field label="Blood group"   field="blood"  type="select" opts={BLOOD} half />
            </div>
          </div>

          {/* Academic */}
          <div>
            <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Academic details</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Class"      field="class"      type="select" opts={CLASSES} half />
              <Field label="Roll no."   field="roll"       type="number" placeholder="21"  half />
              <Field label="Status"     field="status"     type="select" opts={["Active","Inactive","Suspended"]} half />
              <Field label="Fee status" field="fees"       type="select" opts={["Paid","Partial","Overdue"]} half />
            </div>
          </div>

          {/* Guardian */}
          <div>
            <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Guardian details</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Father / Guardian name" field="father" type="text" placeholder="Rakesh Mehta" />
              <Field label="Phone"                  field="phone"  type="text" placeholder="+91 98765 43210" half />
              <Field label="Email"                  field="email"  type="email" placeholder="parent@email.com" half />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink/8 bg-white/40 rounded-b-2xl">
          <p className="text-xs text-ink/35">All fields marked required (*) must be filled</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>{mode === "add" ? "Add student" : "Save changes"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete confirm ─────────────────────────────────────── */
function DeleteConfirm({ student, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-parchment rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-rose-light rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>
          <h3 className="font-serif text-lg text-ink">Delete student?</h3>
          <p className="text-sm text-ink/50 mt-2">
            This will permanently remove <strong>{student.name}</strong> (Roll {student.roll}, {student.class}) and all associated records. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => onConfirm(student.id)}>Delete permanently</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function StudentsPage() {
  const [students, setStudents] = useState(SEED);
  const [search, setSearch]     = useState("");
  const [classF, setClassF]     = useState("All");
  const [feeF, setFeeF]         = useState("All");
  const [statusF, setStatusF]   = useState("All");
  const [modal, setModal]       = useState(null);   // null | { mode:"add"|"edit", data? }
  const [delTarget, setDelTarget] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (classF  === "All" || s.class  === classF) &&
    (feeF    === "All" || s.fees   === feeF) &&
    (statusF === "All" || s.status === statusF)
  );

  const handleAdd = (form) => {
    const newStudent = {
      ...form,
      id: Date.now(),
      admNo: `EDN-2026-${Math.floor(1600 + Math.random() * 400)}`,
      roll: Number(form.roll),
      attendance: Number(form.attendance),
    };
    setStudents((p) => [...p, newStudent]);
    setModal(null);
    showToast(`${form.name} added successfully!`);
  };

  const handleEdit = (form) => {
    setStudents((p) => p.map((s) => s.id === modal.data.id ? { ...s, ...form, roll: Number(form.roll) } : s));
    setModal(null);
    showToast("Student updated successfully!");
  };

  const handleDelete = (id) => {
    setStudents((p) => p.filter((s) => s.id !== id));
    setDelTarget(null);
    showToast("Student deleted.", "warning");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} of ${students.length} students`}
        actions={<Button onClick={() => setModal({ mode: "add" })}>+ Add student</Button>}
      />

      {toast && (
        <Alert variant={toast.type === "warning" ? "warning" : "success"}>
          {toast.msg}
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total students", value: students.length,                                          color: "bg-cobalt-light text-cobalt" },
          { label: "Active",         value: students.filter((s) => s.status === "Active").length,    color: "bg-sage-light text-sage" },
          { label: "Fee overdue",    value: students.filter((s) => s.fees === "Overdue").length,     color: "bg-rose-light text-rose" },
          { label: "Avg attendance", value: Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length) + "%", color: "bg-amber-light text-amber" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <Card padding={false}>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-ink/5">
          <div className="flex-1 min-w-44 flex items-center gap-2 bg-parchment border border-ink/10 rounded-xl px-3 py-2">
            <svg className="w-3.5 h-3.5 text-ink/35 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}><circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/></svg>
            <input type="text" placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35" />
          </div>
          {[
            [classF,  setClassF,  ["All", ...CLASSES]],
            [feeF,    setFeeF,    ["All","Paid","Partial","Overdue"]],
            [statusF, setStatusF, ["All","Active","Inactive"]],
          ].map(([val, setter, opts], i) => (
            <select key={i} value={val} onChange={(e) => setter(e.target.value)}
              className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
          <Button variant="secondary" size="sm">Export CSV</Button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState title="No students found" message="Try adjusting your filters or add a new student." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Adm. no.</Th><Th>Student</Th><Th>Class</Th>
                <Th>Roll</Th><Th>Attendance</Th><Th>Fees</Th>
                <Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-parchment/40 transition-colors group">
                  <Td><span className="font-mono text-xs text-ink/40">{s.admNo}</span></Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-ink">{s.name}</div>
                        <div className="text-xs text-ink/40">{s.father}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><span className="text-xs bg-cobalt-light text-cobalt px-2 py-0.5 rounded-full">{s.class}</span></Td>
                  <Td>{s.roll}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-parchment rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${s.attendance}%`, background: s.attendance >= 85 ? "#3A6B4F" : s.attendance >= 75 ? "#B85C1A" : "#A0334A" }} />
                      </div>
                      <span className="text-xs text-ink/60">{s.attendance}%</span>
                    </div>
                  </Td>
                  <Td><Badge variant={FEE_V[s.fees]}>{s.fees}</Badge></Td>
                  <Td><Badge variant={STATUS_V[s.status]}>{s.status}</Badge></Td>
                  <Td>
                    <div className="flex gap-1.5 opacity-100 group-hover:opacity-100 transition-opacity">
                      {/* View */}
                      <button title="View profile"
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-parchment transition-colors text-ink/50 hover:text-ink">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      {/* Edit */}
                      <button title="Edit student" onClick={() => setModal({ mode: "edit", data: s })}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-cobalt-light hover:border-cobalt/30 transition-colors text-ink/50 hover:text-cobalt">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      {/* Delete */}
                      <button title="Delete student" onClick={() => setDelTarget(s)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-rose-light hover:border-rose/30 transition-colors text-ink/50 hover:text-rose">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Modals */}
      {modal?.mode === "add"  && <StudentModal mode="add"  onSave={handleAdd}  onClose={() => setModal(null)} />}
      {modal?.mode === "edit" && <StudentModal mode="edit" initial={modal.data} onSave={handleEdit} onClose={() => setModal(null)} />}
      {delTarget && <DeleteConfirm student={delTarget} onConfirm={handleDelete} onClose={() => setDelTarget(null)} />}
    </div>
  );
}