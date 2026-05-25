import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function ExamsPage() {
  const { exams, addExam } = useAppData();
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [maxMarks, setMaxMarks] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const marks = Number(maxMarks);
    if (!name.trim() || !className.trim() || !subject.trim() || Number.isNaN(marks)) return;
    addExam({ name: name.trim(), className: className.trim(), subject: subject.trim(), maxMarks: marks });
    setName(""); setClassName(""); setSubject(""); setMaxMarks("");
  };

  return <section>
    <PageHeader title="Exam & Result" subtitle="Exam setup and marks framework." />
    <form className="form-card" onSubmit={onSubmit}>
      <h3>Create Exam</h3>
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Exam name" />
      <input value={className} onChange={(e)=>setClassName(e.target.value)} placeholder="Class" />
      <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" />
      <input value={maxMarks} onChange={(e)=>setMaxMarks(e.target.value)} placeholder="Max marks" inputMode="numeric" />
      <button type="submit">Create</button>
    </form>
    <div className="list">{exams.map((ex)=><div className="list-row" key={ex.id}><strong>{ex.name}</strong><span>{ex.className} • {ex.subject}</span><span>{ex.maxMarks}</span></div>)}</div>
  </section>;
}
