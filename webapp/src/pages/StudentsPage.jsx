import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function StudentsPage() {
  const { students, addStudent } = useAppData();
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [attendance, setAttendance] = useState("");

  const average = useMemo(() => {
    if (!students.length) return 0;
    return Math.round(students.reduce((sum, item) => sum + Number(item.attendance), 0) / students.length);
  }, [students]);

  const onSubmit = (event) => {
    event.preventDefault();
    const numericAttendance = Number(attendance);
    if (!name.trim() || !className.trim() || Number.isNaN(numericAttendance)) return;
    addStudent({ name: name.trim(), className: className.trim(), attendance: numericAttendance });
    setName("");
    setClassName("");
    setAttendance("");
  };

  return (
    <section>
      <PageHeader title="Student Management" subtitle="Profiles, class mapping, and attendance snapshot." />
      <article className="hero-card">
        <small>Average Attendance</small>
        <h3>{average}%</h3>
      </article>

      <form className="form-card" onSubmit={onSubmit}>
        <h3>Quick Add Student</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" />
        <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class / Batch" />
        <input value={attendance} onChange={(e) => setAttendance(e.target.value)} placeholder="Attendance %" inputMode="numeric" />
        <button type="submit">Add Student</button>
      </form>

      <div className="list">
        {students.map((student) => (
          <div className="list-row" key={student.id}>
            <strong>{student.name}</strong>
            <span>{student.className}</span>
            <span>{student.attendance}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
