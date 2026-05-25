import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function AcademicsPage() {
  const { subjects, addSubject } = useAppData();
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [teacher, setTeacher] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !className.trim() || !teacher.trim()) return;
    addSubject({ name: name.trim(), className: className.trim(), teacher: teacher.trim() });
    setName(""); setClassName(""); setTeacher("");
  };

  return <section>
    <PageHeader title="Academics" subtitle="Subjects, class mapping, and faculty allocation." />
    <form className="form-card" onSubmit={onSubmit}>
      <h3>Add Subject</h3>
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Subject" />
      <input value={className} onChange={(e)=>setClassName(e.target.value)} placeholder="Class" />
      <input value={teacher} onChange={(e)=>setTeacher(e.target.value)} placeholder="Teacher" />
      <button type="submit">Save</button>
    </form>
    <div className="list">{subjects.map((s)=><div className="list-row" key={s.id}><strong>{s.name}</strong><span>{s.className}</span><span>{s.teacher}</span></div>)}</div>
  </section>;
}
