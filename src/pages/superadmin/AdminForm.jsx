import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { PageHeader } from "../../components/common";
// import { adminsApi } from "../../api/adminsApi";

/* ------------------------------------------------------------------------
   AdminForm — handles both /admins/new (create) and /admins/:id/edit (edit)

   Drop-in usage once wired to your API:

     <AdminForm
       schools={schoolNames}                 // string[] — school names to assign
       fetchAdmin={adminsApi.getAdmin}         // (id) => Promise<Admin>
       saveAdmin={adminsApi.saveAdmin}         // (id | undefined, payload) => Promise<Admin>
     />

   `saveAdmin(id, payload)` — id is undefined when creating. Should resolve to
   the saved admin object (at minimum an `id`) so the form can redirect to
   /superadmin/admins/:id afterwards.
------------------------------------------------------------------------- */

const DEMO_SCHOOLS = [
  "Delhi Public School", "Sunrise Academy", "Bhavans Group — Pune",
  "St. Xavier's High School", "Greenfield Academy", "Rainbow Public School",
];

const DEMO_ADMINS = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh@dps.edu", phone: "+91 98100 11122", school: "Delhi Public School", status: "Active" },
  { id: "2", name: "Priya Sharma", email: "priya@sunrise.edu", phone: "+91 98200 22233", school: "Sunrise Academy", status: "Active" },
  { id: "3", name: "Sunita Patel", email: "sunita@bhavans.edu", phone: "+91 98300 33344", school: "Bhavans Group — Pune", status: "Active" },
  { id: "4", name: "Fr. Anthony", email: "admin@sxhs.edu", phone: "+91 98400 44455", school: "St. Xavier's High School", status: "Active" },
  { id: "5", name: "Meena Nair", email: "meena@greenfield.edu", phone: "+91 98500 55566", school: "Greenfield Academy", status: "Active" },
  { id: "6", name: "Venkat Rao", email: "venkat@rainbow.edu", phone: "+91 98600 66677", school: "Rainbow Public School", status: "Inactive" },
];

function demoFetchAdmin(id) {
  return Promise.resolve(DEMO_ADMINS.find((a) => a.id === id) || null);
}
function demoSaveAdmin(id, payload) {
  return Promise.resolve({ id: id || String(Date.now()), ...payload });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const box = { borderColor: "#e8e4f5" };
const fieldBox = (invalid) => ({ borderColor: invalid ? "#fca5a5" : "#e8e4f5", background: "#F7F5FD", color: "#1e0a3c" });
const labelStyle = { color: "#4C1D95" };
const headingStyle = { color: "#1e0a3c" };

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={labelStyle}>{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default function AdminForm({ schools = DEMO_SCHOOLS, fetchAdmin, saveAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: "", email: "", phone: "", school: "", status: "Active" });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    setError("");
    const loader = fetchAdmin ? fetchAdmin(id) : demoFetchAdmin(id);
    loader
      .then((data) => {
        if (!data) { setError("Admin not found."); return; }
        setForm({ name: data.name || "", email: data.email || "", phone: data.phone || "", school: data.school || "", status: data.status || "Active" });
      })
      .catch((err) => setError(err.message || "Failed to load admin. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.school) errs.school = "Select a school.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");
    try {
      const saver = saveAdmin ? saveAdmin(id, form) : demoSaveAdmin(id, form);
      const result = await saver;
      navigate(`/superadmin/admins/${result.id}`);
    } catch (err) {
      setError(err.message || "Failed to save admin. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-sm text-purple-300">Loading admin…</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link to="/superadmin/admins" className="text-xs font-medium inline-flex items-center gap-1 mb-2" style={labelStyle}>
          ← Back to admins
        </Link>
        <PageHeader
          title={isEdit ? "Edit admin" : "New admin"}
          subtitle={isEdit ? "Update account details for this admin" : "Create a new admin account and assign a school"}
        />
      </div>

      {error && (
        <div className="text-sm px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-500">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 space-y-5 max-w-xl" style={box}>
        <Field label="Full name" error={fieldErrors.name}>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Rajesh Kumar"
            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border"
            style={fieldBox(fieldErrors.name)}
          />
        </Field>

        <Field label="Email" error={fieldErrors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="admin@school.edu"
            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border"
            style={fieldBox(fieldErrors.email)}
          />
        </Field>

        <Field label="Phone (optional)">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border"
            style={fieldBox(false)}
          />
        </Field>

        <Field label="School" error={fieldErrors.school}>
          <select
            value={form.school}
            onChange={(e) => update("school", e.target.value)}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border cursor-pointer"
            style={fieldBox(fieldErrors.school)}
          >
            <option value="">Select a school</option>
            {schools.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        {isEdit && (
          <Field label="Status">
            <div className="flex gap-2">
              {["Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update("status", s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    form.status === s ? "bg-purple-600 text-white border-purple-600" : "border-purple-200 text-purple-500 hover:bg-purple-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
        )}

        {!isEdit && (
          <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "#F7F5FD", color: "#4C1D95" }}>
            An invite email will be sent to this address so the admin can set their own password.
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create admin"}
          </button>
        </div>
      </form>
    </div>
  );
}