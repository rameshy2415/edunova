import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageHeader, Card, Button, Alert } from "../../../components/common";
import { STUDENTS, CLASSES, BLOOD_GROUPS } from "./data";

/* ─── Reusable field components defined at module level ─────── */
function FormSection({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-4 pb-2 border-b border-ink/5">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

function FormField({ label, required, error, children, span }) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : span === 3 ? "sm:col-span-2 lg:col-span-3" : ""}>
      <label className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide block mb-1.5">
        {label} {required && <span className="text-rose">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-rose mt-1">{error}</p>}
    </div>
  );
}

const EMPTY = {
  name: "", dob: "", gender: "Male", blood: "B+",
  class: "9-A", roll: "", section: "A", status: "Active", fees: "Paid",
  nationality: "Indian", religion: "", category: "General",
  house: "", previousSchool: "",
  father: "", mother: "", phone: "", altPhone: "", email: "",
  address: "", emergencyContact: "",
};

export default function StudentForm() {
  const { id }   = useParams();        // present on edit, absent on new
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  /* Pre-fill for edit mode */
  useEffect(() => {
    if (isEdit) {
      const student = STUDENTS.find((s) => s.id === id);
      if (student) {
        setForm({
          name:            student.name,
          dob:             student.dob,
          gender:          student.gender,
          blood:           student.blood,
          class:           student.class,
          roll:            String(student.roll),
          section:         student.section || "A",
          status:          student.status,
          fees:            student.fees,
          nationality:     student.nationality || "Indian",
          religion:        student.religion || "",
          category:        student.category || "General",
          house:           student.house || "",
          previousSchool:  student.previousSchool || "",
          father:          student.father,
          mother:          student.mother || "",
          phone:           student.phone,
          altPhone:        student.altPhone || "",
          email:           student.email || "",
          address:         student.address || "",
          emergencyContact: student.emergencyContact || "",
        });
      }
    }
  }, [id, isEdit]);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));   // clear field error on change
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = "Full name is required";
    if (!form.dob.trim())    e.dob    = "Date of birth is required";
    if (!form.roll.trim())   e.roll   = "Roll number is required";
    if (!form.father.trim()) e.father = "Father's name is required";
    if (!form.phone.trim())  e.phone  = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    /* Replace this with:
       isEdit
         ? await studentsApi.update(id, form)
         : await studentsApi.create(form)
    */
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => navigate(isEdit ? `/admin/students/${id}` : "/admin/students"), 800);
    }, 900);
  };

  const inputCls = (field) =>
    `w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-cobalt/10 transition-all ${
      errors[field] ? "border-rose" : "border-ink/12 focus:border-cobalt"
    }`;

  const selectCls = "w-full bg-white border border-ink/12 rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/10 transition-all cursor-pointer";

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/admin/students" className="text-ink/40 hover:text-cobalt transition-colors">
            Students
          </Link>
          <span className="text-ink/20">/</span>
          {isEdit && (
            <>
              <Link to={`/admin/students/${id}`} className="text-ink/40 hover:text-cobalt transition-colors">
                {STUDENTS.find((s) => s.id === id)?.name || "Student"}
              </Link>
              <span className="text-ink/20">/</span>
            </>
          )}
          <span className="text-ink font-medium">{isEdit ? "Edit" : "New student"}</span>
        </div>

        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          ← Cancel
        </Button>
      </div>

      <PageHeader
        title={isEdit ? "Edit student" : "Add new student"}
        subtitle={isEdit ? "Update student information below" : "Fill in the details to enrol a new student"}
      />

      {saved && (
        <Alert variant="success">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 11l3 3L22 4"/></svg>
          {isEdit ? "Student updated successfully! Redirecting…" : "Student added successfully! Redirecting…"}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">

          {/* ── Section 1: Personal ── */}
          <Card>
            <FormSection title="Personal information">

              <FormField label="Full name" required error={errors.name} span={2}>
                <input type="text" value={form.name} placeholder="Aryan Mehta"
                  onChange={(e) => set("name", e.target.value)} className={inputCls("name")} />
              </FormField>

              <FormField label="Date of birth" required error={errors.dob}>
                <input type="text" value={form.dob} placeholder="14 Aug 2010"
                  onChange={(e) => set("dob", e.target.value)} className={inputCls("dob")} />
              </FormField>

              <FormField label="Gender">
                <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={selectCls}>
                  {["Male", "Female", "Other"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="Blood group">
                <select value={form.blood} onChange={(e) => set("blood", e.target.value)} className={selectCls}>
                  {BLOOD_GROUPS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="Nationality">
                <input type="text" value={form.nationality} placeholder="Indian"
                  onChange={(e) => set("nationality", e.target.value)} className={inputCls("nationality")} />
              </FormField>

              <FormField label="Religion">
                <input type="text" value={form.religion} placeholder="Hindu"
                  onChange={(e) => set("religion", e.target.value)} className={inputCls("religion")} />
              </FormField>

              <FormField label="Category">
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={selectCls}>
                  {["General", "OBC", "SC", "ST", "EWS"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </FormField>

            </FormSection>
          </Card>

          {/* ── Section 2: Academic ── */}
          <Card>
            <FormSection title="Academic details">

              <FormField label="Class">
                <select value={form.class} onChange={(e) => set("class", e.target.value)} className={selectCls}>
                  {CLASSES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="Roll number" required error={errors.roll}>
                <input type="number" value={form.roll} placeholder="21"
                  onChange={(e) => set("roll", e.target.value)} className={inputCls("roll")} />
              </FormField>

              <FormField label="Section">
                <select value={form.section} onChange={(e) => set("section", e.target.value)} className={selectCls}>
                  {["A","B","C","D"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="Status">
                <select value={form.status} onChange={(e) => set("status", e.target.value)} className={selectCls}>
                  {["Active", "Inactive", "Suspended"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="Fee status">
                <select value={form.fees} onChange={(e) => set("fees", e.target.value)} className={selectCls}>
                  {["Paid", "Partial", "Overdue"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="House">
                <input type="text" value={form.house} placeholder="Tagore House"
                  onChange={(e) => set("house", e.target.value)} className={inputCls("house")} />
              </FormField>

              <FormField label="Previous school" span={2}>
                <input type="text" value={form.previousSchool} placeholder="St. Mary's Primary School"
                  onChange={(e) => set("previousSchool", e.target.value)} className={inputCls("previousSchool")} />
              </FormField>

            </FormSection>
          </Card>

          {/* ── Section 3: Guardian ── */}
          <Card>
            <FormSection title="Guardian details">

              <FormField label="Father / Guardian name" required error={errors.father} span={2}>
                <input type="text" value={form.father} placeholder="Rakesh Mehta"
                  onChange={(e) => set("father", e.target.value)} className={inputCls("father")} />
              </FormField>

              <FormField label="Mother's name">
                <input type="text" value={form.mother} placeholder="Priya Mehta"
                  onChange={(e) => set("mother", e.target.value)} className={inputCls("mother")} />
              </FormField>

              <FormField label="Primary phone" required error={errors.phone}>
                <input type="tel" value={form.phone} placeholder="+91 98765 43210"
                  onChange={(e) => set("phone", e.target.value)} className={inputCls("phone")} />
              </FormField>

              <FormField label="Alternate phone">
                <input type="tel" value={form.altPhone} placeholder="+91 98765 43211"
                  onChange={(e) => set("altPhone", e.target.value)} className={inputCls("altPhone")} />
              </FormField>

              <FormField label="Email address">
                <input type="email" value={form.email} placeholder="parent@email.com"
                  onChange={(e) => set("email", e.target.value)} className={inputCls("email")} />
              </FormField>

              <FormField label="Emergency contact">
                <input type="tel" value={form.emergencyContact} placeholder="+91 98765 43212"
                  onChange={(e) => set("emergencyContact", e.target.value)} className={inputCls("emergencyContact")} />
              </FormField>

              <FormField label="Home address" span={3}>
                <textarea value={form.address} placeholder="42-B Shanti Nagar, Andheri West, Mumbai 400058"
                  rows={2} onChange={(e) => set("address", e.target.value)}
                  className={inputCls("address") + " resize-none"} />
              </FormField>

            </FormSection>
          </Card>

          {/* ── Submit bar ── */}
          <div className="flex items-center justify-between p-4 bg-white border border-ink/8 rounded-2xl">
            <p className="text-xs text-ink/35">
              Fields marked <span className="text-rose font-semibold">*</span> are required
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {isEdit ? "Save changes" : "Add student"}
              </Button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}