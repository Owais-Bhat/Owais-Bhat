import { moduleCatalog } from "../lib/modules";

const cards = [
  ["Total Students", "12,840", "+4.3%"],
  ["Active Teachers", "624", "+1.2%"],
  ["Attendance", "92.6%", "+0.8%"],
  ["Pending Fees", "$84,200", "-3.1%"],
];

import { useAppData } from "../context/AppDataContext";

export default function DashboardPage() {
  const { resetAllData } = useAppData();
  return (
    <section>
      <h2>Education ERP Dashboard</h2>
      <p className="sub">Responsive webapp (desktop + tablet + mobile view).</p>
      <div className="grid">
        {cards.map(([label, value, trend]) => (
          <article key={label} className="card">
            <small>{label}</small>
            <h3>{value}</h3>
            <span>{trend} this week</span>
          </article>
        ))}
      </div>
      <div className="kpi-row" style={{marginTop: "12px"}}>
        <article className="card"><small>Total Modules</small><h3>{moduleCatalog.length}</h3></article>
        <article className="card"><small>In Progress</small><h3>{moduleCatalog.filter((m)=>m.status==="In Progress").length}</h3></article>
        <article className="card"><small>Planned</small><h3>{moduleCatalog.filter((m)=>m.status==="Planned").length}</h3></article>
      </div>
    <button className="danger-btn" onClick={resetAllData}>Reset Demo Data</button>
    </section>
  );
}
