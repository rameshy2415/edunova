import React, { useState } from "react";
import { PageHeader, Card, CardHeader, Badge, Table, Th, Td } from "../../components/common";

const CHILD = {
  name: "Aryan Mehta", class: "9-A", roll: 21, section: "A",
  dateOfBirth: "14 Aug 2010", age: "15 years", bloodGroup: "B+",
  gender: "Male", nationality: "Indian", motherTongue: "Hindi",
  admissionNo: "EDN-2021-1284", admissionDate: "3 Jun 2021",
  house: "Tagore House", classTeacher: "Ms. D'Souza",
};

const PARENT_INFO = {
  fatherName: "Rakesh Mehta", fatherPhone: "+91 98765 43210", fatherOccupation: "Engineer",
  motherName: "Priya Mehta",  motherPhone: "+91 98765 43211", motherOccupation: "Teacher",
  address: "42-B Shanti Nagar, Andheri West, Mumbai 400058",
  emergencyContact: "+91 98765 43212",
};

const ACADEMIC_HISTORY = [
  { year: "2024–25", class: "Class 8-B", rank: "#5 / 42",  avg: "79%", promoted: true },
  { year: "2023–24", class: "Class 7-A", rank: "#8 / 40",  avg: "76%", promoted: true },
  { year: "2022–23", class: "Class 6-C", rank: "#12 / 41", avg: "72%", promoted: true },
];

const TABS = ["Profile", "Academic history", "Health info"];

export default function ParentChildInfo() {
  const [tab, setTab] = useState("Profile");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Child Information"
        subtitle={`${CHILD.name} · Class ${CHILD.class} · Roll ${CHILD.roll}`}
      />

      {/* Header card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 bg-cobalt text-white rounded-2xl flex items-center justify-center font-serif text-2xl font-semibold flex-shrink-0">
            {CHILD.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl text-ink">{CHILD.name}</h2>
            <p className="text-sm text-ink/50 mt-0.5">
              Class {CHILD.class} · Roll {CHILD.roll} · Adm. No. {CHILD.admissionNo}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="success">Active</Badge>
              <Badge variant="info">{CHILD.house}</Badge>
              <Badge variant="neutral">Blood: {CHILD.bloodGroup}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[["Attendance", "96%"], ["Class rank", "#7"], ["Avg grade", "78%"]].map(([l, v]) => (
              <div key={l}>
                <div className="font-serif text-lg font-semibold text-ink">{v}</div>
                <div className="text-[10px] text-ink/40 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-ink/8 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-cobalt text-white shadow-sm" : "text-ink/50 hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === "Profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Personal information" />
            <div className="space-y-0">
              {[
                ["Full name",        CHILD.name],
                ["Date of birth",    CHILD.dateOfBirth],
                ["Age",              CHILD.age],
                ["Gender",           CHILD.gender],
                ["Blood group",      CHILD.bloodGroup],
                ["Nationality",      CHILD.nationality],
                ["Mother tongue",    CHILD.motherTongue],
                ["Admission no.",    CHILD.admissionNo],
                ["Admission date",   CHILD.admissionDate],
                ["Class teacher",    CHILD.classTeacher],
                ["House",            CHILD.house],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2.5 border-b border-ink/5 last:border-0">
                  <span className="text-xs text-ink/45">{l}</span>
                  <span className="text-sm font-medium text-ink text-right">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Parent / guardian details" />
            <div className="space-y-0">
              {[
                ["Father's name",     PARENT_INFO.fatherName],
                ["Father's phone",    PARENT_INFO.fatherPhone],
                ["Father's occupation", PARENT_INFO.fatherOccupation],
                ["Mother's name",     PARENT_INFO.motherName],
                ["Mother's phone",    PARENT_INFO.motherPhone],
                ["Mother's occupation", PARENT_INFO.motherOccupation],
                ["Home address",      PARENT_INFO.address],
                ["Emergency contact", PARENT_INFO.emergencyContact],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2.5 border-b border-ink/5 last:border-0">
                  <span className="text-xs text-ink/45 flex-shrink-0 mr-4">{l}</span>
                  <span className="text-sm font-medium text-ink text-right">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── ACADEMIC HISTORY TAB ── */}
      {tab === "Academic history" && (
        <Card>
          <CardHeader title="Year-wise academic history" />
          <Table>
            <thead><tr><Th>Academic year</Th><Th>Class</Th><Th>Class rank</Th><Th>Average</Th><Th>Result</Th></tr></thead>
            <tbody>
              {ACADEMIC_HISTORY.map((h) => (
                <tr key={h.year} className="hover:bg-parchment/40 transition-colors">
                  <Td><span className="font-medium">{h.year}</span></Td>
                  <Td>{h.class}</Td>
                  <Td>{h.rank}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-parchment rounded-full overflow-hidden">
                        <div className="h-full bg-cobalt rounded-full" style={{ width: h.avg }} />
                      </div>
                      <span className="text-sm font-semibold">{h.avg}</span>
                    </div>
                  </Td>
                  <Td><Badge variant={h.promoted ? "success" : "danger"}>{h.promoted ? "Promoted" : "Held back"}</Badge></Td>
                </tr>
              ))}
              <tr className="bg-cobalt-light/20">
                <Td colSpan={2}><span className="font-semibold text-cobalt">Current year (2025–26)</span></Td>
                <Td><span className="font-semibold text-cobalt">#7 / 40</span></Td>
                <Td><span className="font-semibold text-cobalt">78%</span></Td>
                <Td><Badge variant="info">In progress</Badge></Td>
              </tr>
            </tbody>
          </Table>
        </Card>
      )}

      {/* ── HEALTH INFO TAB ── */}
      {tab === "Health info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Medical information" />
            <div className="space-y-0">
              {[
                ["Blood group",     "B+"],
                ["Height",         "162 cm"],
                ["Weight",         "52 kg"],
                ["Allergies",      "None reported"],
                ["Medical conditions", "None"],
                ["Medications",    "None"],
                ["Doctor's name",  "Dr. Anand Sharma"],
                ["Doctor's phone", "+91 98765 00001"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2.5 border-b border-ink/5 last:border-0">
                  <span className="text-xs text-ink/45">{l}</span>
                  <span className="text-sm font-medium text-ink text-right">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Vaccinations & notes" />
            {[["COVID-19", "Completed"], ["Hepatitis B", "Completed"], ["MMR", "Completed"], ["Typhoid", "Completed"]].map(([vaccine, status]) => (
              <div key={vaccine} className="flex items-center justify-between py-2.5 border-b border-ink/5 last:border-0">
                <span className="text-sm text-ink">{vaccine}</span>
                <Badge variant="success">{status}</Badge>
              </div>
            ))}
            <div className="mt-4 p-3 bg-parchment rounded-xl text-xs text-ink/50">
              Health records are maintained by school. Contact school nurse for updates.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}