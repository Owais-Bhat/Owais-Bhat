import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function HostelPage() {
  const { hostel, addHostel } = useAppData();
  const [student, setStudent] = useState("");
  const [room, setRoom] = useState("");
  const [status, setStatus] = useState("Allocated");
  const onSubmit = (e) => { e.preventDefault(); if (!student.trim() || !room.trim()) return; addHostel({ student: student.trim(), room: room.trim(), status }); setStudent(""); setRoom(""); setStatus("Allocated"); };
  return <section><PageHeader title="Hostel" subtitle="Room allocation and occupancy." /><form className="form-card" onSubmit={onSubmit}><h3>Allocate Room</h3><input value={student} onChange={(e)=>setStudent(e.target.value)} placeholder="Student" /><input value={room} onChange={(e)=>setRoom(e.target.value)} placeholder="Room" /><select value={status} onChange={(e)=>setStatus(e.target.value)}><option>Allocated</option><option>Pending</option></select><button type="submit">Save</button></form><div className="list">{hostel.map((row)=><div className="list-row" key={row.id}><strong>{row.student}</strong><span>{row.room}</span><span>{row.status}</span></div>)}</div></section>;
}
