import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PageHeader, Card, Badge, Table, Th, Td, Button, EmptyState,
} from "../../../components/common";
import { TEACHERS, SUBJECTS, STATUS_VARIANT } from "./data";

export default function TeacherList() {
  const navigate = useNavigate();

  const [search,   setSearch]   = useState("");
  const [subjectF, setSubjectF] = useState("All");
  const [statusF,  setStatusF]  = useState("All");

  const filtered = TEACHERS.filter((t) =>
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
     t.subject.toLowerCase().includes(search.toLowerCase())) &&
    (subjectF === "All" || t.subject === subjectF) &&
    (statusF  === "All" || t.status  === statusF)
  );

  const AVATAR_BG = [
    "bg-cobalt-light text-cobalt",
    "bg-sage-light text-sage",
    "bg-amber-light text-amber",
    "bg-rose-light text-rose",
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teachers"
        subtitle={`${filtered.length} of ${TEACHERS.length} staff members`}
        actions={
          <Button onClick={() => navigate("/admin/teachers/new")}>
            + Add teacher
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total staff",    value: TEACHERS.length,                                        color: "bg-cobalt-light text-cobalt" },
          { label: "Active",         value: TEACHERS.filter((t) => t.status === "Active").length,   color: "bg-sage-light text-sage" },
          { label: "On leave",       value: TEACHERS.filter((t) => t.status === "On Leave").length, color: "bg-amber-light text-amber" },
          { label: "Avg experience", value: Math.round(TEACHERS.reduce((a, t) => a + t.experience, 0) / TEACHERS.length) + " yrs", color: "bg-rose-light text-rose" },
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
            <svg className="w-3.5 h-3.5 text-ink/35 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/>
            </svg>
            <input
              type="text"
              placeholder="Search name or subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
            />
          </div>

          <select value={subjectF} onChange={(e) => setSubjectF(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
            {["All", ...SUBJECTS].map((o) => <option key={o}>{o}</option>)}
          </select>

          <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
            {["All", "Active", "On Leave", "Inactive"].map((o) => <option key={o}>{o}</option>)}
          </select>

          <Button variant="secondary" size="sm">Export CSV</Button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState title="No teachers found" message="Adjust filters or add a new teacher." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Emp. ID</Th>
                <Th>Teacher</Th>
                <Th>Subject</Th>
                <Th>Classes</Th>
                <Th>Experience</Th>
                <Th>Salary</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className="hover:bg-parchment/40 transition-colors group">
                  <Td>
                    <span className="font-mono text-xs text-ink/40">{t.empId}</span>
                  </Td>

                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 ${AVATAR_BG[i % 4]} rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
                        {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        {/* Clicking name → detail page */}
                        <Link
                          to={`/admin/teachers/${t.id}`}
                          className="text-sm font-medium text-ink hover:text-cobalt transition-colors"
                        >
                          {t.name}
                        </Link>
                        <div className="text-xs text-ink/40">{t.email}</div>
                      </div>
                    </div>
                  </Td>

                  <Td>{t.subject}</Td>

                  <Td>
                    <div className="flex gap-1 flex-wrap">
                      {t.classes.slice(0, 2).map((c) => (
                        <span key={c} className="text-[11px] bg-cobalt-light text-cobalt px-2 py-0.5 rounded-full">{c}</span>
                      ))}
                      {t.classes.length > 2 && (
                        <span className="text-[11px] bg-ink/8 text-ink/50 px-2 py-0.5 rounded-full">+{t.classes.length - 2}</span>
                      )}
                    </div>
                  </Td>

                  <Td>{t.experience} yrs</Td>

                  <Td>
                    <span className="text-sm text-ink">₹{t.salary.toLocaleString("en-IN")}</span>
                  </Td>

                  <Td>
                    <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge>
                  </Td>

                  <Td>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">

                      {/* View → /admin/teachers/:id */}
                      <Link
                        to={`/admin/teachers/${t.id}`}
                        title="View profile"
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-cobalt-light hover:border-cobalt/30 transition-colors text-ink/50 hover:text-cobalt"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </Link>

                      {/* Edit → /admin/teachers/:id/edit */}
                      <Link
                        to={`/admin/teachers/${t.id}/edit`}
                        title="Edit teacher"
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-amber-light hover:border-amber/30 transition-colors text-ink/50 hover:text-amber"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </Link>

                      {/* Delete (inline action, no route needed) */}
                      <button
                        title="Remove teacher"
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-ink/12 hover:bg-rose-light hover:border-rose/30 transition-colors text-ink/50 hover:text-rose"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
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