import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useNotification } from '../../hooks/useNotification';
import { MdSend, MdAutoAwesome, MdSchool } from 'react-icons/md';

export default function AiTutorPage() {
  const notification = useNotification();
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I\'m your AI Tutor. I can help you with any subject. What would you like to learn today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('Mathematics');

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { id: messages.length + 1, type: 'user', text: input }]);
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        text: `I'll help you understand ${subject}. Based on your question, here's an explanation: [AI response would appear here]. Feel free to ask follow-up questions!`
      }]);
      setLoading(false);
    }, 1500);

    setInput('');
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MdAutoAwesome className="w-8 h-8 text-neon-cyan" />
          <h1 className="text-3xl font-bold text-white">AI Tutor</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat */}
          <div className="lg:col-span-3">
            <GlassCard className="p-6 h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-primary-blue/30 text-white'
                        : 'bg-white/10 text-white/90'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-lg bg-white/10 text-white/90">
                      <span className="animate-pulse">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1"
                />
                <Button variant="primary" onClick={handleSend} disabled={loading}>
                  <MdSend />
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <GlassCard className="p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <MdSchool /> Select Subject
              </h3>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-glass w-full"
              >
                <option>Mathematics</option>
                <option>English</option>
                <option>Science</option>
                <option>Social Studies</option>
                <option>Hindi</option>
              </select>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-white font-bold mb-4">Common Topics</h3>
              <div className="space-y-2">
                {['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => {
                      setInput(`Explain ${topic}`);
                      setTimeout(() => handleSend(), 0);
                    }}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-white/80 transition"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
