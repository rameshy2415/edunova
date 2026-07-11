import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentsApi, feesApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import {
  PageHeader, StatCard, Card, CardHeader,
  Badge, FullPageSpinner, Alert,
} from "../../components/common";
import { getCurrentAcademicYear } from "../../utils/index"

const STATS = [
  { label: "Total students",      value: "1,284", change: "34 this year",      up: true,  colorClass: "bg-cobalt-light text-cobalt" },
  { label: "Today's attendance",  value: "91.4%", change: "2.1% vs last week", up: false, colorClass: "bg-sage-light text-sage" },
  { label: "Active teachers",     value: "68",    change: "3 new this term",   up: true,  colorClass: "bg-amber-light text-amber" },
  { label: "Fees collected",      value: "₹18.4L",change: "12% vs last month", up: true,  colorClass: "bg-rose-light text-rose" },
];

const RECENT_STUDENTS = [
  { initials: "AR", name: "Aryan Mehta",    cls: "9-A · Roll 21", status: "Active",   color: "bg-cobalt-light text-cobalt" },
  { initials: "PS", name: "Priya Sharma",   cls: "11-B · Roll 07", status: "Active",  color: "bg-sage-light text-sage" },
  { initials: "RK", name: "Rohan Kulkarni", cls: "6-C · Roll 14",  status: "Fee due", color: "bg-amber-light text-amber" },
  { initials: "SN", name: "Sneha Nair",     cls: "10-A · Roll 02", status: "Absent",  color: "bg-rose-light text-rose" },
  { initials: "VJ", name: "Vikram Joshi",   cls: "8-B · Roll 31",  status: "Active",  color: "bg-cobalt-light text-cobalt" },
];

const SCHEDULE = [
  { time: "8:00 am",  subject: "Mathematics",   teacher: "Mr. Kapoor",  room: "R-101", dot: "#1B3F8B" },
  { time: "9:30 am",  subject: "English",        teacher: "Ms. D'Souza", room: "R-204", dot: "#3A6B4F" },
  { time: "11:00 am", subject: "Science Lab",    teacher: "Dr. Rao",     room: "Lab-2", dot: "#A0334A" },
  { time: "2:00 pm",  subject: "Social Studies", teacher: "Ms. Iyer",    room: "R-302", dot: "#B85C1A" },
];

const ATTENDANCE = [
  { cls: "Class 10", pct: 96, color: "#1B3F8B" },
  { cls: "Class 9",  pct: 88, color: "#3A6B4F" },
  { cls: "Class 8",  pct: 79, color: "#B85C1A" },
  { cls: "Class 7",  pct: 92, color: "#A0334A" },
];

const STATUS_BADGE = {
  "Active":   "success",
  "Fee due":  "warning",
  "Absent":   "danger",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  /**
   * Example: wire up real API calls here.
   * const { data: summary, loading, execute } = useApi(feesApi.getSummary);
   * useEffect(() => { execute(); }, []);
   */

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle={`${today} · Academic Year ${getCurrentAcademicYear()}`}
        actions={
          <button
            onClick={() => navigate("/admin/students/new")}
            className="text-sm font-medium bg-cobalt text-white px-4 py-2 rounded-xl hover:bg-cobalt/90 transition-all"
          >
            + Add student
          </button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent students */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent admissions" action="View all →" />
          <div className="space-y-1">
            {RECENT_STUDENTS.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-parchment transition-colors cursor-pointer"
                onClick={() => navigate("/admin/students")}
              >
                <div className={`w-8 h-8 ${s.color} rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{s.name}</div>
                  <div className="text-xs text-ink/45">{s.cls}</div>
                </div>
                <Badge variant={STATUS_BADGE[s.status]}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div className="space-y-5">
          {/* Schedule */}
          <Card>
            <CardHeader title="Today's schedule" action="Full →" />
            <div className="space-y-3">
              {SCHEDULE.map((s) => (
                <div key={s.subject} className="flex items-start gap-3">
                  <span className="text-[11px] text-ink/40 min-w-[52px] pt-0.5">{s.time}</span>
                  <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.dot }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{s.subject}</div>
                    <div className="text-xs text-ink/40">{s.teacher}</div>
                  </div>
                  <span className="text-[11px] text-ink/30">{s.room}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Attendance */}
          <Card>
            <CardHeader title="Attendance by class" />
            <div className="space-y-3">
              {ATTENDANCE.map((a) => (
                <div key={a.cls}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-ink">{a.cls}</span>
                    <span className="text-xs font-semibold text-ink">{a.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-parchment rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${a.pct}%`, background: a.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-cobalt rounded-2xl p-5 relative overflow-hidden">
        <div
          className="absolute right-0 top-0 w-48 h-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle at right, white, transparent)" }}
        />
        <h2 className="font-serif text-lg text-white mb-1">Quick actions</h2>
        <p className="text-sm text-white/50 mb-4">Common tasks at a glance</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Mark attendance",  path: "/admin/attendance" },
            { label: "Add student",      path: "/admin/students" },
            { label: "Record payment",   path: "/admin/fees" },
            { label: "View timetable",   path: "/admin/timetable" },
            { label: "Generate report",  path: "/admin/reports" },
            { label: "Manage teachers",  path: "/admin/teachers" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-colors border border-white/10"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
