import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

export default function CommunicationPage() {
  const { messages, addMessage } = useAppData();
  const [channel, setChannel] = useState("WhatsApp");
  const [audience, setAudience] = useState("Parents");
  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMessage({ channel, audience, text: text.trim() });
    setText("");
  };

  return <section>
    <PageHeader title="Communication" subtitle="Send alerts and reminders." />
    <form className="form-card" onSubmit={onSubmit}>
      <h3>Send Message</h3>
      <select value={channel} onChange={(e)=>setChannel(e.target.value)}><option>WhatsApp</option><option>Email</option><option>SMS</option></select>
      <select value={audience} onChange={(e)=>setAudience(e.target.value)}><option>Parents</option><option>Students</option><option>Teachers</option></select>
      <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Message" />
      <button type="submit">Send</button>
    </form>
    <div className="list">{messages.map((m)=><div className="list-row" key={m.id}><strong>{m.channel}</strong><span>{m.audience}</span><span>{m.text}</span></div>)}</div>
  </section>;
}
