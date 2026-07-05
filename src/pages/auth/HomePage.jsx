import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "👥", color: "bg-cobalt-light text-cobalt", label: "Student Records",    desc: "Comprehensive profiles, academic history, and guardian contacts in one place." },
  { icon: "✅", color: "bg-sage-light text-sage",     label: "Smart Attendance",  desc: "One-click daily marking with auto-generated absence alerts to parents." },
  { icon: "📝", color: "bg-rose-light text-rose",     label: "Exams & Grades",    desc: "Publish results, auto-calculate grades, and share report cards instantly." },
  { icon: "🗓️", color: "bg-cobalt-light text-cobalt", label: "Timetable Builder", desc: "Drag-and-drop scheduling that avoids conflicts and balances teacher load." },
  { icon: "💳", color: "bg-amber-light text-amber",   label: "Fee Management",    desc: "Collect online, track dues, issue receipts, and auto-send reminders." },
  { icon: "📊", color: "bg-sage-light text-sage",     label: "Rich Analytics",    desc: "Board-ready reports on performance, finance, and attendance trends." },
];

const STATS = [
  { val: "1,200+", label: "Schools trust EduNova" },
  { val: "4.8★",  label: "Average rating" },
  { val: "99.9%", label: "Uptime guarantee" },
  { val: "24/7",  label: "Support available" },
];

const TESTIMONIALS = [
  { name: "Meera Iyer",    role: "Principal, Sunrise Academy",         quote: "Fee collection went from a monthly headache to fully automated. Our parents love the instant receipts." },
  { name: "Rajesh Nair",   role: "Admin Head, Delhi Public School",    quote: "The timetable builder alone saved us 3 days every semester. Absolutely worth it." },
  { name: "Sunita Patel",  role: "Director, Bhavans Group",            quote: "We manage 8 campuses through one dashboard. The analytics are exceptional." },
];

export default function HomePage() {
  return (
    <div className="pt-16 font-sans">
      {/* ── Hero ── */}
      <section
        className="pt-20 pb-24 px-6 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,149,42,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,149,42,0.07) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div className="absolute top-20 right-0 w-96 h-96 bg-gold/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-cobalt/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-cobalt-light text-cobalt text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse inline-block" />
            Trusted by 1,200+ schools across India
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-ink leading-tight mb-6">
            The modern way to<br />
            <em className="text-gold not-italic">run your school</em>
          </h1>

          <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed mb-10">
            EduNova unifies admissions, attendance, exams, fees, and analytics into one elegant platform — built for Indian schools.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="group flex items-center justify-center gap-2 bg-cobalt text-white font-medium px-8 py-3.5 rounded-xl hover:bg-cobalt/90 transition-all shadow-lg shadow-cobalt/20"
            >
              Start free trial
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <button className="flex items-center justify-center gap-2 border border-ink/15 text-ink font-medium px-8 py-3.5 rounded-xl hover:bg-ink/5 transition-all">
              Watch demo
            </button>
          </div>
          <p className="text-xs text-ink/40 mt-4">No credit card required · Free 30-day trial</p>
        </div>

        {/* Mini dashboard preview */}
        <div className="max-w-3xl mx-auto mt-16 relative">
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-10 rounded-b-2xl"
            style={{ background: "linear-gradient(to bottom, transparent, #F8F5EF)" }}
          />
          <div className="bg-white border border-ink/8 rounded-2xl shadow-2xl shadow-ink/8 overflow-hidden">
            <div className="bg-ink h-8 flex items-center gap-1.5 px-4">
              <span className="w-2.5 h-2.5 rounded-full bg-rose opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-sage opacity-70" />
              <span className="text-white/30 text-xs ml-4 font-mono">dashboard.edunova.app</span>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { l: "Students",   v: "1,284",  c: "bg-cobalt-light text-cobalt" },
                { l: "Attendance", v: "91.4%",  c: "bg-sage-light text-sage" },
                { l: "Teachers",   v: "68",     c: "bg-amber-light text-amber" },
                { l: "Fees",       v: "₹18.4L", c: "bg-rose-light text-rose" },
              ].map((m) => (
                <div key={m.l} className={`${m.c} rounded-xl p-4`}>
                  <div className="text-xs opacity-70 mb-1">{m.l}</div>
                  <div className="text-xl font-serif font-semibold">{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 px-6 border-y border-gold/15 bg-white/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-4xl text-cobalt mb-1">{s.val}</div>
              <div className="text-sm text-ink/50">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-gold uppercase mb-3">Everything you need</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">One platform, every module</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.label} className="bg-white border border-ink/8 rounded-2xl p-7 hover:-translate-y-1 transition-transform cursor-default">
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center text-xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-serif text-xl text-ink mb-2">{f.label}</h3>
                <p className="text-sm text-ink/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-ink text-parchment relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-gold uppercase mb-3">Testimonials</p>
            <h2 className="font-serif text-4xl text-parchment">Loved by school administrators</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-7">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="text-parchment/80 text-sm leading-relaxed mb-5 font-light">"{t.quote}"</p>
                <div>
                  <div className="font-medium text-parchment text-sm">{t.name}</div>
                  <div className="text-parchment/40 text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-5">
            Ready to modernise your school?
          </h2>
          <p className="text-ink/55 mb-8 text-lg">
            Join 1,200+ schools. Setup in under a day. No IT team required.
          </p>
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 bg-cobalt text-white font-medium px-10 py-4 rounded-xl hover:bg-cobalt/90 transition-all shadow-xl shadow-cobalt/20 text-base"
          >
            Get started free
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
