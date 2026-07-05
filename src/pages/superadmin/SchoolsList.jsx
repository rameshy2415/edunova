import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Badge,
  Table,
  Th,
  Td,
  Button,
  EmptyState,
  Spinner,
} from "../../components/common";
import { superAdminApi } from "../../api/Superadminapi";
import { formatDate } from "../../utils/index"
/* const SCHOOLS = [
  { id: "1",  name: "Delhi Public School",      city: "New Delhi",  state: "Delhi",      plan: "Enterprise", students: 2840, teachers: 142, admin: "Rajesh Kumar",    adminEmail: "rajesh@dps.edu",   status: "Active",  joined: "12 Apr 2026", renewsOn: "11 Apr 2027" },
  { id: "2",  name: "Sunrise Academy",           city: "Mumbai",     state: "Maharashtra",plan: "Pro",        students: 1284, teachers: 68,  admin: "Priya Sharma",    adminEmail: "priya@sunrise.edu",status: "Active",  joined: "8 Apr 2026",  renewsOn: "7 Apr 2027" },
  { id: "3",  name: "Bhavans Group — Pune",     city: "Pune",       state: "Maharashtra",plan: "Enterprise", students: 3200, teachers: 160, admin: "Sunita Patel",    adminEmail: "sunita@bhavans.edu",status: "Active", joined: "1 Apr 2026",  renewsOn: "31 Mar 2027" },
  { id: "4",  name: "St. Xavier's High School", city: "Chennai",    state: "Tamil Nadu", plan: "Pro",        students: 980,  teachers: 54,  admin: "Fr. Anthony",     adminEmail: "admin@sxhs.edu",   status: "Trial",   joined: "25 Mar 2026", renewsOn: "24 Apr 2026" },
  { id: "5",  name: "Greenfield Academy",        city: "Bangalore",  state: "Karnataka",  plan: "Basic",      students: 620,  teachers: 34,  admin: "Meena Nair",      adminEmail: "meena@greenfield.edu",status: "Active",joined: "20 Mar 2026",renewsOn: "19 Mar 2027" },
  { id: "6",  name: "Rainbow Public School",    city: "Hyderabad",  state: "Telangana",  plan: "Pro",        students: 1100, teachers: 62,  admin: "Venkat Rao",      adminEmail: "venkat@rainbow.edu",status: "Expired",joined: "10 Jan 2026", renewsOn: "9 Jan 2026" },
  { id: "7",  name: "Holy Cross Convent",        city: "Kochi",      state: "Kerala",     plan: "Basic",      students: 540,  teachers: 28,  admin: "Sr. Maria",       adminEmail: "admin@holycross.edu",status: "Active",joined: "5 Feb 2026",  renewsOn: "4 Feb 2027" },
  { id: "8",  name: "Modern High School",        city: "Ahmedabad",  state: "Gujarat",    plan: "Pro",        students: 1450, teachers: 78,  admin: "Kiran Shah",      adminEmail: "kiran@modernhs.edu",status: "Active",joined: "14 Feb 2026", renewsOn: "13 Feb 2027" },
]; */

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

export default function SchoolsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [planF, setPlanF] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [SCHOOLS, setSchool] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSchools();
  }, []);

  const getSchools = async () => {
    setLoading(true);
    try {
      const { data } = await superAdminApi.getSchools({
        isActive: true,
        page: 0,
        size: 20,
      });
      setSchool(data.content || []);
    } catch (err) {
      console.log(err);
      setError(
        err.message || "Failed while fetching schools. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = SCHOOLS.filter((s) => {
    return (
      (s?.name?.toLowerCase()?.includes(search?.toLowerCase() || "") ||
        s?.city?.toLowerCase()?.includes(search?.toLowerCase() || "")) &&
      (planF === "All" || s?.plan === planF) &&
      (statusF === "All" || s?.status === statusF)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl" style={{ color: "#1e0a3c" }}>
            Schools
          </h1>
          <p className="text-sm text-purple-400 mt-0.5">
            {filtered.length} of {SCHOOLS.length} schools
          </p>
        </div>
        <Button
          onClick={() => navigate("/superadmin/schools/new")}
          className="bg-purple-700 hover:bg-purple-800 text-white border-purple-700"
        >
          + Onboard new school
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: SCHOOLS.length,
            bg: "bg-purple-50",
            text: "text-purple-700",
          },
          {
            label: "Active",
            value: SCHOOLS.filter((s) => s.status === "Active").length,
            bg: "bg-green-50",
            text: "text-green-700",
          },
          {
            label: "Trial",
            value: SCHOOLS.filter((s) => s.status === "Trial").length,
            bg: "bg-yellow-50",
            text: "text-yellow-700",
          },
          {
            label: "Expired",
            value: SCHOOLS.filter((s) => s.status === "Expired").length,
            bg: "bg-red-50",
            text: "text-red-700",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border border-white rounded-2xl p-4`}
          >
            <div className="text-xs opacity-60 mb-1">{s.label}</div>
            <div className={`font-serif text-2xl font-semibold ${s.text}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div
        className="bg-white border rounded-2xl overflow-hidden"
        style={{ borderColor: "#e8e4f5" }}
      >
        {/* Filters */}
        <div
          className="flex flex-wrap items-center gap-3 p-4 border-b"
          style={{ borderColor: "#f0eef9" }}
        >
          <div
            className="flex-1 min-w-48 flex items-center gap-2 rounded-xl px-3 py-2 border"
            style={{ background: "#F7F5FD", borderColor: "#e8e4f5" }}
          >
            <svg
              className="w-3.5 h-3.5 text-purple-300 flex-shrink-0"
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
              placeholder="Search school or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-purple-200"
              style={{ color: "#4C1D95" }}
            />
          </div>
          <select
            value={planF}
            onChange={(e) => setPlanF(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none cursor-pointer border"
            style={{
              background: "#F7F5FD",
              borderColor: "#e8e4f5",
              color: "#4C1D95",
            }}
          >
            {["All", "Enterprise", "Pro", "Basic"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none cursor-pointer border"
            style={{
              background: "#F7F5FD",
              borderColor: "#e8e4f5",
              color: "#4C1D95",
            }}
          >
            {["All", "Active", "Trial", "Expired", "Suspended"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Spinner />
            <p className="font-serif text-lg text-ink/40">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No schools found" message="Adjust filters." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>School</Th>
                <Th>City</Th>
                <Th>Plan</Th>
                <Th>Students</Th>
                <Th>Admin</Th>
                <Th>Status</Th>
                <Th>Renews</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-purple-50/30 transition-colors group"
                >
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {s.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <Link
                        to={`/superadmin/schools/${s.id}`}
                        className="text-sm font-medium hover:text-purple-700 transition-colors"
                        style={{ color: "#1e0a3c" }}
                      >
                        {s.name}
                      </Link>
                    </div>
                  </Td>
                  <Td>{s.city}</Td>
                  <Td>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_COLOR[s.plan]}`}
                    >
                      {s.plan}
                    </span>
                  </Td>
                  <Td>{s.students.toLocaleString("en-IN")}</Td>
                  <Td>
                    <div className="text-sm" style={{ color: "#1e0a3c" }}>
                      {s.admin}
                    </div>
                    <div className="text-xs text-purple-300">
                      {s.adminEmail}
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={STATUS_V[s.status]}>{s.status}</Badge>
                  </Td>
                  <Td>
                    <span
                      className={`text-xs font-medium ${s.status === "Expired" ? "text-red-500" : "text-purple-400"}`}
                    >
                     {formatDate(s.renewsOn)} 
                    </span>
                  </Td>
                  <Td>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/superadmin/schools/${s.id}`}
                        className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        to={`/superadmin/schools/${s.id}/edit`}
                        className="text-xs px-2.5 py-1 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-50 transition-colors"
                      >
                        Edit
                      </Link>
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
