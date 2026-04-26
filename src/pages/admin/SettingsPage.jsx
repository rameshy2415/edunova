import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Button, Alert } from "../../components/common";
import { useAuth } from "../../context/AuthContext";

const SECTIONS = ["Profile", "School Info", "Notifications", "Security"];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name:  user?.name  || "Admin Principal",
    email: user?.email || "admin@edunova.app",
    phone: "+91 98200 10000",
    role:  "Administrator",
  });

  const [school, setSchool] = useState({
    name:    "EduNova Model School",
    board:   "CBSE",
    address: "123 Knowledge Park, Andheri East, Mumbai 400069",
    phone:   "+91 22 6100 0000",
    email:   "info@edunova.school",
    year:    "2025–26",
    motto:   "Knowledge is Power",
  });

  const [notifications, setNotifications] = useState({
    feeReminders:   true,
    attendanceAlert: true,
    examResults:    true,
    systemUpdates:  false,
    weeklyReport:   true,
    parentMessages: true,
  });

  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });

  const handleSave = () => {
    setSaved(true);
    if (activeSection === "Profile") updateUser?.({ name: profile.name, email: profile.email });
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/10 transition-all";
  const labelCls = "text-xs font-semibold text-ink/50 uppercase tracking-wide block mb-1.5";

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Manage your account and school configuration" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <Card>
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button key={s} onClick={() => { setActiveSection(s); setSaved(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${activeSection === s ? "bg-cobalt text-white" : "text-ink/60 hover:bg-parchment hover:text-ink"}`}>
                <span>{{Profile:"👤", "School Info":"🏫", Notifications:"🔔", Security:"🔒"}[s]}</span>
                {s}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-5">
          {saved && <Alert variant="success">✓ Settings saved successfully!</Alert>}

          {/* ── PROFILE ── */}
          {activeSection === "Profile" && (
            <Card>
              <CardHeader title="Profile Information" />
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ink/5">
                <div className="w-16 h-16 bg-cobalt text-white rounded-full flex items-center justify-center text-xl font-serif font-semibold">
                  {profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-serif text-lg text-ink">{profile.name}</div>
                  <div className="text-sm text-ink/50">{profile.role}</div>
                  <button className="text-xs text-cobalt mt-1 hover:underline">Change avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["Full name", "name", "text"], ["Email address", "email", "email"], ["Phone number", "phone", "tel"], ["Role", "role", "text"]].map(([label, field, type]) => (
                  <div key={field}>
                    <label className={labelCls}>{label}</label>
                    <input type={type} value={profile[field]} onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                      className={inputCls} disabled={field === "role"} />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end"><Button onClick={handleSave}>Save changes</Button></div>
            </Card>
          )}

          {/* ── SCHOOL INFO ── */}
          {activeSection === "School Info" && (
            <Card>
              <CardHeader title="School Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["School name", "name"], ["Board", "board"], ["Academic year", "year"], ["Contact phone", "phone"], ["Contact email", "email"], ["School motto", "motto"]].map(([label, field]) => (
                  <div key={field} className={field === "address" || field === "motto" ? "sm:col-span-2" : ""}>
                    <label className={labelCls}>{label}</label>
                    <input type="text" value={school[field]} onChange={(e) => setSchool({ ...school, [field]: e.target.value })} className={inputCls}/>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address</label>
                  <textarea value={school.address} onChange={(e) => setSchool({ ...school, address: e.target.value })}
                    rows={2} className={inputCls + " resize-none"}/>
                </div>
              </div>
              <div className="mt-5 flex justify-end"><Button onClick={handleSave}>Save changes</Button></div>
            </Card>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === "Notifications" && (
            <Card>
              <CardHeader title="Notification Preferences" />
              <div className="space-y-4">
                {[
                  ["feeReminders",    "Fee payment reminders",    "Send automated reminders for overdue fees"],
                  ["attendanceAlert", "Low attendance alerts",    "Alert when a student's attendance drops below 75%"],
                  ["examResults",     "Exam result notifications","Notify parents when results are published"],
                  ["systemUpdates",   "System updates",           "Receive notifications about EduNova platform updates"],
                  ["weeklyReport",    "Weekly summary report",    "Get a weekly email digest of school activity"],
                  ["parentMessages",  "Parent messages",          "Receive alerts when parents send messages"],
                ].map(([key, label, desc]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-ink">{label}</div>
                      <div className="text-xs text-ink/45 mt-0.5">{desc}</div>
                    </div>
                    <button
                      onClick={() => { setNotifications((p) => ({ ...p, [key]: !p[key] })); setSaved(false); }}
                      className={`w-11 h-6 rounded-full transition-all flex-shrink-0 relative ${notifications[key] ? "bg-cobalt" : "bg-ink/15"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications[key] ? "left-5.5 translate-x-0.5" : "left-0.5"}`}
                        style={{ left: notifications[key] ? "calc(100% - 1.375rem)" : "2px" }}/>
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end"><Button onClick={handleSave}>Save preferences</Button></div>
            </Card>
          )}

          {/* ── SECURITY ── */}
          {activeSection === "Security" && (
            <Card>
              <CardHeader title="Change Password" />
              <div className="space-y-4 max-w-sm">
                {[["Current password", "current"], ["New password", "newPwd"], ["Confirm new password", "confirm"]].map(([label, field]) => (
                  <div key={field}>
                    <label className={labelCls}>{label}</label>
                    <input type="password" value={passwords[field]} onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })} className={inputCls} placeholder="••••••••"/>
                  </div>
                ))}
                <div className="text-xs text-ink/40">Password must be at least 8 characters with a number and special character.</div>
              </div>
              <div className="mt-5 flex gap-3">
                <Button onClick={handleSave}>Update password</Button>
                <Button variant="secondary" onClick={() => setPasswords({ current: "", newPwd: "", confirm: "" })}>Cancel</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
