import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function TransportPage() {
  const { transport, addTransport } = useAppData();
  const [route, setRoute] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const onSubmit = (e) => { e.preventDefault(); if (!route.trim() || !vehicle.trim() || !driver.trim()) return; addTransport({ route: route.trim(), vehicle: vehicle.trim(), driver: driver.trim() }); setRoute(""); setVehicle(""); setDriver(""); };
  return <section><PageHeader title="Transport" subtitle="Route, vehicle, and driver management." /><form className="form-card" onSubmit={onSubmit}><h3>Add Route</h3><input value={route} onChange={(e)=>setRoute(e.target.value)} placeholder="Route" /><input value={vehicle} onChange={(e)=>setVehicle(e.target.value)} placeholder="Vehicle" /><input value={driver} onChange={(e)=>setDriver(e.target.value)} placeholder="Driver" /><button type="submit">Save</button></form><div className="list">{transport.map((row)=><div className="list-row" key={row.id}><strong>{row.route}</strong><span>{row.vehicle}</span><span>{row.driver}</span></div>)}</div></section>;
}
