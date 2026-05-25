import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function IntelligencePage() {
  const { aiInsights, addAiInsight } = useAppData();
  const [type, setType] = useState("Dropout Risk");
  const [target, setTarget] = useState("");
  const [score, setScore] = useState("");
  const onSubmit = (e) => { e.preventDefault(); if (!target.trim() || !score.trim()) return; addAiInsight({ type, target: target.trim(), score: score.trim() }); setTarget(""); setScore(""); };
  return <section><PageHeader title="AI Intelligence" subtitle="AI insights for dropout, weak subjects, and fee risk." /><form className="form-card" onSubmit={onSubmit}><h3>Add Insight</h3><select value={type} onChange={(e)=>setType(e.target.value)}><option>Dropout Risk</option><option>Weak Subject</option><option>Fee Risk</option></select><input value={target} onChange={(e)=>setTarget(e.target.value)} placeholder="Target (class/student)" /><input value={score} onChange={(e)=>setScore(e.target.value)} placeholder="Score/Result" /><button type="submit">Save</button></form><div className="list">{aiInsights.map((r)=><div className="list-row" key={r.id}><strong>{r.type}</strong><span>{r.target}</span><span>{r.score}</span></div>)}</div></section>;
}
