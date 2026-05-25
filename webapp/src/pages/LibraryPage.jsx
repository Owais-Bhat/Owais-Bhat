import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function LibraryPage() {
  const { library, addLibrary } = useAppData();
  const [book, setBook] = useState("");
  const [student, setStudent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const onSubmit = (e) => { e.preventDefault(); if (!book.trim() || !student.trim() || !dueDate.trim()) return; addLibrary({ book: book.trim(), student: student.trim(), dueDate: dueDate.trim() }); setBook(""); setStudent(""); setDueDate(""); };
  return <section><PageHeader title="Library" subtitle="Book issue and due-date tracking." /><form className="form-card" onSubmit={onSubmit}><h3>Issue Book</h3><input value={book} onChange={(e)=>setBook(e.target.value)} placeholder="Book" /><input value={student} onChange={(e)=>setStudent(e.target.value)} placeholder="Student" /><input value={dueDate} onChange={(e)=>setDueDate(e.target.value)} placeholder="Due date" /><button type="submit">Save</button></form><div className="list">{library.map((row)=><div className="list-row" key={row.id}><strong>{row.book}</strong><span>{row.student}</span><span>{row.dueDate}</span></div>)}</div></section>;
}
