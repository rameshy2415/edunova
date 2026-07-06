import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PageHeader, Card, Badge, Table, Th, Td, Button, EmptyState,
  Spinner
} from "../../../components/common";
import { STUDENTS, CLASSES, FEE_VARIANT, STATUS_VARIANT } from "./data";
import { studentsApi } from "../../../api/studentsApi";
import { useAuth } from "../../../context/AuthContext";

export default function StudentList() {
  const navigate = useNavigate();
  const { schoolId } = useAuth();

  const [search,  setSearch]  = useState("");
  const [classF,  setClassF]  = useState("All");
  const [feeF,    setFeeF]    = useState("All");
  const [statusF, setStatusF] = useState("All");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    setLoading(true);
    try {
      const { data } = await studentsApi.getAllStudents(schoolId);
      console.log(data);
      //setStudents(data.content || []);
      setStudents(data || []);
    } catch (err) {
      console.log(err);
      setError(
        err.message || "Failed while fetching students. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (classF  === "All" || s.section  === classF) &&
    (feeF    === "All" || s.fees   === feeF) &&
    (statusF === "All" || s.status === statusF)
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} of ${students.length} students`}
        actions={
          <Button onClick={() => navigate("/admin/students/new")}>
            + Add student
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: students.length,
            color: "bg-cobalt-light text-cobalt",
          },
          {
            label: "Active",
            value: students.filter((s) => s.status === "Active").length,
            color: "bg-sage-light text-sage",
          },
          {
            label: "Fee overdue",
            value: students.filter((s) => s.fees === "Overdue").length,
            color: "bg-rose-light text-rose",
          },
          {
            label: "Avg att.",
            value:
              Math.round(
                students.reduce((a, s) => a + s.attendance, 0) /
                  students.length,
              ) + "%",
            color: "bg-amber-light text-amber",
          },
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
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
            />
          </div>

          <select
            value={classF}
            onChange={(e) => setClassF(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
          >
            {["All", ...CLASSES].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            value={feeF}
            onChange={(e) => setFeeF(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
          >
            {["All", "Paid", "Partial", "Overdue"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
          >
            {["All", "Active", "Inactive", "Suspended"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <Button variant="secondary" size="sm">
            Export CSV
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Spinner />
            <p className="font-serif text-lg text-ink/40">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No students found"
            message="Try adjusting your filters or add a new student."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Adm. no.</Th>
                <Th>Student</Th>
                <Th>Class</Th>
                <Th>Roll</Th>
                <Th>Attendance</Th>
                <Th>Fees</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-parchment/40 transition-colors group"
                >
                  <Td>
                    <span className="font-mono text-xs text-ink/40">
                      {s.admissionNo}
                    </span>
                  </Td>

                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {s.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        {/* Clicking name navigates to detail page */}
                        <Link
                          to={`/admin/students/${s.id}`}
                          className="text-sm font-medium text-ink hover:text-cobalt transition-colors"
                        >
                          {s.name}
                        </Link>
                        <div className="text-xs text-ink/40">{s.father}</div>
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <span className="text-xs bg-cobalt-light text-cobalt px-2 py-0.5 rounded-full">
                      {s.section}
                    </span>
                  </Td>
                  <Td>{s.roll}</Td>

                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-parchment rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.attendance}%`,
                            background:
                              s.attendance >= 85
                                ? "#3A6B4F"
                                : s.attendance >= 75
                                  ? "#B85C1A"
                                  : "#A0334A",
                          }}
                        />
                      </div>
                      <span className="text-xs text-ink/60">
                        {s.attendance}%
                      </span>
                    </div>
                  </Td>

                  <Td>
                    <Badge variant={FEE_VARIANT[s.fees]}>{s.fees}</Badge>
                  </Td>
                  <Td>
                    <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge>
                  </Td>

                  <Td>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* View → /admin/students/:id */}
                      <Link
                        to={`/admin/students/${s.id}`}
                        title="View profile"
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-cobalt-light hover:border-cobalt/30 transition-colors text-ink/50 hover:text-cobalt"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>

                      {/* Edit → /admin/students/:id/edit */}
                      <Link
                        to={`/admin/students/${s.id}/edit`}
                        title="Edit student"
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-amber-light hover:border-amber/30 transition-colors text-ink/50 hover:text-amber"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>

                      {/* Delete button (inline — no route needed) */}
                      <button
                        title="Delete student"
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-rose-light hover:border-rose/30 transition-colors text-ink/50 hover:text-rose"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}