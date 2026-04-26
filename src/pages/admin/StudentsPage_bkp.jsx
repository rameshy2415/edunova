import React, { useState, useEffect } from "react";
import { studentsApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import {
  PageHeader, Card, Badge, Table, Th, Td,
  Button, FullPageSpinner, EmptyState, Alert,
} from "../../components/common";

/* Demo data — replace with real API response */
const MOCK_STUDENTS = [
  { id: 1, initials: "AR", name: "Aryan Mehta",    class: "9-A", roll: 21, gender: "M", status: "Active",   fees: "Paid",     attendance: 96 },
  { id: 2, initials: "PS", name: "Priya Sharma",   class: "11-B", roll: 7, gender: "F", status: "Active",  fees: "Partial",  attendance: 88 },
  { id: 3, initials: "RK", name: "Rohan Kulkarni", class: "6-C",  roll: 14, gender: "M", status: "Active",  fees: "Overdue",  attendance: 72 },
  { id: 4, initials: "SN", name: "Sneha Nair",     class: "10-A", roll: 2, gender: "F", status: "Inactive", fees: "Paid",    attendance: 91 },
  { id: 5, initials: "VJ", name: "Vikram Joshi",   class: "8-B",  roll: 31, gender: "M", status: "Active",  fees: "Partial", attendance: 85 },
  { id: 6, initials: "NK", name: "Neha Kulkarni",  class: "7-A",  roll: 9, gender: "F", status: "Active",  fees: "Paid",     attendance: 98 },
];

const FEE_BADGE   = { Paid: "success", Partial: "warning", Overdue: "danger" };
const STATUS_BADGE = { Active: "success", Inactive: "neutral" };

export default function StudentsPage() {
  const [search, setSearch]     = useState("");
  const [classFilter, setClass] = useState("All");
  const [feeFilter, setFee]     = useState("All");

  /**
   * Real API usage example:
   *
   * const { data, loading, error, execute } = useApi(studentsApi.getAll, []);
   * useEffect(() => { execute({ search, class: classFilter, fee: feeFilter }); }, [search, classFilter, feeFilter]);
   * const students = data || [];
   */

  const students = MOCK_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchClass  = classFilter === "All" || s.class === classFilter;
    const matchFee    = feeFilter === "All"   || s.fees === feeFilter;
    return matchSearch && matchClass && matchFee;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Students"
        subtitle={`${students.length} students found`}
        actions={
          <Button size="sm">+ Add student</Button>
        }
      />

      <Card>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex-1 min-w-48 flex items-center gap-2 bg-parchment border border-ink/10 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-ink/35 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/>
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
            value={classFilter}
            onChange={(e) => setClass(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
          >
            {["All", "6-C", "7-A", "8-B", "9-A", "10-A", "11-B"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={feeFilter}
            onChange={(e) => setFee(e.target.value)}
            className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer"
          >
            {["All", "Paid", "Partial", "Overdue"].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {students.length === 0 ? (
          <EmptyState title="No students found" message="Try adjusting your filters." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Student</Th>
                <Th>Class</Th>
                <Th>Roll</Th>
                <Th>Gender</Th>
                <Th>Attendance</Th>
                <Th>Fees</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-parchment/50 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {s.initials}
                      </div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </Td>
                  <Td>{s.class}</Td>
                  <Td>{s.roll}</Td>
                  <Td>{s.gender === "M" ? "Male" : "Female"}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-parchment rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sage"
                          style={{ width: `${s.attendance}%` }}
                        />
                      </div>
                      <span className="text-xs text-ink/60">{s.attendance}%</span>
                    </div>
                  </Td>
                  <Td><Badge variant={FEE_BADGE[s.fees]}>{s.fees}</Badge></Td>
                  <Td><Badge variant={STATUS_BADGE[s.status]}>{s.status}</Badge></Td>
                  <Td>
                    <div className="flex gap-1.5">
                      <button className="text-xs px-2.5 py-1 rounded-lg border border-ink/12 hover:bg-parchment transition-colors">
                        View
                      </button>
                      <button className="text-xs px-2.5 py-1 rounded-lg border border-ink/12 hover:bg-parchment transition-colors">
                        Edit
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
