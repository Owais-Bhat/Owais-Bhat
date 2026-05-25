import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function FeesPage() {
  const { invoices, addInvoice } = useAppData();
  const [student, setStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");

  const pending = useMemo(() => invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + Number(i.amount), 0), [invoices]);

  const onSubmit = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!student.trim() || Number.isNaN(amt)) return;
    addInvoice({ student: student.trim(), amount: amt, status });
    setStudent(""); setAmount(""); setStatus("Pending");
  };

  return <section>
    <PageHeader title="Fees & Accounts" subtitle="Invoices, payments, and dues." />
    <article className="hero-card"><small>Pending Amount</small><h3>${pending}</h3></article>
    <form className="form-card" onSubmit={onSubmit}>
      <h3>Create Invoice</h3>
      <input value={student} onChange={(e)=>setStudent(e.target.value)} placeholder="Student name" />
      <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" inputMode="numeric" />
      <select value={status} onChange={(e)=>setStatus(e.target.value)}><option>Pending</option><option>Paid</option></select>
      <button type="submit">Create</button>
    </form>
    <div className="list">{invoices.map((inv)=><div className="list-row" key={inv.id}><strong>{inv.student}</strong><span>${inv.amount}</span><span>{inv.status}</span></div>)}</div>
  </section>;
}
