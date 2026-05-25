import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function AdmissionsPage() {
  const { leads, addLead } = useAppData();
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [stage, setStage] = useState("");

  const counters = useMemo(() => {
    const total = leads.length;
    const enquiry = leads.filter((lead) => lead.stage === "Enquiry").length;
    const demo = leads.filter((lead) => lead.stage === "Demo Booked").length;
    return { total, enquiry, demo };
  }, [leads]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !source.trim() || !stage.trim()) return;
    addLead({ name: name.trim(), source: source.trim(), stage: stage.trim() });
    setName("");
    setSource("");
    setStage("");
  };

  return (
    <section>
      <PageHeader title="Admissions CRM" subtitle="Lead pipeline with follow-up and quick intake." />

      <div className="kpi-row">
        <article className="card"><small>Total Leads</small><h3>{counters.total}</h3></article>
        <article className="card"><small>Enquiry</small><h3>{counters.enquiry}</h3></article>
        <article className="card"><small>Demo Booked</small><h3>{counters.demo}</h3></article>
      </div>

      <form className="form-card" onSubmit={onSubmit}>
        <h3>Quick Add Lead</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source (Walk-in / Website / WhatsApp)" />
        <input value={stage} onChange={(e) => setStage(e.target.value)} placeholder="Stage (Enquiry / Demo Booked / Docs Pending)" />
        <button type="submit">Add Lead</button>
      </form>

      <div className="list">
        {leads.map((lead) => (
          <div className="list-row" key={lead.id}>
            <strong>{lead.name}</strong>
            <span>{lead.id} • {lead.source}</span>
            <span>{lead.stage}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
