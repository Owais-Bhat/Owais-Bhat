import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function AutomationPage() {
  const { automationRules, addAutomationRule } = useAppData();
  const [rule, setRule] = useState("");
  const [channel, setChannel] = useState("WhatsApp");
  const [status, setStatus] = useState("Active");
  const onSubmit = (e) => { e.preventDefault(); if (!rule.trim()) return; addAutomationRule({ rule: rule.trim(), channel, status }); setRule(""); };
  return <section><PageHeader title="Automation" subtitle="Event-based reminders and alert workflows." /><form className="form-card" onSubmit={onSubmit}><h3>Add Automation Rule</h3><input value={rule} onChange={(e)=>setRule(e.target.value)} placeholder="Rule name" /><select value={channel} onChange={(e)=>setChannel(e.target.value)}><option>WhatsApp</option><option>Email</option><option>SMS</option></select><select value={status} onChange={(e)=>setStatus(e.target.value)}><option>Active</option><option>Paused</option></select><button type="submit">Save</button></form><div className="list">{automationRules.map((r)=><div className="list-row" key={r.id}><strong>{r.rule}</strong><span>{r.channel}</span><span>{r.status}</span></div>)}</div></section>;
}
