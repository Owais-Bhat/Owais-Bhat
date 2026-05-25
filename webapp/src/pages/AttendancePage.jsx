import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function AttendancePage() {
  const { attendance, addAttendance } = useAppData();
  const [className, setClassName] = useState("");
  const [present, setPresent] = useState("");
  const [total, setTotal] = useState("");

  const avg = useMemo(() => {
    if (!attendance.length) return 0;
    const score = attendance.reduce((sum, r) => sum + (r.present / r.total) * 100, 0);
    return Math.round(score / attendance.length);
  }, [attendance]);

  const onSubmit = (e) => {
    e.preventDefault();
    const p = Number(present); const t = Number(total);
    if (!className.trim() || Number.isNaN(p) || Number.isNaN(t) || t <= 0) return;
    addAttendance({ className: className.trim(), present: p, total: t, date: new Date().toISOString().slice(0,10) });
    setClassName(""); setPresent(""); setTotal("");
  };

  return <section>
    <PageHeader title="Attendance" subtitle="Daily class attendance and compliance." />
    <article className="hero-card"><small>Average Attendance</small><h3>{avg}%</h3></article>
    <form className="form-card" onSubmit={onSubmit}>
      <h3>Record Attendance</h3>
      <input value={className} onChange={(e)=>setClassName(e.target.value)} placeholder="Class / Batch" />
      <input value={present} onChange={(e)=>setPresent(e.target.value)} placeholder="Present" inputMode="numeric" />
      <input value={total} onChange={(e)=>setTotal(e.target.value)} placeholder="Total" inputMode="numeric" />
      <button type="submit">Save</button>
    </form>
    <div className="list">{attendance.map((a)=><div className="list-row" key={a.id}><strong>{a.className}</strong><span>{a.present}/{a.total}</span><span>{a.date}</span></div>)}</div>
  </section>;
}
