import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function PredictivePage() {
  const { predictiveFlags, addPredictiveFlag } = useAppData();
  const [category, setCategory] = useState("Dropout Risk");
  const [entity, setEntity] = useState("");
  const [level, setLevel] = useState("Medium");
  const onSubmit = (e) => { e.preventDefault(); if (!entity.trim()) return; addPredictiveFlag({ category, entity: entity.trim(), level }); setEntity(""); };
  return <section><PageHeader title="Predictive Flags" subtitle="Risk flags for proactive intervention." /><form className="form-card" onSubmit={onSubmit}><h3>Add Predictive Flag</h3><select value={category} onChange={(e)=>setCategory(e.target.value)}><option>Dropout Risk</option><option>Fee Risk</option><option>Weak Subject</option></select><input value={entity} onChange={(e)=>setEntity(e.target.value)} placeholder="Student / Class" /><select value={level} onChange={(e)=>setLevel(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select><button type="submit">Save</button></form><div className="list">{predictiveFlags.map((r)=><div className="list-row" key={r.id}><strong>{r.category}</strong><span>{r.entity}</span><span>{r.level}</span></div>)}</div></section>;
}
