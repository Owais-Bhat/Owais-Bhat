export default function AuthLayout({ children }) {
  const highlights = [
    ['Live Ops', 'Attendance, fees, admissions, and messages in one daily command view.'],
    ['AI Assist', 'Draft parent updates, fee follow-ups, and student progress summaries.'],
    ['Tenant Safe', 'Every school runs inside its own institution workspace.'],
  ];

  return (
    <div className="min-h-screen grid md:grid-cols-[1.08fr_0.92fr] bg-[#F7F8FB]">
      <section className="hidden md:flex flex-col justify-between p-8 lg:p-10 bg-[#111827] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(14,124,123,0.22), transparent 34%), linear-gradient(315deg, rgba(224,100,74,0.2), transparent 28%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #0E7C7B, #E0644A)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
              <path d="M12 3L2 8l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
              <path d="M2 16l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl text-white font-display mb-0">CyberMilo</h1>
            <p className="text-white/50 text-sm mb-0">Education operations workspace</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <p className="text-[#F4B860] text-sm font-bold uppercase tracking-[0.18em] mb-4">
            SaaS Campus Intelligence
          </p>
          <h2 className="text-white text-4xl xl:text-5xl font-display leading-tight mb-5">
            Run every school account from one calm, intelligent operations desk.
          </h2>
          <p className="text-white/60 text-lg max-w-lg">
            CyberMilo is built for multi-tenant school management: admissions, fees, attendance, communication, AI insights, and account control.
          </p>

          <div className="mt-8 grid gap-3">
            {highlights.map(([title, copy]) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/6 p-4">
                <p className="text-white font-bold mb-1">{title}</p>
                <p className="text-white/55 text-sm mb-0">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-4 max-w-xl">
          {[
            ['8+', 'ERP modules'],
            ['AI', 'Automation layer'],
            ['MT', 'Multi-tenant ready'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
              <p className="text-xs text-white/50 mb-0">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #0E7C7B, #E0644A)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
                <path d="M2 16l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-3xl font-display text-slate-950 mb-1">CyberMilo</h1>
            <p className="text-slate-500 text-sm">Education operations workspace</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg px-8 py-8 shadow-2xl">
            {children}
          </div>

          <p className="text-center mt-6 text-slate-400 text-xs">
            Copyright 2026 CyberMilo. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
