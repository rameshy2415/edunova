
import React, { useState } from "react";
import {
  PageHeader, Card, Badge, Table, Th, Td,
  Button, EmptyState, Alert,
} from "../../components/common";

/* ─── Seed data ──────────────────────────────────────────── */
const SEED = [
  { id: 1, empId: "TCH-2012-001", name: "Suresh Kapoor",  subject: "Mathematics",    classes: ["9-A","10-B"],       phone: "+91 98200 11001", email: "s.kapoor@edunova.app",  qualification: "M.Sc Mathematics",  experience: 12, joined: "Aug 2012", salary: 52000, status: "Active" },
  { id: 2, empId: "TCH-2016-002", name: "Priya D'Souza",  subject: "English",        classes: ["11-A","11-B"],       phone: "+91 98200 11002", email: "p.dsouza@edunova.app",  qualification: "M.A. English",      experience: 8,  joined: "Jun 2016", salary: 46000, status: "Active" },
  { id: 3, empId: "TCH-2009-003", name: "Ramesh Rao",     subject: "Science",        classes: ["6-C","7-A"],        phone: "+91 98200 11003", email: "r.rao@edunova.app",     qualification: "M.Sc Physics",      experience: 15, joined: "Jan 2009", salary: 58000, status: "Active" },
  { id: 4, empId: "TCH-2018-004", name: "Anitha Iyer",    subject: "Social Studies", classes: ["8-B","9-A"],        phone: "+91 98200 11004", email: "a.iyer@edunova.app",    qualification: "M.A. History",      experience: 6,  joined: "Mar 2018", salary: 44000, status: "Active" },
  { id: 5, empId: "TCH-2014-005", name: "Vijay Menon",    subject: "Hindi",          classes: ["6-A","6-B"],        phone: "+91 98200 11005", email: "v.menon@edunova.app",   qualification: "M.A. Hindi",        experience: 10, joined: "Aug 2014", salary: 42000, status: "On Leave" },
  { id: 6, empId: "TCH-2019-006", name: "Nita Pillai",    subject: "Computer Sci.",  classes: ["10-A","11-A"],      phone: "+91 98200 11006", email: "n.pillai@edunova.app",  qualification: "B.E. CSE",          experience: 5,  joined: "Jul 2019", salary: 48000, status: "Active" },
  { id: 7, empId: "TCH-2015-007", name: "Kishore Sharma", subject: "Physical Ed.",   classes: ["All sections"],     phone: "+91 98200 11007", email: "k.sharma@edunova.app",  qualification: "M.P.Ed",            experience: 9,  joined: "Apr 2015", salary: 40000, status: "Active" },
];

const SUBJECTS   = ["Mathematics","English","Science","Social Studies","Hindi","Computer Sci.","Physical Ed.","Art","Music"];
const ALL_CLASSES = ["6-A","6-B","6-C","7-A","7-B","8-A","8-B","9-A","9-B","10-A","10-B","11-A","11-B"];
const STATUS_V   = { Active: "success", "On Leave": "warning", Inactive: "neutral" };
const AVATAR_BG  = ["bg-cobalt-light text-cobalt","bg-sage-light text-sage","bg-amber-light text-amber","bg-rose-light text-rose"];

const EMPTY_FORM = { name:"", subject:"Mathematics", qualification:"", experience:1, joined:"", phone:"", email:"", salary:"", status:"Active", classes:[] };

/* ─── Modal ──────────────────────────────────────────────── */
function TeacherModal({ mode, initial, onSave, onClose }) {
  const [form, setForm]     = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleClass = (cls) =>
    setForm((p) => ({
      ...p,
      classes: p.classes.includes(cls)
        ? p.classes.filter((c) => c !== cls)
        : [...p.classes, cls],
    }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name          = "Name is required";
    if (!form.qualification.trim()) e.qualification = "Qualification is required";
    if (!form.phone.trim())         e.phone         = "Phone is required";
    if (!form.email.trim())         e.email         = "Email is required";
    if (!form.salary)               e.salary        = "Salary is required";
    if (form.classes.length === 0)  e.classes       = "Assign at least one class";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(form); };

  const inputCls = (field) =>
    `w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-cobalt/10 transition-all ${errors[field] ? "border-rose" : "border-ink/12 focus:border-cobalt"}`;

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div className="bg-parchment rounded-2xl shadow-2xl w-full max-w-2xl mb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
          <h2 className="font-serif text-xl text-ink">{mode === "add" ? "Add new teacher" : "Edit teacher"}</h2>
          <button onClick={onClose} className="text-ink/30 hover:text-ink transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Personal */}
          <div>
            <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Personal information</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">Full name *</label>
                <input type="text" value={form.name} placeholder="Suresh Kapoor" onChange={(e) => set("name", e.target.value)} className={inputCls("name")} />
                {errors.name && <p className="text-[11px] text-rose mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">Phone *</label>
                <input type="text" value={form.phone} placeholder="+91 98200 11001" onChange={(e) => set("phone", e.target.value)} className={inputCls("phone")} />
                {errors.phone && <p className="text-[11px] text-rose mt-1">{errors.phone}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">Email *</label>
                <input type="email" value={form.email} placeholder="name@edunova.app" onChange={(e) => set("email", e.target.value)} className={inputCls("email")} />
                {errors.email && <p className="text-[11px] text-rose mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">Qualification *</label>
                <input type="text" value={form.qualification} placeholder="M.Sc Mathematics" onChange={(e) => set("qualification", e.target.value)} className={inputCls("qualification")} />
                {errors.qualification && <p className="text-[11px] text-rose mt-1">{errors.qualification}</p>}
              </div>
            </div>
          </div>

          {/* Professional */}
          <div>
            <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Professional details</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Subject *",      field: "subject",    type: "select", opts: SUBJECTS },
                { label: "Experience (yrs)",field:"experience", type: "number", placeholder: "5" },
                { label: "Date joined",    field: "joined",     type: "text",   placeholder: "Aug 2020" },
                { label: "Monthly salary (₹)*", field:"salary", type: "number", placeholder: "45000" },
                { label: "Status",         field: "status",     type: "select", opts: ["Active","On Leave","Inactive"] },
              ].map(({ label, field, type, opts, placeholder }) => (
                <div key={field}>
                  <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">{label}</label>
                  {type === "select" ? (
                    <select value={form[field]} onChange={(e) => set(field, e.target.value)} className={inputCls(field)}>
                      {opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type} value={form[field]} placeholder={placeholder} onChange={(e) => set(field, type === "number" ? Number(e.target.value) : e.target.value)} className={inputCls(field)} />
                  )}
                  {errors[field] && <p className="text-[11px] text-rose mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Assign classes */}
          <div>
            <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-1">Assigned classes *</p>
            {errors.classes && <p className="text-[11px] text-rose mb-2">{errors.classes}</p>}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ALL_CLASSES.map((cls) => (
                <button key={cls} type="button" onClick={() => toggleClass(cls)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${form.classes.includes(cls) ? "bg-cobalt text-white border-cobalt" : "border-ink/12 text-ink/50 hover:border-cobalt/40 hover:text-ink"}`}>
                  {cls}
                </button>
              ))}
            </div>
            {form.classes.length > 0 && (
              <p className="text-[11px] text-ink/40 mt-1">{form.classes.length} class{form.classes.length > 1 ? "es" : ""} selected</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink/8 bg-white/40 rounded-b-2xl">
          <p className="text-xs text-ink/35">Fields marked * are required</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>{mode === "add" ? "Add teacher" : "Save changes"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete confirm ─────────────────────────────────────── */
function DeleteConfirm({ teacher, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-parchment rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-rose-light rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>
          <h3 className="font-serif text-lg text-ink">Remove teacher?</h3>
          <p className="text-sm text-ink/50 mt-2">
            This will permanently remove <strong>{teacher.name}</strong> ({teacher.subject}) and all their records. Classes they teach will need to be reassigned.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => onConfirm(teacher.id)}>Remove permanently</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function TeachersPage() {
  const [teachers, setTeachers] = useState(SEED);
  const [search, setSearch]     = useState("");
  const [subjectF, setSubjectF] = useState("All");
  const [statusF, setStatusF]   = useState("All");
  const [modal, setModal]       = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const allSubjects = ["All", ...new Set(SEED.map((t) => t.subject))];

  const filtered = teachers.filter((t) =>
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())) &&
    (subjectF === "All" || t.subject === subjectF) &&
    (statusF  === "All" || t.status  === statusF)
  );

  const handleAdd = (form) => {
    const t = { ...form, id: Date.now(), empId: `TCH-2026-${String(teachers.length + 1).padStart(3,"0")}` };
    setTeachers((p) => [...p, t]);
    setModal(null);
    showToast(`${form.name} added successfully!`);
  };

  const handleEdit = (form) => {
    setTeachers((p) => p.map((t) => t.id === modal.data.id ? { ...t, ...form } : t));
    setModal(null);
    showToast("Teacher updated successfully!");
  };

  const handleDelete = (id) => {
    setTeachers((p) => p.filter((t) => t.id !== id));
    if (detailId === id) setDetailId(null);
    setDelTarget(null);
    showToast("Teacher removed.", "warning");
  };

  const detail = teachers.find((t) => t.id === detailId);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teachers"
        subtitle={`${filtered.length} of ${teachers.length} staff members`}
        actions={<Button onClick={() => setModal({ mode: "add" })}>+ Add teacher</Button>}
      />

      {toast && <Alert variant={toast.type === "warning" ? "warning" : "success"}>{toast.msg}</Alert>}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total staff",   value: teachers.length,                                           color: "bg-cobalt-light text-cobalt" },
          { label: "Active",        value: teachers.filter((t) => t.status === "Active").length,      color: "bg-sage-light text-sage" },
          { label: "On leave",      value: teachers.filter((t) => t.status === "On Leave").length,    color: "bg-amber-light text-amber" },
          { label: "Avg experience",value: Math.round(teachers.reduce((a,t)=>a+t.experience,0)/teachers.length)+" yrs", color: "bg-rose-light text-rose" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table */}
        <Card className={detail ? "lg:col-span-2" : "lg:col-span-3"} padding={false}>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-ink/5">
            <div className="flex-1 min-w-44 flex items-center gap-2 bg-parchment border border-ink/10 rounded-xl px-3 py-2">
              <svg className="w-3.5 h-3.5 text-ink/35 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}><circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/></svg>
              <input type="text" placeholder="Search name or subject…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35" />
            </div>
            <select value={subjectF} onChange={(e) => setSubjectF(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {allSubjects.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {["All","Active","On Leave","Inactive"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No teachers found" message="Adjust filters or add a new teacher." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Emp. ID</Th><Th>Teacher</Th><Th>Subject</Th>
                  <Th>Classes</Th><Th>Experience</Th><Th>Status</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id}
                    className={`hover:bg-parchment/40 transition-colors cursor-pointer group ${detailId === t.id ? "bg-cobalt-light/20" : ""}`}
                    onClick={() => setDetailId(detailId === t.id ? null : t.id)}>
                    <Td><span className="font-mono text-xs text-ink/40">{t.empId}</span></Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 ${AVATAR_BG[i % 4]} rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
                          {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ink">{t.name}</div>
                          <div className="text-xs text-ink/40">{t.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>{t.subject}</Td>
                    <Td>
                      <div className="flex gap-1 flex-wrap">
                        {(Array.isArray(t.classes) ? t.classes : []).slice(0, 2).map((c) => (
                          <span key={c} className="text-[11px] bg-cobalt-light text-cobalt px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                        {Array.isArray(t.classes) && t.classes.length > 2 && (
                          <span className="text-[11px] bg-ink/8 text-ink/50 px-2 py-0.5 rounded-full">+{t.classes.length - 2}</span>
                        )}
                      </div>
                    </Td>
                    <Td>{t.experience} yrs</Td>
                    <Td><Badge variant={STATUS_V[t.status]}>{t.status}</Badge></Td>
                    <Td onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Edit" onClick={() => setModal({ mode: "edit", data: t })}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-cobalt-light hover:border-cobalt/30 transition-colors text-ink/50 hover:text-cobalt">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button title="Delete" onClick={() => setDelTarget(t)}
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

        {/* Detail panel */}
        {detail && (
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-sm font-semibold">
                  {detail.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-serif text-base text-ink">{detail.name}</div>
                  <div className="text-xs text-ink/45 mt-0.5">{detail.subject}</div>
                </div>
              </div>
              <button onClick={() => setDetailId(null)} className="text-ink/30 hover:text-ink">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="space-y-0">
              {[
                ["Emp. ID",       detail.empId],
                ["Email",         detail.email],
                ["Phone",         detail.phone],
                ["Qualification", detail.qualification],
                ["Experience",    `${detail.experience} years`],
                ["Date joined",   detail.joined],
                ["Salary",        `₹${Number(detail.salary).toLocaleString("en-IN")}/mo`],
                ["Status",        <Badge variant={STATUS_V[detail.status]}>{detail.status}</Badge>],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-ink/5 last:border-0">
                  <span className="text-xs text-ink/45 flex-shrink-0 mr-3">{label}</span>
                  <span className="text-sm font-medium text-ink text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-2">Classes assigned</div>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(detail.classes) ? detail.classes : []).map((c) => (
                  <span key={c} className="text-xs bg-cobalt-light text-cobalt px-2.5 py-1 rounded-lg">{c}</span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={() => setModal({ mode: "edit", data: detail })}>Edit details</Button>
              <Button variant="danger"    size="sm" onClick={() => setDelTarget(detail)}>Remove</Button>
            </div>
          </Card>
        )}
      </div>

      {/* Modals */}
      {modal?.mode === "add"  && <TeacherModal mode="add"  onSave={handleAdd}  onClose={() => setModal(null)} />}
      {modal?.mode === "edit" && <TeacherModal mode="edit" initial={modal.data} onSave={handleEdit} onClose={() => setModal(null)} />}
      {delTarget && <DeleteConfirm teacher={delTarget} onConfirm={handleDelete} onClose={() => setDelTarget(null)} />}
    </div>
  );
}