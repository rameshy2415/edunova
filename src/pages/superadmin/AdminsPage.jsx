import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, Badge, Button, Table, Th, Td, EmptyState, PageHeader } from "../../components/common";


/* ═══════════════════════════════════════════════════════════
   ADMINS PAGE
   ═══════════════════════════════════════════════════════════ */
const ADMINS = [
  { id:"1", name:"Rajesh Kumar",  email:"rajesh@dps.edu",    school:"Delhi Public School",      lastLogin:"Today 9:14 am",       status:"Active" },
  { id:"2", name:"Priya Sharma",  email:"priya@sunrise.edu", school:"Sunrise Academy",           lastLogin:"Yesterday 4:30 pm",   status:"Active" },
  { id:"3", name:"Sunita Patel",  email:"sunita@bhavans.edu",school:"Bhavans Group — Pune",     lastLogin:"2 days ago",          status:"Active" },
  { id:"4", name:"Fr. Anthony",   email:"admin@sxhs.edu",    school:"St. Xavier's High School", lastLogin:"4 days ago",          status:"Active" },
  { id:"5", name:"Meena Nair",    email:"meena@greenfield.edu",school:"Greenfield Academy",     lastLogin:"1 week ago",          status:"Active" },
  { id:"6", name:"Venkat Rao",    email:"venkat@rainbow.edu",school:"Rainbow Public School",    lastLogin:"3 months ago",        status:"Inactive" },
];

export default function AdminsPage() {
  const [search, setSearch] = useState("");
  const filtered = ADMINS.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="School Admins"
        subtitle="All admin accounts across every onboarded school"
        actions={
          <Link
            to="/superadmin/admins/new"
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}><path d="M8 3v10M3 8h10"/></svg>
            Onboard admin
          </Link>
        }
      />

      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#e8e4f5" }}>
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "#f0eef9" }}>
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 border" style={{ background: "#F7F5FD", borderColor: "#e8e4f5" }}>
            <svg className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}><circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/></svg>
            <input type="text" placeholder="Search admin or school…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-purple-200" style={{ color: "#4C1D95" }} />
          </div>
        </div>

        {filtered.length === 0 ? <EmptyState title="No admins found" /> : (
          <Table>
            <thead><tr><Th>Admin</Th><Th>School</Th><Th>Last login</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-purple-50/20 transition-colors">
                  <Td>
                    <Link to={`/superadmin/admins/${a.id}`} className="flex items-center gap-2.5 group">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {a.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium group-hover:text-purple-700 transition-colors" style={{ color: "#1e0a3c" }}>{a.name}</div>
                        <div className="text-xs text-purple-300">{a.email}</div>
                      </div>
                    </Link>
                  </Td>
                  <Td><Link to={`/superadmin/schools/${a.id}`} className="text-sm hover:text-purple-700 transition-colors" style={{ color: "#4C1D95" }}>{a.school}</Link></Td>
                  <Td className="text-gray-500">{a.lastLogin}</Td>
                  <Td><Badge variant={a.status === "Active" ? "success" : "neutral"}>{a.status}</Badge></Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <Link
                        to={`/superadmin/admins/${a.id}`}
                        className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        to={`/superadmin/admins/${a.id}/edit`}
                        className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors"
                      >
                        Edit
                      </Link>
                      <button className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors">Reset pwd</button>
                      <button className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                        {a.status === "Active" ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}