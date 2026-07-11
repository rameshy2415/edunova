import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageHeader, Badge, Table, Th, Td, EmptyState } from "../../components/common";
// import { adminsApi } from "../../api/adminsApi";

/* ------------------------------------------------------------------------
   AdminDetail — /admins/:id

   Drop-in usage once wired to your API:

     <AdminDetail
       fetchAdmin={adminsApi.getAdmin}             // (id) => Promise<Admin>
       fetchActivity={adminsApi.getAdminActivity}   // (id) => Promise<{action, date}[]>
       resetPassword={adminsApi.resetPassword}      // (id) => Promise<void>
       toggleStatus={adminsApi.setAdminStatus}      // (id, "Active"|"Inactive") => Promise<void>
       deleteAdmin={adminsApi.deleteAdmin}          // (id) => Promise<void>
     />

   Until those exist, this falls back to seeded demo data matching the
   AdminsPage list so it renders correctly out of the box.
------------------------------------------------------------------------- */

const DEMO_ADMINS = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh@dps.edu", phone: "+91 98100 11122", school: "Delhi Public School", lastLogin: "Today 9:14 am", joinedOn: "12 Jun 2023", status: "Active" },
  { id: "2", name: "Priya Sharma", email: "priya@sunrise.edu", phone: "+91 98200 22233", school: "Sunrise Academy", lastLogin: "Yesterday 4:30 pm", joinedOn: "3 Feb 2022", status: "Active" },
  { id: "3", name: "Sunita Patel", email: "sunita@bhavans.edu", phone: "+91 98300 33344", school: "Bhavans Group — Pune", lastLogin: "2 days ago", joinedOn: "18 Nov 2021", status: "Active" },
  { id: "4", name: "Fr. Anthony", email: "admin@sxhs.edu", phone: "+91 98400 44455", school: "St. Xavier's High School", lastLogin: "4 days ago", joinedOn: "9 Aug 2020", status: "Active" },
  { id: "5", name: "Meena Nair", email: "meena@greenfield.edu", phone: "+91 98500 55566", school: "Greenfield Academy", lastLogin: "1 week ago", joinedOn: "27 Jan 2024", status: "Active" },
  { id: "6", name: "Venkat Rao", email: "venkat@rainbow.edu", phone: "+91 98600 66677", school: "Rainbow Public School", lastLogin: "3 months ago", joinedOn: "5 May 2019", status: "Inactive" },
];

const DEMO_ACTIVITY = {
  "1": [
    { action: "Logged in", date: "Today 9:14 am" },
    { action: "Updated fee structure for Grade 9", date: "Yesterday 3:02 pm" },
    { action: "Added new teacher account", date: "3 days ago" },
    { action: "Logged in", date: "4 days ago" },
  ],
};
const DEFAULT_ACTIVITY = [{ action: "Logged in", date: "—" }];

function demoFetchAdmin(id) {
  return Promise.resolve(DEMO_ADMINS.find((a) => a.id === id) || null);
}
function demoFetchActivity(id) {
  return Promise.resolve(DEMO_ACTIVITY[id] || DEFAULT_ACTIVITY);
}

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const box = { borderColor: "#e8e4f5" };
const dangerBox = { borderColor: "#fecaca" };
const labelStyle = { color: "#4C1D95" };
const headingStyle = { color: "#1e0a3c" };

export default function AdminDetail({ fetchAdmin, fetchActivity, resetPassword, toggleStatus, deleteAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const a = fetchAdmin ? await fetchAdmin(id) : await demoFetchAdmin(id);
      if (!a) { setError("Admin not found."); setLoading(false); return; }
      setAdmin(a);
      const act = fetchActivity ? await fetchActivity(id) : await demoFetchActivity(id);
      setActivity(act);
    } catch (err) {
      setError(err.message || "Failed to load admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setBusy(true);
    try {
      resetPassword ? await resetPassword(id) : await new Promise((r) => setTimeout(r, 500));
      alert(`Password reset link sent to ${admin.email}`);
    } catch (err) {
      alert(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async () => {
    const next = admin.status === "Active" ? "Inactive" : "Active";
    setBusy(true);
    try {
      toggleStatus ? await toggleStatus(id, next) : await new Promise((r) => setTimeout(r, 400));
      setAdmin((p) => ({ ...p, status: next }));
    } catch (err) {
      alert(err.message || "Failed to update status. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      deleteAdmin ? await deleteAdmin(id) : await new Promise((r) => setTimeout(r, 400));
      navigate("/superadmin/admins");
    } catch (err) {
      alert(err.message || "Failed to delete admin. Please try again.");
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-sm text-purple-300">Loading admin…</div>;
  }

  if (error || !admin) {
    return (
      <div className="space-y-5">
        <Link to="/superadmin/admins" className="text-xs font-medium inline-flex items-center gap-1" style={labelStyle}>← Back to admins</Link>
        <EmptyState title="Admin not found" message={error || "This admin account may have been removed."} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link to="/superadmin/admins" className="text-xs font-medium inline-flex items-center gap-1 mb-2" style={labelStyle}>← Back to admins</Link>
        <PageHeader
          title={admin.name}
          subtitle={admin.school}
          actions={
            <div className="flex gap-2">
              <Link
                to={`/superadmin/admins/${id}/edit`}
                className="text-sm font-medium px-3.5 py-2 rounded-xl border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleToggleStatus}
                disabled={busy}
                className={`text-sm font-medium px-3.5 py-2 rounded-xl border transition-colors disabled:opacity-50 ${
                  admin.status === "Active" ? "border-red-200 text-red-400 hover:bg-red-50" : "border-purple-200 text-purple-500 hover:bg-purple-50"
                }`}
              >
                {admin.status === "Active" ? "Disable" : "Enable"}
              </button>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border rounded-2xl p-6" style={box}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                {initials(admin.name)}
              </div>
              <div>
                <p className="text-base font-semibold" style={headingStyle}>{admin.name}</p>
                <p className="text-sm text-purple-300">{admin.email}</p>
              </div>
              <div className="ml-auto">
                <Badge variant={admin.status === "Active" ? "success" : "neutral"}>{admin.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-purple-300 mb-1">Phone</p>
                <p style={headingStyle}>{admin.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-purple-300 mb-1">School</p>
                <Link to={`/superadmin/schools/${admin.schoolId || admin.id}`} className="hover:underline" style={labelStyle}>{admin.school}</Link>
              </div>
              <div>
                <p className="text-xs text-purple-300 mb-1">Joined</p>
                <p style={headingStyle}>{admin.joinedOn || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-purple-300 mb-1">Last login</p>
                <p style={headingStyle}>{admin.lastLogin || "—"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl overflow-hidden" style={box}>
            <div className="p-4 border-b" style={{ borderColor: "#f0eef9" }}>
              <p className="text-sm font-semibold" style={headingStyle}>Recent activity</p>
            </div>
            {activity.length === 0 ? (
              <EmptyState title="No recent activity" />
            ) : (
              <Table>
                <thead><tr><Th>Action</Th><Th>When</Th></tr></thead>
                <tbody>
                  {activity.map((a, i) => (
                    <tr key={i}><Td>{a.action}</Td><Td className="text-gray-500">{a.date}</Td></tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border rounded-2xl p-5" style={box}>
            <p className="text-sm font-semibold mb-3" style={headingStyle}>Account actions</p>
            <button
              onClick={handleResetPassword}
              disabled={busy}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors mb-2 disabled:opacity-50"
            >
              Send password reset
            </button>
            <Link
              to={`/superadmin/admins/${id}/edit`}
              className="block text-center w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors"
            >
              Edit details
            </Link>
          </div>

          <div className="bg-white border rounded-2xl p-5" style={dangerBox}>
            <p className="text-sm font-semibold text-red-500 mb-1">Danger zone</p>
            <p className="text-xs text-gray-500 mb-3">Deleting this admin account is permanent and cannot be undone.</p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
              >
                Delete admin
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-500">Are you sure? This can't be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 text-xs font-medium px-3 py-2 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={busy}
                    className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    Yes, delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}