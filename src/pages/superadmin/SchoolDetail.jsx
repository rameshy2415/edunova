import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Badge, Button, EmptyState, Spinner } from "../../components/common";
import { superAdminApi } from "../../api/Superadminapi";

const SCHOOLS = {
  1: {
    id: "1",
    name: "Delhi Public School",
    city: "New Delhi",
    state: "Delhi",
    board: "CBSE",
    phone: "+91 11 2345 6789",
    email: "info@dps.edu",
    website: "https://dps.edu",
    principalName: "Dr. Anjali Singh",
    establishedYear: 1949,
    affiliationNo: "2730001",
    address: "Mathura Road, New Delhi 110003",
    students: 2840,
    teachers: 142,
    plan: "Enterprise",
    status: "Active",
    joined: "12 Apr 2026",
    renewsOn: "11 Apr 2027",
    admin: {
      name: "Rajesh Kumar",
      email: "rajesh@dps.edu",
      phone: "+91 98765 43210",
      lastLoginAt: "Today, 9:14 am",
    },
    subscription: {
      plan: "Enterprise",
      billingCycle: "Annual",
      amount: "Custom",
      nextBilling: "11 Apr 2027",
      status: "Active",
    },
  },
};

const PLAN_COLOR = {
  Enterprise: "bg-purple-100 text-purple-700",
  Pro: "bg-blue-100 text-blue-700",
  Basic: "bg-gray-100 text-gray-600",
};
const STATUS_V = {
  Active: "success",
  Trial: "warning",
  Expired: "danger",
  Suspended: "neutral",
};

const TABS = ["Overview", "Subscription", "Admin account", "Activity log"];

const ACTIVITY = [
  {
    time: "Today 9:14 am",
    action: "Admin login",
    user: "Rajesh Kumar",
    type: "auth",
  },
  {
    time: "Yesterday 4:30 pm",
    action: "Added 12 students",
    user: "Rajesh Kumar",
    type: "data",
  },
  {
    time: "2 days ago",
    action: "Attendance marked (9-A)",
    user: "Suresh Kapoor",
    type: "data",
  },
  {
    time: "3 days ago",
    action: "Fee payment recorded",
    user: "Rajesh Kumar",
    type: "billing",
  },
  {
    time: "8 Apr 2026",
    action: "School onboarded",
    user: "Super Admin",
    type: "system",
  },
];

const TYPE_COLOR = {
  auth: "bg-blue-100 text-blue-600",
  data: "bg-green-100 text-green-600",
  billing: "bg-purple-100 text-purple-700",
  system: "bg-orange-100 text-orange-600",
};

export default function SchoolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation(); // React Router hook
  const isEditMode = location.pathname.includes("/edit");

  const [tab, setTab] = useState("Overview");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getSchoolDetails();
  }, [id]);

  useEffect(() => {
    if (isEditMode && school) {
      setEditData({ ...school });
    }
  }, [isEditMode, school]);

  const getSchoolDetails = async () => {
    setLoading(true);
    try {
      const { data } = await superAdminApi.getSchoolById(id);
      console.log(data);
      const schoolData = {
        ...data.school,
        admin: {
          ...data.admin,
        },
        subscription: {
          ...data.subscription,
        },
      };
      setSchool(schoolData);
      /* if (isEditMode) {
        setEditData({ ...schoolData });
      } */
    } catch (err) {
      console.log(err);
      setError(
        err.message ||
          "Failed while fetching school details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdminChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      admin: {
        ...prev.admin,
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Call API to update school details
      await superAdminApi.updateSchool(id, editData);
      setSchool(editData);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate(`/superadmin/schools/${id}`);
      }, 1500);
    } catch (err) {
      console.log(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/superadmin/schools/${id}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] overflow-hidden gap-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Spinner />
          <p className="font-serif text-lg text-ink/40">Loading...</p>
        </div>
      </div>
    );

  if (!school && !error)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] overflow-hidden gap-4">
        <p className="font-serif text-xl text-purple-300">School not found</p>
        <Button onClick={() => navigate("/superadmin/schools")}>
          ← Back to schools
        </Button>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] overflow-hidden gap-4">
        <div className="flex items-center justify-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
        <Button onClick={() => navigate("/superadmin/schools")}>
          ← Back to schools
        </Button>
      </div>
    );

  const displayData = isEditMode && editData ? editData : school;

  const initials = displayData.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ──────────────────────────────────
  // EDIT MODE VIEW
  // ──────────────────────────────────
  if (isEditMode && editData) {
    return (
      <div className="space-y-5">
        {/* Breadcrumb + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/superadmin/schools"
              className="text-purple-400 hover:text-purple-700 transition-colors"
            >
              Schools
            </Link>
            <span className="text-purple-200">/</span>
            <Link
              to={`/superadmin/schools/${school.id}`}
              className="text-purple-400 hover:text-purple-700 transition-colors"
            >
              {school.name}
            </Link>
            <span className="text-purple-200">/</span>
            <span className="font-medium" style={{ color: "#1e0a3c" }}>
              Edit
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              ← Cancel
            </Button>
            <Button
              size="sm"
              className="bg-purple-700 hover:bg-purple-800 text-white border-purple-700"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm border border-green-200">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Changes saved successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-light text-rose text-xs px-4 py-3 rounded-xl">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Banner - Display only (not editable) */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "#4C1D95" }}
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute right-10 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-white text-xl flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-2xl text-white">
                {editData.name}
              </h1>
              <p className="text-purple-200 text-sm mt-0.5">
                {editData.city}, {editData.state} · {editData.board} · Est.{" "}
                {editData.establishedYear}
              </p>
              <p className="text-purple-300/60 text-xs mt-1 font-mono">
                Affiliation: {editData.affiliationNo}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Form */}
          <div
            className="lg:col-span-2 bg-white border rounded-2xl p-5"
            style={{ borderColor: "#e8e4f5" }}
          >
            <h3
              className="font-serif text-base mb-5"
              style={{ color: "#1e0a3c" }}
            >
              School Information
            </h3>

            <div className="space-y-4">
              {/* School Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  School Name *
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#e8e4f5" }}
                />
              </div>

              {/* Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={editData.city}
                    onChange={(e) => handleEditChange("city", e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    value={editData.state}
                    onChange={(e) => handleEditChange("state", e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Address *
                </label>
                <textarea
                  value={editData.address}
                  onChange={(e) => handleEditChange("address", e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  style={{ borderColor: "#e8e4f5" }}
                  rows="3"
                />
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleEditChange("phone", e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
              </div>

              {/* Website & Board Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) =>
                      handleEditChange("website", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Board *
                  </label>
                  <select
                    value={editData.board}
                    onChange={(e) => handleEditChange("board", e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  >
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>State Board</option>
                    <option>IB</option>
                  </select>
                </div>
              </div>

              {/* Principal & Established Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Principal Name *
                  </label>
                  <input
                    type="text"
                    value={editData.principalName}
                    onChange={(e) =>
                      handleEditChange("principalName", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Established Year *
                  </label>
                  <input
                    type="number"
                    value={editData.establishedYear}
                    onChange={(e) =>
                      handleEditChange(
                        "establishedYear",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
              </div>

              {/* Affiliation No */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Affiliation No. *
                </label>
                <input
                  type="text"
                  value={editData.affiliationNo}
                  onChange={(e) =>
                    handleEditChange("affiliationNo", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#e8e4f5" }}
                />
              </div>

              {/* Students & Teachers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    value={editData.students}
                    onChange={(e) =>
                      handleEditChange("students", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Number of Teachers
                  </label>
                  <input
                    type="number"
                    value={editData.teachers}
                    onChange={(e) =>
                      handleEditChange("teachers", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: "#e8e4f5" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Info Edit */}
          <div
            className="bg-white border rounded-2xl p-5"
            style={{ borderColor: "#e8e4f5" }}
          >
            <h3
              className="font-serif text-base mb-4"
              style={{ color: "#1e0a3c" }}
            >
              School Admin
            </h3>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {editData.admin.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#1e0a3c" }}
                >
                  {editData.admin.name}
                </div>
                <div className="text-xs text-purple-400">School Admin</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={editData.admin.name}
                  onChange={(e) => handleAdminChange("name", e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#e8e4f5" }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={editData.admin.email}
                  onChange={(e) => handleAdminChange("email", e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#e8e4f5" }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Admin Phone
                </label>
                <input
                  type="tel"
                  value={editData.admin.phone}
                  onChange={(e) => handleAdminChange("phone", e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#e8e4f5" }}
                />
              </div>
            </div>

            <div
              className="mt-4 p-3 bg-purple-50 rounded-lg border"
              style={{ borderColor: "#e8e4f5" }}
            >
              <p className="text-xs text-purple-600">
                <strong>Note:</strong> Admin account creation date and last
                login info cannot be edited here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────
  // DETAIL VIEW (READ ONLY)
  // ──────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Breadcrumb + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/superadmin/schools"
            className="text-purple-400 hover:text-purple-700 transition-colors"
          >
            Schools
          </Link>
          <span className="text-purple-200">/</span>
          <span className="font-medium" style={{ color: "#1e0a3c" }}>
            {school.name}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/superadmin/schools")}
          >
            ← Back
          </Button>
          <Link to={`/superadmin/schools/${school.id}/edit`}>
            <Button
              size="sm"
              className="bg-purple-700 hover:bg-purple-800 text-white border-purple-700"
            >
              Edit school
            </Button>
          </Link>
        </div>
      </div>

      {/* Banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "#4C1D95" }}
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute right-10 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-white text-xl flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl text-white">{school.name}</h1>
            <p className="text-purple-200 text-sm mt-0.5">
              {school.city}, {school.state} · {school.board} · Est.{" "}
              {school.establishedYear}
            </p>
            <p className="text-purple-300/60 text-xs mt-1 font-mono">
              Affiliation: {school.affiliationNo}
            </p>
          </div>
          <div className="flex gap-5 flex-shrink-0">
            {[
              ["Students", school?.students.toLocaleString("en-IN")],
              ["Teachers", school?.teachers],
              ["Plan", school.subscription.plan?.name || school.plan],
            ].map(([l, v]) => (
              <div key={l} className="text-center">
                <div className="font-serif text-xl text-white font-semibold">
                  {v}
                </div>
                <div className="text-purple-300/60 text-[11px] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${PLAN_COLOR[school.subscription.plan?.name || school.plan]}`}
            >
              {school.subscription.plan?.name || school.plan}
            </span>
            <Badge variant={STATUS_V[school.subscription.status]}>
              {school.subscription.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 bg-white border rounded-xl p-1 w-fit"
        style={{ borderColor: "#e8e4f5" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "text-white shadow-sm" : "text-purple-300 hover:text-purple-700"}`}
            style={{ background: tab === t ? "#4C1D95" : "transparent" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div
            className="lg:col-span-2 bg-white border rounded-2xl p-5"
            style={{ borderColor: "#e8e4f5" }}
          >
            <h3
              className="font-serif text-base mb-4"
              style={{ color: "#1e0a3c" }}
            >
              School information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {[
                ["Phone", school.phone],
                ["Email", school.email],
                ["Website", school.website || "—"],
                ["Principal", school.principalName],
                ["Board", school.board],
                ["Affiliation no.", school.affiliationNo],
                ["Est. year", school.establishedYear],
                ["Onboarded", school.joined],
                ["Renews on", school.renewsOn],
                [
                  "Status",
                  <Badge key="s" variant={STATUS_V[school.subscription.status]}>
                    {school.subscription.status}
                  </Badge>,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2.5 border-b last:border-0"
                  style={{ borderColor: "#f8f7fd" }}
                >
                  <span className="text-xs text-gray-400">{label}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#1e0a3c" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-3 pt-3 border-t"
              style={{ borderColor: "#f0eef9" }}
            >
              <div className="text-xs text-gray-400 mb-1">Address</div>
              <div className="text-sm" style={{ color: "#1e0a3c" }}>
                {school.address}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Admin quick info */}
            <div
              className="bg-white border rounded-2xl p-5"
              style={{ borderColor: "#e8e4f5" }}
            >
              <h3
                className="font-serif text-base mb-4"
                style={{ color: "#1e0a3c" }}
              >
                School admin
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {school.admin.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "#1e0a3c" }}
                  >
                    {school.admin.name}
                  </div>
                  <div className="text-xs text-purple-400">
                    School Admin · role: admin
                  </div>
                </div>
              </div>
              {[
                ["Email", school.admin.email],
                ["Phone", school.admin.phone],
                ["Last login", school.admin.lastLoginAt],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between py-2 border-b last:border-0"
                  style={{ borderColor: "#f8f7fd" }}
                >
                  <span className="text-xs text-gray-400">{l}</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#1e0a3c" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex-1 text-xs font-medium px-3 py-2 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Reset password
                </button>
                <button
                  onClick={() => setTab("Admin account")}
                  className="flex-1 text-xs font-medium px-3 py-2 rounded-lg text-white transition-colors"
                  style={{ background: "#4C1D95" }}
                >
                  View account
                </button>
              </div>
            </div>

            {/* Danger zone */}
            <div
              className="bg-white border rounded-2xl p-5"
              style={{ borderColor: "#fecaca" }}
            >
              <h3 className="font-serif text-base text-red-600 mb-3">
                Danger zone
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowSuspendConfirm(true)}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  ⚠ Suspend school access
                </button>
                <button className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-left">
                  🗑 Delete school permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBSCRIPTION ── */}
      {tab === "Subscription" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div
            className="lg:col-span-2 bg-white border rounded-2xl p-5"
            style={{ borderColor: "#e8e4f5" }}
          >
            <h3
              className="font-serif text-base mb-4"
              style={{ color: "#1e0a3c" }}
            >
              Subscription details
            </h3>
            <div
              className="flex items-center gap-4 mb-5 p-4 rounded-xl"
              style={{ background: "#F7F5FD" }}
            >
              <div className="flex-1">
                <div
                  className="font-serif text-xl"
                  style={{ color: "#1e0a3c" }}
                >
                  {school.subscription.plan?.name || school.plan} Plan
                </div>
                <div className="text-sm text-purple-400 mt-0.5">
                  {school.subscription.billingCycle} billing ·{" "}
                  {school.subscription.plan?.priceAnnually ||
                    school.subscription.amount}
                </div>
              </div>
              <Badge variant={STATUS_V[school.subscription.status]}>
                {school.subscription.status}
              </Badge>
            </div>
            {[
              ["Current plan", school.subscription.plan?.name || school.plan],
              ["Billing cycle", school.subscription.billingCycle],
              [
                "Amount",
                school.subscription.plan?.priceAnnually ||
                  school.subscription.amount,
              ],
              ["Next billing", school.subscription.nextBilling],
              ["Started on", school.joined],
              [
                "Status",
                <Badge key="s" variant={STATUS_V[school.subscription.status]}>
                  {school.subscription.status}
                </Badge>,
              ],
            ].map(([l, v]) => (
              <div
                key={l}
                className="flex justify-between items-center py-2.5 border-b last:border-0"
                style={{ borderColor: "#f8f7fd" }}
              >
                <span className="text-xs text-gray-400">{l}</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#1e0a3c" }}
                >
                  {v}
                </span>
              </div>
            ))}
            <div className="mt-4 flex gap-2">
              <button
                className="text-sm font-medium px-4 py-2 rounded-xl text-white transition-colors"
                style={{ background: "#4C1D95" }}
              >
                Change plan
              </button>
              <button className="text-sm font-medium px-4 py-2 rounded-xl border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors">
                Extend renewal
              </button>
            </div>
          </div>
          <div
            className="bg-white border rounded-2xl p-5"
            style={{ borderColor: "#e8e4f5" }}
          >
            <h3
              className="font-serif text-base mb-4"
              style={{ color: "#1e0a3c" }}
            >
              Usage
            </h3>
            {[
              ["Students", school.students, 5000],
              ["Teachers", school.teachers, 250],
            ].map(([l, used, max]) => (
              <div key={l} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-500">{l}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#1e0a3c" }}
                  >
                    {used.toLocaleString()} / {max.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${Math.min((used / max) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  {Math.round((used / max) * 100)}% of plan limit
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ADMIN ACCOUNT ── */}
      {tab === "Admin account" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
            className="bg-white border rounded-2xl p-5"
            style={{ borderColor: "#e8e4f5" }}
          >
            <h3
              className="font-serif text-base mb-4"
              style={{ color: "#1e0a3c" }}
            >
              Admin account details
            </h3>
            <div
              className="flex items-center gap-3 mb-5 p-4 rounded-xl"
              style={{ background: "#F7F5FD" }}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {school.admin.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div
                  className="font-serif text-lg"
                  style={{ color: "#1e0a3c" }}
                >
                  {school.admin.name}
                </div>
                <div className="text-xs text-purple-400 mt-0.5">
                  School Admin · {school.name}
                </div>
              </div>
            </div>
            {[
              ["Email", school.admin.email],
              ["Phone", school.admin.phone],
              ["Role", "Admin (school-level)"],
              ["Last login", school.admin.lastLoginAt],
              ["Account status", "Active"],
            ].map(([l, v]) => (
              <div
                key={l}
                className="flex justify-between py-2.5 border-b last:border-0"
                style={{ borderColor: "#f8f7fd" }}
              >
                <span className="text-xs text-gray-400">{l}</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#1e0a3c" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div
              className="bg-white border rounded-2xl p-5"
              style={{ borderColor: "#e8e4f5" }}
            >
              <h3
                className="font-serif text-base mb-4"
                style={{ color: "#1e0a3c" }}
              >
                Account actions
              </h3>
              <div className="space-y-2">
                {[
                  [
                    "Reset password",
                    "Send password reset email to admin",
                    "border-purple-200 text-purple-600 hover:bg-purple-50",
                    () => setShowResetConfirm(true),
                  ],
                  [
                    "Resend welcome email",
                    "Re-send onboarding email with credentials",
                    "border-purple-200 text-purple-600 hover:bg-purple-50",
                    () => {},
                  ],
                  [
                    "Edit admin details",
                    "Update name, phone or email",
                    "border-purple-200 text-purple-600 hover:bg-purple-50",
                    () => {},
                  ],
                  [
                    "Disable admin account",
                    "Temporarily lock admin login",
                    "border-red-200 text-red-600 hover:bg-red-50",
                    () => {},
                  ],
                ].map(([label, desc, cls, fn]) => (
                  <button
                    key={label}
                    onClick={fn}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl border transition-colors ${cls}`}
                  >
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-[11px] opacity-60 mt-0.5">
                        {desc}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 flex-shrink-0 opacity-40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            {resetSent && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm border border-green-100">
                ✓ Password reset email sent to {school.admin.email}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ACTIVITY LOG ── */}
      {tab === "Activity log" && (
        <div
          className="bg-white border rounded-2xl overflow-hidden"
          style={{ borderColor: "#e8e4f5" }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "#f0eef9" }}
          >
            <h3 className="font-serif text-base" style={{ color: "#1e0a3c" }}>
              Activity log
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#f8f7fd" }}>
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3 hover:bg-purple-50/30 transition-colors"
              >
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[a.type]}`}
                >
                  {a.type}
                </span>
                <div className="flex-1">
                  <div
                    className="text-sm font-medium"
                    style={{ color: "#1e0a3c" }}
                  >
                    {a.action}
                  </div>
                  <div className="text-xs text-purple-300 mt-0.5">
                    by {a.user}
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset password confirm */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3
              className="font-serif text-lg mb-2"
              style={{ color: "#1e0a3c" }}
            >
              Reset admin password?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              A password reset link will be emailed to{" "}
              <strong>{school.admin.email}</strong>.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  setResetSent(true);
                  setTab("Admin account");
                }}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl text-white transition-colors"
                style={{ background: "#4C1D95" }}
              >
                Send reset email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend confirm */}
      {showSuspendConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3
              className="font-serif text-lg text-center mb-2"
              style={{ color: "#1e0a3c" }}
            >
              Suspend school access?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              All users of <strong>{school.name}</strong> will lose access
              immediately. The data will be preserved.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowSuspendConfirm(false)}
              >
                Cancel
              </Button>
              <button
                onClick={() => setShowSuspendConfirm(false)}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Suspend school
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
