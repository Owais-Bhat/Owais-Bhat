import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useNotification } from '../../hooks/useNotification';
import { MdSend, MdAnnouncements, MdMessage } from 'react-icons/md';

export default function CommunicationPage() {
  const notification = useNotification();
  const [announcements] = useState([
    { id: 1, title: 'School Holiday on July 4th', content: 'School will remain closed on July 4th due to National Holiday', priority: 'high', date: '2024-07-01' },
    { id: 2, title: 'Parent-Teacher Meeting', content: 'PTM scheduled for July 15th at 3:00 PM', priority: 'normal', date: '2024-06-30' },
    { id: 3, title: 'Sports Day Registration', content: 'Register for annual sports day before June 25th', priority: 'normal', date: '2024-06-20' },
  ]);

  const [messages] = useState([
    { id: 1, sender: 'Ms. Singh', subject: 'Assignment Submission', message: 'Please submit the assignment by tomorrow', date: '2024-07-03' },
    { id: 2, sender: 'Mr. Sharma', subject: 'Class Notes', message: 'Here are the class notes for today\'s lesson', date: '2024-07-02' },
    { id: 3, sender: 'School Admin', subject: 'Fee Reminder', message: 'Please pay your fees before the due date', date: '2024-07-01' },
  ]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Communication Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcements */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdAnnouncements /> Announcements
              </h2>
              <Button variant="primary" size="sm">New</Button>
            </div>
            <div className="space-y-3">
              {announcements.map(ann => (
                <GlassCard key={ann.id} className="p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{ann.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{ann.content}</p>
                      <p className="text-white/40 text-xs mt-2">{new Date(ann.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      ann.priority === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {ann.priority}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdMessage /> Messages
              </h2>
              <Button variant="primary" size="sm">Compose</Button>
            </div>
            <div className="space-y-3">
              {messages.map(msg => (
                <GlassCard key={msg.id} className="p-4 cursor-pointer hover:bg-white/5 transition">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-neon-cyan flex items-center justify-center text-xs font-bold text-white">
                      {msg.sender.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{msg.sender}</h3>
                          <p className="text-white/60 text-sm">{msg.subject}</p>
                        </div>
                        <span className="text-white/40 text-xs">{new Date(msg.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/50 text-sm mt-2 line-clamp-2">{msg.message}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Send Message Form */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Send Message</h2>
          <div className="space-y-4">
            <Input label="Recipient" placeholder="Select recipient" />
            <Input label="Subject" placeholder="Message subject" />
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                className="input-glass w-full h-32"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => notification.success('Message sent!')}>
                <MdSend className="mr-2 inline" /> Send
              </Button>
              <Button variant="secondary">Clear</Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
