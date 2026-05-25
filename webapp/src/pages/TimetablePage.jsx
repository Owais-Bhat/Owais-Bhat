import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function TimetablePage() {
  const { timetable, addTimetable } = useAppData();
  const [day, setDay] = useState("Monday");
  const [period, setPeriod] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!period.trim() || !className.trim() || !subject.trim()) return;
    addTimetable({ day, period: period.trim(), className: className.trim(), subject: subject.trim() });
    setPeriod(""); setClassName(""); setSubject("");
  };

  return <section>
    <PageHeader title="Timetable" subtitle="Class schedule planning and allocation." />
    <form className="form-card" onSubmit={onSubmit}>
      <h3>Add Slot</h3>
      <select value={day} onChange={(e)=>setDay(e.target.value)}><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option></select>
      <input value={period} onChange={(e)=>setPeriod(e.target.value)} placeholder="Period (09:00-10:00)" />
      <input value={className} onChange={(e)=>setClassName(e.target.value)} placeholder="Class" />
      <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" />
      <button type="submit">Save</button>
    </form>
    <div className="list">{timetable.map((t)=><div className="list-row" key={t.id}><strong>{t.day}</strong><span>{t.period} • {t.className}</span><span>{t.subject}</span></div>)}</div>
  </section>;
}
