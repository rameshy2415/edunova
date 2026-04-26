import React, { useState } from "react";
import { PageHeader, Card, Badge, Table, Th, Td, Button, EmptyState } from "../../components/common";

const MOCK_TEACHERS = [
  { id: 1, initials: "SK", name: "Suresh Kapoor",   subject: "Mathematics",    classes: ["9-A", "10-B"],  experience: "12 yrs", status: "Active",   phone: "+91 98200 11001", email: "s.kapoor@edunova.app",   joined: "Aug 2012" },
  { id: 2, initials: "PD", name: "Priya D'Souza",   subject: "English",        classes: ["11-A", "11-B"], experience: "8 yrs",  status: "Active",   phone: "+91 98200 11002", email: "p.dsouza@edunova.app",   joined: "Jun 2016" },
  { id: 3, initials: "RR", name: "Ramesh Rao",      subject: "Science",        classes: ["6-C", "7-A"],   experience: "15 yrs", status: "Active",   phone: "+91 98200 11003", email: "r.rao@edunova.app",      joined: "Jan 2009" },
  { id: 4, initials: "AI", name: "Anitha Iyer",     subject: "Social Studies", classes: ["8-B", "9-A"],   experience: "6 yrs",  status: "Active",   phone: "+91 98200 11004", email: "a.iyer@edunova.app",     joined: "Mar 2018" },
  { id: 5, initials: "VM", name: "Vijay Menon",     subject: "Hindi",          classes: ["6-A", "6-B"],   experience: "10 yrs", status: "On Leave", phone: "+91 98200 11005", email: "v.menon@edunova.app",    joined: "Aug 2014" },
  { id: 6, initials: "NP", name: "Nita Pillai",     subject: "Computer Sci.",  classes: ["10-A", "11-A"], experience: "5 yrs",  status: "Active",   phone: "+91 98200 11006", email: "n.pillai@edunova.app",   joined: "Jul 2019" },
  { id: 7, initials: "KS", name: "Kishore Sharma",  subject: "Physical Ed.",   classes: ["All"],          experience: "9 yrs",  status: "Active",   phone: "+91 98200 11007", email: "k.sharma@edunova.app",   joined: "Apr 2015" },
];

const STATUS_VARIANT = { Active: "success", "On Leave": "warning", Inactive: "neutral" };
const AVATAR_BG = ["bg-cobalt-light text-cobalt", "bg-sage-light text-sage", "bg-amber-light text-amber", "bg-rose-light text-rose"];

export default function TeachersPage() {
  const [search, setSearch]     = useState("");
  const [subject, setSubject]   = useState("All");
  const [statusF, setStatusF]   = useState("All");
  const [selected, setSelected] = useState(null);

  const subjects = ["All", ...new Set(MOCK_TEACHERS.map((t) => t.subject))];

  const filtered = MOCK_TEACHERS.filter((t) => {
    const ms = t.name.toLowerCase().includes(search.toLowerCase()) ||
               t.subject.toLowerCase().includes(search.toLowerCase());
    return ms &&
      (subject === "All" || t.subject === subject) &&
      (statusF === "All" || t.status === statusF);
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teachers"
        subtitle={`${filtered.length} of ${MOCK_TEACHERS.length} staff members`}
        actions={<Button size="sm">+ Add teacher</Button>}
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total staff", value: "68", color: "bg-cobalt-light text-cobalt" },
          { label: "Active",      value: "64", color: "bg-sage-light text-sage" },
          { label: "On leave",    value: "3",  color: "bg-amber-light text-amber" },
          { label: "Subjects",    value: "14", color: "bg-rose-light text-rose" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table */}
        <Card className="lg:col-span-2" padding={false}>
          <div className="flex flex-wrap gap-3 p-4 border-b border-ink/5">
            <div className="flex-1 min-w-44 flex items-center gap-2 bg-parchment border border-ink/10 rounded-xl px-3 py-2">
              <svg className="w-3.5 h-3.5 text-ink/35 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}><circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/></svg>
              <input type="text" placeholder="Search name or subject…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"/>
            </div>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="bg-parchment border border-ink/10 rounded-xl px-3 py-2 text-sm text-ink outline-none cursor-pointer">
              {["All", "Active", "On Leave", "Inactive"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? <EmptyState title="No teachers found" message="Adjust filters." /> : (
            <Table>
              <thead><tr><Th>Teacher</Th><Th>Subject</Th><Th>Classes</Th><Th>Experience</Th><Th>Status</Th><Th></Th></tr></thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className={`hover:bg-parchment/50 transition-colors cursor-pointer ${selected?.id === t.id ? "bg-cobalt-light/20" : ""}`} onClick={() => setSelected(t)}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 ${AVATAR_BG[i % 4]} rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0`}>{t.initials}</div>
                        <div><div className="text-sm font-medium text-ink">{t.name}</div><div className="text-xs text-ink/40">{t.email}</div></div>
                      </div>
                    </Td>
                    <Td>{t.subject}</Td>
                    <Td>
                      <div className="flex gap-1 flex-wrap">
                        {t.classes.slice(0, 2).map((c) => <span key={c} className="text-[11px] bg-cobalt-light text-cobalt px-2 py-0.5 rounded-full">{c}</span>)}
                        {t.classes.length > 2 && <span className="text-[11px] bg-ink/8 text-ink/50 px-2 py-0.5 rounded-full">+{t.classes.length - 2}</span>}
                      </div>
                    </Td>
                    <Td>{t.experience}</Td>
                    <Td><Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge></Td>
                    <Td><div className="flex gap-1.5"><button className="text-xs px-2.5 py-1 rounded-lg border border-ink/12 hover:bg-parchment transition-colors">Edit</button></div></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {/* Detail panel */}
        <Card>
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cobalt-light text-cobalt rounded-full flex items-center justify-center text-sm font-semibold">{selected.initials}</div>
                  <div><div className="font-serif text-base text-ink">{selected.name}</div><div className="text-xs text-ink/45 mt-0.5">{selected.subject}</div></div>
                </div>
                <button onClick={() => setSelected(null)} className="text-ink/30 hover:text-ink"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="space-y-0">
                {[["Email", selected.email], ["Phone", selected.phone], ["Experience", selected.experience], ["Joined", selected.joined], ["Status", <Badge variant={STATUS_VARIANT[selected.status]}>{selected.status}</Badge>]].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-ink/5 last:border-0">
                    <span className="text-xs text-ink/45">{label}</span>
                    <span className="text-sm text-ink font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4"><div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-2">Assigned classes</div>
                <div className="flex flex-wrap gap-1.5">{selected.classes.map((c) => <span key={c} className="text-xs bg-cobalt-light text-cobalt px-2.5 py-1 rounded-lg">{c}</span>)}</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2"><Button variant="secondary" size="sm">Edit</Button><Button size="sm">Schedule</Button></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <svg className="w-8 h-8 text-ink/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6"/></svg>
              <p className="text-sm text-ink/40">Click a teacher row<br/>to see details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
