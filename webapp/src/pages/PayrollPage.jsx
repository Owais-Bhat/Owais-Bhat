import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function PayrollPage() {
  const { payroll, addPayroll } = useAppData();
  const [staff, setStaff] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const onSubmit = (e) => { e.preventDefault(); const amt=Number(amount); if (!staff.trim() || !month.trim() || Number.isNaN(amt)) return; addPayroll({ staff: staff.trim(), month: month.trim(), amount: amt }); setStaff(""); setMonth(""); setAmount(""); };
  return <section><PageHeader title="HR & Payroll" subtitle="Salary processing records." /><form className="form-card" onSubmit={onSubmit}><h3>Add Payroll</h3><input value={staff} onChange={(e)=>setStaff(e.target.value)} placeholder="Staff" /><input value={month} onChange={(e)=>setMonth(e.target.value)} placeholder="Month" /><input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" inputMode="numeric" /><button type="submit">Save</button></form><div className="list">{payroll.map((row)=><div className="list-row" key={row.id}><strong>{row.staff}</strong><span>{row.month}</span><span>{row.amount}</span></div>)}</div></section>;
}
