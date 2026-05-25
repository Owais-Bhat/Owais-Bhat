import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function InventoryPage() {
  const { inventory, addInventory } = useAppData();
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("Available");
  const onSubmit = (e) => { e.preventDefault(); const qty=Number(quantity); if (!item.trim() || Number.isNaN(qty)) return; addInventory({ item: item.trim(), quantity: qty, status }); setItem(""); setQuantity(""); setStatus("Available"); };
  return <section><PageHeader title="Inventory & Assets" subtitle="Stock and asset tracking." /><form className="form-card" onSubmit={onSubmit}><h3>Add Item</h3><input value={item} onChange={(e)=>setItem(e.target.value)} placeholder="Item" /><input value={quantity} onChange={(e)=>setQuantity(e.target.value)} placeholder="Quantity" inputMode="numeric" /><select value={status} onChange={(e)=>setStatus(e.target.value)}><option>Available</option><option>In Use</option></select><button type="submit">Save</button></form><div className="list">{inventory.map((row)=><div className="list-row" key={row.id}><strong>{row.item}</strong><span>{row.quantity}</span><span>{row.status}</span></div>)}</div></section>;
}
