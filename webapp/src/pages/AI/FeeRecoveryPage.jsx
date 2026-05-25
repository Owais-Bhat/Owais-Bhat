import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import { useNotification } from '../../hooks/useNotification';
import { MdAutoAwesome, MdAttachMoney } from 'react-icons/md';

export default function FeeRecoveryPage() {
  const notification = useNotification();
  const [strategies, setStrategies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('rahul');

  const defaulters = [
    { id: 'rahul', name: 'Rahul Kumar', pending: 15000, daysOverdue: 30, lastPayment: '2024-05-15' },
    { id: 'amit', name: 'Amit Patel', pending: 50000, daysOverdue: 60, lastPayment: '2024-05-01' },
  ];

  const handleGenerateStrategy = async () => {
    setLoading(true);
    setTimeout(() => {
      setStrategies({
        studentName: defaulters.find(d => d.id === selectedStudent)?.name,
        pending: defaulters.find(d => d.id === selectedStudent)?.pending,
        strategies: [
          {
            id: 1,
            name: 'Payment Plan',
            description: 'Break down payment into 3 EMIs',
            effectiveness: 85,
            timeline: '3 months'
          },
          {
            id: 2,
            name: 'Discount Incentive',
            description: 'Offer 5% discount for full payment',
            effectiveness: 90,
            timeline: 'Immediate'
          },
          {
            id: 3,
            name: 'Parent Communication',
            description: 'Personalized email and call campaign',
            effectiveness: 75,
            timeline: '2 weeks'
          },
        ],
        recommended: 'Discount Incentive + Payment Plan combination',
        estimatedRecovery: '₹12,750 (85% recovery)'
      });
      setLoading(false);
      notification.success('Fee recovery strategy generated!');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MdAttachMoney className="w-8 h-8 text-neon-cyan" />
          <h1 className="text-3xl font-bold text-white">AI Fee Recovery Assistant</h1>
        </div>

        {/* Fee Defaulters */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Fee Defaulters</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Student Name</th>
                  <th className="text-right py-3 px-4 text-white/60">Pending Amount</th>
                  <th className="text-right py-3 px-4 text-white/60">Days Overdue</th>
                  <th className="text-left py-3 px-4 text-white/60">Last Payment</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map(def => (
                  <tr key={def.id} className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                    onClick={() => setSelectedStudent(def.id)}>
                    <td className="py-3 px-4 text-white">{def.name}</td>
                    <td className="py-3 px-4 text-right text-orange-400 font-medium">₹{def.pending.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-red-400">{def.daysOverdue} days</td>
                    <td className="py-3 px-4 text-white/80">{new Date(def.lastPayment).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="flex justify-center">
          <Button
            variant="primary"
            loading={loading}
            onClick={handleGenerateStrategy}
            className="flex items-center gap-2"
          >
            <MdAutoAwesome /> Generate Recovery Strategy
          </Button>
        </div>

        {strategies && (
          <>
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recovery Strategy for {strategies.studentName}</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm">Pending Amount</p>
                  <p className="text-2xl font-bold text-orange-400">₹{strategies.pending.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm">Estimated Recovery</p>
                  <p className="text-2xl font-bold text-emerald-400">{strategies.estimatedRecovery}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recovery Strategies</h2>
              <div className="space-y-4">
                {strategies.strategies.map((strat) => (
                  <div key={strat.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold">{strat.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        strat.effectiveness >= 85
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : strat.effectiveness >= 75
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {strat.effectiveness}% effective
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{strat.description}</p>
                    <p className="text-white/40 text-xs">Timeline: {strat.timeline}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recommended Approach</h2>
              <p className="text-white/80 text-lg mb-4">{strategies.recommended}</p>
              <div className="flex gap-3">
                <Button variant="primary" onClick={() => notification.success('Strategy activated!')}>
                  Activate Strategy
                </Button>
                <Button variant="secondary">Send Communication</Button>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </MainLayout>
  );
}
